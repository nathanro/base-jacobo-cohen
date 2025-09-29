// This is sample financial data to demonstrate the functionality
// It simulates what would be uploaded via Excel files

const sampleFinancialData = [
// Company 1 - Tech Startup
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
    "Revenue": 12500000,
    "Net_Income": 2100000,
    "Assets": 45000000,
    "Liabilities": 7000000,
    "Equity": 38000000,
    "EBITDA": 3200000,
    "Debt_to_Equity": 0.18,
    "ROE": 5.5,
    "Profit_Margin": 16.8,
    "Growth_Rate": 25.3,
    "Market_Cap": 150000000,
    "Employees": 450
  },
  {
    "Year": 2023,
    "Quarter": "Q1",
    "Company": "TechCorp Inc.",
    "Industry": "Technology",
    "Revenue": 10000000,
    "Net_Income": 1600000,
    "Assets": 38000000,
    "Liabilities": 6000000,
    "Equity": 32000000,
    "EBITDA": 2400000,
    "Debt_to_Equity": 0.19,
    "ROE": 5.0,
    "Profit_Margin": 16.0,
    "Growth_Rate": 22.1,
    "Market_Cap": 120000000,
    "Employees": 380
  }]
  )
},

// Company 2 - Manufacturing
{
  filename: "manufacturing-corp-annual-2023.xlsx",
  dataset_name: "ManufaCorp 2023 Annual Report",
  description: "Annual financial report for ManufaCorp with detailed operational metrics and profitability analysis",
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
  processing_notes: "Good quality data with minor inconsistencies in depreciation calculations",
  file_data: JSON.stringify([
  {
    "Year": 2023,
    "Company": "ManufaCorp Ltd.",
    "Industry": "Manufacturing",
    "Revenue": 89500000,
    "Cost_of_Goods_Sold": 62650000,
    "Gross_Profit": 26850000,
    "Operating_Expenses": 17900000,
    "Net_Income": 8950000,
    "Assets": 125000000,
    "Liabilities": 36000000,
    "Equity": 89000000,
    "EBITDA": 18500000,
    "Debt_to_Equity": 0.40,
    "ROE": 10.1,
    "ROA": 7.2,
    "Profit_Margin": 10.0,
    "Growth_Rate": 12.7,
    "Inventory_Turnover": 4.2,
    "Current_Ratio": 2.1,
    "Employees": 1250
  },
  {
    "Year": 2022,
    "Company": "ManufaCorp Ltd.",
    "Industry": "Manufacturing",
    "Revenue": 79400000,
    "Cost_of_Goods_Sold": 57528000,
    "Gross_Profit": 21872000,
    "Operating_Expenses": 16462000,
    "Net_Income": 5410000,
    "Assets": 118000000,
    "Liabilities": 34500000,
    "Equity": 83500000,
    "EBITDA": 12850000,
    "Debt_to_Equity": 0.41,
    "ROE": 6.5,
    "ROA": 4.6,
    "Profit_Margin": 6.8,
    "Growth_Rate": 8.3,
    "Inventory_Turnover": 3.9,
    "Current_Ratio": 1.9,
    "Employees": 1180
  }]
  )
},

// Company 3 - Retail Chain
{
  filename: "retail-chain-2023-performance.xlsx",
  dataset_name: "RetailPlus Chain 2023 Performance Analysis",
  description: "Comprehensive financial and operational analysis for RetailPlus chain stores nationwide",
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
  processing_notes: "Excellent data quality with complete store-by-store breakdown",
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
  },
  {
    "Year": 2022,
    "Company": "RetailPlus Stores",
    "Industry": "Retail",
    "Revenue": 144100000,
    "Cost_of_Goods_Sold": 102231000,
    "Gross_Profit": 41869000,
    "Operating_Expenses": 36025000,
    "Net_Income": 5844000,
    "Assets": 82000000,
    "Liabilities": 25500000,
    "Equity": 56500000,
    "EBITDA": 12608000,
    "Debt_to_Equity": 0.45,
    "ROE": 10.3,
    "ROA": 7.1,
    "Profit_Margin": 4.1,
    "Growth_Rate": 5.7,
    "Store_Count": 235,
    "Revenue_per_Store": 613000,
    "Same_Store_Growth": 4.8,
    "Inventory_Turnover": 5.4,
    "Employees": 2950
  }]
  )
},

