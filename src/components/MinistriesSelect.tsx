import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllMinistries } from "@/hooks/use-gov";

const MinistriesSelect = ({
  value,
  setMinistry,
  disabled,
  edit,
}: {
  value?: string;
  setMinistry: (val: string, id: number | null) => void;
  disabled?: boolean;
  edit?: boolean;
}): React.JSX.Element => {

  const { data: ministries, isLoading } = useAllMinistries();

  const handleChange = (selectedName: string) => {
    const selectedMinistry = ministries?.find((gov) => gov.name === selectedName);
    setMinistry(selectedName, selectedMinistry?.id ?? null);
  };

  return (
    <Select dir="rtl" name="ministry" onValueChange={handleChange} value={value}>
      <SelectTrigger
        disabled={disabled}
        className="w-full border-0 bg-none border-b-2 border-b-gray-300 rounded-none cursor-pointer hover:bg-accent"
      >
        {edit ? (
          <SelectValue>{value || "اختر الوزارة"}</SelectValue>
        ) : (
          <SelectValue placeholder={"اختر وزارة"} />
        )}
      </SelectTrigger>

      <SelectContent>
        {isLoading ? (
          <SelectItem value="loading" disabled>
            جاري التحميل...
          </SelectItem>
        ) : (
          ministries?.map((gov) => (
            <SelectItem key={gov.id} value={gov.name}>
              {gov.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};

export default MinistriesSelect;
