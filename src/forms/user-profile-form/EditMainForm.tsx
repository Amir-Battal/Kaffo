import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { JSX, useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ChevronLeft } from "lucide-react"
import { useUpdateUserBasicInfo } from "@/hooks/use-user"
// import { toast } from "sonner"

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  phone: z.string(),
  email: z.string(),
})

export function EditMainForm({...props}): JSX.Element {

  console.log(props.user);
  const { updateUserBasicInfo } = useUpdateUserBasicInfo();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    },
  })

  useEffect(() => {
    if (props.user) {
      form.reset({
        firstName: props.user.firstName || "",
        lastName: props.user.lastName || "",
        phone: props.user.phone || "",
        email: props.user.email || "",
      })
    }
  }, [props.user, form])

  if (props.isLoading) return <p>جاري التحميل...</p>
  if (!props.user) return <p>لم يتم العثور على المستخدم</p>


  function onSubmit(values: z.infer<typeof formSchema>) {
    // if (!currentUser?._id) {
    //   toast.error("لا يمكن تعديل المستخدم: المعرف غير موجود");
    //   return;
    // }
    
    updateUserBasicInfo({
      id: props.user?.id,
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      email: values.email,
    });

    // load page to render new data
    window.location.reload();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full grid grid-cols-2 gap-6 pt-5" dir="rtl">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم الأول</FormLabel>
              <FormControl>
                <Input placeholder="أحمد" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
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
          control={form.control}
          name="phone"
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
