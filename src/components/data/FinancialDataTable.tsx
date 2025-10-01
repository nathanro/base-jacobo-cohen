import { useState, useEffect, useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  FilterFn } from
'@tanstack/react-table';
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Filter,
  X,
  Settings2,
  RotateCcw,
  Upload,
  AlertCircle } from
'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'@/components/ui/table';
import { showError, showSuccess } from '@/utils/toast';
import { useTranslation } from 'react-i18next';
import { SampleDataLoader } from './SampleDataLoader';
import {
  valueToPercentage,
  percentageToValue,
  formatAsPercentage,
  shouldConvertToPercentage,
  getPercentageStep,
  convertPercentageRangeToValues,
  convertValueRangeToPercentages,
  DATA_RANGE } from
'@/utils/percentage-conversion';

interface ColumnFilter {
  id: string;
  type: 'text' | 'range' | 'select';
  value: any;
  options?: string[];
  min?: number;
  max?: number;
  isPriority?: boolean;
}

// Custom filter functions
const rangeFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const rawValue = parseFloat(row.getValue(columnId));
  if (isNaN(rawValue)) return true;

  const [filterMin, filterMax] = filterValue || [null, null];
  if (filterMin === null && filterMax === null) return true;

  // Check if this column uses percentage conversion
  const shouldConvert = shouldConvertToPercentage(columnId, rawValue);

  if (shouldConvert) {
    // Convert percentage filter values back to raw values for comparison
    const [rawMin, rawMax] = convertPercentageRangeToValues([
    filterMin ?? 0,
    filterMax ?? 100]
    );

    if (filterMin !== null && rawValue < rawMin) return false;
    if (filterMax !== null && rawValue > rawMax) return false;
  } else {
    // Use direct value comparison for non-percentage fields
    if (filterMin !== null && rawValue < filterMin) return false;
    if (filterMax !== null && rawValue > filterMax) return false;
  }

  return true;
};

const selectFilter: FilterFn<any> = (row, columnId, filterValue) => {
  if (!filterValue || filterValue.length === 0) return true;
  const value = String(row.getValue(columnId));
  return filterValue.includes(value);
};

const textFilter: FilterFn<any> = (row, columnId, filterValue) => {
  if (!filterValue) return true;
  const value = String(row.getValue(columnId)).toLowerCase();
  return value.includes(filterValue.toLowerCase());
};

function PriorityFilterSection({
  priorityColumns,
  columnFilterConfigs,
  table,
  t





}: {priorityColumns: Record<string, string>;columnFilterConfigs: Record<string, ColumnFilter>;table: any;t: any;}) {
  const renderPriorityFilter = (key: string, label: string) => {
    const columnName = priorityColumns[key];
    if (!columnName) return null;

    const column = table.getColumn(columnName);
    const config = columnFilterConfigs[columnName];
    if (!column || !config) return null;

    // All 3 filters should display as percentage
    const isPercentageFilter = true;

    return (
      <div key={key} className="space-y-2">
        <label className="text-sm font-semibold text-blue-700 flex items-center space-x-2">
          <span>{label}</span>
          <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
            Priority
          </Badge>
        </label>
        <div className="border-2 border-blue-200 rounded-md p-3 bg-blue-50">
          {config.type === 'range' && config.min !== undefined && config.max !== undefined &&
          <PercentageRangeFilterControl
            column={column}
            min={config.min}
            max={config.max}
            forcePercentageDisplay={isPercentageFilter}
            t={t} />

          }
          {config.type === 'select' && config.options &&
          <SelectFilterControl column={column} options={config.options} t={t} />
          }
          {config.type === 'text' &&
          <Input
            placeholder={`Search ${label}...`}
            value={column.getFilterValue() as string ?? ''}
            onChange={(e) => column.setFilterValue(e.target.value)}
            className="w-full" />

          }
        </div>
      </div>);

  };

  const hasPriorityColumns = Object.values(priorityColumns).some((col) => col);

  if (!hasPriorityColumns) return null;

  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 mb-4">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-blue-800">Key Financial Metrics Filters</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderPriorityFilter('sales_grow_per_quarter', 'Sales Growth Quarter')}
        {renderPriorityFilter('sales_grow_per_year', 'Sales Growth Per Year')}
        {renderPriorityFilter('margin', 'Margin')}
      </div>
    </div>);

}

