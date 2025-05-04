import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type PaginationCompProps = {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
};

const PaginationComp = ({ page, setPage, totalPages }: PaginationCompProps) => {
  const generatePages = () => {
    const pages: number[] = [];

    if (totalPages <= 5) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      if (page <= 2) {
        pages.push(0, 1, 2, 3);
        pages.push(-1); // ellipsis
        pages.push(totalPages - 1);
      } else if (page >= totalPages - 3) {
        pages.push(0);
        pages.push(-1); // ellipsis
        for (let i = totalPages - 4; i < totalPages; i++) pages.push(i);
      } else {
        pages.push(0);
        pages.push(-1); // ellipsis
        pages.push(page - 1, page, page + 1);
        pages.push(-1); // ellipsis
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };

  const handleClick = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) setPage(newPage);
  };

  return (
    <Pagination dir="ltr">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => handleClick(page - 1)}
            className={page === 0 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {generatePages().map((p, index) =>
          p === -1 ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                onClick={() => handleClick(p)}
                isActive={p === page}
              >
                {p + 1}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => handleClick(page + 1)}
            className={page === totalPages - 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComp;
