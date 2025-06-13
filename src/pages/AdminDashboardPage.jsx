import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BarChart2, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminDashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const adminActions = [
    {
      titleKey: 'userManagementTitle',
      descriptionKey: 'userManagementDesc',
      icon: <Users className="h-8 w-8 text-company-brand" />,
      action: () => navigate('/admin/users'),
      buttonTextKey: 'manageUsersButton'
    },
    {
      titleKey: 'viewReportsTitle',
      descriptionKey: 'viewReportsDesc',
      icon: <BarChart2 className="h-8 w-8 text-company-brand-accent" />,
      action: () => navigate('/reports'), // Placeholder, implement reports page later
      buttonTextKey: 'viewReportsButton'
    },
    {
      titleKey: 'systemSettingsTitle',
      descriptionKey: 'systemSettingsDesc',
      icon: <Settings className="h-8 w-8 text-gray-500" />,
      action: () => navigate('/settings'), // Placeholder, implement settings page later
      buttonTextKey: 'configureSettingsButton'
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-company-text-primary">{t('adminDashboardTitle')}</h1>
        <p className="text-company-text-secondary">{t('adminDashboardSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminActions.map((item, index) => (
          <motion.div
            key={item.titleKey}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Card className="bg-company-card-bg border-company-border hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                {item.icon}
                <CardTitle className="text-xl text-company-text-primary">{t(item.titleKey)}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-company-text-secondary mb-4">{t(item.descriptionKey)}</p>
              </CardContent>
              <div className="p-4 pt-0">
                 <Button onClick={item.action} className="w-full bg-company-brand text-company-brand-foreground hover:bg-company-brand/90">
                  {t(item.buttonTextKey)}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminDashboardPage;