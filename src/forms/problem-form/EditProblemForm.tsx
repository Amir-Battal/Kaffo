import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import * as DialogPrimitive from "@radix-ui/react-dialog"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ProblemCategorySelect from "@/components/ProblemCategorySelect"
import GovernorateSelect from "@/components/GovernorateSelect"
import MapPicker from "@/components/MapPicker"
import { useGetProblemById, useUpdateProblem } from "@/hooks/use-problem"
import { useAddress, useUpdateAddress } from "@/hooks/use-Address"
import { useCategory, useUpdateCategory } from "@/hooks/use-category"
import ProblemImageManager from "./ProblemImageManager"
import MinistriesSelect from "@/components/MinistriesSelect"
import { useMinistryById } from "@/hooks/use-gov"
import { toast } from "sonner"
import { Check } from "lucide-react"
import keycloak from "@/lib/keycloak"
import { useGetMyUser } from "@/hooks/use-user"

const formSchema = z.object({
  title: z.string(),
  address: z.string(),
  details: z.string(),
  category: z.number(),
  governorate: z.string(),
  lat: z.number(),
  lng: z.number(),
})

type EditProp = {
  problemId: number
}

export function EditProblemForm({ problemId }: EditProp) {
  const roles = keycloak.tokenParsed?.resource_access?.["react-client"].roles || [];

  const { currentUser } = useGetMyUser();
  const { problem, isLoading: loadingProblem } = useGetProblemById(problemId)
  const { data: address, isLoading: loadingAddress } = useAddress(problem?.addressId ?? 0)
  const { data: speCategory, isLoading: loadingCategory } = useCategory(problem?.categoryId ?? 0)



  const { data: userGov } = useMinistryById(currentUser?.govId);
  const { data: userMinistry } = useMinistryById(userGov?.parentGovId);
  const { data: speMinistry } = useMinistryById(speCategory?.govId ?? null);


  const usedMinistry = roles.includes("ROLE_GOV") ? userMinistry : speMinistry;




  const [governorate, setGovernorate] = useState(null);
  const [category, setCategory] = useState();
  const [addressDescription, setAddressDescription] = useState(null);

  const { updateProblem, isLoading: isUpdating } = useUpdateProblem();
  const { mutateAsync: updateAddress } = useUpdateAddress();
  const { mutateAsync: updateCategory } = useUpdateCategory();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      address: "",
      details: "",
      category: speCategory?.id || 0, // Initial value based on category id
      governorate: "",
      lat: 0,
      lng: 0,
    },
  });

  const [location, setLocation] = useState({ lat: 0, lng: 0 })
  const [ministryName, setMinistryName] = useState("");
  const [ministryId, setMinistryId] = useState<number | null>(null);



  // عند تحميل البيانات
  useEffect(() => {
  if (address && problem && speCategory) {
    setLocation({ lat: address.latitude, lng: address.longitude });
    setGovernorate(address.city);
    setCategory(speCategory.name);
    setAddressDescription(address.description);

    form.reset({
      title: problem.title,
      details: problem.description,
      category: speCategory.id || 0, // تعيين الـ categoryId
      governorate: address.city,
      address: address.description,
      lat: address.latitude,
      lng: address.longitude,
    });
  }
}, [address, problem, speCategory]);


  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng })
    form.setValue("lat", lat)
    form.setValue("lng", lng)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!problem || !address || !speCategory) return;

    try {
      // تحديث العنوان
      await updateAddress({
        ...address,
        description: values.address,
        city: governorate,
        latitude: values.lat,
        longitude: values.lng,
      });

      // تحديث المشكلة
      await updateProblem({
        id: problem.id,
        data: {
          title: values.title,
          description: values.details,
          categoryId: values.category, // تأكد من أن categoryId هو ID التصنيف الجديد
          addressId: problem.addressId,
        },
      });
      window.location.reload();
    // toast.success("تم حفظ التعديلات");
    } catch (error) {
      console.error("فشل تحديث الشكوى:", error);
      toast.error("فشل تحديث المشكلة");
    } finally {
      sessionStorage.setItem("showToastProblemEdit", "تم تعديل الشكوى بنجاح");
    }
  };


  if (loadingProblem || loadingAddress || loadingCategory || !speMinistry) {
    return <p className="text-center">جارٍ تحميل البيانات...</p>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="px-5 gap-2 m-0" dir="rtl">
        <div className="w-full grid grid-cols-1 gap-10">
          <div className="w-full flex flex-col gap-7">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المشكلة</FormLabel>
                  <FormControl>
                    <Input placeholder="مثلاً: رصيف مكسور" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تفاصيل</FormLabel>
                  <FormControl>
                    <Input placeholder="وصف إضافي للمشكلة" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {!roles.includes("ROLE_GOV") && (
              <div className="flex flex-col gap-2">
                <h1>الوزارة</h1>
                <MinistriesSelect
                  edit
                  value={ministryName || speMinistry?.name}
                  setMinistry={(name, id) => {
                    setMinistryName(name);
                    setMinistryId(id);
                    form.setValue("category", 0); // تصفير التصنيف عند تغيير الوزارة
                    setCategory(""); // تصفير اسم التصنيف
                  }}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الصنف</FormLabel>
                  <FormControl>
                    <ProblemCategorySelect
                      value={field.value}
                      onChange={field.onChange} // Update category ID
                      category={category}
                      setCategory={setCategory}
                      ministry={ministryId ?? speMinistry?.id}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="governorate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المحافظة</FormLabel>
                  <FormControl>
                    <GovernorateSelect
                        value={field.value}
                        onChange={field.onChange} // ✅ تمرير الدالة المطلوبة
                        setGovernorate={setGovernorate} // ✅ ما زلت تحتفظ بهذه
                      />

                  </FormControl>
                </FormItem>
              )}
            />
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
            {/* إحداثيات مخفية */}
            <FormField
              control={form.control}
              name="lat"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="lng"
              render={({ field }) => <input type="hidden" {...field} />}
            />
          </div>

          <div className="flex flex-col gap-2">
            <h3>الموقع على الخريطة</h3>
            <MapPicker
              key={`${location.lat}-${location.lng}`} // يجبر إعادة البناء عند تغير الإحداثيات
              onLocationSelect={handleLocationSelect}
              lat={location.lat}
              lng={location.lng}
              // isEdit={true}
            />

            <p>📍 الموقع الحالي: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
          </div>
        </div>

        {problemId && (
          <ProblemImageManager problemId={problemId} />
        )}


        <DialogPrimitive.Close>
          <Button type="submit" className="cursor-pointer mt-5">
            {isUpdating ? "جارٍ الحفظ..." : "حفظ التعديلات"}
          </Button>
        </DialogPrimitive.Close>
      </form>
    </Form>
  )
}
