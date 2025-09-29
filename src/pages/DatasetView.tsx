import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/navigation/Navigation';
import { MadeWithDyad } from '@/components/powered-by-publiexpert';
import { useTranslation } from 'react-i18next';
import { FinancialDataTable } from '@/components/data/FinancialDataTable';
import { ExcelFileUploader } from '@/components/data/ExcelFileUploader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Upload, BarChart3 } from 'lucide-react';

const DatasetView = () => {
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    // Trigger a refresh of the data table
    setRefreshKey((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>);

  }

  const canUpload = user && (user.Roles?.includes('Administrator') || user.Roles?.includes('GeneralUser'));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">{t('datasetView.title') || 'Financial Data Dashboard'}</h1>
          <p className="text-gray-600 mt-1">
            Analyze financial data with advanced filtering and visualization tools
          </p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analysis" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Data Analysis</span>
            </TabsTrigger>
            {canUpload &&
            <TabsTrigger value="upload" className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Upload Data</span>
              </TabsTrigger>
            }
          </TabsList>
          
          <TabsContent value="analysis" className="mt-6">
            <FinancialDataTable key={refreshKey} />
          </TabsContent>
          
          {canUpload &&
          <TabsContent value="upload" className="mt-6">
              <ExcelFileUploader onUploadSuccess={handleUploadSuccess} />
            </TabsContent>
          }
        </Tabs>
      </main>
      
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <MadeWithDyad />
        </div>
      </footer>
    </div>);

};

export default DatasetView;