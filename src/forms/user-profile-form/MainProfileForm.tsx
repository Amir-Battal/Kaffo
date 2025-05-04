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
import { JSX, useEffect } from "react"

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

// interface personMainData {
//   firstName?: string;
//   lastName?: string;
//   phoneNumber: string;
//   email?: string;
// }



export function MainProfileForm({...props}): JSX.Element {

  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
    },
  });
  
  // تحديث القيم الافتراضية بعد الحصول على بيانات المستخدم
  useEffect(() => {
    if (props.user) {
      form.reset({
        firstName: props.user.firstName || "",
        lastName: props.user.lastName || "",
        phoneNumber: props.user.phone || "",
        email: props.user.email || "",
      });
    }
  }, [props.user, form]);
  
  if (props.isLoading) return <p>جاري التحميل...</p>;
  if (!props.user) return <p>لم يتم العثور على المستخدم</p>;


  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
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
              <FormControl dir="ltr" className="text-end">
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
