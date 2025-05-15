import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import GovernorateSelect from "./GovernorateSelect";
import ProblemCategorySelect from "./ProblemCategorySelect";
import ProblemStatusSelect from "./ProblemStatusSelect";
import { Input } from "./ui/input";
import NewProblemOverlay from "@/forms/problem-form/NewProblemOverlay";

type ProblemHeaderProps = {
  onFilterChange?: (filters: {
    searchText: string;
    city: string | null;
    status: string | null;
    categoryId: number | null;
  }) => void;
  myAucation?: boolean;
};

const ProblemHeader = ({ onFilterChange, myAucation }: ProblemHeaderProps) => {
  const [searchText, setSearchText] = useState("");
  const [city, setCity] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);


  useEffect(() => {
    // عند تغيير أي فلتر، يتم استدعاء onFilterChange تلقائيًا
    if (onFilterChange) {
      onFilterChange({ searchText, city, status, categoryId });
    }
  }, [searchText, city, status, categoryId]); // راقب هذه القيم فقط

  return (
    <div className="flex flex-row-reverse justify-between gap-5 pl-10">
      <div className="w-full flex flex-row gap-5">
        <GovernorateSelect
          onChange={(value: any) => setCity(value)} // ✅ هذا موجود
        />
        <ProblemStatusSelect
          status={status}
          onChange={(value) => setStatus(value)}
        />

        <ProblemCategorySelect
          onChange={(id) => setCategoryId(id)}
          category={categoryName ?? ""}
          setCategory={(name) => setCategoryName(name)} // تأكد أن هذا name وليس object
        />

      </div>
      <div className="w-full flex flex-row items-center gap-2">
        <Search />
        <Input
          placeholder="تبحث عن مشكلة معينة ..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      {myAucation
        ?(
          <div></div>
        ):(
          <NewProblemOverlay />
        )
      }
    </div>
  );
};

export default ProblemHeader;
