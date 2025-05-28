import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAllMinistries, useAllParties } from "@/hooks/use-gov";
import { useGetMyUser } from "@/hooks/use-user";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  firstName: z.string(),
  governorate: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  ministry: z.string(),
  concernedParty: z.string(),
});

export function MainGovProfileForm() {
  const { currentUser } = useGetMyUser();
  const { data: parties } = useAllParties();
  const { data: ministries } = useAllMinistries();

  const party = useMemo(() => {
    return parties?.find((p) => p.id === currentUser?.govId);
  }, [parties, currentUser]);

  const ministry = useMemo(() => {
    if (!party) return undefined;
    return ministries?.find((m) => m.id === party.parentGovId);
  }, [ministries, party]);

  
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      firstName: "",
      governorate: "",
      phoneNumber: "",
      email: "",
      ministry: "",
      concernedParty: "",
    },
  });

  // تحديث القيم بعد توفر البيانات
  useEffect(() => {
    if (currentUser && party && ministry) {
      form.reset({
        firstName: currentUser.firstName || "",
        governorate: currentUser.lastName || "",
        phoneNumber: currentUser.phone || "",
        email: currentUser.email || "",
        ministry: ministry.name || "",
        concernedParty: party.name || "",
      });
    }
  }, [currentUser, party, ministry, form]);

  return (
    <Form {...form}>
      <form className="flex flex-col gap-10 py-10" dir="rtl">
        <div className="grid grid-cols-2 gap-12">
          {["firstName", "governorate", "phoneNumber", "email", "ministry", "concernedParty"].map((fieldName, index) => (
            <FormField
              key={fieldName}
              name={fieldName as keyof z.infer<typeof formSchema>}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {{
                      firstName: "اسم الجهة",
                      governorate: "المحافظة",
                      phoneNumber: "رقم الهاتف",
                      email: "البريد الإلكتروني",
                      ministry: "الوزارة",
                      concernedParty: "الجهة المعنية",
                    }[fieldName]}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>
      </form>
    </Form>
  );
}
