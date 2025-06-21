"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useGetAllProblems } from "@/hooks/use-problem";
import ProblemHeader from "@/components/ProblemHeader";
import { useGetUserById } from "@/hooks/use-user";
import { useCategory } from "@/hooks/use-category";
import { useAddress, useCities } from "@/hooks/use-Address";
import { Link } from "react-router-dom";
import { useMinistryById } from "@/hooks/use-gov";

// ----------------------------
// Columns
// ----------------------------
const columns = [
  {
    accessorKey: "title",
    header: "العنوان",
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
  },
  {
    accessorKey: "user",
    header: "المستخدم",
    cell: ({ row }) => {
      const userId = row.original.userId;
      const { data: user } = useGetUserById(userId);
      return <div>{user?.firstName + " " + user?.lastName || "جارٍ التحميل..."}</div>;
    },
  },
  {
    accessorKey: "concernedGov",
    header: "الجهة المعنية",
    cell: ({ row }) => {
      const categoryId = row.original.categoryId;
      return <ConcernedGovCell categoryId={categoryId} />;
    },
  },
  {
    accessorKey: "category",
    header: "الصنف",
    cell: ({ row }) => {
      const categoryId = row.original.categoryId;
      const { data: category } = useCategory(categoryId);
      return (
        <Badge className="bg-neutral-200 text-black">
          {category?.name || "جارٍ التحميل..."}
        </Badge>
      );
    },
  },
  {
    accessorKey: "governorate",
    header: "المحافظة",
    cell: ({ row }) => {
      const addressId = row.original.addressId;
      const { data: address } = useAddress(addressId);
      const { data: cities } = useCities();
      const cityArabicName = cities?.find(c => c.value === address?.city)?.arabic ?? address?.city;
      return <div>{cityArabicName || "جارٍ التحميل..."}</div>;
    },
  },
  {
    accessorKey: "location",
    header: "المنطقة",
    cell: ({ row }) => {
      const addressId = row.original.addressId;
      const { data: address } = useAddress(addressId);
      return <div>{address?.description.split(" ")[0] + "..." || "جارٍ التحميل..."}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.original.status;
      const color = {
        "جارية": "bg-fuchsia-600",
        "جاري التحقق": "bg-blue-600",
        "جاري المعالجة": "bg-orange-600",
        "تم الرفض": "bg-red-600",
        "تم حل المشكلة": "bg-green-600",
        "جديدة": "bg-gray-500",
      }[status];
      return <Badge className={`w-[80%] h-[30px] ${color}`}>{status}</Badge>;
    },
  },
  {
    accessorKey: "details",
    header: "التفاصيل",

    cell: ({row}) => (
      <Link to={`/problems/${row.original.id}`} className="w-full h-[30px] flex flex-row justify-around items-center cursor-pointer text-white bg-black p-2  hover:bg-gray-800">
        <h3 className="text-[14px]">تفاصيل</h3>
        <ChevronLeft />
      </Link>
    ),
  },
];

// ----------------------------
// Component
// ----------------------------
export function ProblemsTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});


  const [filters, setFilters] = useState<{
    searchText: string;
    city: string | null;
    status: string | null;
    categoryId: number | null;
  }>({
    searchText: "",
    city: null,
    status: null,
    categoryId: null,
  });


  const [page, setPage] = useState(0);
  const size = 6;

  const criteria = useMemo(() => {
    return {
      searchText: filters.searchText || undefined,
      status: filters.status || undefined,
      city: filters.city || undefined,
      categoryId: filters.categoryId || undefined,
    };
  }, [filters]);

  const { problems, isLoading, totalPages } = useGetAllProblems(
    { page, size, sort: "submissionDate,desc" },
    criteria
  );

  const mappedData = useMemo(() => {
    return problems.map((p) => ({
      id: p.id.toString(),
      title: p.title,
      userId: p.submittedByUserId,
      categoryId: p.categoryId,
      addressId: p.addressId,
      status:
        p.status === "APPROVED"
          ? "جديدة"
          : p.status === "PENDING_APPROVAL"
          ? "جاري التحقق"
          : p.status === "RESOLVED"
          ? "تم حل المشكلة"
          : p.status === "REJECTED"
          ? "تم الرفض"
          : "جاري المعالجة",
    }));
  }, [problems]);


  const table = useReactTable({
    data: mappedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-[90%] flex flex-col gap-5">
        {/* ✅ Problem Header */}

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl">المشكلات (الشكاوي)</h1>
          <h3 className="text-sm text-neutral-600 font-light">يمكنك الاطلاع والتعديل على جميع المشكلات</h3>
        </div>

        <ProblemHeader onFilterChange={setFilters} />

        {/* ✅ Table */}
        <div className="rounded-md border">
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => (
                    <TableHead key={header.id} className="text-center font-bold">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length > 0 ? (
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
                  <TableCell colSpan={columns.length} className="text-center">
                    لا توجد نتائج
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* ✅ Pagination */}
        <div className="flex justify-end items-center gap-4 py-4">
          <div className="text-sm text-muted-foreground" dir="rtl">
            {mappedData.length > 0 && `${page * size + 1} - ${page * size + mappedData.length}`} من{" "}
            {totalPages * size} سطر
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
            >
              السابق
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page + 1 >= totalPages}
            >
              التالي
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


const ConcernedGovCell = ({ categoryId }: { categoryId: number }) => {
  const { data: category, isLoading: loadingCategory } = useCategory(categoryId);
  const [govId, setGovId] = useState<number | null>(null);

  useEffect(() => {
    if (category?.govId) {
      setGovId(category.govId);
    }
  }, [category]);

  const { data: gov, isLoading: loadingGov } = useMinistryById(govId ?? -1);

  if (loadingCategory || !category) return <div>جارٍ التحميل...</div>;
  if (loadingGov || !gov) return <div>جارٍ التحميل...</div>;

  return <div>{gov.name}</div>;
};