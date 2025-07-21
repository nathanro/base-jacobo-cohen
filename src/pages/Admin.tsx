import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ExcelUploader } from '@/components/admin/ExcelUploader';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

// Actualizado para incluir tu correo electrónico
const ADMIN_EMAILS = ['nathan@publiexpert.com']; 

const Admin = () => {
  const { user, loading, profile } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [updatingSubscription, setUpdatingSubscription] = useState(false);
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }
    
    if (user) {
      // Check if user is an admin
      if (ADMIN_EMAILS.includes(user.email || '')) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setCheckingAdmin(false);
    }
  }, [user, loading, navigate]);

  const makeUserPremium = async () => {
    if (!user) return;
    
    setUpdatingSubscription(true);
    try {
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'premium',
          subscription_end_date: oneYearFromNow.toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      showSuccess('¡Actualizado a usuario premium con éxito!');
      
      // Recargar la página para actualizar el contexto de autenticación
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      showError(error.message || 'Error al actualizar la suscripción');
    } finally {
      setUpdatingSubscription(false);
    }
  };
  
  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
          <p className="mb-4">No tienes permiso para acceder a esta página.</p>
          <Button onClick={() => navigate('/')}>
            Volver al Inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
          
          <Button variant="outline" onClick={() => navigate('/')}>
            Volver al Inicio
          </Button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {profile?.subscription_status !== 'premium' && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold mb-4">Estado de Suscripción</h2>
              <p className="mb-4">Actualmente eres un usuario gratuito. Como administrador, puedes actualizar tu cuenta a premium.</p>
              <Button 
                onClick={makeUserPremium} 
                disabled={updatingSubscription}
              >
                {updatingSubscription ? 'Actualizando...' : 'Convertirme en Usuario Premium'}
              </Button>
            </div>
          )}
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Subir Datos Financieros</h2>
            <ExcelUploader />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;