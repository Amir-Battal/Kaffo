import GovernorateSelect from "@/components/GovernorateSelect";
import PaginationComp from "@/components/PaginationComp";
import ProblemCard from "@/components/ProblemCard";
import ProblemCategorySelect from "@/components/ProblemCategorySelect";
import ProblemStatusSelect from "@/components/ProblemStatusSelect";
import { Input } from "@/components/ui/input";
import NewProblemOverlay from "@/forms/problem-form/NewProblemOverlay";
import { Search } from "lucide-react";


const AuctionsPage = () => {
  return (
    <div className="flex flex-col gap-10 pr-10">
      <div className="flex flex-row-reverse justify-between gap-5 pl-10">
        <div className="w-full flex flex-row gap-5">
          {/* <GovernorateSelect gov='حلب' /> */}
          <ProblemStatusSelect status='جاري المعالجة' />
          <ProblemCategorySelect category='أرصفة' />
        </div>
        <div className="w-full flex flex-row items-center">
          <Search />
          <Input placeholder="تبحث عن مشكلة معينة ..."/>
        </div>
        {/* // TODO: in Gov status hide this button */}
        <NewProblemOverlay />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <ProblemCard num={1} />
        <ProblemCard num={2} />
        <ProblemCard num={3} />
        {/* <ProblemCard num={4} />
        <ProblemCard num={5} />
        <ProblemCard num={6} /> */}
      </div>
      {/* <PaginationComp /> */}
    </div>
  );
};

export default AuctionsPage;