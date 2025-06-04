import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form, FormControl, FormField, FormItem, FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Check, Edit, Ban } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useGovUserInfo, useUpdateGovUserInfo, useUpdateUserBasicInfo } from "@/hooks/use-user"
import { useAddress, useCities, useCreateAddress } from "@/hooks/use-Address"

const formSchema = z.object({
  address: z.string().min(1, "العنوان مطلوب"),
  about: z.string().min(1, "الوصف مطلوب"),
})

export function SecondaryGovForm({ userId }: { userId: string }) {
  const { data: user, isLoading, isError } = useGovUserInfo(userId)
  const { updateUserBasicInfo } = useUpdateUserBasicInfo()
  const { mutateAsync: createAddress } = useCreateAddress()
  const { data: cities } = useCities()


  const { data: address } = useAddress(user?.addressId);

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
        address: address?.description || "",
        about: user.description || "",
      })
    }
  }, [user, address, form])

  // const extractCityFromLastName = (lastName: string) => {
  //   const parts = lastName?.trim()?.split(" ")
  //   return parts?.[1] || "غير محدد"
  // }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!user || !cities) return;


      const cityNameFromLastName = user.lastName

      const matchedCity = cities.find((c) => c.arabic === cityNameFromLastName)

      if (!matchedCity) {
        toast.error("لم يتم العثور على المدينة المطابقة في النظام.")
        return
      }


      const addressRes = await createAddress({
        city: matchedCity.value ,
        description: values.address,
        latitude: 0,
        longitude: 0,
      })

      updateUserBasicInfo(
        {
          id: userId,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          email: user.email,
          description: values.about,
          addressId: addressRes.id,
        },
        {
          onSuccess: () => {
            sessionStorage.setItem("showToastSecondaryEdit", "تم تعديل البيانات الثانوية بنجاح")
            setEditable(false)
            window.location.reload()
          },
          onError: (err) => {
            console.error("فشل التحديث:", err)
            toast("حدث خطأ أثناء التحديث", {
              style: { background: "#cc1100", color: "#fff", direction: "rtl", border: "none" },
              icon: <Ban />,
              closeButton: true,
            })
          },
        }
      )
    } catch (err) {
      console.error("خطأ أثناء إنشاء العنوان:", err)
      toast("حدث خطأ أثناء إنشاء العنوان", {
        style: { background: "#cc1100", color: "#fff", direction: "rtl", border: "none" },
        icon: <Ban />,
        closeButton: true,
      })
    }
  }

  const handleEdit = () => {
    if (!user?.phone || user.phone.trim() === "") {
      toast("يرجى إكمال البيانات الأساسية", {
        style: { background: "#cc1100", color: "#fff", gap: "20px", direction: "rtl", border: "none" },
        icon: <Ban />,
        closeButton: true,
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
                  <Textarea disabled {...field} />
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
