import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EquipmentCard from '@/components/EquipmentCard';
import AddEquipmentForm from '@/components/AddEquipmentForm';
import CameraCapture from '@/components/CameraCapture';
import PhotoViewer from '@/components/PhotoViewer';
import ReportModal from '@/components/ReportModal';
import { 
  Plus, 
  Search,
  FileDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

const PREDEFINED_LOCATIONS = [
  'Fábrica Jaboatão', 
  'Fábrica Raposo', 
  'Fábrica Mogi das Cruzes', 
  'CV João Pessoa', 
  'CV Caruaru', 
  'Brasília', 
  'Jaguariúna', 
  'Osasco', 
  'Fábrica Rio de Janeiro',
  'Juiz de Fora',
  'Pouso Alegre',
  'Gravataí'
];

const COMPANY_LOGO_URL = ""; 

const ChecklistPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth(); 
  const LOGO_PLACEHOLDER_TEXT = t('logoPlaceholder');

  const [equipments, setEquipments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [currentEquipmentId, setCurrentEquipmentId] = useState(null);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [logoUrl, setLogoUrl] = useState(COMPANY_LOGO_URL);

  useEffect(() => {
    const savedEquipments = localStorage.getItem('equipments');
    if (savedEquipments) {
      setEquipments(JSON.parse(savedEquipments));
    } else {
      const sampleData = [
        {
          id: 1,
          name: 'TV Samsung 55"',
          type: 'TV',
          status: 'funcionando',
          location: PREDEFINED_LOCATIONS[0],
          notes: 'Instalada em 2023, funcionando perfeitamente',
          checked: false,
          lastCheck: new Date().toISOString(),
          photo: null,
          userId: 'tech001' 
        },
        {
          id: 2,
          name: 'Switch Cisco 24 portas',
          type: 'Switch',
          status: 'manutencao',
          location: PREDEFINED_LOCATIONS[1],
          notes: 'Necessita atualização de firmware',
          checked: true,
          lastCheck: new Date(Date.now() - 86400000).toISOString(),
          photo: null,
          userId: 'admin001'
        }
      ];
      setEquipments(sampleData);
      localStorage.setItem('equipments', JSON.stringify(sampleData));
    }
    
    if (COMPANY_LOGO_URL && COMPANY_LOGO_URL !== "YOUR_LOGO_URL_HERE") {
      setLogoUrl(COMPANY_LOGO_URL);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('equipments', JSON.stringify(equipments));
  }, [equipments]);

  const addEquipment = (newEquipment) => {
    setEquipments(prev => [...prev, { ...newEquipment, userId: user?.id, id: Date.now() }]); //Ensure unique ID
  };

  const toggleEquipmentCheck = (id) => {
    setEquipments(prev => 
      prev.map(eq => 
        eq.id === id 
          ? { ...eq, checked: !eq.checked, lastCheck: new Date().toISOString() }
          : eq
      )
    );
  };

  const deleteEquipment = (id) => {
    setEquipments(prev => prev.filter(eq => eq.id !== id));
    toast({
      title: t('equipmentRemoved'),
      description: t('equipmentRemovedDesc'),
    });
  };

  const openCamera = (equipmentId) => {
    setCurrentEquipmentId(equipmentId);
    setShowCamera(true);
  };

  const handlePhotoCapture = (photoDataUrl) => {
    if (currentEquipmentId) {
      setEquipments(prev =>
        prev.map(eq =>
          eq.id === currentEquipmentId
            ? { ...eq, photo: photoDataUrl }
            : eq
        )
      );
    }
    setShowCamera(false);
    setCurrentEquipmentId(null);
  };

  const viewPhoto = (photo) => {
    setCurrentPhoto(photo);
    setShowPhotoViewer(true);
  };

  const filteredEquipments = equipments.filter(equipment => {
    const nameMatch = equipment.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = equipment.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const locationMatch = equipment.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatch || typeMatch || locationMatch;
    
    const matchesStatus = filterStatus === 'all' || equipment.status === filterStatus;
    const matchesType = filterType === 'all' || equipment.type === filterType;
    const matchesLocation = filterLocation === 'all' || equipment.location === filterLocation;
    
    return matchesSearch && matchesStatus && matchesType && matchesLocation;
  });

  const stats = {
    total: equipments.length,
    checked: equipments.filter(eq => eq.checked).length,
    functioning: equipments.filter(eq => eq.status === 'funcionando').length,
    maintenance: equipments.filter(eq => eq.status === 'manutencao').length,
    broken: equipments.filter(eq => eq.status === 'defeito').length
  };

  const uniqueTypes = [...new Set(equipments.map(eq => eq.type).filter(Boolean))];
  const uniqueLocations = [...new Set(equipments.map(eq => eq.location).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-md text-company-text-secondary text-center mb-10 max-w-3xl mx-auto"
      >
        {t('appDescription')} {user && <span className="font-semibold">{t('welcomeUser', {name: user.name})}</span>}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8"
      >
        {[
          { labelKey: 'total', value: stats.total, color: 'text-company-brand-accent' },
          { labelKey: 'checked', value: stats.checked, color: 'text-green-500' },
          { labelKey: 'functioning', value: stats.functioning, color: 'text-green-500' },
          { labelKey: 'maintenance', value: stats.maintenance, color: 'text-yellow-500' },
          { labelKey: 'broken', value: stats.broken, color: 'text-red-500' },
        ].map(stat => (
          <Card key={stat.labelKey} className="bg-company-card-bg border-company-border hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4 text-center">
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-company-text-secondary">{t(stat.labelKey)}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8"
      >
        <Card className="bg-company-card-bg border-company-border">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-company-text-secondary h-4 w-4" />
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-company-input-bg border-company-border text-company-text-primary placeholder:text-company-text-secondary w-full focus:ring-company-brand focus:border-company-brand"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-company-input-bg border-company-border rounded-md text-company-text-primary text-sm focus:ring-company-brand focus:border-company-brand"
                >
                  <option value="all">{t('allStatuses')}</option>
                  <option value="funcionando">{t('functioning')}</option>
                  <option value="manutencao">{t('maintenance')}</option>
                  <option value="defeito">{t('broken')}</option>
                </select>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 bg-company-input-bg border-company-border rounded-md text-company-text-primary text-sm focus:ring-company-brand focus:border-company-brand"
                >
                  <option value="all">{t('allTypes')}</option>
                  {uniqueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="px-3 py-2 bg-company-input-bg border-company-border rounded-md text-company-text-primary text-sm focus:ring-company-brand focus:border-company-brand"
                >
                  <option value="all">{t('allLocations')}</option>
                  {PREDEFINED_LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                  {uniqueLocations.filter(loc => !PREDEFINED_LOCATIONS.includes(loc)).map(loc => (
                     <option key={loc} value={loc}>{loc} (Outra)</option>
                  ))}
                </select>
                
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-company-brand text-company-brand-foreground hover:bg-company-brand/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('add')}
                </Button>

                <Button
                  onClick={() => setShowReportModal(true)}
                  variant="outline"
                  className="border-company-brand-accent text-company-brand-accent hover:bg-company-brand-accent/10"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  {t('report')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredEquipments.map((equipment) => (
            <EquipmentCard
              key={equipment.id}
              equipment={equipment}
              onToggleCheck={toggleEquipmentCheck}
              onDelete={deleteEquipment}
              onTakePhoto={openCamera}
              onViewPhoto={viewPhoto}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredEquipments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4 text-company-brand">📱</div>
          <h3 className="text-xl font-semibold text-company-text-primary mb-2">
            {t('noEquipmentFound')}
          </h3>
          <p className="text-company-text-secondary mb-6">
            {searchTerm || filterStatus !== 'all' || filterType !== 'all' || filterLocation !== 'all'
              ? t('adjustFilters')
              : t('addFirstEquipment')
            }
          </p>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-company-brand text-company-brand-foreground hover:bg-company-brand/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('addEquipmentButton')}
          </Button>
        </motion.div>
      )}

      <AddEquipmentForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAdd={addEquipment}
        locations={PREDEFINED_LOCATIONS}
      />

      <CameraCapture
        isOpen={showCamera}
        onClose={() => {
          setShowCamera(false);
          setCurrentEquipmentId(null);
        }}
        onPhotoCapture={handlePhotoCapture}
      />

      <PhotoViewer
        photo={currentPhoto}
        isOpen={showPhotoViewer}
        onClose={() => {
          setShowPhotoViewer(false);
          setCurrentPhoto(null);
        }}
      />

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        equipments={equipments}
        locations={PREDEFINED_LOCATIONS}
        logoUrl={logoUrl}
        logoPlaceholder={LOGO_PLACEHOLDER_TEXT}
      />
    </div>
  );
};

export default ChecklistPage;