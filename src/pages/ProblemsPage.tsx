import { useState } from "react";
import GovernorateSelect from "@/components/GovernorateSelect";
import PaginationComp from "@/components/PaginationComp";
import ProblemCard from "@/components/ProblemCard";
import ProblemCategorySelect from "@/components/ProblemCategorySelect";
import ProblemStatusSelect from "@/components/ProblemStatusSelect";
import { Input } from "@/components/ui/input";
import NewProblemOverlay from "@/forms/problem-form/NewProblemOverlay";
import { Search } from "lucide-react";
import { useGetAllProblems } from "@/hooks/use-problem";

const ProblemsPage = () => {
  const [page, setPage] = useState(0); // ⚠️ backend يبدأ من 0

  const { problems, totalPages, isLoading } = useGetAllProblems({
    page,
    size: 6,
    // sort: ["submissionDate,desc"], // ✅ مثال
  });

  return (
    <div className="flex flex-col gap-10 pr-10 mb-25">
      <div className="flex flex-row-reverse justify-between gap-5 pl-10">
        <div className="w-full flex flex-row gap-5">
          <GovernorateSelect gov="حلب" />
          <ProblemStatusSelect status="جاري المعالجة" />
          <ProblemCategorySelect category="أرصفة" />
        </div>
        <div className="w-full flex flex-row items-center">
          <Search />
          <Input placeholder="تبحث عن مشكلة معينة ..." />
        </div>
        <NewProblemOverlay />
      </div>

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
