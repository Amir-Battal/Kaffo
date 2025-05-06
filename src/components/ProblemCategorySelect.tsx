import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAllCategories,
  useCategoriesByGovId,
  useCreateCategory,
} from "@/hooks/use-category";

interface ProblemCategorySelectProps {
  value: number;
  onChange: (id: number) => void;
  userGovId?: number; // لو عنده govId فهو جهة معنية
  disabled?: boolean;
}

const ProblemCategorySelect = ({
  value,
  onChange,
  userGovId,
  disabled = false,
}: ProblemCategorySelectProps) => {
  const [isCustom, setIsCustom] = useState(false);
  const [customName, setCustomName] = useState("");

  const {
    data: categories,
    isLoading,
  } = userGovId ? useCategoriesByGovId(userGovId) : useAllCategories();

  const createCategory = useCreateCategory();

  const handleSelectChange = (selected: string) => {
    if (selected === "__custom__") {
      setIsCustom(true);
      onChange(0); // Clear current selection
    } else {
      setIsCustom(false);
      const selectedCategory = categories?.find((c) => c.name === selected);
      if (selectedCategory) {
        onChange(selectedCategory.id);
      }
    }
  };

  const handleAddCustom = async () => {
    if (!customName.trim()) {
      toast.error("يرجى كتابة اسم التصنيف الجديد");
      return;
    }

    try {
      const newCategory = await createCategory.mutateAsync({
        name: customName.trim(),
        govId: 1, // دائماً 0، وسيقوم المشرف لاحقاً بإسناده
      });

      setCustomName("");
      setIsCustom(false);
      onChange(newCategory.id);
      toast.success("تم إنشاء التصنيف الجديد");
    } catch (err) {
      toast.error("فشل في إنشاء التصنيف");
    }
  };

  const selectedCategoryName = categories?.find((c) => c.id === value)?.name || "";

  return (
    <div className="flex flex-col gap-2">
      <Select
        value={selectedCategoryName}
        onValueChange={handleSelectChange}
        disabled={disabled || isLoading}
        dir="rtl"
      >
        <SelectTrigger className="w-full border-0 border-b-2 border-gray-300 rounded-none bg-white hover:bg-accent">
          <SelectValue placeholder="اختر تصنيف المشكلة" />
        </SelectTrigger>
        <SelectContent>
          {categories?.map((cat) => (
            <SelectItem key={cat.id} value={cat.name}>
              {cat.name}
            </SelectItem>
          ))}
          <SelectItem value="__custom__">+ إضافة تصنيف جديد</SelectItem>
        </SelectContent>
      </Select>

      {isCustom && (
        <div className="flex gap-2 mt-2">
          <Input
            dir="rtl"
            placeholder="اكتب اسم التصنيف الجديد"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
          />
          <button
            className="bg-primary text-white px-4 rounded"
            onClick={handleAddCustom}
            disabled={createCategory.isLoading}
          >
            إضافة
          </button>
        </div>
      )}
    </div>
  );
};

export default ProblemCategorySelect;
