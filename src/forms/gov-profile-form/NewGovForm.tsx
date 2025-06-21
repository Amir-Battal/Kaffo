import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import MinistriesSelect from "@/components/MinistriesSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateAddress } from "@/hooks/use-Address";
import { useCreateGov } from "@/hooks/use-gov";
import GovernorateSelect from "@/components/GovernorateSelect";

const NewGovForm = () => {
  const [govName, setGovName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [govType, setGovType] = useState<"ministry" | "concerned">("ministry");
  const [parentGovId, setParentGovId] = useState<number | null>(null);
  const [parentGovName, setParentGovName] = useState<string>("");

  const createAddress = useCreateAddress();
  const createGov = useCreateGov(); // ✅ استخدام hook الإنشاء

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const address = {
        city,
        description,
        latitude: 0,
        longitude: 0,
      };

      const addressResponse = await createAddress.mutateAsync(address);

      const govPayload = {
        name: govName,
        email,
        phone,
        logoUrl: "https://", // سيتم تحديثه لاحقًا
        addressId: addressResponse.id,
        parentGovId: govType === "concerned" && parentGovId ? parentGovId : null,
      };

      await createGov.mutateAsync(govPayload);
      window.location.reload();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <form
      dir="rtl"
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto flex flex-col gap-5 gap-4 mt-6"
    >
      {/* اسم الجهة */}
      <div className="flex flex-col gap-2">
        <Label>اسم الجهة</Label>
        <Input value={govName} onChange={(e) => setGovName(e.target.value)} required />
      </div>

      <div className="w-full flex flex-row gap-5">
        {/* البريد الإلكتروني */}
        <div className="w-full flex flex-col gap-2">
          <Label>البريد الإلكتروني</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        {/* رقم الهاتف */}
        <div className="w-full flex flex-col gap-2">
          <Label>رقم الهاتف</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
      </div>

      <div className="w-full flex flex-row gap-5">
        {/* نوع الجهة */}
        <div className="w-full flex flex-col gap-2">
          <Label>نوع الجهة</Label>
          <Select value={govType} onValueChange={(val: "ministry" | "concerned") => setGovType(val)}>
            <SelectTrigger dir="rtl" className="w-full border-0 bg-none border-b-2 border-b-gray-300 disabled:border-b-zinc-500 disabled:opacity-100 disabled:text-zinc-600 rounded-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent dir="rtl">
              <SelectItem value="ministry">وزارة</SelectItem>
              <SelectItem value="concerned">جهة معنية</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* في حال كانت جهة معنية، اختر الوزارة التابعة */}
        {govType === "concerned" && (
          <div className="w-full flex flex-col gap-2">
            <Label>اختر الوزارة التابعة لها</Label>
            <MinistriesSelect
              value={parentGovName}
              setMinistry={(name, id) => {
                setParentGovName(name);
                setParentGovId(id);
              }}
            />
          </div>
        )}

      </div>



      <div className="w-full flex flex-row gap-5">
        {/* العنوان */}
        <div className="w-full flex flex-col gap-2">
          <Label>المحافظة</Label>
          <GovernorateSelect value={city} onChange={setCity} />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Label>العنوان</Label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
      </div>

      <div className="col-span-2 flex justify-end mt-4">
        <Button type="submit" className="w-full">
          إنشاء الجهة
        </Button>
      </div>
    </form>
  );
};

export default NewGovForm;
