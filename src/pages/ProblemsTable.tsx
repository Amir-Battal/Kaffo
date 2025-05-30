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
import { ChevronLeft, Filter, Plus, Repeat, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import NewProblemOverlay from "@/forms/problem-form/NewProblemOverlay"
import { Input } from "@/components/ui/input"
import ProblemStatusSelect from "@/components/ProblemStatusSelect"

const data: Problem[] = [
  {
    id: "derv1ws0",
    title: 'رصيف مكسور',
    user: "مديرية كهرباء حلب",
    concernedGov: "بلدية حلب",
    category: ['رصيف مكسور', 'بلدية حلب', 'اي شي', 'اي شي ٢'],
    governorate: "حلب",
    location: "العزيزية",
    status: "جديدة",
  },
  {
    id: "3u1reuv4",
    title: 'رصيف مكسور',
    user: "أمير بطال",
    concernedGov: "بلدية حلب",
    category: ['رصيف مكسور', 'بلدية حلب'],
    governorate: "حلب",
    location: "العزيزية",
    status: "جاري التحقق",
  },
  {
    id: "m5gr84i9",
    title: 'رصيف مكسور',
    user: "أمير بطال",
    concernedGov: "بلدية حلب",
    category: ['رصيف مكسور', 'بلدية حلب'],
    governorate: "حلب",
    location: "العزيزية",
    status: "جاري المعالجة",
  },
  {
    id: "m5gr84i8",
    title: 'رصيف مكسور',
    user: "أمير بطال",
    concernedGov: "بلدية حلب",
    category: ['رصيف مكسور', 'بلدية حلب'],
    governorate: "حلب",
    location: "العزيزية",
    status: "جاري المعالجة",
  },
  {
    id: "m5gr84i7",
    title: 'رصيف مكسور',
    user: "أمير بطال",
    concernedGov: "بلدية حلب",
    category: ['رصيف مكسور', 'بلدية حلب'],
    governorate: "حلب",
    location: "العزيزية",
    status: "جاري المعالجة",
  },
  {
    id: "m5gr84i6",
    title: 'رصيف مكسور',
    user: "أمير بطال",
    concernedGov: "بلدية حلب",
    category: ['رصيف مكسور', 'بلدية حلب'],
    governorate: "حلب",
    location: "العزيزية",
    status: "جاري المعالجة",
  },
  {
    id: "m5gr84i5",
    title: 'رصيف مكسور',
    user: "أمير بطال",
    concernedGov: "بلدية حلب",
    category: ['رصيف مكسور', 'بلدية حلب'],
    governorate: "حلب",
    location: "العزيزية",
    status: "جاري المعالجة",
  },
  {
    id: "m5gr84i4",
    title: 'رصيف مكسور',
    user: "أمير بطال",
    concernedGov: "بلدية حلب",
    category: ['رصيف مكسور', 'بلدية حلب'],
    governorate: "حلب",
    location: "العزيزية",
    status: "جاري المعالجة",
  },
  {
    id: "5kma53ae",
    title: 'رصيف مكسور',
    user: "أمير بطال",
    concernedGov: "بلدية حلب",
    category: ['رصيف مكسور', 'بلدية حلب'],
    governorate: "حلب",
    location: "العزيزية",
    status: "تم حل المشكلة",
  },
  {
    id: "bhqecj4p",
    title: 'رصيف مكسور',
    user: "أمير بطال",
    concernedGov: "بلدية حلب",
    category: ['رصيف مكسور', 'بلدية حلب'],
    governorate: "حلب",
    location: "العزيزية",
    status: "تم الرفض",
  }
]

export type Problem = {
  id: string
  title: string
  user: string
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
    accessorKey: "user",
    header: "المستخدم",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("user")}</div>
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
      <div className="flex flex-row gap-2 justify-center">
        {row.original.category.slice(0, 2).map((item, index) => (
          <Badge key={index} className="w-[40%] h-[30px] bg-neutral-200 text-black font-normal">{item}</Badge>
        ))}
        {row.original.category.length > 2 && (
          <Badge className="w-[40px] h-[30px] bg-neutral-200 text-black font-normal"><Plus /></Badge>
        )}
      </div>
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
      <Badge className={`w-[80%] h-[30px] ${row.original.status === 'جاري المعالجة'
        ? 'bg-orange-600'
        : row.original.status === 'جاري التحقق'
          ? 'bg-blue-600'
          : row.original.status === 'تم الرفض'
            ? 'bg-red-600'
            : row.original.status === 'تم حل المشكلة'
              ? 'bg-green-600'
              : 'bg-fuchsia-600'}`}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "details",
    header: "التفاصيل",
    cell: () => (
      <Button className="rounded-none cursor-pointer">
        <h1>التفاصيل</h1>
        <ChevronLeft />
      </Button>
    )
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
      <div className="w-[90%] flex flex-col gap-5">

        <NewProblemOverlay />

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl">المشكلات (الشكاوي)</h1>
          <h3 className="text-sm text-neutral-600 font-light">تستطيع إيجاد كل المشكلات والتعديل عليها</h3>
        </div>

        <div className="w-full flex flex-row justify-between">
          <div className="w-[50%] flex flex-row gap-5">
            <div className="w-full flex flex-row items-center">
              <Search />
              <Input placeholder="تبحث عن مشكلة معينة ..."/>
            </div>
            <ProblemStatusSelect status='جاري المعالجة' />
          </div>
          <div className="w-[50%] flex flex-row gap-5 justify-end">
            <Button className="rounded-none cursor-pointer">
              <h3>تطبيق الفلتر</h3>
              <Filter />
            </Button>
            <Button className="rounded-none cursor-pointer" variant={"outline"}>
              <h3>فتلر افتراضي</h3>
              <Repeat />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table className="w-full">
            <TableHeader className="rounded-none">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-center font-bold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="cursor-pointer">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    لا يوجد نتائج
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground" dir="rtl">
            {table.getFilteredRowModel().rows.length - table.getFilteredRowModel().rows.length + 1} - {table.getFilteredRowModel().rows.length} من{" "} 
            {/* {table.getFilteredRowModel().rows.length} سطر في الصفحة. */}
            50 سطر من العدد الإجمالي.
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
