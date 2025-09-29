import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ExcelUploader } from '@/components/admin/ExcelUploader';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/navigation/Navigation';
import { showError, showSuccess } from '@/utils/toast';
import { MadeWithDyad } from '@/components/powered-by-publiexpert';
import { useTranslation } from 'react-i18next';

const Admin = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [updatingSubscription, setUpdatingSubscription] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t('admin.loading', 'Cargando...')}</p>
      </div>);
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('admin.accessDenied', 'Acceso Denegado')}</h1>
          <p className="mb-4">{t('admin.noPermission', 'No tienes permiso para acceder a esta página.')}</p>
          <Button onClick={() => navigate('/')}>
            {t('admin.backToHome', 'Volver al Inicio')}
          </Button>
        </div>
      </div>);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.title', 'Panel de Administración')}</h1>
          
          <Button variant="outline" onClick={() => navigate('/')}>
            {t('admin.backToHome', 'Volver al Inicio')}
          </Button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="space-y-8">
          {/* Admin Info Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">{t('admin.welcomeTitle', 'Bienvenido Administrador')}</h2>
            <p className="mb-2"><strong>{t('admin.userName', 'Usuario:')})</strong> {user?.Name}</p>
            <p className="mb-2"><strong>{t('admin.userEmail', 'Email:')})</strong> {user?.Email}</p>
            <p className="mb-4"><strong>{t('admin.userRole', 'Rol:')})</strong> {user?.RoleName || 'Administrador'}</p>
            <p className="text-sm text-gray-600">{t('admin.adminDescription', 'Como administrador, puedes gestionar el contenido del sitio web, subir datos financieros y realizar tareas de mantenimiento.')}</p>
          </div>

          {/* File Upload Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">{t('admin.uploadData', 'Subir Datos Financieros')}</h2>
            <p className="mb-4 text-gray-600">{t('admin.uploadDescription', 'Utiliza esta sección para cargar archivos Excel con datos financieros al sistema.')}</p>
            <ExcelUploader />
          </div>

          {/* Documentation Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">{t('admin.documentation', 'Documentación de Administración')}</h2>
            <p className="mb-4 text-gray-600">{t('admin.docDescription', 'Consulta las instrucciones detalladas para el manejo del panel de administración.')}</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">{t('admin.contentManagement', 'Gestión de Contenido')}</h3>
                <p className="text-sm text-gray-600">{t('admin.contentDesc', 'Aprende a gestionar el contenido del sitio web.')}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">{t('admin.dataManagement', 'Gestión de Datos')}</h3>
                <p className="text-sm text-gray-600">{t('admin.dataDesc', 'Instrucciones para cargar y gestionar datos financieros.')}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">{t('admin.translations', 'Traducciones')}</h3>
                <p className="text-sm text-gray-600">{t('admin.translationsDesc', 'Cómo actualizar las traducciones del sitio.')}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">{t('admin.maintenance', 'Mantenimiento')}</h3>
                <p className="text-sm text-gray-600">{t('admin.maintenanceDesc', 'Tareas básicas de mantenimiento del sitio.')}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <MadeWithDyad />
        </div>
      </footer>
    </div>);

};

export default Admin;