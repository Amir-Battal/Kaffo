import { useEffect, useState } from "react";
import PaginationComp from "@/components/PaginationComp";
import ProblemCard from "@/components/ProblemCard";
import { useGetAllProblems, useGetMyProblems } from "@/hooks/use-problem";
import ProblemHeader from "@/components/ProblemHeader";
import { toast } from "sonner";
import { Ban, Check } from "lucide-react";

const AuctionsPage = () => {
  const [page, setPage] = useState(0); // يبدأ من 0

  const [criteria, setCriteria] = useState({});

  useEffect(() => {
    setPage(0);
  }, [criteria]);

  useEffect(() => {
    const toastMessage = sessionStorage.getItem("showToastDelete");
    if (toastMessage) {
      toast(toastMessage, {
        style: {
          display: 'flex',
          flexDirection: 'row',
          gap: '20px',
          background: '#cc1100',
          color: '#fff',
          direction: 'rtl',
          border: 'none',
        },
        icon: <Ban />,
        closeButton: true
      });
      sessionStorage.removeItem("showToastDelete");
    }
  }, []);

  const { problems, totalPages, isLoading } = useGetMyProblems(
    { page, size: 6 },
    criteria
  );


  return (
    <div className="flex flex-col gap-10 pr-10 mb-25">
      <ProblemHeader
        onFilterChange={setCriteria}
      />

      <div className="grid grid-cols-3 gap-5">
        {isLoading ? (
          <p>جاري التحميل...</p>
        ) : (
          problems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))
        )}
      </div>

      <PaginationComp page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
};

export default AuctionsPage;
