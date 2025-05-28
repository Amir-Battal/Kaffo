import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConcernedParties } from "@/hooks/use-gov";

const ConcernedPartySelect = ({
  ministryId,
  value,
  setConcernedParty,
}: {
  ministryId: number;
  value?: string;
  setConcernedParty: (name: string, id: number) => void;
}): React.JSX.Element => {
  const { data: parties, isLoading } = useConcernedParties(ministryId);

  return (
    <Select
      dir="rtl"
      name="party"
      value={value}
      onValueChange={(val) => {
        const selected = parties?.find((p) => p.id === Number(val));
        if (selected) {
          setConcernedParty(selected.name, selected.id);
        }
      }}
    >
      <SelectTrigger className="w-full border-0 bg-none border-b-2 border-b-gray-300 rounded-none cursor-pointer hover:bg-accent">
        <SelectValue placeholder="اختر الجهة المعنية" />
      </SelectTrigger>

      <SelectContent>
        {isLoading ? (
          <SelectItem value="loading" disabled>
            جاري التحميل...
          </SelectItem>
        ) : (
          parties?.map((party) => (
            <SelectItem key={party.id} value={party.id.toString()}>
              {party.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};

export default ConcernedPartySelect;

