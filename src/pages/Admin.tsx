import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/navigation/Navigation';
import { MadeWithDyad } from '@/components/powered-by-publiexpert';
import { useTranslation } from 'react-i18next';

// Import the new admin components
import AdminDashboard from  '@/components/admin/AdminDashboard';
import UserManagement from  '@/components/admin/UserManagement';
import RoleManagement from  '@/components/admin/RoleManagement';
import { ExcelUploader } from '@/components/admin/ExcelUploader';
import { SystemSettings } from '@/components/admin/SystemSettings';

const Admin = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t('admin.loading')}</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('admin.accessDenied')}</h1>
          <p className="mb-4">{t('admin.noPermission')}</p>
          <Button onClick={() => navigate('/')}>
            {t('admin.backToHome')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <header className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.title')}</h1>
          <Button variant="outline" onClick={() => navigate('/')}>
            {t('admin.backToHome')}
          </Button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">{t('admin.tabs.dashboard')}</TabsTrigger>
            <TabsTrigger value="users">{t('admin.tabs.users')}</TabsTrigger>
            <TabsTrigger value="roles">{t('admin.tabs.roles')}</TabsTrigger>
            <TabsTrigger value="data">{t('admin.tabs.data')}</TabsTrigger>
            <TabsTrigger value="settings">{t('admin.tabs.settings')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>
          
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="roles">
            <RoleManagement />
          </TabsContent>
          
          <TabsContent value="data">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">{t('admin.dataManagement.title')}</h2>
                <p className="mb-6 text-gray-600">{t('admin.dataManagement.description')}</p>
                <ExcelUploader />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">{t('admin.instructions.title')}</h4>
                <p className="text-sm text-blue-800">
                  {t('admin.instructions.dataManagementInstructions')}
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};

export default Admin;