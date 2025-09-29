import { useState, useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  ColumnFiltersState,
  SortingState } from
'@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
"@/components/ui/table";
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';

interface FinancialDataTableProps {
  datasetId: string;
}

export function FinancialDataTable({ datasetId }: FinancialDataTableProps) {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<ColumnDef<any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [datasetInfo, setDatasetInfo] = useState<{name: string;description: string | null;}>({
    name: '',
    description: null
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch dataset info
        const { data: datasetData, error: datasetError } = await supabase.
        from('financial_datasets').
        select('name, description').
        eq('id', datasetId).
        single();

        if (datasetError) throw datasetError;
        setDatasetInfo(datasetData);

        // Fetch financial data
        const { data: financialData, error: dataError } = await supabase.
        from('financial_data').
        select('data').
        eq('dataset_id', datasetId).
        single();

        if (dataError) throw dataError;

        if (financialData && Array.isArray(financialData.data)) {
          setData(financialData.data);

          // Generate columns from the first row
          if (financialData.data.length > 0) {
            const firstRow = financialData.data[0];
            const generatedColumns: ColumnDef<any>[] = Object.keys(firstRow).map((key) => ({
              accessorKey: key,
              header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full flex justify-between items-center">

                    {key}
                    {column.getIsSorted() === "asc" ?
                    <ChevronUp className="ml-2 h-4 w-4" /> :
                    column.getIsSorted() === "desc" ?
                    <ChevronDown className="ml-2 h-4 w-4" /> :

                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                    }
                  </Button>);

              },
              cell: ({ row }) => <div>{row.getValue(key)}</div>
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
  }, [datasetId]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters
    }
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            Loading financial data...
          </div>
        </CardContent>
      </Card>);

  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{datasetInfo.name}</CardTitle>
        {datasetInfo.description &&
        <CardDescription>{datasetInfo.description}</CardDescription>
        }
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {table.getAllColumns().
            filter((column) => column.getCanFilter()).
            map((column) =>
            <div key={column.id} className="space-y-2">
                  <label htmlFor={`filter-${column.id}`} className="text-sm font-medium">
                    Filter by {column.id}
                  </label>
                  <Input
                id={`filter-${column.id}`}
                placeholder={`Filter ${column.id}...`}
                value={column.getFilterValue() as string ?? ''}
                onChange={(e) => column.setFilterValue(e.target.value)}
                className="max-w-sm" />

                </div>
            )}
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) =>
                <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) =>
                  <TableHead key={header.id}>
                        {header.isPlaceholder ?
                    null :
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
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
                  data-state={row.getIsSelected() && "selected"}>

                      {row.getVisibleCells().map((cell) =>
                  <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                  )}
                    </TableRow>
                ) :

                <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
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
            <div className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>);

}