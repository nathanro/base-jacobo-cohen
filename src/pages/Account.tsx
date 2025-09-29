import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionCard } from '@/components/subscription/SubscriptionCard';
import { useAuth } from '@/contexts/AuthContext';
import { MadeWithDyad } from '@/components/powered-by-publiexpert';

const Account = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>);

  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your account details and subscription status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p>{profile.first_name} {profile.last_name}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{user.email}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Subscription Status</p>
                <p className="capitalize">{profile.subscription_status}</p>
              </div>
              
              {profile.subscription_end_date &&
              <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Subscription Ends</p>
                  <p>{new Date(profile.subscription_end_date).toLocaleDateString()}</p>
                </div>
              }
            </CardContent>
          </Card>
          
          <SubscriptionCard />
        </div>
      </main>
      
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <MadeWithDyad />
        </div>
      </footer>
    </div>);

};

export default Account;