import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { useTranslation } from 'react-i18next';
import { Upload, FileX, Eye, Trash2, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface UploadedFile {
  id: number;
  filename: string;
  file_size: number;
  upload_date: string;
  dataset_name: string;
  description: string;
  is_premium: boolean;
  file_data: string;
  uploaded_by: number;
}

export function ExcelUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [datasetName, setDatasetName] = useState('');
  const [description, setDescription] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const { t } = useTranslation();
  const { user } = useAuth();

  // File validation constants
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_EXTENSIONS = ['.xlsx', '.xls'];

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
    }

    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return `File type not supported. Please upload ${ALLOWED_EXTENSIONS.join(' or ')} files only.`;
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const validationError = validateFile(selectedFile);

      if (validationError) {
        showError(validationError);
        e.target.value = '';
        return;
      }

      setFile(selectedFile);
    }
  };

  const loadUploadedFiles = async () => {
    setLoadingFiles(true);
    try {
      const response = await window.ezsite.apis.tablePage(41729, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "upload_date",
        IsAsc: false
      });

      if (response.error) throw response.error;
      setUploadedFiles(response.data.List || []);
    } catch (error: any) {
      showError(error || 'Failed to load uploaded files');
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !datasetName.trim()) {
      showError('Please select a file and provide a dataset name');
      return;
    }

    if (!user?.ID) {
      showError('User authentication required');
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      showError(validationError);
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    const loadingToastId = showLoading('Uploading and processing file...');

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Read the Excel file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        throw new Error('The Excel file is empty or contains no valid data');
      }

      clearInterval(progressInterval);
      setUploadProgress(95);

      // Store the data using EasySite API
      const uploadData = {
        filename: file.name,
        file_size: file.size,
        upload_date: new Date().toISOString(),
        dataset_name: datasetName.trim(),
        description: description.trim(),
        is_premium: isPremium,
        file_data: JSON.stringify(jsonData),
        uploaded_by: user.ID
      };

      const response = await window.ezsite.apis.tableCreate(41729, uploadData);

      if (response.error) throw response.error;

      setUploadProgress(100);
      dismissToast(loadingToastId);
      showSuccess(`Excel file uploaded successfully! ${jsonData.length} rows processed.`);

      // Reset form
      setFile(null);
      setDatasetName('');
      setDescription('');
      setIsPremium(false);
      setUploadProgress(0);

      // Reset file input
      const fileInput = document.getElementById('excel-file') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

      // Reload uploaded files
      await loadUploadedFiles();
    } catch (error: any) {
      dismissToast(loadingToastId);
      showError(error || 'An error occurred during upload');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handlePreview = (file: UploadedFile) => {
    try {
      const data = JSON.parse(file.file_data);
      setPreviewData(Array.isArray(data) ? data.slice(0, 100) : []); // Limit to first 100 rows
      setPreviewDialogOpen(true);
    } catch (error) {
      showError('Failed to parse file data for preview');
    }
  };

  const handleDelete = async (fileId: number) => {
    if (!confirm('Are you sure you want to delete this uploaded file?')) {
      return;
    }

    try {
      const response = await window.ezsite.apis.tableDelete(41729, { ID: fileId });
      if (response.error) throw response.error;

      showSuccess('File deleted successfully');
      await loadUploadedFiles();
    } catch (error: any) {
      showError(error || 'Failed to delete file');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  // Load uploaded files on component mount
  useState(() => {
    loadUploadedFiles();
  });

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {t('admin.dataManagement.uploadFinancialData')}
          </CardTitle>
          <CardDescription>
            {t('admin.dataManagement.uploadFinancialDataDescription')}
            <br />
            <span className="text-sm text-muted-foreground">
              Max file size: {MAX_FILE_SIZE / (1024 * 1024)}MB. Supported formats: {ALLOWED_EXTENSIONS.join(', ')}
            </span>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUpload}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dataset-name">{t('admin.dataManagement.datasetName')} *</Label>
              <Input
                id="dataset-name"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                placeholder="Enter dataset name"
                required />

            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">{t('admin.dataManagement.datasetDescription')}</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description (optional)" />

            </div>
            
            <div className="space-y-2">
              <Label htmlFor="excel-file">{t('admin.dataManagement.excelFile')} *</Label>
              <Input
                id="excel-file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                required />

              {file &&
              <div className="text-sm text-muted-foreground">
                  Selected: {file.name} ({formatFileSize(file.size)})
                </div>
              }
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="premium"
                checked={isPremium}
                onCheckedChange={(checked) => setIsPremium(checked === true)} />

              <Label htmlFor="premium">{t('admin.dataManagement.premiumContent')}</Label>
            </div>

            {loading && uploadProgress > 0 &&
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            }
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ?
              <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t('common.loading')}
                </div> :

              t('admin.dataManagement.uploadData')
              }
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Uploaded Files List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Uploaded Files</span>
            <Button
              variant="outline"
              size="sm"
              onClick={loadUploadedFiles}
              disabled={loadingFiles}>

              {loadingFiles ? 'Loading...' : 'Refresh'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingFiles ?
          <div className="flex items-center justify-center p-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span className="ml-2">Loading files...</span>
            </div> :
          uploadedFiles.length === 0 ?
          <div className="text-center py-8 text-muted-foreground">
              <FileX className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No files uploaded yet</p>
            </div> :

          <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dataset Name</TableHead>
                    <TableHead>Filename</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uploadedFiles.map((file) =>
                <TableRow key={file.id}>
                      <TableCell className="font-medium">{file.dataset_name}</TableCell>
                      <TableCell>{file.filename}</TableCell>
                      <TableCell>{formatFileSize(file.file_size)}</TableCell>
                      <TableCell>{formatDate(file.upload_date)}</TableCell>
                      <TableCell>
                        <Badge variant={file.is_premium ? "default" : "secondary"}>
                          {file.is_premium ? "Premium" : "Standard"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreview(file)}>

                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(file.id)}>

                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                )}
                </TableBody>
              </Table>
            </ScrollArea>
          }
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Data Preview</DialogTitle>
            <DialogDescription>
              Showing first {Math.min(previewData.length, 100)} rows of data
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] w-full">
            {previewData.length > 0 &&
            <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(previewData[0]).map((key) =>
                  <TableHead key={key}>{key}</TableHead>
                  )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.slice(0, 50).map((row, index) =>
                <TableRow key={index}>
                      {Object.values(row).map((value: any, cellIndex) =>
                  <TableCell key={cellIndex}>
                          {String(value).length > 50 ?
                    String(value).substring(0, 50) + '...' :
                    String(value)
                    }
                        </TableCell>
                  )}
                    </TableRow>
                )}
                </TableBody>
              </Table>
            }
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>);

}