import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { MadeWithDyad } from '@/components/powered-by-publiexpert';
import LanguageSwitcher from '@/components/navigation/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t('common.loading')}</p>
      </div>);

  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with Language Switcher */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">DataInsights Analytics</h1>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>
      
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">{t('hero.title')}</h1>
            <p className="mt-2 text-gray-600">{t('hero.subtitle')}</p>
          </div>
          
          <AuthForm />
        </div>
      </div>
      
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <MadeWithDyad />
        </div>
      </footer>
    </div>);

};

export default Login;