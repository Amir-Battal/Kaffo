"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const data: Problem[] = [
  {
    id: "m5gr84i9",
    title: 'رصيف مكسور',
    concernedGov: "بلدية حلب",
    category: ['رصيف مكسور', 'بلدية حلب'],
    governorate: "حلب",
    location: "العزيزية",
    status: "جاري المعالجة",
  },
  {
    id: "3u1reuv4",
    title: 'رصيف مكسور',
    concernedGov: "بلدية حلب",
    category: ['رصيف مكسور', 'بلدية حلب'],
    governorate: "حلب",
    location: "العزيزية",
    status: "جاري المعالجة",
  },
  {
    id: "derv1ws0",
    title: 'رصيف مكسور',
    concernedGov: "بلدية حلب",
    category: ['رصيف مكسور', 'بلدية حلب'],
    governorate: "حلب",
    location: "العزيزية",
    status: "جاري المعالجة",
  },
  {
    id: "5kma53ae",
    title: 'رصيف مكسور',
    concernedGov: "بلدية حلب",
    category: ['رصيف مكسور', 'بلدية حلب', 'اي شي', 'اي شي ٢'],
    governorate: "حلب",
    location: "العزيزية",
    status: "جاري المعالجة",
  },
  {
    id: "bhqecj4p",
    title: 'رصيف مكسور',
    concernedGov: "بلدية حلب",
    category: ['رصيف مكسور', 'بلدية حلب'],
    governorate: "حلب",
    location: "العزيزية",
    status: "جاري المعالجة",
  }
]

export type Problem = {
  id: string
  title: string
  concernedGov: string
  category: string[]
  governorate: string
  location: string
  status: "جاري التحقق" | "جاري المعالجة" | "جديدة" | "تم الرفض" | "تم حل المشكلة"
}

export const columns: ColumnDef<Problem>[] = [
  {
    accessorKey: "title",
    header: "العنوان",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "concernedGov",
    header: "الجهة المعنية",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("concernedGov")}</div>
    ),
  },
  {
    accessorKey: "category",
    header: "الصنف",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("category")}</div>
    ),
  },
  {
    accessorKey: "governorate",
    header: "المحافظة",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("governorate")}</div>
    ),
  },
  {
    accessorKey: "location",
    header: "المنطقة",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("location")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "details",
    header: "التفاصيل",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("details")}</div>
    ),
  }
]

export function ProblemsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-[90%]">

        {/* // Search & Filter */}
        {/* <div className="flex items-center py-4">
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value: any) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}

        {/* // Table */}
        <div className="rounded-md border">
          <Table className="w-full">
            <TableHeader >
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="text-center">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center">
                        {cell.column.columnDef.header === 'الصنف'
                          ?(
                            <div>
                              {row.original.category.length > 2
                                ?(
                                  <div className="flex flex-row gap-2 justify-center">
                                    {row.original.category.slice(0, 2).map((item) => (
                                      <Badge className="w-[30%] h-[30px]">{item}</Badge>
                                    ))}
                                    <Badge className="w-[30px] h-[30px]"><Plus /></Badge>
                                  </div>
                                ):(
                                  <div className="flex flex-row gap-2 justify-center">
                                    {row.original.category.map((item) => (
                                      <Badge className="w-[30%] h-[30px]">{item}</Badge>
                                    ))}
                                  </div>
                                ) 
                              }
                            </div>
                          ):(
                            <div>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          )
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    لا يوجد نتائج
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* // Pagination Footer */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground" dir="rtl">
            {table.getFilteredSelectedRowModel().rows.length} من{" "}
            {table.getFilteredRowModel().rows.length} سطر في الصفحة.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              السابق
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              التالي
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
