import GovernorateSelect from "@/components/GovernorateSelect";
import ProblemCard from "@/components/ProblemCard";
import ProblemCategorySelect from "@/components/ProblemCategorySelect";
import ProblemStatusSelect from "@/components/ProblemStatusSelect";
import { Input } from "@/components/ui/input";
import NewProblemOverlay from "@/forms/problem-form/NewProblemOverlay";
import { Search } from "lucide-react";

const MyAucationsPage = () => {
  return (
    <div className="flex flex-col gap-10 pr-10">
      <div className="flex flex-row-reverse justify-between gap-5 pl-10">
        <div className="w-full flex flex-row gap-5">
          <GovernorateSelect gov='حلب' />
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
        <ProblemCard num={1} myAucation/>
        <ProblemCard num={2} myAucation/>
        <ProblemCard num={3} myAucation/>
      </div>
      {/* <PaginationComp /> */}
    </div>
  );
};

export default MyAucationsPage;