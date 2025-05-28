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
import * as DialogPrimitive from "@radix-ui/react-dialog";
import GovernorateSelect from "@/components/GovernorateSelect";
import { useGetMyUser, useUpdateUserBasicInfo } from "@/hooks/use-user";
import { useAllMinistries, useAllParties } from "@/hooks/use-gov";
import { useCities } from "@/hooks/use-Address";

// النموذج الأساسي
const formSchema = z.object({
  firstName: z.string(),
  governorate: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().min(10).max(10),
  concernedPartyId: z.number(), // المعرف فقط
});

export function EditMainGovProfileForm() {
  const [ministryId, setMinistryId] = useState<number | null>(null);
  const [concernedPartyId, setConcernedPartyId] = useState<number | null>(null);

  const [ministryName, setMinistryName] = useState("");
  const [concernedPartyName, setConcernedPartyName] = useState("");


  const { currentUser } = useGetMyUser();
  const { updateUserBasicInfo } = useUpdateUserBasicInfo();
  const { data: parties } = useAllParties();
  const { data: ministries } = useAllMinistries();

  const { data: cities} = useCities();


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
    if (currentUser && parties && cities && ministries) {
      const matchedGovernorate = cities.find(
        (gov) => gov.arabic === currentUser.lastName
      );

      form.reset({
        firstName: currentUser.firstName || "",
        governorate: matchedGovernorate ? matchedGovernorate.value : "",
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
      }
    }
  }, [currentUser, parties, cities, ministries, form]);




  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentUser || !concernedPartyId) {
      alert("حدث خطأ في تحديد المستخدم أو الجهة المعنية");
      return;
    }

    const selectedCity = cities.find(city => city.value === values.governorate);

    await updateUserBasicInfo({
      id: currentUser.id,
      firstName: values.firstName,
      lastName: selectedCity?.arabic || "", // هنا نستخدم الاسم العربي
      phone: values.phoneNumber,
      email: values.email,
      govId: concernedPartyId,
    });

    window.location.reload();

    console.log("✅ تم تعديل البيانات الاساسية بنجاح", values);
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-10 py-10" dir="rtl">

        <div className="grid grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم الأول</FormLabel>
                <FormControl>
                  <Input placeholder="الاسم الكامل" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="governorate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المحافظة</FormLabel>
                <GovernorateSelect
                  value={field.value}
                  onChange={field.onChange}
                />

              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الهاتف</FormLabel>
                <FormControl>
                  <Input placeholder="0999999999" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>البريد الإلكتروني</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>  

        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <FormLabel>الوزارة</FormLabel>
            <MinistriesSelect
              value={ministryName}
              setMinistry={(name, id) => {
                setMinistryId(id);
                setConcernedPartyId(null); // إعادة التهيئة عند تغيير الوزارة
              }}
            />
          </div>

          {ministryId !== null && (
            <div className="flex flex-col gap-2">
              <FormLabel>الجهة المعنية</FormLabel>
              <ConcernedPartySelect
                key={ministryId}
                ministryId={ministryId}
                value={concernedPartyId?.toString()} // 🟢 تمرير القيمة الحالية
                setConcernedParty={(name, id) => {
                  setConcernedPartyName(name);
                  setConcernedPartyId(id);
                  form.setValue("concernedPartyId", id);
                }}
              />

            </div>
          )}

        </div>

        <DialogPrimitive.Close>
          <Button type="submit" className="w-[60%] cursor-pointer">
            <h3>تأكيد التعديل</h3>
            <ChevronLeft />
          </Button>
        </DialogPrimitive.Close>
      </form>
    </Form>
  );
}
