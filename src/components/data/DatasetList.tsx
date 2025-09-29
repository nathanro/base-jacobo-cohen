import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSpreadsheet, Calendar, User, Database, Upload, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { showError, showSuccess } from '@/utils/toast';
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
  company_name?: string;
  report_period?: string;
  fiscal_year?: number;
  status: string;
};

export function DatasetList() {
  const [uploads, setUploads] = useState<ExcelUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchUploads = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await window.ezsite.apis.tablePage(41729, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: 'upload_date',
        IsAsc: false
      });

      if (response.error) {
        throw new Error(response.error);
      }

      const uploadList = response.data?.List || [];
      setUploads(uploadList);

      if (showRefreshing) {
        showSuccess(`Refreshed dataset list - found ${uploadList.length} datasets`);
      }
    } catch (error: any) {
      console.error('Failed to load datasets:', error);
      showError(error.message || 'Failed to load datasets');
    } finally {
      if (showRefreshing) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const handleViewDataset = () => {
    navigate('/datasets/1');
  };

  const handleRefresh = () => {
    fetchUploads(true);
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

  const totalRecords = uploads.reduce((total, upload) => total + getRecordCount(upload.file_data), 0);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Available Financial Datasets</h2>
        <div className="h-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>);

  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Available Financial Datasets</h2>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={refreshing}
            className="flex items-center space-x-2">

            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Button onClick={handleViewDataset} className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>View All Data</span>
          </Button>
        </div>
      </div>

      {uploads.length === 0 &&
      <div className="space-y-6">
          <SampleDataUploader />
          <div className="text-center p-8 border rounded-lg">
            <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-muted-foreground mb-4">No financial datasets available yet.</p>
            <p className="text-sm text-gray-500">
              Use the sample data uploader above or upload Excel files through the admin panel.
            </p>
          </div>
        </div>
      }

      {uploads.length > 0 &&
      <div className="space-y-4">
          <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-800">
              <strong>Found {uploads.length} dataset{uploads.length !== 1 ? 's' : ''}</strong> with{' '}
              <strong>{totalRecords.toLocaleString()} total records</strong>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {uploads.filter((u) => u.status === 'processed').length} processed
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploads.map((upload) =>
          <Card key={upload.id} className="hover:shadow-md transition-shadow bg-white">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <FileSpreadsheet className="h-5 w-5 text-green-600" />
                      <span className="truncate">{upload.dataset_name || upload.filename}</span>
                    </CardTitle>
                    <div className="flex flex-col space-y-1">
                      {upload.is_premium &&
                  <Badge variant="secondary" className="text-xs">
                          Premium
                        </Badge>
                  }
                      <Badge
                    variant={upload.status === 'processed' ? 'default' : 'secondary'}
                    className="text-xs">

                        {upload.status}
                      </Badge>
                    </div>
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
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {upload.description || 'No description available'}
                    </p>
                    
                    {(upload.company_name || upload.report_period || upload.fiscal_year) &&
                <div className="bg-gray-50 p-2 rounded-md text-xs space-y-1">
                        {upload.company_name &&
                  <div><strong>Company:</strong> {upload.company_name}</div>
                  }
                        {upload.report_period &&
                  <div><strong>Period:</strong> {upload.report_period}</div>
                  }
                        {upload.fiscal_year &&
                  <div><strong>Year:</strong> {upload.fiscal_year}</div>
                  }
                      </div>
                }
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Database className="h-3 w-3" />
                        <span>{getRecordCount(upload.file_data).toLocaleString()} records</span>
                      </span>
                      <span className="truncate max-w-[120px]">File: {upload.filename}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button
                onClick={handleViewDataset}
                variant="default"
                className="w-full">

                    Analyze Data
                  </Button>
                </CardFooter>
              </Card>
          )}
          </div>
        </div>
      }
    </div>);

}