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
  FilterFn,
} from '@tanstack/react-table';
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronsUpDown, 
  Filter, 
  X, 
  Settings2,
  RotateCcw 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { useTranslation } from 'react-i18next';

interface FinancialDataTableProps {
  datasetId: string;
}

interface ColumnFilter {
  id: string;
  type: 'text' | 'range' | 'select';
  value: any;
  options?: string[];
  min?: number;
  max?: number;
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

function RangeFilterControl({ 
  column, 
  min, 
  max, 
  t 
}: { 
  column: any; 
  min: number; 
  max: number; 
  t: any; 
}) {
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
        <span>{t('datasetView.filterControls.rangeFrom')}: {localValue[0].toFixed(2)}</span>
        <span>-</span>
        <span>{t('datasetView.filterControls.rangeTo')}: {localValue[1].toFixed(2)}</span>
      </div>
      <Slider
        value={localValue}
        onValueChange={setLocalValue}
        min={min}
        max={max}
        step={(max - min) / 100}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min.toFixed(2)}</span>
        <span>{max.toFixed(2)}</span>
      </div>
    </div>
  );
}

function SelectFilterControl({ 
  column, 
  options, 
  t 
}: { 
  column: any; 
  options: string[]; 
  t: any; 
}) {
  const filterValue = column.getFilterValue() as string[] || [];

  const handleValueChange = (value: string) => {
    if (value === 'all') {
      column.setFilterValue(undefined);
    } else if (value === 'none') {
      column.setFilterValue([]);
    } else {
      const newValue = filterValue.includes(value)
        ? filterValue.filter(v => v !== value)
        : [...filterValue, value];
      column.setFilterValue(newValue.length === 0 ? undefined : newValue);
    }
  };

  return (
    <div className="space-y-2">
      <Select onValueChange={handleValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`${t('datasetView.filterControls.filterBy')} ${column.id}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('datasetView.filterControls.selectAll')}</SelectItem>
          <SelectItem value="none">{t('datasetView.filterControls.selectNone')}</SelectItem>
          <Separator className="my-1" />
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              <div className="flex items-center space-x-2">
                <span>{option}</span>
                {filterValue.includes(option) && (
                  <Badge variant="secondary" className="text-xs">✓</Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {filterValue.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {filterValue.map(value => (
            <Badge key={value} variant="secondary" className="text-xs">
              {value}
              <button
                onClick={() => handleValueChange(value)}
                className="ml-1 hover:bg-gray-200 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export function FinancialDataTable({ datasetId }: FinancialDataTableProps) {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<ColumnDef<any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [columnFilterConfigs, setColumnFilterConfigs] = useState<Record<string, ColumnFilter>>({});
  const [datasetInfo, setDatasetInfo] = useState<{name: string; description: string | null;}>({
    name: '',
    description: null
  });

  const { t } = useTranslation();

  // Analyze data to determine filter configurations
  const analyzeColumnData = useMemo(() => {
    if (data.length === 0) return {};
    
    const configs: Record<string, ColumnFilter> = {};
    const firstRow = data[0];
    
    Object.keys(firstRow).forEach(key => {
      const values = data.map(row => row[key]).filter(v => v !== null && v !== undefined);
      const numericValues = values.map(v => parseFloat(v)).filter(v => !isNaN(v));
      const uniqueValues = [...new Set(values.map(v => String(v)))];
      
      // Detect financial metrics that need special handling
      const keyLower = key.toLowerCase();
      const isFinancialMetric = keyLower.includes('sales') || keyLower.includes('growth') || 
                               keyLower.includes('margin') || keyLower.includes('debt') ||
                               keyLower.includes('revenue') || keyLower.includes('profit') ||
                               keyLower.includes('assets') || keyLower.includes('ratio');
      
      if (numericValues.length > values.length * 0.8 || isFinancialMetric) {
        // Numeric/Range filter
        const min = Math.min(...numericValues);
        const max = Math.max(...numericValues);
        configs[key] = {
          id: key,
          type: 'range',
          value: [min, max],
          min,
          max
        };
      } else if (uniqueValues.length <= Math.min(20, values.length / 2)) {
        // Select filter for categorical data
        configs[key] = {
          id: key,
          type: 'select',
          value: [],
          options: uniqueValues.sort()
        };
      } else {
        // Text filter
        configs[key] = {
          id: key,
          type: 'text',
          value: ''
        };
      }
    });
    
    return configs;
  }, [data]);

  useEffect(() => {
    setColumnFilterConfigs(analyzeColumnData);
  }, [analyzeColumnData]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch dataset info
        const { data: datasetData, error: datasetError } = await supabase
          .from('financial_datasets')
          .select('name, description')
          .eq('id', datasetId)
          .single();

        if (datasetError) throw datasetError;
        setDatasetInfo(datasetData);

        // Fetch financial data
        const { data: financialData, error: dataError } = await supabase
          .from('financial_data')
          .select('data')
          .eq('dataset_id', datasetId)
          .single();

        if (dataError) throw dataError;

        if (financialData && Array.isArray(financialData.data)) {
          setData(financialData.data);

          // Generate columns from the first row with enhanced headers
          if (financialData.data.length > 0) {
            const firstRow = financialData.data[0];
            const generatedColumns: ColumnDef<any>[] = Object.keys(firstRow).map((key) => ({
              accessorKey: key,
              header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full flex justify-between items-center hover:bg-gray-50"
                  >
                    <span className="font-semibold">
                      {t(`datasetView.columns.${key.toLowerCase()}`) || key}
                    </span>
                    {column.getIsSorted() === "asc" ? (
                      <ChevronUp className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                      <ChevronDown className="ml-2 h-4 w-4" />
                    ) : (
                      <ChevronsUpDown className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                );
              },
              cell: ({ row }) => {
                const value = row.getValue(key);
                // Format numeric values for better display
                if (typeof value === 'number') {
                  return <div className="text-right font-mono">{value.toLocaleString()}</div>;
                }
                return <div>{value}</div>;
              },
              filterFn: columnFilterConfigs[key]?.type === 'range' ? rangeFilter :
                        columnFilterConfigs[key]?.type === 'select' ? selectFilter : textFilter
            }));
            setColumns(generatedColumns);
          }
        }
      } catch (error: any) {
        showError(error.message || 'Failed to load financial data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [datasetId, t]);

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
      text: textFilter,
    },
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  const resetAllFilters = () => {
    setColumnFilters([]);
    table.getAllColumns().forEach(column => {
      column.setFilterValue(undefined);
    });
  };

  const activeFilterCount = columnFilters.length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('datasetView.loading')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{datasetInfo.name}</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>
                {showFilters ? t('datasetView.filterControls.hideFilters') : t('datasetView.filterControls.showFilters')}
              </span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            {activeFilterCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetAllFilters}
                className="flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>{t('datasetView.filterControls.resetAll')}</span>
              </Button>
            )}
          </div>
        </CardTitle>
        {datasetInfo.description && (
          <CardDescription>{datasetInfo.description}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <Collapsible open={showFilters} onOpenChange={setShowFilters}>
            <CollapsibleContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-2 mb-4">
                  <Settings2 className="h-4 w-4" />
                  <h3 className="font-medium">{t('datasetView.filters')}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {table.getAllColumns()
                    .filter((column) => column.getCanFilter())
                    .map((column) => {
                      const config = columnFilterConfigs[column.id];
                      if (!config) return null;

                      return (
                        <div key={column.id} className="space-y-2">
                          <label className="text-sm font-medium flex items-center space-x-2">
                            <span>{t(`datasetView.columns.${column.id.toLowerCase()}`) || column.id}</span>
                            <Badge variant="outline" className="text-xs">
                              {t(`datasetView.filterControls.${config.type}Filter`)}
                            </Badge>
                          </label>
                          
                          <div className="border rounded-md p-3 bg-white">
                            {config.type === 'text' && (
                              <Input
                                placeholder={`${t('datasetView.filterControls.searchPlaceholder')}${column.id}`}
                                value={(column.getFilterValue() as string) ?? ''}
                                onChange={(e) => column.setFilterValue(e.target.value)}
                                className="w-full"
                              />
                            )}
                            
                            {config.type === 'range' && config.min !== undefined && config.max !== undefined && (
                              <RangeFilterControl
                                column={column}
                                min={config.min}
                                max={config.max}
                                t={t}
                              />
                            )}
                            
                            {config.type === 'select' && config.options && (
                              <SelectFilterControl
                                column={column}
                                options={config.options}
                                t={t}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="bg-gray-50">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-gray-50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      {t('datasetView.noData')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {t('datasetView.previous')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {t('datasetView.next')}
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {t('datasetView.rowsPerPage')}:
              </span>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {t('datasetView.of').replace('%1', `${table.getState().pagination.pageIndex + 1}`).replace('%2', `${table.getPageCount()}`)} 
              {` (${table.getFilteredRowModel().rows.length} ${data.length > table.getFilteredRowModel().rows.length ? 'filtered' : 'total'} rows)`}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}