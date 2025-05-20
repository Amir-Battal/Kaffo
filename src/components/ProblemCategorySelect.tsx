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
  value?: number; // Make sure to pass category ID as a number
  onChange: (id: number) => void;
  userGovId?: number; // لو عنده govId فهو جهة معنية
  disabled?: boolean;
  setCategory?: (category: string) => void;
  category?: string;
}

const ProblemCategorySelect = ({
  value,
  onChange,
  userGovId,
  disabled = false,
  setCategory,
  category
}: ProblemCategorySelectProps) => {

  const {
    data: categories,
    isLoading,
  } = userGovId ? useCategoriesByGovId(userGovId) : useAllCategories();

  const createCategory = useCreateCategory();

  const handleSelectChange = (selected: string) => {
    const selectedCategory = categories?.find((c) => c.name === selected);
    if (setCategory && selectedCategory?.name) {
      setCategory(selectedCategory.name); // Update the category name (optional)
    }

    if (selectedCategory) {
      onChange(selectedCategory.id); // Send category ID to parent component
    }
  };



  const selectedCategoryName = categories?.find((c) => c.id === value)?.name || "";

  return (
    <div className="flex flex-col gap-2">
      <Select
        value={category || selectedCategoryName} // Ensure value reflects category name
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
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProblemCategorySelect;
