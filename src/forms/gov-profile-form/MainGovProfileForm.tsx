import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAddress, useCities } from "@/hooks/use-Address";
import { useAllMinistries, useAllParties, useGovById } from "@/hooks/use-gov";
import { useGetMyUser } from "@/hooks/use-user";
import { ChevronLeft } from "lucide-react";
import { JSX, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
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
  const { govId } = useParams();

  const { currentUser } = govId ? useGovById(Number(govId)) : useGetMyUser();

  console.log(currentUser);

  const { data: parties } = useAllParties();
  const { data: ministries } = useAllMinistries();
  
  const { data: address } = useAddress(currentUser?.addressId);
  const { data: cities } = useCities();

  const cityArabicName = cities?.find(c => c.value === address?.city)?.arabic ?? address?.city;

  const govMinistry = parties?.find((p) => p.id === currentUser?.parentGovId);


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

// console.log(currentUser, party, ministry);

  // تحديث القيم بعد توفر البيانات
  useEffect(() => {
    if (currentUser) {
      if(currentUser?.keycloakId){
        form.reset({
          firstName: currentUser.firstName || "",
          governorate: currentUser.lastName || "",
          phoneNumber: currentUser.phone || "",
          email: currentUser.email || "",
          ministry: ministry?.name || "", // استخدم optional chaining
          concernedParty: party?.name || "",
        });
      } else if(!currentUser?.parentGovId) {
        form.reset({
          firstName: currentUser.name || "",
          // governorate: cityArabicName || "",
          phoneNumber: currentUser.phone || "",
          email: currentUser.email || "",
          // ministry: currentUser?.name || "", // استخدم optional chaining
          // concernedParty: party?.name || "",
        });
      } else {
        form.reset({
          firstName: currentUser.name || "",
          // governorate: cityArabicName || "",
          phoneNumber: currentUser.phone || "",
          email: currentUser.email || "",
          ministry: govMinistry?.name || "", // استخدم optional chaining
        });
      }
    }
  }, [currentUser, address, party, ministry, form]);


  const userItems = ["firstName", "governorate", "phoneNumber", "email", "ministry", "concernedParty"]
  const concernedPartyItems = ["firstName", "phoneNumber", "email", "ministry"]
  const ministryItems = ["firstName", "phoneNumber", "email"]

  return (
    <Form {...form}>
      <form className="flex flex-col gap-10 py-10" dir="rtl">
        <div>
          {currentUser?.keycloakId ? (
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
          ) : (!currentUser?.parentGovId) ? (
            <div className="grid grid-cols-2 gap-12">
              {ministryItems.map((fieldName, index) => (
                <FormField
                  key={fieldName}
                  name={fieldName as keyof z.infer<typeof formSchema>}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {{
                          firstName: "اسم الجهة",
                          phoneNumber: "رقم الهاتف",
                          email: "البريد الإلكتروني",
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
          ) : (
            <div className="grid grid-cols-2 gap-12">
              {concernedPartyItems.map((fieldName, index) => (
                <FormField
                  key={fieldName}
                  name={fieldName as keyof z.infer<typeof formSchema>}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {{
                          firstName: "اسم الجهة",
                          phoneNumber: "رقم الهاتف",
                          email: "البريد الإلكتروني",
                          ministry: "الوزارة"
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
          )}
        </div>
        {currentUser?.keycloakId && (
          <Link target="_blank" to="http://localhost:9098/realms/kafu-realm/account/account-security/signing-in" className="flex flex-row justify-around cursor-pointer w-[40%] text-white bg-black p-2  rounded-[10px] hover:bg-gray-800">
            <h3>تغيير كلمة المرور</h3>
            <ChevronLeft />
          </Link>
        )}
      </form>
    </Form>
  );
}
