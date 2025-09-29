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
  const value = parseFloat(row.getValue(columnId));
  if (isNaN(value)) return true;

  const [min, max] = filterValue || [null, null];
  if (min !== null && value < min) return false;
  if (max !== null && value > max) return false;
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
          <RangeFilterControl
            column={column}
            min={config.min}
            max={config.max}
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
        {renderPriorityFilter('sales_grow_per_year', 'Sales Growth Per Year')}
        {renderPriorityFilter('margin', 'Margin')}
        {renderPriorityFilter('debt', 'Debt')}
      </div>
    </div>);

}

function RangeFilterControl({
  column,
  min,
  max,
  t





}: {column: any;min: number;max: number;t: any;}) {
  const filterValue = column.getFilterValue() as [number, number] || [min, max];
  const [localValue, setLocalValue] = useState(filterValue);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      column.setFilterValue(localValue[0] === min && localValue[1] === max ? undefined : localValue);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [localValue, column, min, max]);

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 text-sm">
        <span>From: {localValue[0].toFixed(2)}</span>
        <span>-</span>
        <span>To: {localValue[1].toFixed(2)}</span>
      </div>
      <Slider
        value={localValue}
        onValueChange={setLocalValue}
        min={min}
        max={max}
        step={(max - min) / 100}
        className="w-full" />

      <div className="flex justify-between text-xs text-gray-500">
        <span>{min.toFixed(2)}</span>
        <span>{max.toFixed(2)}</span>
      </div>
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

  // Find columns that match our priority filters
  const findMatchingColumns = useMemo(() => {
    if (data.length === 0) return {};

    const firstRow = data[0];
    const columnNames = Object.keys(firstRow);
    const matches: Record<string, string> = {};

    // Define patterns for each priority filter
    const patterns = {
      sales_grow_per_year: /sales.*grow.*year|grow.*sales.*year|sales.*year.*grow|year.*sales.*grow|growth.*rate|growth_rate|sales_growth/i,
      margin: /margin|profit.*margin|gross.*margin|net.*margin|profit_margin/i,
      debt: /debt|debt.*ratio|total.*debt|long.*debt|short.*debt/i
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
          configs[key] = {
            id: key,
            type: 'range',
            value: [min, max],
            min,
            max,
            isPriority: isPriorityColumn
          };
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

        setData(allFinancialData);

        // Generate columns from the first row
        const firstRow = allFinancialData[0];
        const generatedColumns: ColumnDef<any>[] = Object.keys(firstRow).
        filter((key) => !key.startsWith('_')) // Hide metadata columns from main view
        .map((key) => ({
          accessorKey: key,
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className="w-full flex justify-between items-center hover:bg-gray-50">

                  <span className="font-semibold">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                  {column.getIsSorted() === 'asc' ?
                <ChevronUp className="ml-2 h-4 w-4" /> :
                column.getIsSorted() === 'desc' ?
                <ChevronDown className="ml-2 h-4 w-4" /> :

                <ChevronsUpDown className="ml-2 h-4 w-4" />
                }
                </Button>);

          },
          cell: ({ row }) => {
            const value = row.getValue(key);
            // Format numeric values for better display
            if (typeof value === 'number') {
              return <div className="text-right font-mono">{value.toLocaleString()}</div>;
            }
            return <div>{value}</div>;
          },
          filterFn:
          analyzeColumnData[key]?.type === 'range' ?
          rangeFilter :
          analyzeColumnData[key]?.type === 'select' ?
          selectFilter :
          textFilter
        }));

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

        setData(allFinancialData);

        if (allFinancialData.length > 0) {
          const firstRow = allFinancialData[0];
          const generatedColumns: ColumnDef<any>[] = Object.keys(firstRow).
          filter((key) => !key.startsWith('_')).
          map((key) => ({
            accessorKey: key,
            header: ({ column }) => {
              return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                  className="w-full flex justify-between items-center hover:bg-gray-50">

                    <span className="font-semibold">
                      {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    {column.getIsSorted() === 'asc' ?
                  <ChevronUp className="ml-2 h-4 w-4" /> :
                  column.getIsSorted() === 'desc' ?
                  <ChevronDown className="ml-2 h-4 w-4" /> :

                  <ChevronsUpDown className="ml-2 h-4 w-4" />
                  }
                  </Button>);

            },
            cell: ({ row }) => {
              const value = row.getValue(key);
              if (typeof value === 'number') {
                return <div className="text-right font-mono">{value.toLocaleString()}</div>;
              }
              return <div>{value}</div>;
            },
            filterFn:
            analyzeColumnData[key]?.type === 'range' ?
            rangeFilter :
            analyzeColumnData[key]?.type === 'select' ?
            selectFilter :
            textFilter
          }));
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
      <Card>
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
        <Card>
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
        <Card>
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
    <Card className="w-full">
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

              
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-2 mb-4">
                  <Settings2 className="h-4 w-4" />
                  <h3 className="font-medium">All Column Filters</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {table.
                  getAllColumns().
                  filter((column) => column.getCanFilter()).
                  map((column) => {
                    const config = columnFilterConfigs[column.id];
                    if (!config) return null;

                    return (
                      <div key={column.id} className="space-y-2">
                          <label className="text-sm font-medium flex items-center space-x-2">
                            <span>
                              {column.id.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {config.type}
                            </Badge>
                            {config.isPriority &&
                          <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
                                Key Metric
                              </Badge>
                          }
                          </label>

                          <div className={`border rounded-md p-3 ${config.isPriority ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
                            {config.type === 'text' &&
                          <Input
                            placeholder={`Search ${column.id}...`}
                            value={column.getFilterValue() as string ?? ''}
                            onChange={(e) => column.setFilterValue(e.target.value)}
                            className="w-full" />

                          }

                            {config.type === 'range' &&
                          config.min !== undefined &&
                          config.max !== undefined &&
                          <RangeFilterControl
                            column={column}
                            min={config.min}
                            max={config.max}
                            t={t} />

                          }

                            {config.type === 'select' && config.options &&
                          <SelectFilterControl column={column} options={config.options} t={t} />
                          }
                          </div>
                        </div>);

                  })}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="rounded-md border">
            <Table>
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