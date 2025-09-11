import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import GovernorateSelect from "@/components/GovernorateSelect";
import MinistriesSelect from "@/components/MinistriesSelect";
import ConcernedPartySelect from "@/components/ConcernedPartySelect";

import {
  useAllMinistries,
  useAllParties,
  useGovById,
  useUpdateGovInfo,
} from "@/hooks/use-gov";
import { useGetMyUser, useUpdateUserBasicInfo } from "@/hooks/use-user";
import { useAddress, useCities } from "@/hooks/use-Address";
import { PhoneInput } from "@/components/PhoneInput";

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  // governorate: z.string(),
  email: z.string().email(),
  countryCode: z.string().min(1, { message: "اختر رمز الدولة" }),
  phone: z.string().min(1, { message: "أدخل رقم الهاتف" }).regex(/^[0-9]+$/, { message: "أرقام فقط" }),
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
  const isConcernedParty = !!currentUser?.parentGovId;

  const { data: address } = useAddress(currentUser?.addressId);
  const { data: cities } = useCities();
  const { data: parties } = useAllParties();
  const { data: ministries } = useAllMinistries();

  const { updateUserBasicInfo } = useUpdateUserBasicInfo();
  const { mutateAsync: updateGovInfo } = useUpdateGovInfo();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "",
      phone: "",
      concernedPartyId: 0,
    }
  });

  useEffect(() => {
    if (!currentUser || !cities || !ministries || !parties || hasUpdated) return;

    const matchedGovernorate = cities.find(
      (gov) => gov.arabic === (currentUser.lastName || address?.city)
    );

    let countryCode = ""
    let phone = currentUser.phone || ""

    if (phone.startsWith("+")) {
      const match = phone.match(/^(\+\d{1,4})(\d+)$/)
      if (match) {
        countryCode = match[1]
        phone = match[2]
      }
    }

    form.reset({
      firstName: currentUser.firstName || currentUser.name || "",
      lastName: currentUser.lastName || currentUser.name || "",
      // governorate: matchedGovernorate?.value || "",
      email: currentUser.email || "",
      countryCode,
      phone,
      concernedPartyId: currentUser.govId || 0,
    });

    if (isConcernedParty) {
      const ministry = ministries.find((m) => m.id === currentUser.parentGovId);
      if (ministry) {
        setMinistryId(ministry.id);
        setMinistryName(ministry.name);
      }
    } else if (currentUser.govId) {
      const party = parties.find((p) => p.id === currentUser.govId);
      const ministry = ministries.find((m) => m.id === party?.parentGovId);
      if (party && ministry) {
        setMinistryId(ministry.id);
        setMinistryName(ministry.name);
        setConcernedPartyId(party.id);
        setConcernedPartyName(party.parentGovName);
      }
    }
  }, [currentUser, parties, ministries, cities, address, form, hasUpdated]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const fullPhone = `${values.countryCode}${values.phone}`
    
    const selectedCity = cities?.find((c) => c.value === values.governorate);
    const arabicCity = selectedCity?.arabic || "";

    if (!currentUser) return;

    if (isMinistry) {
      await updateGovInfo({
        id: currentUser.id,
        name: values.firstName,
        email: values.email,
        phone: fullPhone,
      });
    } else if (isConcernedParty) {
      await updateGovInfo({
        id: currentUser.id,
        name: values.firstName,
        email: values.email,
        phone: fullPhone,
        parentGovId: ministryId ?? currentUser.parentGovId,
      });
    } else {
      if (!concernedPartyId) {
        alert("حدث خطأ في تحديد الجهة المعنية");
        return;
      }

      await updateUserBasicInfo({
        id: currentUser.id,
        firstName: values.firstName,
        lastName: values.lastName,
        // lastName: arabicCity,
        phone: fullPhone,
        email: values.email,
        govId: concernedPartyId,
      });
    }

    setHasUpdated(true);
    sessionStorage.setItem("showToastEdit", "تم تعديل البيانات بنجاح");
    window.location.reload();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-10 py-10" dir="rtl">
        <div className="flex flex-col gap-5">
          <FormField name="firstName" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم الأول</FormLabel>
              <FormControl><Input placeholder="الاسم" {...field} /></FormControl>
            </FormItem>
          )} />

          {/* {!isMinistry && !isConcernedParty && (
            <FormField name="governorate" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>المحافظة</FormLabel>
                <GovernorateSelect value={field.value} onChange={field.onChange} />
              </FormItem>
            )} />
          )} */}

          {!isMinistry && !isConcernedParty && (
            <FormField name="lastName" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>الكنية</FormLabel>
              <FormControl><Input placeholder="الكنية" {...field} /></FormControl>
              </FormItem>
            )} />
          )}

          {/* <FormField name="phoneNumber" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>رقم الهاتف</FormLabel>
              <FormControl><Input placeholder="0999999999" {...field} /></FormControl>
            </FormItem>
          )} /> */}
          <FormField
            control={form.control}
            name="phone"
            render={() => (
              <PhoneInput />
            )}
          />


          {/* <FormField name="email" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl><Input placeholder="email@example.com" {...field} /></FormControl>
            </FormItem>
          )} /> */}
        </div>

        {/* {!isMinistry && (
          <div className="grid grid-cols-2 gap-5">
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

            {!isConcernedParty && ministryId !== null && (
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
        )} */}

        <Button type="submit" className="w-[60%] cursor-pointer">
          <h3>تأكيد التعديل</h3>
          <ChevronLeft />
        </Button>
      </form>
    </Form>
  );
}