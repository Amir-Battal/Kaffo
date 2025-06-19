import { useEffect, useState } from "react";
import ProblemCard from "@/components/ProblemCard";
import ProblemHeader from "@/components/ProblemHeader";
import PaginationComp from "@/components/PaginationComp";
import { useGetMyProblems } from "@/hooks/use-problem";
import { toast } from "sonner";
import { Check } from "lucide-react";

const MyAucationsPage = () => {
  const [page, setPage] = useState(0);
    const [criteria, setCriteria] = useState({});

  useEffect(() => {
    setPage(0); // كلما تغيّر الفلتر، نرجع لأول صفحة
  }, [criteria]);

  useEffect(() => {
      const toastMessage = sessionStorage.getItem("showToastDelete");
      if (toastMessage) {
        toast(toastMessage,{
          style:{
            display: 'flex',
            flexDirection: 'row',
            gap: '20px',
            background: '#008c2f',
            color: '#fff',
            direction: 'rtl',
            border: 'none',
          },
          icon: <Check />,
          closeButton: true
        })
        sessionStorage.removeItem("showToastDelete");
      }
    }, []);

  const { problems, totalPages, isLoading } = useGetMyProblems(
    { page, size: 6 },
    criteria
  );


  return (
    <div className="flex flex-col gap-10 pr-10 mb-25">
      <ProblemHeader myAucation onFilterChange={setCriteria} />

      <div className="grid grid-cols-3 gap-5">
        {isLoading ? (
          <p>جاري التحميل...</p>
        ) : problems.length > 0 ? (
          problems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} myAucation />
          ))
        ) : (
          <p>لا توجد شكاوي مطابقة للبحث.</p>
        )}
      </div>

      <PaginationComp page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
};

export default MyAucationsPage;