// Company 4 - Financial Services
{
  filename: "finservices-q4-2023.xlsx",
  dataset_name: "FinanceFirst Q4 2023 Results",
  description: "Fourth quarter financial results for FinanceFirst with detailed loan portfolio analysis",
  company_name: "FinanceFirst Corp",
  report_period: "Q4 2023",
  fiscal_year: 2023,
  revenue: 34200000,
  net_income: 6840000,
  assets: 890000000,
  equity: 89000000,
  debt: 12000000,
  ebitda: 9120000,
  margin: 20.0,
  sales_grow_per_year: 15.8,
  data_quality_score: 98,
  upload_date: new Date('2024-01-25').toISOString(),
  processed_date: new Date('2024-01-25').toISOString(),
  status: "processed",
  is_premium: true,
  uploaded_by: 1,
  file_size: 234567,
  processing_notes: "Exceptional data quality with detailed risk analysis and regulatory compliance metrics",
  file_data: JSON.stringify([
  {
    "Year": 2023,
    "Quarter": "Q4",
    "Company": "FinanceFirst Corp",
    "Industry": "Financial Services",
    "Net_Interest_Income": 28500000,
    "Fee_Income": 5700000,
    "Total_Revenue": 34200000,
    "Operating_Expenses": 18810000,
    "Provision_for_Losses": 2280000,
    "Net_Income": 6840000,
    "Total_Assets": 890000000,
    "Total_Loans": 645000000,
    "Total_Deposits": 756000000,
    "Shareholders_Equity": 89000000,
    "ROE": 30.6,
    "ROA": 3.1,
    "Net_Interest_Margin": 3.8,
    "Efficiency_Ratio": 55.0,
    "Loan_Loss_Rate": 0.35,
    "Capital_Ratio": 12.5,
    "Employees": 890
  }]
  )
},

// Company 5 - Healthcare
{
  filename: "healthcare-group-2023.xlsx",
  dataset_name: "HealthCare Group 2023 Annual Financial Report",
  description: "Annual financial performance report for HealthCare Group including patient volume and revenue per procedure metrics",
  company_name: "HealthCare Group Inc.",
  report_period: "Annual 2023",
  fiscal_year: 2023,
  revenue: 245800000,
  net_income: 24580000,
  assets: 456000000,
  equity: 298000000,
  debt: 158000000,
  ebitda: 49160000,
  margin: 10.0,
  sales_grow_per_year: 9.2,
  data_quality_score: 85,
  upload_date: new Date('2024-03-10').toISOString(),
  processed_date: new Date('2024-03-10').toISOString(),
  status: "processed",
  is_premium: false,
  uploaded_by: 1,
  file_size: 387292,
  processing_notes: "Good data quality with some missing patient demographic information",
  file_data: JSON.stringify([
  {
    "Year": 2023,
    "Company": "HealthCare Group Inc.",
    "Industry": "Healthcare",
    "Patient_Revenue": 220320000,
    "Insurance_Revenue": 25480000,
    "Total_Revenue": 245800000,
    "Operating_Costs": 196640000,
    "Administrative_Expenses": 24580000,
    "Net_Income": 24580000,
    "Total_Assets": 456000000,
    "Total_Liabilities": 158000000,
    "Shareholders_Equity": 298000000,
    "EBITDA": 49160000,
    "Patient_Days": 125000,
    "Revenue_per_Patient_Day": 1966,
    "Occupancy_Rate": 82.5,
    "Staff_to_Patient_Ratio": 3.2,
    "ROE": 8.25,
    "ROA": 5.39,
    "Debt_to_Equity": 0.53,
    "Employees": 2850
  }]
  )
}];


// Function to insert sample data
async function insertSampleData() {
  try {
    for (const record of sampleFinancialData) {
      const response = await window.ezsite.apis.tableCreate(41729, record);
      if (response.error) {
        console.error('Error inserting sample data:', response.error);
      } else {
        console.log('Successfully inserted:', record.dataset_name);
      }
    }
    console.log('All sample data inserted successfully');
  } catch (error) {
    console.error('Failed to insert sample data:', error);
  }
}

// Export for use in other files
export { sampleFinancialData, insertSampleData };