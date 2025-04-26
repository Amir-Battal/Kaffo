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
import { ChevronLeft } from "lucide-react"
import { useState } from "react"
import GovernorateSelect from "@/components/GovernorateSelect"
import ConcernedPartySelect from "@/components/ConcernedPartySelect"
import MinistriesSelect from "@/components/MinistriesSelect"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"


const formSchema = z.object({
  phoneNumber: z.string().min(10).max(10),
  email: z.string().min(10).max(20),
  ministry: z.string(),
  concernedParty: z.string(),
  governorate: z.string(),
})

interface govMainData {
  phoneNumber: string;
  email: string;
  ministry: string,
  concernedParty: string,
  governorate: string
}

const gov: govMainData[] = [
  {
    phoneNumber: '0999999999',
    email: 'email@example.com',
    ministry: 'وزارة الإدارة المحلية والبيئة',
    concernedParty: 'بلدية حلب',
    governorate: 'حلب'
  },
]


export function EditMainGovProfileForm() {

  const [governorate, setGovernorate] = useState(gov[0].governorate);
  const [ministry, setMinistry] = useState(gov[0].ministry);
  const [concernedParty, setConcernedParty] = useState(gov[0].concernedParty);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
        <div className="grid grid-cols-2 gap-5">
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
            <FormField
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
            <FormField
              control={form.control}
              name="concernedParty"
              render={({ field }) => (
                <FormItem className="mt-10">
                  <FormLabel>الجهة المعنية</FormLabel>
                  <FormControl>
                    <ConcernedPartySelect setParty={setConcernedParty} ministry={ministry} gov={governorate}  {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
        </div>

        <DialogPrimitive.Close>
          <Button type="submit" className="w-[60%] cursor-pointer">
            <h3>تأكيد التعديل</h3>
            <ChevronLeft />
          </Button>
        </DialogPrimitive.Close>
      </form>
    </Form>
  )
}
