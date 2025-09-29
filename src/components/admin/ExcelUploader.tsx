import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { useTranslation } from 'react-i18next';

export function ExcelUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [datasetName, setDatasetName] = useState('');
  const [description, setDescription] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !datasetName) {
      showError('Please select a file and provide a dataset name');
      return;
    }

    setLoading(true);

    try {
      // Read the Excel file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        throw new Error('The Excel file is empty');
      }

      // Create a new dataset
      const { data: dataset, error: datasetError } = await supabase.
      from('financial_datasets').
      insert({
        name: datasetName,
        description,
        is_premium: isPremium
      }).
      select().
      single();

      if (datasetError) throw datasetError;

      // Insert the data
      const { error: dataError } = await supabase.
      from('financial_data').
      insert({
        dataset_id: dataset.id,
        data: jsonData
      });

      if (dataError) throw dataError;

      showSuccess('Financial data uploaded successfully!');

      // Reset form
      setFile(null);
      setDatasetName('');
      setDescription('');
      setIsPremium(false);

      // Reset file input
      const fileInput = document.getElementById('excel-file') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error: any) {
      showError(error.message || 'An error occurred during upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{t('admin.uploadFinancialData')}</CardTitle>
        <CardDescription>
          {t('admin.uploadFinancialDataDescription')}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleUpload}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dataset-name">{t('admin.datasetName')}</Label>
            <Input
              id="dataset-name"
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
              required />

          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">{t('admin.description')}</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)} />

          </div>
          
          <div className="space-y-2">
            <Label htmlFor="excel-file">{t('admin.excelFile')}</Label>
            <Input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              required />

          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="premium"
              checked={isPremium}
              onCheckedChange={(checked) => setIsPremium(checked === true)} />

            <Label htmlFor="premium">{t('admin.premiumContent')}</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('common.loading') : t('admin.uploadData')}
          </Button>
        </CardFooter>
      </form>
    </Card>);

}