import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCities } from "@/hooks/use-Address";
import { useEffect, useState } from "react";


// interface City {
//   arabic: string;
//   english: string;
//   value: string;
// }



const GovernorateSelect = ({ gov, setGov, onChange, value, disabled }: any) : React.JSX.Element => {
  const { data: cities, isLoading, isError } = useCities();

  const [selected, setSelected] = useState(gov || "");

  useEffect(() => {
    if (gov) setSelected(gov);
  }, [gov]);

  const handleChange = (value: string) => {
    setSelected(value);
    if (setGov) setGov(value);
    if (onChange) onChange(value);
  };

  if (isLoading) {
    return <p>...جاري تحميل المحافظات</p>;
  }

  if (isError) {
    return <p className="text-red-500">فشل في تحميل المحافظات</p>;
  }

  const selectValue = gov || selected;

  return (
    <Select
      dir="rtl"
      name="governorate"
      value={selectValue}
      onValueChange={handleChange}
      disabled={disabled}
    >
      <SelectTrigger className={`w-full border-0 bg-none border-b-2 border-b-gray-300 rounded-none ${disabled ? "" : "cursor-pointer hover:bg-accent"}`}>
        <SelectValue placeholder={
          cities?.find((city) => city.english === selectValue)?.arabic || "اختر محافظة"
        } />
      </SelectTrigger>
      <SelectContent>
        {cities?.map((city) => (
          <SelectItem key={city.value} value={city.value}>
            {city.arabic}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};


export default GovernorateSelect;