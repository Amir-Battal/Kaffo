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
import { ChevronLeft } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
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

console.log(currentUser, party, ministry);

  // تحديث القيم بعد توفر البيانات
  useEffect(() => {
    if (currentUser) {
      form.reset({
        firstName: currentUser.firstName || "",
        governorate: currentUser.lastName || "",
        phoneNumber: currentUser.phone || "",
        email: currentUser.email || "",
        ministry: ministry?.name || "", // استخدم optional chaining
        concernedParty: party?.name || "",
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
        <Link target="_blank" to="http://localhost:9098/realms/kafu-realm/account/account-security/signing-in" className="flex flex-row justify-around cursor-pointer w-[40%] text-white bg-black p-2  rounded-[10px] hover:bg-gray-800">
          <h3>تغيير كلمة المرور</h3>
          <ChevronLeft />
        </Link>
      </form>
    </Form>
  );
}
