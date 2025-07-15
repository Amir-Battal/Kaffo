import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  ColumnFiltersState,
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
import ProblemCategorySelect from "@/components/ProblemCategorySelect"
import { useEffect, useMemo, useState } from "react"
import { useAllParties } from "@/hooks/use-gov"
import { useAddress, useCities } from "@/hooks/use-Address"
import NewGovOverlay from "@/forms/gov-profile-form/NewGovOverlay"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type Gov = {
  id: string
  email: string
  phone: string
  name: string
  addressId: string
  parentGovId?: string
}

export function GovsTable() {
  const { data: allGovs = [], isLoading } = useAllParties();

  const [searchText, setSearchText] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [govRoleFilter, setGovRoleFilter] = useState<string | null>(null);


  // Pagination
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  // 1. Filtered and reversed data
  const filteredGovs = useMemo(() => {
    const filtered = allGovs.filter((gov) => {
      const text = searchText.toLowerCase();

      const matchesSearch =
        gov.email?.toLowerCase().includes(text) ||
        gov.name?.toLowerCase().includes(text);

      const matchesRole = !govRoleFilter
        ? true
        : govRoleFilter === "جهة معنية"
        ? Boolean(gov.parentGovId)
        : !gov.parentGovId;

      return matchesSearch && matchesRole;
    });

    return filtered.reverse();
  }, [allGovs, searchText, govRoleFilter]);



    // 2. Paginated data
  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredGovs.slice(start, start + pageSize);
  }, [filteredGovs, pageIndex]);

  const columns: ColumnDef<Gov>[] = [
    {
      accessorKey: "email",
      header: "البريد الإلكتروني",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phone",
      header: "رقم الهاتف",
      cell: ({ row }) => <div dir="ltr">{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "name",
      header: "الجهة المعنية",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "governorate",
      header: "المحافظة",
      cell: ({ row }) => {
        const addressId = row.original.addressId
        const { data: address } = useAddress(addressId)
        const { data: cities } = useCities()
        const cityArabic = cities?.find(c => c.value === address?.city)?.arabic ?? address?.city
        return <div>{cityArabic || "جارٍ التحميل..."}</div>
      },
    },
    {
      accessorKey: "role",
      header: "صفة الحساب",
      cell: ({ row }) => {
        const parentGovId = row.original.parentGovId
        return <div>{parentGovId ? "جهة معنية" : "وزارة"}</div>
      },
    },
    {
      accessorKey: "details",
      header: "التفاصيل",
      cell: ({row}) => (
        <Link to={`/gov-profile/${row.original.id}`} className="w-full h-[30px] flex flex-row justify-around items-center cursor-pointer text-white bg-black p-2  hover:bg-gray-800">
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
    pageCount: Math.ceil(filteredGovs.length / pageSize),
  });

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-[90%] flex flex-col gap-5">


        <div className="w-full flex flex-row justify-between"> 
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl">الجهات المعنية</h1>
            <h3 className="text-sm text-neutral-600 font-light">
              تستطيع إيجاد كل حسابات الجهات المعنية والتعديل عليها
            </h3>
          </div>

          <NewGovOverlay />
        </div>


        <div className="w-full flex flex-row justify-between">
          <div className="w-[65%] flex flex-row items-center gap-4">
            <Search />
            <Input
              placeholder="تبحث عن جهة أو بريد إلكتروني ..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setPageIndex(0);
              }}
            />
          </div>

          {/* فلتر صفة الحساب */}
          <div className="w-[30%]">
            <Select
              dir="rtl"
              value={govRoleFilter ?? "all"}
              onValueChange={(val) => {
                setGovRoleFilter(val === "all" ? null : val);
                setPageIndex(0);
              }}
            >
              <SelectTrigger
                className={`w-full border-0 bg-none border-b-2 border-b-gray-300 disabled:border-b-zinc-500 disabled:opacity-100 disabled:text-zinc-600 rounded-none cursor-pointer hover:bg-accent`}
              >
                <SelectValue placeholder="صفة الحساب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">اختر الصفة</SelectItem>
                <SelectItem value="وزارة">وزارة</SelectItem>
                <SelectItem value="جهة معنية">جهة معنية</SelectItem>
              </SelectContent>
            </Select>
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    جاري تحميل البيانات...
                  </TableCell>
                </TableRow>
              ) : paginatedData.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
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
            {filteredGovs.length
              ? `${pageIndex * pageSize + 1} - ${Math.min(
                  (pageIndex + 1) * pageSize,
                  filteredGovs.length
                )} من ${filteredGovs.length} جهة`
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
                  (prev + 1) * pageSize < filteredGovs.length ? prev + 1 : prev
                )
              }
              disabled={(pageIndex + 1) * pageSize >= filteredGovs.length}
            >
              التالي
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}