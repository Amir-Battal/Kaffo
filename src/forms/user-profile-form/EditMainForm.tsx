import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { JSX, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Check, ChevronLeft } from "lucide-react"
import { useUpdateUserBasicInfo } from "@/hooks/use-user"
import { toast } from "sonner"

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "يجب أن يحتوي الاسم الأول على حرفين على الأقل.",
  }),
  lastName: z.string().min(2, {
    message: "يجب أن تحتوي الكنية على حرفين على الأقل.",
  }),
  phone: z.string().min(1, {
    message: "رقم الهاتف مطلوب.",
  }),
  email: z.string(),
})

type EditMainFormProps = {
  user: any
  isLoading: boolean
  onSuccess?: () => void
}

export function EditMainForm({ user, isLoading, onSuccess }: EditMainFormProps): JSX.Element {
  const { updateUserBasicInfo } = useUpdateUserBasicInfo()

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
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        email: user.email || "",
      })
    }
  }, [user, form])

  if (isLoading) return <p>جاري التحميل...</p>
  if (!user) return <p>لم يتم العثور على المستخدم</p>

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
    await updateUserBasicInfo({
      id: user?.id,
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      email: values.email,
    });

    sessionStorage.setItem("showToast", "تم تعديل البيانات الأساسية بنجاح");
    onSuccess?.();
    window.location.reload();
  } catch (error) {
    toast.error("فشل التعديل");
    console.error("فشل التعديل", error);
  }
}


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full grid grid-cols-2 gap-6 pt-5"
        dir="rtl"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم الأول</FormLabel>
              <FormControl>
                <Input placeholder="أحمد" {...field} />
              </FormControl>
              <FormMessage />
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
              <FormMessage />
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
              <FormMessage />
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
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2 flex justify-center">
          <Button type="submit" className="w-[60%] cursor-pointer">
            <h3>تأكيد التعديل</h3>
            <ChevronLeft />
          </Button>
        </div>
      </form>
    </Form>
  )
}