function RangeFilterControl({
  column,
  min,
  max,
  t





}: {column: any;min: number;max: number;t: any;}) {
  // Check if this column should use percentage conversion
  const shouldUsePercentage = shouldConvertToPercentage(column.id, max);

  // Set up display range and values
  const displayMin = shouldUsePercentage ? 0 : min;
  const displayMax = shouldUsePercentage ? 100 : max;

  // Initialize filter value - convert to percentage if needed
  const initialFilterValue = column.getFilterValue() as [number, number] || (
  shouldUsePercentage ? [0, 100] : [min, max]);

  const [localValue, setLocalValue] = useState(initialFilterValue);

  const formatValue = (value: number) => {
    if (shouldUsePercentage) {
      return `${value.toFixed(2)}%`;
    }

    // Format large numbers with appropriate units
    if (Math.abs(value) >= 1e12) {
      return `${(value / 1e12).toFixed(1)}T`;
    } else if (Math.abs(value) >= 1e9) {
      return `${(value / 1e9).toFixed(1)}B`;
    } else if (Math.abs(value) >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`;
    }
    return value.toFixed(2);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Reset filter if values are at default range
      const isDefaultRange = shouldUsePercentage ?
      localValue[0] === 0 && localValue[1] === 100 :
      localValue[0] === min && localValue[1] === max;

      column.setFilterValue(isDefaultRange ? undefined : localValue);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [localValue, column, min, max, shouldUsePercentage]);

  const step = shouldUsePercentage ? getPercentageStep(2) : (max - min) / 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 text-sm">
        <span>From: {formatValue(localValue[0])}</span>
        <span>-</span>
        <span>To: {formatValue(localValue[1])}</span>
      </div>
      {shouldUsePercentage &&
      <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
          💡 Values converted to percentage scale (0-100%) for easier filtering
        </div>
      }
      <Slider
        value={localValue}
        onValueChange={setLocalValue}
        min={displayMin}
        max={displayMax}
        step={step}
        className="w-full" />

      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatValue(displayMin)}</span>
        <span>{formatValue(displayMax)}</span>
      </div>
      {shouldUsePercentage &&
      <div className="text-xs text-gray-600">
          Raw range: {formatValue(min)} to {formatValue(max)}
        </div>
      }
    </div>);

}

function PercentageRangeFilterControl({
  column,
  min,
  max,
  forcePercentageDisplay,
  t




}: {column: any;min: number;max: number;forcePercentageDisplay?: boolean;t: any;}) {
  // Check if this column should use percentage conversion or force percentage display
  const shouldUsePercentage = shouldConvertToPercentage(column.id, max);
  const displayAsPercentage = forcePercentageDisplay || shouldUsePercentage;

  // Set up display range and values
  const displayMin = displayAsPercentage ? 0 : min;
  const displayMax = displayAsPercentage ? 100 : max;

  // Initialize filter value - convert to percentage if needed
  const initialFilterValue = column.getFilterValue() as [number, number] || (
  displayAsPercentage ? [0, 100] : [min, max]);

  const [localValue, setLocalValue] = useState(initialFilterValue);

  const formatValue = (value: number) => {
    if (displayAsPercentage) {
      return `${value.toFixed(2)}%`;
    }

    // Format large numbers with appropriate units
    if (Math.abs(value) >= 1e12) {
      return `${(value / 1e12).toFixed(1)}T`;
    } else if (Math.abs(value) >= 1e9) {
      return `${(value / 1e9).toFixed(1)}B`;
    } else if (Math.abs(value) >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`;
    }
    return value.toFixed(2);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Reset filter if values are at default range
      const isDefaultRange = displayAsPercentage ?
      localValue[0] === 0 && localValue[1] === 100 :
      localValue[0] === min && localValue[1] === max;

      column.setFilterValue(isDefaultRange ? undefined : localValue);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [localValue, column, min, max, displayAsPercentage]);

  const step = displayAsPercentage ? getPercentageStep(2) : (max - min) / 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 text-sm">
        <span>From: {formatValue(localValue[0])}</span>
        <span>-</span>
        <span>To: {formatValue(localValue[1])}</span>
      </div>
      {displayAsPercentage &&
      <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
          💡 Values displayed as percentage scale (0-100%) for easier filtering
        </div>
      }
      <Slider
        value={localValue}
        onValueChange={setLocalValue}
        min={displayMin}
        max={displayMax}
        step={step}
        className="w-full" />

      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatValue(displayMin)}</span>
        <span>{formatValue(displayMax)}</span>
      </div>
      {displayAsPercentage && !shouldUsePercentage &&
      <div className="text-xs text-gray-600">
          Raw range: {formatValue(min)} to {formatValue(max)}
        </div>
      }
    </div>);

}

