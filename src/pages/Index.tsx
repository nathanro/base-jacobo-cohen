import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { DatasetList } from '@/components/data/DatasetList';
import { useAuth } from '@/contexts/AuthContext';
import { MadeWithDyad } from '@/components/powered-by-publiexpert';

const Index = () => {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Financial Data Platform</h1>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="text-sm text-right">
                  <p className="font-medium">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <p className="text-gray-500">
                    {profile?.subscription_status === 'premium' ? 'Premium User' : 'Free User'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigate('/account')}>
                    Account
                  </Button>
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <Button onClick={() => navigate('/login')}>Sign In</Button>
            )}
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user ? (
          <DatasetList />
        ) : (
          <div className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Welcome to the Financial Data Platform</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Access valuable financial datasets with powerful filtering and sorting capabilities.
              Sign in to explore available data or subscribe for premium content.
            </p>
            <Button size="lg" onClick={() => navigate('/login')}>
              Get Started
            </Button>
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};

export default Index;