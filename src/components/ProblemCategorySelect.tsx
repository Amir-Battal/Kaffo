import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllCategories, useCategoriesByGovId } from "@/hooks/use-category";

type Category = {
  id: number;
  name: string;
};

type ProblemCategorySelectProps = {
  value: number | null;
  onChange: (id: number) => void;
  ministry?: number; // govId
  disabled?: boolean;
  setCategory?: (name: string) => void;
  category?: string;
  header?: boolean;
};

const ProblemCategorySelect = ({
  value,
  onChange,
  ministry,
  disabled = false,
  setCategory,
  category,
  header,
}: ProblemCategorySelectProps) => {
  // جلب التصنيفات حسب وجود الوزارة (الجهة المعنية)
  const {
    data: categories,
    isLoading,
  } = ministry ? useCategoriesByGovId(ministry) : useAllCategories();


  const selected = Array.isArray(categories)
    ? categories.find((c) => c.id === value)
    : null;

  const displayName = selected?.name || "اختر التصنيف";

  const handleSelectChange = (selectedName: string) => {
    const selectedCategory = Array.isArray(categories)
      ? categories.find((c) => c.name === selectedName)
      : null;

    if (selectedCategory) {
      onChange(selectedCategory.id); // إرسال المعرف (ID)
      setCategory?.(selectedCategory.name); // إرسال الاسم إذا توفر
    }
  };

  return (
    <Select
      dir="rtl"
      onValueChange={handleSelectChange}
      value={selected?.name || ""}
      disabled={ministry || header ? disabled : true}
    >
      <SelectTrigger className="w-full border-0 border-b-2 border-b-gray-300 rounded-none cursor-pointer hover:bg-accent">
        <SelectValue placeholder={displayName} />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <SelectItem value="loading" disabled>
            جاري التحميل...
          </SelectItem>
        ) : (
          Array.isArray(categories) &&
          categories.map((c: Category) => (
            <SelectItem key={c.id} value={c.name}>
              {c.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};

export default ProblemCategorySelect;
