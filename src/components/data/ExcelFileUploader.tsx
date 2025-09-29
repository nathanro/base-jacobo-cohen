import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { Upload, FileSpreadsheet, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useAuth } from '@/contexts/AuthContext';

interface ExcelFileUploaderProps {
  onUploadSuccess?: () => void;
}

export function ExcelFileUploader({ onUploadSuccess }: ExcelFileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [datasetName, setDatasetName] = useState('');
  const [description, setDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [reportPeriod, setReportPeriod] = useState('');
  const [fiscalYear, setFiscalYear] = useState<number | ''>('');
  const [isPremium, setIsPremium] = useState(false);
  const { user } = useAuth();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      if (!datasetName) {
        setDatasetName(file.name.replace(/\.[^/.]+$/, ""));
      }
      parseExcelFile(file);
    }
  }, [datasetName]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false
  });

  const parseExcelFile = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setParsedData(jsonData);
      showSuccess(`Parsed ${jsonData.length} rows from Excel file`);
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      showError('Failed to parse Excel file');
      setParsedData([]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || parsedData.length === 0) {
      showError('Please select and parse a file first');
      return;
    }

    if (!datasetName.trim()) {
      showError('Please enter a dataset name');
      return;
    }

    setUploading(true);
    const toastId = showLoading('Uploading dataset...');

    try {
      const uploadData = {
        filename: selectedFile.name,
        file_data: JSON.stringify(parsedData),
        upload_date: new Date().toISOString(),
        file_size: selectedFile.size,
        status: 'processed',
        description: description.trim(),
        is_premium: isPremium,
        dataset_name: datasetName.trim(),
        uploaded_by: user?.ID || 0,
        company_name: companyName.trim(),
        report_period: reportPeriod.trim(),
        fiscal_year: fiscalYear ? Number(fiscalYear) : 0,
        processed_date: new Date().toISOString(),
        processing_notes: `Uploaded via web interface with ${parsedData.length} records`,
        data_quality_score: 85,
        mime_type: selectedFile.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      };

      const response = await window.ezsite.apis.tableCreate(41729, uploadData);

      if (response.error) {
        throw new Error(response.error);
      }

      dismissToast(toastId);
      showSuccess(`Successfully uploaded dataset with ${parsedData.length} records!`);

      // Reset form
      setSelectedFile(null);
      setParsedData([]);
      setDatasetName('');
      setDescription('');
      setCompanyName('');
      setReportPeriod('');
      setFiscalYear('');
      setIsPremium(false);

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error: any) {
      dismissToast(toastId);
      console.error('Failed to upload dataset:', error);
      showError(error.message || 'Failed to upload dataset');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setParsedData([]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Upload Excel Financial Data</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!selectedFile ?
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`
          }>

            <input {...getInputProps()} />
            <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            {isDragActive ?
          <p className="text-blue-600">Drop the Excel file here...</p> :

          <div>
                <p className="text-gray-600 mb-2">Drag & drop an Excel file here, or click to select</p>
                <p className="text-sm text-gray-500">Supports .xlsx, .xls, and .csv files</p>
              </div>
          }
          </div> :

        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileSpreadsheet className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">{selectedFile.name}</p>
                  <p className="text-sm text-green-700">
                    {(selectedFile.size / 1024).toFixed(2)} KB • {parsedData.length} records parsed
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={removeFile} className="text-green-800">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="datasetName">Dataset Name *</Label>
                <Input
                id="datasetName"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                placeholder="Enter dataset name"
                required />

              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name" />

              </div>

              <div className="space-y-2">
                <Label htmlFor="reportPeriod">Report Period</Label>
                <Input
                id="reportPeriod"
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
                placeholder="e.g., Q1 2024, Annual 2023" />

              </div>

              <div className="space-y-2">
                <Label htmlFor="fiscalYear">Fiscal Year</Label>
                <Input
                id="fiscalYear"
                type="number"
                value={fiscalYear}
                onChange={(e) => setFiscalYear(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g., 2024"
                min="2000"
                max="2030" />

              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the dataset content and purpose"
              rows={3} />

            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
              id="isPremium"
              checked={isPremium}
              onCheckedChange={(checked) => setIsPremium(checked as boolean)} />

              <Label htmlFor="isPremium" className="text-sm">
                Mark as premium dataset
              </Label>
            </div>

            <div className="pt-4 border-t">
              <Button
              onClick={handleUpload}
              disabled={uploading || parsedData.length === 0}
              className="w-full"
              size="lg">

                {uploading ?
              <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading Dataset...
                  </> :

              <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Dataset ({parsedData.length} records)
                  </>
              }
              </Button>
            </div>

            {parsedData.length > 0 &&
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Data Preview</h4>
                <div className="text-xs text-gray-600 mb-2">
                  First few columns: {Object.keys(parsedData[0] || {}).slice(0, 5).join(', ')}
                  {Object.keys(parsedData[0] || {}).length > 5 && '...'}
                </div>
                <div className="text-xs text-gray-500">
                  {parsedData.length} rows ready for upload
                </div>
              </div>
          }
          </div>
        }
      </CardContent>
    </Card>);

}