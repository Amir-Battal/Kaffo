"use client"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton"
import { useAllUsers } from "@/hooks/use-user"
import { useMemo, useState } from "react"
import { useAddress, useCities } from "@/hooks/use-Address"

export type User = {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  dateOfBirth: number
  governorate: string
  govId: string
  addressId: string
}


export function UsersTable() {
  const { data: allUsers = [], isLoading } = useAllUsers();

  const [searchText, setSearchText] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Pagination
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  // 1. Filtered data based on search
  const filteredUsers = useMemo(() => {
    const filtered = allUsers.filter((user) => {
      const text = searchText.toLowerCase();
      return (
        user.email?.toLowerCase().includes(text) ||
        user.firstName?.toLowerCase().includes(text) ||
        user.lastName?.toLowerCase().includes(text)   
      );
    });

    return filtered.reverse();
  }, [allUsers, searchText]);

  // 2. Paginated data
  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, pageIndex]);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "الاسم",
      cell: ({ row }) => {
        const firstName = row.original.firstName
        const lastName = row.original.lastName
        return <div className="capitalize">{firstName} {lastName}</div>
      },
    },
    {
      accessorKey: "phone",
      header: "رقم الهاتف",
      cell: ({ row }) => (
        <div dir="ltr" className="capitalize">{row.getValue("phone") || "لا يوجد"}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "البريد الإلكتروني",
      cell: ({ row }) => (
        <div>{row.getValue("email") || "لا يوجد"}</div>
      ),
    },
    {
      accessorKey: "dateOfBirth",
      header: "تاريخ الميلاد",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("dateOfBirth") || "لا يوجد"}</div>
      ),
    },
    {
      accessorKey: "governorate",
      header: "المحافظة",
      cell: ({ row }) => {
        console.log(row);
        const addressId = row.original.addressId
        const { data: address } = useAddress(addressId)
        const { data: cities } = useCities()
        const cityArabic = cities?.find(c => c.value === address?.city)?.arabic ?? address?.city
        return <div>{cityArabic || "لم يتم التحديد"}</div>
      },
    },
    {
      accessorKey: "role",
      header: "صفة الحساب",
      cell: ({ row }) => {
        const govId = row.original.govId
        return <div>{govId ? "موظف" : "مستخدم عادي"}</div>
      },
    },
    {
      accessorKey: "details",
      header: "التفاصيل",
      cell: ({row}) => (
        <Link to={`/user-profile/${row.original.id}`} className="w-full h-[30px] flex flex-row justify-around items-center cursor-pointer text-white bg-black p-2  hover:bg-gray-800">
          <h3 className="text-[14px]">تفاصيل</h3>
          <ChevronLeft />
        </Link>
      ),
    },
  ]

    // 3. Setup table
  const table = useReactTable({
    data: paginatedData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(filteredUsers.length / pageSize),
  });



  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-[90%] flex flex-col gap-5">

        <Link to='/user-profile' className="w-[12%] flex flex-row justify-around items-center cursor-pointer text-white bg-black p-2 rounded-[10px] hover:bg-gray-800">
          <h3 className="text-sm">مستخدم جديد</h3>
          <Plus size={17} />
        </Link>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl">المستخدمين</h1>
          <h3 className="text-sm text-neutral-600 font-light">تستطيع إيجاد كل المستخدمين والتعديل عليهم</h3>
        </div>

        {/* Filters */}
        <div className="w-full flex flex-row justify-between">
            <div className="w-full flex flex-row items-center">
              <Search />
              <Input
                placeholder="تبحث عن مستخدم ما..."
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setPageIndex(0); // إعادة أول صفحة عند تغيير البحث
                }}
              />
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    <Skeleton className="h-6 w-[80%] mx-auto" />
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
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
            {filteredUsers.length
              ? `${pageIndex * pageSize + 1} - ${Math.min(
                  (pageIndex + 1) * pageSize,
                  filteredUsers.length
                )} من ${filteredUsers.length} جهة`
              : `0 من 0`}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
              disabled={pageIndex === 0}
            >
              السابق
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPageIndex((prev) =>
                  (prev + 1) * pageSize < filteredUsers.length ? prev + 1 : prev
                )
              }
              disabled={(pageIndex + 1) * pageSize >= filteredUsers.length}
            >
              التالي
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
