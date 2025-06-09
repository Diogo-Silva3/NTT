import React, { Suspense, useState } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useTranslation } from 'react-i18next';
import { Globe, LogOut, Users, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Lazy load pages
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const ChecklistPage = React.lazy(() => import('@/pages/ChecklistPage'));
const AdminDashboardPage = React.lazy(() => import('@/pages/AdminDashboardPage'));
const UserManagementPage = React.lazy(() => import('@/pages/UserManagementPage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/checklist" replace />; 
  }

  return <Outlet />;
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen bg-company-background text-company-foreground">
    <div className="p-8 rounded-lg shadow-xl">
      <p className="text-xl animate-pulse">Carregando...</p>
    </div>
  </div>
);

const AppHeader = () => {
  const { t, i18n } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language.split('-')[0]);
  const navigate = useNavigate();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
  };

  const languageOptions = [
    { code: 'ptBR', label: t('portugueseBR') },
    { code: 'en', label: t('english') },
    { code: 'es', label: t('spanish') },
  ];

  const COMPANY_LOGO_URL = ""; 
  const LOGO_PLACEHOLDER_TEXT = t('logoPlaceholder');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row justify-between items-center mb-6 p-4 md:p-6 rounded-lg shadow-xl bg-company-header-bg border border-company-border"
    >
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate(isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/checklist') : '/login')}>
        {COMPANY_LOGO_URL ? (
          <img-replace src={COMPANY_LOGO_URL} alt={t('logoPlaceholder')} className="h-10 md:h-12 object-contain"/>
        ) : (
           <span className="text-2xl md:text-3xl font-bold text-company-brand">
            {LOGO_PLACEHOLDER_TEXT}
          </span>
        )}
      </div>
      <h1 className="text-xl md:text-2xl font-semibold text-company-text-primary mt-2 md:mt-0 text-center md:text-left">
        {t('appTitle')}
      </h1>
      <div className="flex items-center space-x-2 md:space-x-4 mt-3 md:mt-0">
        <div className="flex items-center space-x-1">
          <Globe className="h-4 w-4 md:h-5 md:w-5 text-company-text-secondary" />
          <select
            value={currentLanguage}
            onChange={(e) => changeLanguage(e.target.value)}
            className="px-2 py-1 md:px-3 md:py-2 bg-company-input-bg border-company-border rounded-md text-company-text-primary text-xs md:text-sm focus:ring-company-brand focus:border-company-brand"
          >
            {languageOptions.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </div>
        {isAuthenticated && (
          <>
            {user?.role === 'admin' && (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="text-company-text-secondary hover:text-company-brand">
                  <LayoutDashboard className="h-4 w-4 mr-1 md:mr-2" /> <span className="hidden sm:inline">{t('adminDashboardShort')}</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/users')} className="text-company-text-secondary hover:text-company-brand">
                  <Users className="h-4 w-4 mr-1 md:mr-2" /> <span className="hidden sm:inline">{t('userManagementShort')}</span>
                </Button>
              </>
            )}
             <Button variant="ghost" size="sm" onClick={handleLogout} className="text-company-text-secondary hover:text-red-500">
              <LogOut className="h-4 w-4 mr-1 md:mr-2" /> <span className="hidden sm:inline">{t('logout')}</span>
            </Button>
          </>
        )}
      </div>
    </motion.header>
  );
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-company-background text-company-foreground">
        <Suspense fallback={<LoadingSpinner />}>
          <AppHeader />
          <main className="p-4">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              <Route element={<ProtectedRoute allowedRoles={['admin', 'technician']} />}>
                <Route path="/checklist" element={<ChecklistPage />} />
              </Route>
              
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/users" element={<UserManagementPage />} />
              </Route>
              
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Toaster />
        </Suspense>
      </div>
    </AuthProvider>
  );
}

export default App;