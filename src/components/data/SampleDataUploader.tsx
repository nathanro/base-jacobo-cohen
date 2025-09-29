import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { showError, showSuccess } from '@/utils/toast';
import { Upload, Database } from 'lucide-react';

export function SampleDataUploader() {
  const [loading, setLoading] = useState(false);

  const sampleFinancialData = [
  {
    company_name: "TechCorp Inc",
    revenue: 125000000,
    sales_grow_per_year: 15.2,
    margin: 22.5,
    debt: 45000000,
    assets: 180000000,
    employees: 1250,
    sector: "Technology",
    year: 2023,
    country: "USA"
  },
  {
    company_name: "GreenEnergy Ltd",
    revenue: 89000000,
    sales_grow_per_year: 28.7,
    margin: 18.3,
    debt: 32000000,
    assets: 145000000,
    employees: 890,
    sector: "Energy",
    year: 2023,
    country: "Canada"
  },
  {
    company_name: "HealthPlus Corp",
    revenue: 67000000,
    sales_grow_per_year: 12.4,
    margin: 35.8,
    debt: 18000000,
    assets: 95000000,
    employees: 650,
    sector: "Healthcare",
    year: 2023,
    country: "USA"
  },
  {
    company_name: "AutoMotive Solutions",
    revenue: 156000000,
    sales_grow_per_year: 8.9,
    margin: 14.2,
    debt: 78000000,
    assets: 220000000,
    employees: 1850,
    sector: "Automotive",
    year: 2023,
    country: "Germany"
  },
  {
    company_name: "FoodChain Global",
    revenue: 234000000,
    sales_grow_per_year: 6.5,
    margin: 8.7,
    debt: 123000000,
    assets: 345000000,
    employees: 3200,
    sector: "Food & Beverage",
    year: 2023,
    country: "UK"
  },
  {
    company_name: "FinTech Innovations",
    revenue: 78000000,
    sales_grow_per_year: 45.3,
    margin: 28.9,
    debt: 25000000,
    assets: 110000000,
    employees: 520,
    sector: "Financial Services",
    year: 2023,
    country: "USA"
  },
  {
    company_name: "Manufacturing Pro",
    revenue: 198000000,
    sales_grow_per_year: 4.2,
    margin: 11.5,
    debt: 89000000,
    assets: 275000000,
    employees: 2100,
    sector: "Manufacturing",
    year: 2023,
    country: "China"
  },
  {
    company_name: "RetailMax Chain",
    revenue: 445000000,
    sales_grow_per_year: 7.8,
    margin: 5.3,
    debt: 156000000,
    assets: 520000000,
    employees: 8900,
    sector: "Retail",
    year: 2023,
    country: "USA"
  },
  {
    company_name: "CloudSoft Systems",
    revenue: 92000000,
    sales_grow_per_year: 32.1,
    margin: 25.4,
    debt: 28000000,
    assets: 125000000,
    employees: 780,
    sector: "Technology",
    year: 2023,
    country: "USA"
  },
  {
    company_name: "BioPharm Research",
    revenue: 134000000,
    sales_grow_per_year: 18.6,
    margin: 42.3,
    debt: 45000000,
    assets: 185000000,
    employees: 1100,
    sector: "Healthcare",
    year: 2023,
    country: "Switzerland"
  }];


  const uploadSampleData = async () => {
    setLoading(true);
    try {
      const response = await window.ezsite.apis.tableCreate(41729, {
        filename: "sample_financial_data.xlsx",
        file_data: JSON.stringify(sampleFinancialData),
        upload_date: new Date().toISOString(),
        file_size: JSON.stringify(sampleFinancialData).length,
        description: "Sample financial data for testing with key metrics including sales growth, margin, and debt ratios",
        is_premium: false,
        dataset_name: "Sample Financial Dataset 2023",
        uploaded_by: 0
      });

      if (response.error) {
        throw new Error(response.error);
      }

      showSuccess(`Sample financial data uploaded successfully! Added ${sampleFinancialData.length} company records.`);
    } catch (error: any) {
      console.error('Failed to upload sample data:', error);
      showError(error.message || 'Failed to upload sample data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Sample Data</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Upload sample financial data to test the dashboard functionality. This includes 10 companies with key metrics:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <span className="font-semibold">• Sales Growth per Year</span>
            <span className="font-semibold">• Margin %</span>
            <span className="font-semibold">• Debt Amount</span>
            <span>• Revenue, Assets, Employees</span>
          </div>
          <Button
            onClick={uploadSampleData}
            disabled={loading}
            className="flex items-center space-x-2">

            <Upload className="h-4 w-4" />
            <span>{loading ? 'Uploading...' : 'Upload Sample Data'}</span>
          </Button>
        </div>
      </CardContent>
    </Card>);

}