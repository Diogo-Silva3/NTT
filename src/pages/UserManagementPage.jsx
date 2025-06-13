import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2, Search, UserX, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
// Mock data - replace with Supabase data later
const initialUsers = [
  { id: 'admin001', name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active' },
  { id: 'tech001', name: 'Tech User 1', email: 'tech1@example.com', role: 'technician', status: 'active' },
  { id: 'tech002', name: 'Tech User 2', email: 'tech2@example.com', role: 'technician', status: 'inactive' },
];

// Mock User Form Modal (simplified)
const UserFormModal = ({ isOpen, onClose, onSubmit, user, roles }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', role: roles[0] || '', password: '' });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, role: user.role, password: '' });
    } else {
      setFormData({ name: '', email: '', role: roles[0] || '', password: '' });
    }
  }, [user, roles, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || (!user && !formData.password)) {
        toast({ title: t('error'), description: t('fillAllRequiredFields'), variant: 'destructive'});
        return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="bg-company-card-bg p-6 rounded-lg shadow-xl w-full max-w-md"
        >
            <h2 className="text-xl font-semibold text-company-text-primary mb-4">
                {user ? t('editUserTitle') : t('addUserTitle')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-company-text-secondary">{t('userNameLabel')}</label>
                    <Input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full bg-company-input-bg border-company-border"/>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-company-text-secondary">{t('emailLabel')}</label>
                    <Input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full bg-company-input-bg border-company-border"/>
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-company-text-secondary">{t('passwordLabel')} {user ? `(${t('leaveBlankNoChange')})` : ''}</label>
                    <Input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required={!user} className="mt-1 block w-full bg-company-input-bg border-company-border"/>
                </div>
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-company-text-secondary">{t('roleLabel')}</label>
                    <select name="role" id="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full p-2 bg-company-input-bg border-company-border rounded-md">
                        {roles.map(role => <option key={role} value={role}>{t(role)}</option>)}
                    </select>
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose}>{t('cancelButton')}</Button>
                    <Button type="submit" className="bg-company-brand hover:bg-company-brand/90">{user ? t('saveChangesButton') : t('addUserButtonModal')}</Button>
                </div>
            </form>
        </motion.div>
    </motion.div>
  );
};


const UserManagementPage = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const availableRoles = ['admin', 'technician']; // Could come from config or API

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId) => {
    // In a real app, show confirmation dialog
    setUsers(users.filter(user => user.id !== userId));
    toast({ title: t('userDeletedTitle'), description: t('userDeletedDesc') });
  };
  
  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => user.id === userId ? {...user, status: user.status === 'active' ? 'inactive' : 'active'} : user));
    toast({ title: t('userStatusUpdatedTitle'), description: t('userStatusUpdatedDesc') });
  };

  const handleFormSubmit = (userData) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...editingUser, ...userData } : u));
      toast({ title: t('userUpdatedTitle'), description: t('userUpdatedDesc') });
    } else {
      setUsers([...users, { ...userData, id: `user_${Date.now()}`, status: 'active' }]);
      toast({ title: t('userAddedTitle'), description: t('userAddedDesc') });
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t(user.role).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto"
    >
      <Card className="bg-company-card-bg border-company-border shadow-lg">
        <CardHeader className="flex flex-col md:flex-row justify-between items-center">
          <CardTitle className="text-2xl text-company-text-primary mb-4 md:mb-0">{t('userManagementTitle')}</CardTitle>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-company-text-secondary h-4 w-4" />
                <Input
                    type="text"
                    placeholder={t('searchUsersPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full bg-company-input-bg border-company-border"
                />
            </div>
            <Button onClick={handleAddUser} className="bg-company-brand hover:bg-company-brand/90">
              <PlusCircle className="h-4 w-4 mr-2" /> {t('addUserButton')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-company-border">
              <thead className="bg-company-input-bg/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-company-text-secondary uppercase tracking-wider">{t('userNameLabel')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-company-text-secondary uppercase tracking-wider">{t('emailLabel')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-company-text-secondary uppercase tracking-wider">{t('roleLabel')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-company-text-secondary uppercase tracking-wider">{t('statusLabel')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-company-text-secondary uppercase tracking-wider">{t('actionsLabel')}</th>
                </tr>
              </thead>
              <tbody className="bg-company-card-bg divide-y divide-company-border">
                <AnimatePresence>
                  {filteredUsers.map((user) => (
                    <motion.tr 
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        layout
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-company-text-primary">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-company-text-secondary">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-company-text-secondary">{t(user.role)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {t(user.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)} className="text-company-brand-accent hover:text-company-brand-accent/80">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => toggleUserStatus(user.id)} className={user.status === 'active' ? "text-yellow-500 hover:text-yellow-600" : "text-green-500 hover:text-green-600"}>
                          {user.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                        {user.role !== 'admin' && ( // Prevent deleting admin
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <p className="text-center py-8 text-company-text-secondary">{t('noUsersFound')}</p>
          )}
        </CardContent>
      </Card>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        user={editingUser}
        roles={availableRoles}
      />
    </motion.div>
  );
};

export default UserManagementPage;