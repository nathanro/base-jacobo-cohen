import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { FinancialDataTable } from '@/components/data/FinancialDataTable';
import { useAuth } from '@/contexts/AuthContext';
import { MadeWithDyad } from '@/components/powered-by-publiexpert';

const DatasetView = () => {
  const { id } = useParams<{id: string;}>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>);

  }

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Dataset not found</p>
      </div>);

  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Financial Dataset</h1>
          
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <FinancialDataTable datasetId={id} />
      </main>
      
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <MadeWithDyad />
        </div>
      </footer>
    </div>);

};

export default DatasetView;