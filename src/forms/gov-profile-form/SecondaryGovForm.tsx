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
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Check, Edit, Ban } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useGovUserInfo, useUpdateGovUserInfo } from "@/hooks/use-user"

const formSchema = z.object({
  address: z.string().min(1, "العنوان مطلوب"),
  about: z.string().min(1, "الوصف مطلوب"),
})

export function SecondaryGovForm({ userId }: { userId: string }) {
  const { data: user, isLoading, isError } = useGovUserInfo(userId)
  const { updateGovUserInfo } = useUpdateGovUserInfo()

  const [editable, setEditable] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      about: "",
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        address: user.address || "",
        about: user.description || "",
      })
    }
  }, [user, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateGovUserInfo(
      {
        id: userId,
        address: values.address,
        description: values.about,
      },
      {
        onSuccess: () => {
          sessionStorage.setItem("showToast", "تم تعديل البيانات الثانوية بنجاح")
          setEditable(false)
          window.location.reload()
        },
        onError: (err) => {
          console.error("فشل التحديث:", err)
          toast("حدث خطأ أثناء التحديث", {
            style: {
              background: '#cc1100',
              color: '#fff',
              direction: 'rtl',
              border: 'none',
            },
            icon: <Ban />,
            closeButton: true
          })
        }
      }
    )
  }

  const handleEdit = () => {
    if (!user?.phone || user.phone.trim() === "") {
      toast("يرجى كتابة رقم الهاتف أولاً قبل تعديل البيانات الثانوية", {
        style: {
          background: '#cc1100',
          color: '#fff',
          direction: 'rtl',
          border: 'none',
        },
        icon: <Ban />,
        closeButton: true
      })
      return
    }
    setEditable(true)
  }

  if (isLoading) return <div>جاري تحميل بيانات المستخدم...</div>
  if (isError) return <div>حدث خطأ أثناء جلب البيانات.</div>

  return (
    <Form {...form}>
      {editable ? (
        <form onSubmit={form.handleSubmit(onSubmit)} dir="rtl" className="w-full space-y-6">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>العنوان</FormLabel>
                <FormControl>
                  <Input placeholder="حلب، العزيزية" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>وصف عنك</FormLabel>
                <FormControl>
                  <Textarea placeholder="قم بكتابة وصف عنك" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-[40%] flex justify-around h-[50px] text-white bg-black hover:bg-gray-800 rounded-[10px]">
            <h3>تأكيد التعديل</h3>
            <Check />
          </Button>
        </form>
      ) : (
        <div dir="rtl" className="w-full space-y-6">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>العنوان</FormLabel>
                <FormControl>
                  <Input disabled className="text-gray-400" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>وصف عنك</FormLabel>
                <FormControl>
                  <Textarea disabled className="text-gray-400" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="button" onClick={handleEdit} className="w-[40%] flex justify-around h-[50px] text-white bg-black hover:bg-gray-800 rounded-[10px]">
            <h3>تعديل البيانات الثانوية</h3>
            <Edit />
          </Button>
        </div>
      )}
    </Form>
  )
}
