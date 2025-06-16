import { useEffect, useState } from "react";
import PaginationComp from "@/components/PaginationComp";
import ProblemCard from "@/components/ProblemCard";
import { useGetAllProblems } from "@/hooks/use-problem";
import ProblemHeader from "@/components/ProblemHeader";
import { toast } from "sonner";
import { Ban, Check } from "lucide-react";

const ProblemsPage = () => {
  const [page, setPage] = useState(0); // ⚠️ backend يبدأ من 0

  // TODO: get all problems using gov Id & completed status
  const [criteria, setCriteria] = useState({});

  useEffect(() => {
    setPage(0);
  }, [criteria]);

  useEffect(() => {
      const toastMessage = sessionStorage.getItem("showToastProblemDelete");
      if (toastMessage) {
        toast(toastMessage,{
          style:{
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
        })
        sessionStorage.removeItem("showToastProblemDelete");
      }
    }, []);

    const { problems, totalPages, isLoading } = useGetAllProblems({
      page,
      size: 6,
      sort: "submissionDate,desc", // ✅ مثال
    }, criteria);

    


  return (
    <div className="flex flex-col gap-10 pr-10 mb-25">
      <ProblemHeader onFilterChange={setCriteria} />

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

export default ProblemsPage;
