import { useEffect, useState } from "react";
import ProblemCard from "@/components/ProblemCard";
import ProblemHeader from "@/components/ProblemHeader";
import PaginationComp from "@/components/PaginationComp";
import { useGetMyProblems } from "@/hooks/use-problem";

const MyAucationsPage = () => {
  const [page, setPage] = useState(0);
  const [criteria, setCriteria] = useState({});

  useEffect(() => {
    setPage(0); // كلما تغيّر الفلتر، نرجع لأول صفحة
  }, [criteria]);

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
