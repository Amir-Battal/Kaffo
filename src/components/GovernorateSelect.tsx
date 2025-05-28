import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCities } from "@/hooks/use-Address";

const GovernorateSelect = ({
  value,
  onChange,
  disabled,
  setGovernorate,
  returnArabicName = false,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  setGovernorate?: (governorate: string) => void;
  returnArabicName?: boolean;
}): React.JSX.Element => {
  const { data: cities, isLoading, isError } = useCities();

  const handleChange = (value: string) => {
    const selectedCity = cities?.find((city) => city.value === value);
    if (!selectedCity) return;

    const result = returnArabicName ? selectedCity.arabic : selectedCity.value;
    onChange(result);
    if (setGovernorate) setGovernorate(result);
  };

  if (isLoading) return <p>...جاري تحميل المحافظات</p>;
  if (isError) return <p className="text-red-500">فشل في تحميل المحافظات</p>;

  return (
    <Select
      dir="rtl"
      value={value}
      onValueChange={handleChange}
      disabled={disabled}
    >
      <SelectTrigger
        className={`w-full border-0 bg-none border-b-2 border-b-gray-300 disabled:border-b-zinc-500 disabled:opacity-100 disabled:text-zinc-600 rounded-none ${
          disabled ? "" : "cursor-pointer hover:bg-accent"
        }`}
      >
        <SelectValue
          placeholder={
            cities?.find((city) => city.value === value)?.arabic ||
            "اختر محافظة"
          }
        />
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
