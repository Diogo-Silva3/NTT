import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4"
    >
      <AlertTriangle className="h-24 w-24 text-company-brand-accent mb-6" />
      <h1 className="text-5xl font-bold text-company-text-primary mb-4">{t('notFoundTitle')}</h1>
      <p className="text-xl text-company-text-secondary mb-8 max-w-md">
        {t('notFoundSubtitle')}
      </p>
      <div className="flex space-x-4">
        <Button 
          onClick={() => navigate(-1)} 
          variant="outline"
          className="border-company-brand text-company-brand hover:bg-company-brand/10"
        >
          {t('goBackButton')}
        </Button>
        <Button 
          onClick={() => navigate('/')}
          className="bg-company-brand text-company-brand-foreground hover:bg-company-brand/90"
        >
          {t('goHomeButton')}
        </Button>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;