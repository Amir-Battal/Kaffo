import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import GovernorateSelect from "@/components/GovernorateSelect"
import { useState } from "react"
import MinistriesSelect from "@/components/MinistriesSelect"
import ConcernedPartySelect from "@/components/ConcernedPartySelect"

const formSchema = z.object({
  name: z.string(),
  phoneNumber: z.string().min(10).max(10),
  email: z.string().min(10).max(20),
  ministry: z.string(),
  concernedParty: z.string(),
  governorate: z.string(),
})

interface govMainData {
  name: string;
  phoneNumber: string;
  email: string;
  ministry: string,
  concernedParty: string,
  governorate: string
}

const gov: govMainData[] = [
  {
    name: 'شركة كهرباء حلب',
    phoneNumber: '0999999999',
    email: 'email@example.com',
    ministry: 'وزارة الإدارة المحلية والبيئة',
    concernedParty: 'بلدية حلب',
    governorate: 'حلب'
  },
]

export function MainGovProfileForm() {

  const [governorate, setGovernorate] = useState(gov[0].governorate);
  const [ministry, setMinistry] = useState(gov[0].ministry);
  const [concernedParty, setConcernedParty] = useState(gov[0].concernedParty);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: gov[0].name,
      phoneNumber: gov[0].phoneNumber,
      email: gov[0].email,
      ministry: gov[0].ministry,
      concernedParty: gov[0].concernedParty,
      governorate: gov[0].governorate
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    values.governorate = governorate;
    values.ministry = ministry;
    values.concernedParty = concernedParty;
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-10 py-10" dir="rtl">
        <FormField
            disabled
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم</FormLabel>
                <FormControl>
                  <Input placeholder="شركة كهرباء حلب" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        <div className="grid grid-cols-2 gap-5">
          <FormField
              disabled
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
              disabled
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
            <FormField
              disabled
              control={form.control}
              name="ministry"
              render={({ field }) => (
                <FormItem className="mt-10">
                  <FormLabel>الوزارة</FormLabel>
                  <FormControl>
                    <MinistriesSelect setMinistry={setMinistry}  {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              disabled
              control={form.control}
              name="concernedParty"
              render={({ field }) => (
                <FormItem className="mt-10">
                  <FormLabel>الجهة المعنية</FormLabel>
                  <FormControl>
                    <ConcernedPartySelect setParty={setConcernedParty}  {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              disabled
              control={form.control}
              name="governorate"
              render={({ field }) => (
                <FormItem className="mt-10">
                  <FormLabel>المحافظة</FormLabel>
                  <FormControl>
                    <GovernorateSelect setGov={setGovernorate} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
        </div>

        <Link to="/changePassword" className="flex flex-row justify-around cursor-pointer w-[40%] text-white bg-black p-2  rounded-[10px] hover:bg-gray-800 mt-5">
          <h3>تغيير كلمة المرور</h3>
          <ChevronLeft />
        </Link>
      </form>
    </Form>
  )
}
