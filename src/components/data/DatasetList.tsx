import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSpreadsheet, Calendar, User, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { showError } from '@/utils/toast';
import { useAuth } from '@/contexts/AuthContext';
import { SampleDataUploader } from './SampleDataUploader';

type ExcelUpload = {
  id: number;
  filename: string;
  description: string;
  upload_date: string;
  file_size: number;
  is_premium: boolean;
  dataset_name: string;
  uploaded_by: number;
  file_data: string;
};

export function DatasetList() {
  const [uploads, setUploads] = useState<ExcelUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchUploads = async () => {
    setLoading(true);
    try {
      const response = await window.ezsite.apis.tablePage(41729, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: 'upload_date',
        IsAsc: false,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      setUploads(response.data?.List || []);
    } catch (error: any) {
      console.error('Failed to load datasets:', error);
      showError(error.message || 'Failed to load datasets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const handleViewDataset = () => {
    navigate('/datasets/view');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getRecordCount = (fileData: string) => {
    try {
      const data = JSON.parse(fileData || '[]');
      return Array.isArray(data) ? data.length : 0;
    } catch {
      return 0;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Available Financial Datasets</h2>
        <div className="h-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Available Financial Datasets</h2>
        <Button onClick={handleViewDataset} className="flex items-center space-x-2">
          <Database className="h-4 w-4" />
          <span>View All Data</span>
        </Button>
      </div>

      {uploads.length === 0 && (
        <SampleDataUploader />
      )}

      {uploads.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-muted-foreground mb-4">No financial datasets available yet.</p>
          <p className="text-sm text-gray-500">
            Use the sample data uploader above or upload Excel files through the admin panel.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Found {uploads.length} dataset{uploads.length !== 1 ? 's' : ''} with{' '}
            {uploads.reduce((total, upload) => total + getRecordCount(upload.file_data), 0)} total records
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploads.map((upload) => (
              <Card key={upload.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <FileSpreadsheet className="h-5 w-5 text-green-600" />
                      <span>{upload.dataset_name || upload.filename}</span>
                    </CardTitle>
                    {upload.is_premium && (
                      <Badge variant="secondary" className="ml-2">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center space-x-4 text-xs">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(upload.upload_date).toLocaleDateString()}</span>
                    </span>
                    <span>{formatFileSize(upload.file_size)}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {upload.description || 'No description available'}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Database className="h-3 w-3" />
                        <span>{getRecordCount(upload.file_data)} records</span>
                      </span>
                      <span>File: {upload.filename}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button
                    onClick={handleViewDataset}
                    variant="default"
                    className="w-full"
                  >
                    View Data
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}