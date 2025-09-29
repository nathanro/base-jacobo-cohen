import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/navigation/Navigation';
import { MadeWithDyad } from '@/components/powered-by-publiexpert';
import { useTranslation } from 'react-i18next';
import { DatasetList } from '@/components/data/DatasetList';
import { Database } from 'lucide-react';

const Datasets = () => {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <Database className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('navigation.datasets') || 'Financial Datasets'}
              </h1>
              <p className="text-gray-600 mt-1">
                {t('datasets.subtitle') || 'Explore and analyze comprehensive financial datasets'}
              </p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <DatasetList />
      </main>
      
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <MadeWithDyad />
        </div>
      </footer>
    </div>);

};

export default Datasets;