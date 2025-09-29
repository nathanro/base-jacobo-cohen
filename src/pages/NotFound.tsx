import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MadeWithDyad } from '@/components/powered-by-publiexpert';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-bold mb-4">{t('notFound.title')}</h2>
          <p className="text-xl text-gray-600 mb-4">{t('notFound.message')}</p>
          <a href="/" className="text-blue-500 hover:text-blue-700 underline">
            {t('notFound.goHome')}
          </a>
        </div>
      </div>
      
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <MadeWithDyad />
        </div>
      </footer>
    </div>);

};

export default NotFound;