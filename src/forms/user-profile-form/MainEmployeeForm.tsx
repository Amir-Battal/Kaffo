import { useAddress, useCities } from "@/hooks/use-Address";
import { useAllMinistries, useAllParties } from "@/hooks/use-gov";
import { useGetUserById } from "@/hooks/use-user";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  // governorate: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  ministry: z.string(),
  concernedParty: z.string(),
});

const MainEmployeeForm = () => {

  const { userId } = useParams();

  const { data: user } = useGetUserById(Number(userId));

  const { data: parties } = useAllParties();
  const { data: ministries } = useAllMinistries();

  // const { data: address } = useAddress(user?.addressId);
  // const { data: cities } = useCities();

  // const cityArabicName = cities?.find(c => c.value === address?.city)?.arabic ?? address?.city;

  // const govMinistry = parties?.find((p) => p.id === user?.govId);

  const party = useMemo(() => {
    return parties?.find((p) => p.id === user?.govId);
  }, [parties, user]);

  const ministry = useMemo(() => {
    if (!party) return undefined;
    return ministries?.find((m) => m.id === party.parentGovId);
  }, [ministries, party]);


  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      ministry: "",
      concernedParty: "",
    },
  });

  useEffect(() => {
    if(user){
      if(user.govId){
        form.reset({
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          // governorate: user?.lastName || "",
          phoneNumber: user?.phone || "",
          email: user?.email || "",
          ministry: ministry?.name || "", // استخدم optional chaining
          concernedParty: party?.name || "",
        });
      }
    }
  }, [user, party, ministry, form]);  


  const userItems = ["firstName", "lastName", "phoneNumber", "email", "ministry", "concernedParty"]


  return (
    <Form {...form}>
      <form className="flex flex-col gap-10 py-10" dir="rtl">
        <div>
            <div className="grid grid-cols-2 gap-12">
              {userItems.map((fieldName, index) => (
                <FormField
                  key={fieldName}
                  name={fieldName as keyof z.infer<typeof formSchema>}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {{
                          firstName: "الاسم",
                          lastName: "الكنية",
                          // governorate: "المحافظة",
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
        </div>
      </form>
    </Form>

  );
};

export default MainEmployeeForm;
