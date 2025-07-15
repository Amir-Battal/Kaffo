import ConcernedPartySelect from "@/components/ConcernedPartySelect";
import MinistriesSelect from "@/components/MinistriesSelect";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCities } from "@/hooks/use-Address";
import { useAllMinistries, useAllParties } from "@/hooks/use-gov";
import { useGetUserById, useUpdateUserBasicInfo } from "@/hooks/use-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  // governorate: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().min(10).max(10),
  concernedPartyId: z.number().optional(),
});

const EditMainEmployeeProfileForm = () => {
  const { userId } = useParams();
  const [hasUpdated, setHasUpdated] = useState(false);

  const [ministryId, setMinistryId] = useState<number | null>(null);
  const [concernedPartyId, setConcernedPartyId] = useState<number | null>(null);
  const [ministryName, setMinistryName] = useState("");
  const [concernedPartyName, setConcernedPartyName] = useState("");

  const { data: user } = useGetUserById(Number(userId));
  const { data: cities } = useCities();
  const { data: parties } = useAllParties();
  const { data: ministries } = useAllMinistries();

  const { updateUserBasicInfo } = useUpdateUserBasicInfo();

  console.log(user);

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        firstName: "",
        lastName: "",
        // governorate: "",
        email: "",
        phoneNumber: "",
        concernedPartyId: 0,
      },
    });


    useEffect(() => {
      if (!user || !cities || !ministries || !parties || hasUpdated) return;
  
      form.reset({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        // governorate: matchedGovernorate?.value || "",
        email: user?.email || "",
        phoneNumber: user?.phone || "",
        concernedPartyId: user?.govId || 0,
      });
  
      if (user?.govId) {
        const party = parties.find((p) => p.id === user.govId);
        const ministry = ministries.find((m) => m.id === party?.parentGovId);
        if (party && ministry) {
          setMinistryId(ministry.id);
          setMinistryName(ministry.name);
          setConcernedPartyId(party.id);
          setConcernedPartyName(party.parentGovName);
        }
      }
    }, [user, parties, ministries, cities, form, hasUpdated]);


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
  
        await updateUserBasicInfo({
          id: user.id,
          firstName: values.firstName,
          lastName: values.lastName,
          // lastName: arabicCity,
          phone: values.phoneNumber,
          email: values.email,
          govId: concernedPartyId,
        });
  
      setHasUpdated(true);
      sessionStorage.setItem("showToastEdit", "تم تعديل البيانات بنجاح");
      window.location.reload();
    };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-10 py-10" dir="rtl">
        <FormField name="firstName" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>الاسم الأول</FormLabel>
            <FormControl><Input placeholder="الاسم" {...field} /></FormControl>
          </FormItem>
        )} />
        <FormField name="lastName" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>الكنية</FormLabel>
          <FormControl><Input placeholder="الكنية" {...field} /></FormControl>
          </FormItem>
        )} />
        <FormField name="phoneNumber" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>رقم الهاتف</FormLabel>
            <FormControl><Input placeholder="0999999999" {...field} /></FormControl>
          </FormItem>
        )} />
        <FormField name="email" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>البريد الإلكتروني</FormLabel>
            <FormControl><Input placeholder="email@example.com" {...field} /></FormControl>
          </FormItem>
        )} />

        <div className="flex flex-col gap-2">
          <FormLabel>الوزارة</FormLabel>
          <MinistriesSelect
            value={ministryName && ministryName !== "" ? ministryName : undefined}
            setMinistry={(name, id) => {
              setMinistryId(id);
              setConcernedPartyId(null);
              setMinistryName(name ?? "");
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

        <Button type="submit" className="w-[60%] cursor-pointer">
          <h3>تأكيد التعديل</h3>
          <ChevronLeft />
        </Button>
      </form>
    </Form>
  );
};

export default EditMainEmployeeProfileForm;
