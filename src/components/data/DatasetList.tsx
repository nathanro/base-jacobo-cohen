import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { useAuth } from '@/contexts/AuthContext';

type Dataset = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  is_premium: boolean;
};

export function DatasetList() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const isPremiumUser = profile?.subscription_status === 'premium';

  useEffect(() => {
    const fetchDatasets = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('financial_datasets')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setDatasets(data || []);
      } catch (error: any) {
        showError(error.message || 'Failed to load datasets');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDatasets();
  }, []);

  const handleViewDataset = (id: string, isPremium: boolean) => {
    if (isPremium && !isPremiumUser) {
      showError('This dataset requires a premium subscription');
      return;
    }
    
    navigate(`/datasets/${id}`);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Available Datasets</h2>
        <div className="h-40 flex items-center justify-center">
          Loading datasets...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Available Datasets</h2>
      
      {datasets.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-muted-foreground">No datasets available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets.map(dataset => (
            <Card key={dataset.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{dataset.name}</CardTitle>
                  {dataset.is_premium && (
                    <Badge variant="secondary" className="ml-2">
                      <Lock className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  {new Date(dataset.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {dataset.description || 'No description available'}
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleViewDataset(dataset.id, dataset.is_premium)}
                  variant={dataset.is_premium && !isPremiumUser ? "outline" : "default"}
                  className="w-full"
                >
                  {dataset.is_premium && !isPremiumUser ? (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Requires Premium
                    </>
                  ) : (
                    'View Data'
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}