function SelectFilterControl({
  column,
  options,
  t




}: {column: any;options: string[];t: any;}) {
  const filterValue = column.getFilterValue() as string[] || [];

  const handleValueChange = (value: string) => {
    if (value === 'all') {
      column.setFilterValue(undefined);
    } else if (value === 'none') {
      column.setFilterValue([]);
    } else {
      const newValue = filterValue.includes(value) ?
      filterValue.filter((v) => v !== value) :
      [...filterValue, value];
      column.setFilterValue(newValue.length === 0 ? undefined : newValue);
    }
  };

  return (
    <div className="space-y-2">
      <Select onValueChange={handleValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Filter by ${column.id}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Select All</SelectItem>
          <SelectItem value="none">Select None</SelectItem>
          <Separator className="my-1" />
          {options.map((option) =>
          <SelectItem key={option} value={option}>
              <div className="flex items-center space-x-2">
                <span>{option}</span>
                {filterValue.includes(option) &&
              <Badge variant="secondary" className="text-xs">
                    ✓
                  </Badge>
              }
              </div>
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      {filterValue.length > 0 &&
      <div className="flex flex-wrap gap-1">
          {filterValue.map((value) =>
        <Badge key={value} variant="secondary" className="text-xs">
              {value}
              <button
            onClick={() => handleValueChange(value)}
            className="ml-1 hover:bg-gray-200 rounded-full">

                <X className="h-3 w-3" />
              </button>
            </Badge>
        )}
        </div>
      }
    </div>);

}

export function FinancialDataTable() {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<ColumnDef<any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [columnFilterConfigs, setColumnFilterConfigs] = useState<Record<string, ColumnFilter>>({});
  const [showSampleLoader, setShowSampleLoader] = useState(false);
  const [error, setError] = useState<string>('');

  const { t } = useTranslation();

  // Define exact column order as per database
  const EXACT_COLUMN_ORDER = [
    'Symbol', '4_total_revenue_qq', '3_total_revenue_qq', '2_total_revenue_qq', '1_total_revenue_qq', '0_total_revenue_qq',
    '4_total_revenue', '3_total_revenue', '2_total_revenue', '1_total_revenue', '0_total_revenue',
    '4_cost_of_revenue', '3_cost_of_revenue', '2_cost_of_revenue', '1_cost_of_revenue', '0_cost_of_revenue',
    '4_basic_earnings_per_share', '3_basic_earnings_per_share', '2_basic_earnings_per_share', '1_basic_earnings_per_share', '0_basic_earnings_per_share',
    '4_total_assets', '3_total_assets', '2_total_assets', '1_total_assets', '0_total_assets',
    '4_total_liabilities_net_minority_interest', '3_total_liabilities_net_minority_interest', '2_total_liabilities_net_minority_interest', '1_total_liabilities_net_minority_interest', '0_total_liabilities_net_minority_interest',
    '4_retained_earnings', '3_retained_earnings', '2_retained_earnings', '1_retained_earnings', '0_retained_earnings',
    '0_shares_outstanding', '0_price', '0_market_cap', '0_dividend_yield', 'groww', 'margin', 'asset / liabilities ratio',
    '0_name', '0_stock_exchange', '0_sector', '0_industry_category', '0_business_phone_no', '0_hq_address1', '0_hq_address_city'
  ];

  // Find columns that match our 3 priority filters only
  const findMatchingColumns = useMemo(() => {
    if (data.length === 0) return {};

    const firstRow = data[0];
    const columnNames = Object.keys(firstRow);
    const matches: Record<string, string> = {};

    // Only 3 filters: Sales Growth Quarter, Sales Growth Per Year, and Margin
    const patterns = {
      sales_grow_per_quarter: /sales.*grow.*quarter|grow.*sales.*quarter|quarter.*sales.*grow|quarter.*growth|sales.*quarter|4_total_revenue_qq/i,
      sales_grow_per_year: /sales.*grow.*year|grow.*sales.*year|sales.*year.*grow|year.*sales.*grow|growth.*rate|growth_rate|sales_growth|groww/i,
      margin: /margin|profit.*margin|gross.*margin|net.*margin|profit_margin/i
    };

    Object.keys(patterns).forEach((priorityKey) => {
      const pattern = patterns[priorityKey as keyof typeof patterns];
      const matchingColumn = columnNames.find((col) =>
      pattern.test(col) || col.toLowerCase().includes(priorityKey.replace(/_/g, ''))
      );
      if (matchingColumn) {
        matches[priorityKey] = matchingColumn;
      }
    });

    return matches;
  }, [data]);

  // Analyze data to determine filter configurations
  const analyzeColumnData = useMemo(() => {
    if (data.length === 0) return {};

    const configs: Record<string, ColumnFilter> = {};
    const firstRow = data[0];

    Object.keys(firstRow).forEach((key) => {
      const values = data.map((row) => row[key]).filter((v) => v !== null && v !== undefined);
      const numericValues = values.map((v) => parseFloat(v)).filter((v) => !isNaN(v));
      const uniqueValues = [...new Set(values.map((v) => String(v)))];

      // Detect financial metrics that need special handling
      const keyLower = key.toLowerCase();
      const isFinancialMetric =
      keyLower.includes('sales') ||
      keyLower.includes('growth') ||
      keyLower.includes('grow') ||
      keyLower.includes('margin') ||
      keyLower.includes('debt') ||
      keyLower.includes('revenue') ||
      keyLower.includes('profit') ||
      keyLower.includes('assets') ||
      keyLower.includes('ratio') ||
      keyLower.includes('year') ||
      keyLower.includes('per');

      // Check if this is a priority column
      const isPriorityColumn = Object.values(findMatchingColumns).includes(key);

      if (numericValues.length > values.length * 0.8 || isFinancialMetric) {
        // Numeric/Range filter
        const min = Math.min(...numericValues);
        const max = Math.max(...numericValues);
        if (min !== max) {
          // Check if any values in this column should use percentage conversion
          const usePercentageConversion = numericValues.some((val) =>
          shouldConvertToPercentage(key, val)
          );

          // Set up the filter configuration with appropriate range
          const filterConfig = {
            id: key,
            type: 'range' as const,
            min,
            max,
            isPriority: isPriorityColumn
          };

          // If using percentage conversion, set initial value to 0-100%
          if (usePercentageConversion) {
            filterConfig.value = [0, 100];
          } else {
            filterConfig.value = [min, max];
          }

          configs[key] = filterConfig;
        }
      } else if (uniqueValues.length <= Math.min(20, values.length / 2)) {
        // Select filter for categorical data
        configs[key] = {
          id: key,
          type: 'select',
          value: [],
          options: uniqueValues.sort(),
          isPriority: isPriorityColumn
        };
      } else {
        // Text filter
        configs[key] = {
          id: key,
          type: 'text',
          value: '',
          isPriority: isPriorityColumn
        };
      }
    });

    return configs;
  }, [data, findMatchingColumns]);

  useEffect(() => {
    setColumnFilterConfigs(analyzeColumnData);
  }, [analyzeColumnData]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch data from excel_uploads table using EasySite API
        const response = await window.ezsite.apis.tablePage(41729, {
          PageNo: 1,
          PageSize: 1000,
          OrderByField: 'id',
          IsAsc: false
        });

        if (response.error) {
          throw new Error(response.error);
        }

        const uploads = response.data?.List || [];

        if (uploads.length === 0) {
          setShowSampleLoader(true);
          return;
        }

        // Parse and combine data from all uploads
        let allFinancialData: any[] = [];

        for (const upload of uploads) {
          try {
            const fileData = JSON.parse(upload.file_data || '[]');
            if (Array.isArray(fileData) && fileData.length > 0) {
              // Add metadata to each row
              const dataWithMetadata = fileData.map((row: any, index: number) => ({
                ...row,
                _source_file: upload.filename,
                _dataset_name: upload.dataset_name || upload.filename,
                _upload_id: upload.id,
                _row_number: index + 1,
                _company_name: upload.company_name,
                _report_period: upload.report_period,
                _fiscal_year: upload.fiscal_year
              }));
              allFinancialData = [...allFinancialData, ...dataWithMetadata];
            }
          } catch (parseError) {
            console.warn(`Failed to parse data from ${upload.filename}:`, parseError);
          }
        }

        if (allFinancialData.length === 0) {
          setShowSampleLoader(true);
          return;
        }

        // Sort data by fiscal_year (desc), report_period, then original row number
        // This ensures consistent ordering while maintaining data integrity
        allFinancialData.sort((a, b) => {
          // First sort by fiscal year (descending - newest first)
          const yearA = a._fiscal_year || 0;
          const yearB = b._fiscal_year || 0;
          if (yearB !== yearA) return yearB - yearA;

          // Then by report period (Q1, Q2, Q3, Q4, or full year)
          const periodA = a._report_period || '';
          const periodB = b._report_period || '';
          if (periodA !== periodB) return periodA.localeCompare(periodB);

          // Finally by row number to maintain original order within same period
          const rowA = a._row_number || 0;
          const rowB = b._row_number || 0;
          return rowA - rowB;
        });

        setData(allFinancialData);

        // Generate columns from all unique keys across all rows to ensure no columns are missing
        const allKeys = new Set<string>();
        allFinancialData.forEach((row) => {
          Object.keys(row).forEach((key) => {
            if (!key.startsWith('_')) {// Hide metadata columns from main view
              allKeys.add(key);
            }
          });
        });

        // Use exact column order as specified, only include columns that exist in data
        const sortedKeys = EXACT_COLUMN_ORDER.filter(col => allKeys.has(col));
        // Add any columns not in the predefined order at the end
        allKeys.forEach(key => {
          if (!EXACT_COLUMN_ORDER.includes(key)) {
            sortedKeys.push(key);
          }
        });
        const generatedColumns: ColumnDef<any>[] = sortedKeys.map((key) => {
          const lowerColumnName = key.toLowerCase();
          
          // Define colors for specific financial metrics
          let headerClassName = 'font-semibold';
          let cellClassName = '';

          // Check for Revenue columns - should be green (not cost of revenue)
          if (lowerColumnName.includes('revenue') && !lowerColumnName.includes('cost')) {
            headerClassName += ' text-green-700 bg-green-50 border-green-200';
            cellClassName = 'text-green-600';
          }
          // Check for Cost of Revenue columns - should be red
          else if (lowerColumnName.includes('cost_of_revenue') || 
                   (lowerColumnName.includes('cost') && lowerColumnName.includes('revenue'))) {
            headerClassName += ' text-red-700 bg-red-50 border-red-200';
            cellClassName = 'text-red-600';
          }
          // Earnings per share
          else if (lowerColumnName.includes('earnings') || lowerColumnName.includes('eps')) {
            headerClassName += ' text-purple-700 bg-purple-50 border-purple-200';
            cellClassName = 'text-purple-600';
          }
          // Asset columns
          else if (lowerColumnName.includes('asset')) {
            headerClassName += ' text-blue-700 bg-blue-50 border-blue-200';
            cellClassName = 'text-blue-600';
          }
          // Liability columns
          else if (lowerColumnName.includes('liabilit') || lowerColumnName.includes('debt')) {
            headerClassName += ' text-orange-700 bg-orange-50 border-orange-200';
            cellClassName = 'text-orange-600';
          }
          // Retained earnings
          else if (lowerColumnName.includes('retained')) {
            headerClassName += ' text-indigo-700 bg-indigo-50 border-indigo-200';
            cellClassName = 'text-indigo-600';
          }

          return {
            accessorKey: key,
            header: ({ column }) => {
              return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                  className={`w-full flex justify-between items-center hover:bg-gray-50 ${headerClassName}`}>
                  <span>
                    {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                  {column.getIsSorted() === 'asc' ?
                  <ChevronUp className="ml-2 h-4 w-4" /> :
                  column.getIsSorted() === 'desc' ?
                  <ChevronDown className="ml-2 h-4 w-4" /> :
                  <ChevronsUpDown className="ml-2 h-4 w-4" />
                  }
                </Button>
              );
            },
            cell: ({ row }) => {
              const value = row.getValue(key);
              // Format numeric values for better display
              if (typeof value === 'number') {
                // Format large numbers with appropriate units
                let formattedValue = value.toLocaleString();
                if (Math.abs(value) >= 1e12) {
                  formattedValue = `${(value / 1e12).toFixed(2)}T`;
                } else if (Math.abs(value) >= 1e9) {
                  formattedValue = `${(value / 1e9).toFixed(2)}B`;
                } else if (Math.abs(value) >= 1e6) {
                  formattedValue = `${(value / 1e6).toFixed(2)}M`;
                } else if (Math.abs(value) >= 1e3) {
                  formattedValue = `${(value / 1e3).toFixed(2)}K`;
                } else {
                  formattedValue = value.toFixed(2);
                }

                return <div className={`text-right font-mono ${cellClassName}`} title={`Exact value: ${value.toLocaleString()}`}>{formattedValue}</div>;
              }
              return <div className={cellClassName}>{value}</div>;
            },
            filterFn:
            analyzeColumnData[key]?.type === 'range' ?
            rangeFilter :
            analyzeColumnData[key]?.type === 'select' ?
            selectFilter :
            textFilter
          };
        });

        setColumns(generatedColumns);
        showSuccess(`Loaded ${allFinancialData.length} financial records from ${uploads.length} datasets.`);
      } catch (error: any) {
        console.error('Failed to load financial data:', error);
        setError(error.message || 'Failed to load financial data');
        showError(error.message || 'Failed to load financial data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDataLoaded = () => {
    setShowSampleLoader(false);
    setError('');
    // Refresh the data after sample data is loaded
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await window.ezsite.apis.tablePage(41729, {
          PageNo: 1,
          PageSize: 1000,
          OrderByField: 'id',
          IsAsc: false
        });

        if (response.error) {
          throw new Error(response.error);
        }

        const uploads = response.data?.List || [];
        let allFinancialData: any[] = [];

        for (const upload of uploads) {
          try {
            const fileData = JSON.parse(upload.file_data || '[]');
            if (Array.isArray(fileData) && fileData.length > 0) {
              const dataWithMetadata = fileData.map((row: any, index: number) => ({
                ...row,
                _source_file: upload.filename,
                _dataset_name: upload.dataset_name || upload.filename,
                _upload_id: upload.id,
                _row_number: index + 1,
                _company_name: upload.company_name,
                _report_period: upload.report_period,
                _fiscal_year: upload.fiscal_year
              }));
              allFinancialData = [...allFinancialData, ...dataWithMetadata];
            }
          } catch (parseError) {
            console.warn(`Failed to parse data from ${upload.filename}:`, parseError);
          }
        }

        // Sort data by fiscal_year (desc), report_period, then original row number
        // This ensures consistent ordering while maintaining data integrity
        allFinancialData.sort((a, b) => {
          // First sort by fiscal year (descending - newest first)
          const yearA = a._fiscal_year || 0;
          const yearB = b._fiscal_year || 0;
          if (yearB !== yearA) return yearB - yearA;

          // Then by report period (Q1, Q2, Q3, Q4, or full year)
          const periodA = a._report_period || '';
          const periodB = b._report_period || '';
          if (periodA !== periodB) return periodA.localeCompare(periodB);

          // Finally by row number to maintain original order within same period
          const rowA = a._row_number || 0;
          const rowB = b._row_number || 0;
          return rowA - rowB;
        });

        setData(allFinancialData);

        if (allFinancialData.length > 0) {
          // Generate columns from all unique keys across all rows to ensure no columns are missing
          const allKeys = new Set<string>();
          allFinancialData.forEach((row) => {
            Object.keys(row).forEach((key) => {
              if (!key.startsWith('_')) {// Hide metadata columns from main view
                allKeys.add(key);
              }
            });
          });

          // Use exact column order as specified, only include columns that exist in data
          const sortedKeys = EXACT_COLUMN_ORDER.filter(col => allKeys.has(col));
          // Add any columns not in the predefined order at the end
          allKeys.forEach(key => {
            if (!EXACT_COLUMN_ORDER.includes(key)) {
              sortedKeys.push(key);
            }
          });
          const generatedColumns: ColumnDef<any>[] = sortedKeys.map((key) => {
            const lowerColumnName = key.toLowerCase();
            
            // Define colors for specific financial metrics
            let headerClassName = 'font-semibold';
            let cellClassName = '';

            // Check for Revenue columns - should be green (not cost of revenue)
            if (lowerColumnName.includes('revenue') && !lowerColumnName.includes('cost')) {
              headerClassName += ' text-green-700 bg-green-50 border-green-200';
              cellClassName = 'text-green-600';
            }
            // Check for Cost of Revenue columns - should be red
            else if (lowerColumnName.includes('cost_of_revenue') || 
                     (lowerColumnName.includes('cost') && lowerColumnName.includes('revenue'))) {
              headerClassName += ' text-red-700 bg-red-50 border-red-200';
              cellClassName = 'text-red-600';
            }
            // Earnings per share
            else if (lowerColumnName.includes('earnings') || lowerColumnName.includes('eps')) {
              headerClassName += ' text-purple-700 bg-purple-50 border-purple-200';
              cellClassName = 'text-purple-600';
            }
            // Asset columns
            else if (lowerColumnName.includes('asset')) {
              headerClassName += ' text-blue-700 bg-blue-50 border-blue-200';
              cellClassName = 'text-blue-600';
            }
            // Liability columns
            else if (lowerColumnName.includes('liabilit') || lowerColumnName.includes('debt')) {
              headerClassName += ' text-orange-700 bg-orange-50 border-orange-200';
              cellClassName = 'text-orange-600';
            }
            // Retained earnings
            else if (lowerColumnName.includes('retained')) {
              headerClassName += ' text-indigo-700 bg-indigo-50 border-indigo-200';
              cellClassName = 'text-indigo-600';
            }

            return {
              accessorKey: key,
              header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className={`w-full flex justify-between items-center hover:bg-gray-50 ${headerClassName}`}>
                    <span>
                      {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    {column.getIsSorted() === 'asc' ?
                    <ChevronUp className="ml-2 h-4 w-4" /> :
                    column.getIsSorted() === 'desc' ?
                    <ChevronDown className="ml-2 h-4 w-4" /> :
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                    }
                  </Button>
                );
              },
              cell: ({ row }) => {
                const value = row.getValue(key);
                // Format numeric values for better display
                if (typeof value === 'number') {
                  // Format large numbers with appropriate units
                  let formattedValue = value.toLocaleString();
                  if (Math.abs(value) >= 1e12) {
                    formattedValue = `${(value / 1e12).toFixed(2)}T`;
                  } else if (Math.abs(value) >= 1e9) {
                    formattedValue = `${(value / 1e9).toFixed(2)}B`;
                  } else if (Math.abs(value) >= 1e6) {
                    formattedValue = `${(value / 1e6).toFixed(2)}M`;
                  } else if (Math.abs(value) >= 1e3) {
                    formattedValue = `${(value / 1e3).toFixed(2)}K`;
                  } else {
                    formattedValue = value.toFixed(2);
                  }

                  return <div className={`text-right font-mono ${cellClassName}`} title={`Exact value: ${value.toLocaleString()}`}>{formattedValue}</div>;
                }
                return <div className={cellClassName}>{value}</div>;
              },
              filterFn:
              analyzeColumnData[key]?.type === 'range' ?
              rangeFilter :
              analyzeColumnData[key]?.type === 'select' ?
              selectFilter :
              textFilter
            };
          });

          setColumns(generatedColumns);
          showSuccess(`Loaded ${allFinancialData.length} financial records from ${uploads.length} datasets.`);
        }
      } catch (error: any) {
        console.error('Failed to load financial data:', error);
        setError(error.message || 'Failed to load financial data');
        showError(error.message || 'Failed to load financial data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    filterFns: {
      range: rangeFilter,
      select: selectFilter,
      text: textFilter
    },
    state: {
      sorting,
      columnFilters
    },
    initialState: {
      pagination: {
        pageSize: 25
      }
    }
  });

  const resetAllFilters = () => {
    setColumnFilters([]);
    table.getAllColumns().forEach((column) => {
      column.setFilterValue(undefined);
    });
  };

  const activeFilterCount = columnFilters.length;

  if (loading) {
    return (
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Loading Financial Data...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>);

  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Financial Data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Financial Data Dashboard</CardTitle>
            <CardDescription>
              There was an error loading the financial data. Please try loading sample data to test the functionality.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SampleDataLoader onDataLoaded={handleDataLoaded} />
          </CardContent>
        </Card>
      </div>);

  }

  if (showSampleLoader || data.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Financial Data Dashboard</CardTitle>
            <CardDescription>
              Upload Excel files with financial data to get started, or load sample data to explore the functionality.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-4">
              <p className="text-muted-foreground mb-6">
                No financial datasets have been uploaded yet. You can load sample data to explore the dashboard capabilities.
              </p>
              <SampleDataLoader onDataLoaded={handleDataLoaded} />
            </div>
          </CardContent>
        </Card>
      </div>);

  }

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Financial Data Dashboard</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2">

              <Filter className="h-4 w-4" />
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              {activeFilterCount > 0 &&
              <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              }
            </Button>
            {activeFilterCount > 0 &&
            <Button
              variant="outline"
              size="sm"
              onClick={resetAllFilters}
              className="flex items-center space-x-2">

                <RotateCcw className="h-4 w-4" />
                <span>Reset All</span>
              </Button>
            }
          </div>
        </CardTitle>
        <CardDescription>
          Financial data from uploaded Excel files with advanced filtering and analysis tools. 
          {Object.values(findMatchingColumns).length > 0 &&
          <span className="text-blue-600 font-medium">
              {" "}Key metrics detected: {Object.keys(findMatchingColumns).filter((k) => findMatchingColumns[k]).map((k) => k.replace(/_/g, ' ')).join(', ')}
            </span>
          }
          <div className="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r">
            <div className="flex items-start">
              <div className="text-blue-700 text-sm">
                <strong>📊 Percentage Scale:</strong> Large financial values (range: {DATA_RANGE.MIN_VALUE.toLocaleString()} to {DATA_RANGE.MAX_VALUE.toLocaleString()}) 
                are automatically converted to a 0-100% scale for easier comparison and filtering. 
                Hover over percentage values to see raw amounts.
              </div>
            </div>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <Collapsible open={showFilters} onOpenChange={setShowFilters}>
            <CollapsibleContent className="space-y-4">
              <PriorityFilterSection
                priorityColumns={findMatchingColumns}
                columnFilterConfigs={columnFilterConfigs}
                table={table}
                t={t} />


            </CollapsibleContent>
          </Collapsible>

          <div className="rounded-md border w-full overflow-auto bg-white">
            <Table className="w-full bg-white">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) =>
                <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) =>
                  <TableHead key={header.id} className="bg-gray-50">
                        {header.isPlaceholder ?
                    null :
                    flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                  )}
                  </TableRow>
                )}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ?
                table.getRowModel().rows.map((row) =>
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-gray-50">

                      {row.getVisibleCells().map((cell) =>
                  <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                  )}
                    </TableRow>
                ) :

                <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No data available.
                    </TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}>

                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}>

                Next
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}>

                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 25, 50, 100].map((pageSize) =>
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} 
              ({table.getFilteredRowModel().rows.length} {data.length > table.getFilteredRowModel().rows.length ? 'filtered' : 'total'} rows)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>);

}