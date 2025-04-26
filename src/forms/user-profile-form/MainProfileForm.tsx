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

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  phoneNumber: z.string().min(10).max(10),
  email: z.string().min(10).max(20),
})

interface personMainData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

const user: personMainData[] = [
  {
    firstName: 'أمير',
    lastName: 'بطال',
    phoneNumber: '0999999999',
    email: 'amir@example.com'
  },
]

export function MainProfileForm() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user[0].firstName,
      lastName: user[0].lastName,
      phoneNumber: user[0].phoneNumber,
      email: user[0].email,
    },
  })
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full grid grid-cols-2 gap-6 py-10" dir="rtl">
      <FormField
          disabled
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم الأول</FormLabel>
              <FormControl>
                <Input placeholder="أحمد" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />
        <FormField
          disabled
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الكنية</FormLabel>
              <FormControl>
                <Input placeholder="محمد" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          disabled
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رقم الهاتف</FormLabel>
              <FormControl>
                <Input placeholder="0999 999 999" {...field} />
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

        <Link to="/changePassword" className="flex flex-row justify-around cursor-pointer w-[60%] text-white bg-black p-2  rounded-[10px] hover:bg-gray-800">
          <h3>تغيير كلمة المرور</h3>
          <ChevronLeft />
        </Link>
      </form>
    </Form>
  )
}
