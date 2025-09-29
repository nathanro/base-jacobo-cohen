import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/navigation/Navigation';
import { MadeWithDyad } from '@/components/powered-by-publiexpert';
import { useTranslation } from 'react-i18next';
import { FinancialDataTable } from '@/components/data/FinancialDataTable';

const DatasetView = () => {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>);

  }

  // Allow access to dataset view even if not logged in for demo purposes
  // In production, you might want to restrict access

  

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">{t('datasetView.title') || 'Financial Data Dashboard'}</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <FinancialDataTable />
      </main>
      
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <MadeWithDyad />
        </div>
      </footer>
    </div>);

};

export default DatasetView;