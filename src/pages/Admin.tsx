import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ExcelUploader } from '@/components/admin/ExcelUploader';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';

// In a real app, you would have proper admin role management
// For this demo, we'll use a simple check against a list of admin emails
const ADMIN_EMAILS = ['nathan@publiexpert.com']; // Replace with your email to test

const Admin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  
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
        // In a real app, you would check against a database role
        // For this demo, we'll just check if the user's email is in the admin list
        setIsAdmin(false);
      }
      setCheckingAdmin(false);
    }
  }, [user, loading, navigate]);
  
  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-4">You don't have permission to access this page.</p>
          <Button onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Upload Financial Data</h2>
            <ExcelUploader />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;