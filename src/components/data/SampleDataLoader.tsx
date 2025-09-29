import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Upload, CheckCircle } from 'lucide-react';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';

export function SampleDataLoader({ onDataLoaded }: {onDataLoaded?: () => void;}) {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const sampleFinancialData = [
  {
    filename: "tech-startup-q1-2024.xlsx",
    dataset_name: "TechCorp Q1 2024 Financial Report",
    description: "Quarterly financial report for TechCorp including revenue, expenses, and growth metrics",
    company_name: "TechCorp Inc.",
    report_period: "Q1 2024",
    fiscal_year: 2024,
    revenue: 12500000,
    net_income: 2100000,
    assets: 45000000,
    equity: 38000000,
    debt: 7000000,
    ebitda: 3200000,
    margin: 16.8,
    sales_grow_per_year: 25.3,
    data_quality_score: 95,
    upload_date: new Date('2024-04-15').toISOString(),
    processed_date: new Date('2024-04-15').toISOString(),
    status: "processed",
    is_premium: true,
    uploaded_by: 1,
    file_size: 156780,
    processing_notes: "High quality data with complete financial statements",
    file_data: JSON.stringify([
    {
      "Year": 2024,
      "Quarter": "Q1",
      "Company": "TechCorp Inc.",
      "Industry": "Technology",
      "Revenue": 12500000000,
      "Net_Income": 2100000000,
      "Assets": 45000000000,
      "Liabilities": 7000000000,
      "Equity": 38000000000,
      "EBITDA": 3200000000,
      "Total_Investment": 25000000000000,
      "Enterprise_Value": 18500000000000,
      "Debt_to_Equity": 0.18,
      "ROE": 5.5,
      "Profit_Margin": 16.8,
      "Growth_Rate": 25.3,
      "Market_Cap": 150000000000,
      "Large_Scale_Assets": 33000000000000,
      "Future_Cash_Flow": 8900000000000,
      "Employees": 450
    }]
    )
  },
  {
    filename: "manufacturing-corp-annual-2023.xlsx",
    dataset_name: "ManufaCorp 2023 Annual Report",
    description: "Annual financial report for ManufaCorp with detailed operational metrics",
    company_name: "ManufaCorp Ltd.",
    report_period: "Annual 2023",
    fiscal_year: 2023,
    revenue: 89500000,
    net_income: 8950000,
    assets: 125000000,
    equity: 89000000,
    debt: 36000000,
    ebitda: 18500000,
    margin: 10.0,
    sales_grow_per_year: 12.7,
    data_quality_score: 88,
    upload_date: new Date('2024-03-20').toISOString(),
    processed_date: new Date('2024-03-20').toISOString(),
    status: "processed",
    is_premium: false,
    uploaded_by: 1,
    file_size: 298456,
    processing_notes: "Good quality data with minor inconsistencies",
    file_data: JSON.stringify([
    {
      "Year": 2023,
      "Company": "ManufaCorp Ltd.",
      "Industry": "Manufacturing",
      "Revenue": 89500000000,
      "Cost_of_Goods_Sold": 62650000000,
      "Gross_Profit": 26850000000,
      "Operating_Expenses": 17900000000,
      "Net_Income": 8950000000,
      "Assets": 1250000000000,
      "Liabilities": 36000000000,
      "Equity": 89000000000,
      "EBITDA": 18500000000,
      "Total_Capital": 15600000000000,
      "Infrastructure_Value": 22100000000000,
      "Production_Assets": 9800000000000,
      "Debt_to_Equity": 0.40,
      "ROE": 10.1,
      "ROA": 7.2,
      "Profit_Margin": 10.0,
      "Growth_Rate": 12.7,
      "Inventory_Turnover": 4.2,
      "Current_Ratio": 2.1,
      "Employees": 1250
    }]
    )
  },
  {
    filename: "retail-chain-2023-performance.xlsx",
    dataset_name: "RetailPlus Chain 2023 Performance Analysis",
    description: "Comprehensive financial and operational analysis for RetailPlus chain stores",
    company_name: "RetailPlus Stores",
    report_period: "Annual 2023",
    fiscal_year: 2023,
    revenue: 156200000,
    net_income: 7810000,
    assets: 89500000,
    equity: 62300000,
    debt: 27200000,
    ebitda: 15620000,
    margin: 5.0,
    sales_grow_per_year: 8.4,
    data_quality_score: 92,
    upload_date: new Date('2024-02-28').toISOString(),
    processed_date: new Date('2024-02-28').toISOString(),
    status: "processed",
    is_premium: true,
    uploaded_by: 1,
    file_size: 445123,
    processing_notes: "Excellent data quality with complete store breakdown",
    file_data: JSON.stringify([
    {
      "Year": 2023,
      "Company": "RetailPlus Stores",
      "Industry": "Retail",
      "Revenue": 156200000,
      "Cost_of_Goods_Sold": 109340000,
      "Gross_Profit": 46860000,
      "Operating_Expenses": 39050000,
      "Net_Income": 7810000,
      "Assets": 89500000,
      "Liabilities": 27200000,
      "Equity": 62300000,
      "EBITDA": 15620000,
      "Debt_to_Equity": 0.44,
      "ROE": 12.5,
      "ROA": 8.7,
      "Profit_Margin": 5.0,
      "Growth_Rate": 8.4,
      "Store_Count": 248,
      "Revenue_per_Store": 630000,
      "Same_Store_Growth": 6.2,
      "Inventory_Turnover": 5.8,
      "Employees": 3200
    }]
    )
  }];


  const insertSampleData = async () => {
    setLoading(true);
    const toastId = showLoading('Loading sample financial data...');

    try {
      let successCount = 0;

      for (const record of sampleFinancialData) {
        const response = await window.ezsite.apis.tableCreate(41729, record);
        if (response.error) {
          console.error('Error inserting sample data:', response.error);
        } else {
          successCount++;
        }
      }

      dismissToast(toastId);

      if (successCount > 0) {
        showSuccess(`Successfully loaded ${successCount} sample datasets!`);
        setCompleted(true);
        if (onDataLoaded) {
          setTimeout(() => {
            onDataLoaded();
          }, 1000);
        }
      } else {
        showError('Failed to load sample data. Please try again.');
      }
    } catch (error: any) {
      dismissToast(toastId);
      console.error('Failed to insert sample data:', error);
      showError(error.message || 'Failed to load sample data');
    } finally {
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Sample Data Loaded Successfully!
            </h3>
            <p className="text-green-700">
              The financial datasets are now available for analysis. The page will refresh shortly.
            </p>
          </div>
        </CardContent>
      </Card>);

  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Load Sample Financial Data</span>
        </CardTitle>
        <CardDescription>
          Load sample datasets to explore the financial dashboard functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border">
          <h4 className="font-medium text-blue-900 mb-2">Sample datasets include:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• TechCorp Q1 2024 - Technology company quarterly report</li>
            <li>• ManufaCorp 2023 - Manufacturing company annual report</li>
            <li>• RetailPlus 2023 - Retail chain performance analysis</li>
          </ul>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> This sample data is for demonstration purposes only. 
            In a production environment, you would upload real Excel files through the admin panel.
          </p>
        </div>

        <Button
          onClick={insertSampleData}
          disabled={loading}
          className="w-full"
          size="lg">

          {loading ?
          <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Loading Sample Data...
            </> :

          <>
              <Upload className="h-4 w-4 mr-2" />
              Load Sample Financial Data
            </>
          }
        </Button>
      </CardContent>
    </Card>);

}