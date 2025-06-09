
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user: authUserHook, loading: authLoading, createFirstAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Placeholder to attempt creating first admin - remove or secure this later
  // const [adminSetupAttempted, setAdminSetupAttempted] = useState(false);
  // useEffect(() => {
  //   const setupAdmin = async () => {
  //     if (!authUserHook && !authLoading && !adminSetupAttempted) {
  //       setAdminSetupAttempted(true); // Mark as attempted
  //       try {
  //         // IMPORTANT: THIS IS A SIMPLIFIED EXAMPLE for demonstration.
  //         // In a real app, you would not hardcode credentials or run this on every page load.
  //         // This should be a one-time setup process or handled via a secure admin interface.
  //         // console.log("Attempting to create first admin user...");
  //         // await createFirstAdmin("admin@example.com", "admin123", "Default Admin");
  //         // console.log("First admin setup process completed (or skipped if exists).");
  //       } catch (err) {
  //         // console.error("Error during initial admin setup:", err.message);
  //         // Potentially inform user if it's a setup phase, or log silently.
  //       }
  //     }
  //   };
  //   // setupAdmin();
  // }, [authUserHook, authLoading, createFirstAdmin, adminSetupAttempted]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError(t('fillAllFieldsError'));
      toast({
        title: t('error'),
        description: t('fillAllFieldsError'),
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      const loggedInUser = await login(email, password);
      toast({
        title: t('loginSuccessTitle'),
        description: t('loginSuccessDesc', { name: loggedInUser.name || loggedInUser.email }),
      });
      const redirectTo = loggedInUser.role === 'admin' ? '/admin' : '/checklist';
      navigate(location.state?.from?.pathname || redirectTo, { replace: true });
      
    } catch (err) {
      let errorMessage = t('loginErrorTitle');
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMessage = t('invalidCredentialsError');
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast({
        title: t('loginErrorTitle'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-[calc(100vh-200px)]"
    >
      <Card className="w-full max-w-md shadow-2xl bg-company-card-bg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-company-brand">{t('loginTitle')}</CardTitle>
          <CardDescription className="text-company-text-secondary">{t('loginSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-company-text-primary">{t('emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-company-input-bg border-company-border focus:ring-company-brand focus:border-company-brand"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-company-text-primary">{t('passwordLabel')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-company-input-bg border-company-border focus:ring-company-brand focus:border-company-brand"
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <Button type="submit" className="w-full bg-company-brand text-company-brand-foreground hover:bg-company-brand/90" disabled={isLoading || authLoading}>
              {isLoading || authLoading ? t('loggingInButton') : t('loginButton')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-company-text-secondary">
          <p>{t('loginHintFirebase')}</p> 
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default LoginPage;
