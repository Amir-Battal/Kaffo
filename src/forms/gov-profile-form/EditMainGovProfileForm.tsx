// نسخة محسّنة من النموذج لتجنّب إعادة ضبط البيانات بعد التعديل

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import MinistriesSelect from "@/components/MinistriesSelect";
import ConcernedPartySelect from "@/components/ConcernedPartySelect";
import { Button } from "@/components/ui/button";
import GovernorateSelect from "@/components/GovernorateSelect";
import { useGetMyUser, useUpdateUserBasicInfo } from "@/hooks/use-user";
import {
  useAllMinistries,
  useAllParties,
  useGovById,
  useUpdateGovInfo,
} from "@/hooks/use-gov";
import { useAddress, useCities } from "@/hooks/use-Address";
import { useParams } from "react-router-dom";

const formSchema = z.object({
  firstName: z.string(),
  governorate: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().min(10).max(10),
  concernedPartyId: z.number().optional(),
});

export function EditMainGovProfileForm() {
  const { govId } = useParams();
  const [hasUpdated, setHasUpdated] = useState(false);

  const [ministryId, setMinistryId] = useState<number | null>(null);
  const [concernedPartyId, setConcernedPartyId] = useState<number | null>(null);
  const [ministryName, setMinistryName] = useState("");
  const [concernedPartyName, setConcernedPartyName] = useState("");

  const { currentUser } = govId ? useGovById(Number(govId)) : useGetMyUser();
  const isMinistry = currentUser?.parentGovId === null;
  const isConcernedParty = currentUser?.parentGovId;

  const { data: address } = useAddress(currentUser?.addressId);
  const { data: cities } = useCities();
  const cityArabicName = cities?.find((c) => c.value === address?.city)?.arabic ?? address?.city;

  const { updateUserBasicInfo } = useUpdateUserBasicInfo();
  const { data: parties } = useAllParties();
  const { data: ministries } = useAllMinistries();
  const { mutateAsync: updateGovInfo } = useUpdateGovInfo();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      governorate: "",
      email: "",
      phoneNumber: "",
      concernedPartyId: 0,
    },
  });

  useEffect(() => {
    if (!currentUser || !cities || !ministries || !parties || hasUpdated) return;

    const matchedGovernorate = cities.find(
      (gov) => gov.arabic === (currentUser?.lastName || cityArabicName)
    );

    form.reset({
      firstName: currentUser.firstName || currentUser.name || "",
      governorate: matchedGovernorate?.value || "",
      email: currentUser.email || "",
      phoneNumber: currentUser.phone || "",
      concernedPartyId: currentUser.govId || 0,
    });

    if (currentUser.govId) {
      const party = parties.find((p) => p.id === currentUser.govId);
      const ministry = ministries.find((m) => m.id === party?.parentGovId);
      if (party && ministry) {
        setMinistryId(party.parentGovId);
        setConcernedPartyId(party.id);
        setMinistryName(ministry.name);
        setConcernedPartyName(party.parentGovName);
      }
    } else if (currentUser.parentGovId) {
      const ministry = ministries.find((m) => m.id === currentUser.parentGovId);
      if (ministry) {
        setMinistryId(ministry.id);
        setMinistryName(ministry.name);
      }
    }
  }, [currentUser, parties, cities, ministries, form, hasUpdated]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const selectedCity = cities?.find((city) => city.value === values.governorate);
    const arabicCity = selectedCity?.arabic || "";

    if (!currentUser) return;

    if (isMinistry) {
      await updateGovInfo({
        id: currentUser.id,
        name: values.firstName,
        email: values.email,
        phone: values.phoneNumber,
      });
      setHasUpdated(true);
      sessionStorage.setItem("showToastEdit", "تم تعديل بيانات الجهة بنجاح");
      window.location.reload();
      return;
    }

    if (!concernedPartyId) {
      alert("حدث خطأ في تحديد الجهة المعنية");
      return;
    }

    await updateUserBasicInfo({
      id: currentUser.id,
      firstName: values.firstName,
      lastName: arabicCity,
      phone: values.phoneNumber,
      email: values.email,
      govId: concernedPartyId,
    });

    setHasUpdated(true);
    sessionStorage.setItem("showToastEdit", "تم تعديل البيانات الأساسية بنجاح");
    window.location.reload();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-10 py-10" dir="rtl">
        <div className="grid grid-cols-2 gap-5">
          <FormField control={form.control} name="firstName" render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم الأول</FormLabel>
              <FormControl><Input placeholder="الاسم الكامل" {...field} /></FormControl>
            </FormItem>
          )} />

          {!isMinistry && (
            <FormField control={form.control} name="governorate" render={({ field }) => (
              <FormItem>
                <FormLabel>المحافظة</FormLabel>
                <GovernorateSelect value={field.value} onChange={field.onChange} />
              </FormItem>
            )} />
          )}

          <FormField control={form.control} name="phoneNumber" render={({ field }) => (
            <FormItem>
              <FormLabel>رقم الهاتف</FormLabel>
              <FormControl><Input placeholder="0999999999" {...field} /></FormControl>
            </FormItem>
          )} />

          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl><Input placeholder="email@example.com" {...field} /></FormControl>
            </FormItem>
          )} />
        </div>

        {!isMinistry && (
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <FormLabel>الوزارة</FormLabel>
              <MinistriesSelect
                value={ministryName}
                setMinistry={(name, id) => {
                  setMinistryId(id);
                  setConcernedPartyId(null);
                }}
              />
            </div>

            {ministryId !== null && (
              <div className="flex flex-col gap-2">
                <FormLabel>الجهة المعنية</FormLabel>
                <ConcernedPartySelect
                  key={ministryId}
                  ministryId={ministryId}
                  value={concernedPartyId?.toString()}
                  setConcernedParty={(name, id) => {
                    setConcernedPartyName(name);
                    setConcernedPartyId(id);
                    form.setValue("concernedPartyId", id);
                  }}
                />
              </div>
            )}
          </div>
        )}

        <Button type="submit" className="w-[60%] cursor-pointer">
          <h3>تأكيد التعديل</h3>
          <ChevronLeft />
        </Button>
      </form>
    </Form>
  );
}
