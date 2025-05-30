import { useEffect, useState } from "react";
import PaginationComp from "@/components/PaginationComp";
import ProblemCard from "@/components/ProblemCard";
import ProblemHeader from "@/components/ProblemHeader";
import { useGetProblemsForContribution } from "@/hooks/use-problem";

const DonationsPage = () => {
  const [page, setPage] = useState(0);
  const [criteria, setCriteria] = useState({});

  useEffect(() => {
    setPage(0); // إعادة الصفحة للصفر عند تغيير الفلاتر
  }, [criteria]);

  const { problems, totalPages, isLoading } = useGetProblemsForContribution(
    { 
      page, 
      size: 6,
      sort: "submissionDate,desc"
    },
    { ...criteria,
      forContribution: true}
  );

  return (
    <div className="flex flex-col gap-10 pr-10 mb-25">
      <ProblemHeader onFilterChange={setCriteria} noNew />

      <div className="grid grid-cols-3 gap-5">
        {isLoading ? (
          <p>جاري التحميل...</p>
        ) : (
          problems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} contribution />
          ))
        )}
      </div>

      <PaginationComp page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
};

export default DonationsPage;
