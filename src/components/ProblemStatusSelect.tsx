import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { arabicToEnglishStatus, problemStatusMap } from "@/status-mapping";
import { useState, useEffect } from "react";

type Props = {
  status?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

const ProblemStatusSelect = ({ status, onChange, disabled }: Props): React.JSX.Element => {
  const [selectedArabic, setSelectedArabic] = useState(
    status ? problemStatusMap[status as keyof typeof problemStatusMap] : ""
  );

  useEffect(() => {
    if (status) {
      setSelectedArabic(problemStatusMap[status as keyof typeof problemStatusMap]);
    }
  }, [status]);

  const handleChange = (value: string) => {
    setSelectedArabic(value);
    const backendStatus = arabicToEnglishStatus[value];
    if (onChange) onChange(backendStatus);
  };

  return (
    <Select dir="rtl" value={selectedArabic} onValueChange={handleChange} name="status">
      <SelectTrigger
        disabled={disabled}
        className="w-full border-0 bg-none border-b-2 border-b-gray-300 rounded-none cursor-pointer hover:bg-accent"
      >
        <SelectValue placeholder="اختر الحالة" />
      </SelectTrigger>

      <SelectContent>
        {Object.values(problemStatusMap).map((label) => (
          <SelectItem key={label} value={label}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ProblemStatusSelect;
