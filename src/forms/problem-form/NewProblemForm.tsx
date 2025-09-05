import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Check, Plus } from "lucide-react"
import ProblemCategorySelect from "@/components/ProblemCategorySelect"
import GovernorateSelect from "@/components/GovernorateSelect"
import MapPicker from "@/components/MapPicker"
import { MultiImageUploader } from "./MultiImageUploader"

import { useCreateProblem, useUpdateProblem } from "@/hooks/use-problem"
import { useCreateAddress } from "@/hooks/use-Address"
import { usePresignedUpload } from "@/hooks/use-problem-photo"
import { toast } from "sonner"
import MinistriesSelect from "@/components/MinistriesSelect"
import keycloak from "@/lib/keycloak"
import { useGetMyUser } from "@/hooks/use-user"
import { useMinistryById } from "@/hooks/use-gov"


const formSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  address: z.string().min(1, "العنوان التفصيلي مطلوب"),
  description: z.string().min(1, "الوصف مطلوب"),
  categoryId: z.number().min(1, "صنف الشكوى مطلوب"),
  governorate: z.string().min(1, "المحافظة مطلوبة"),
  lat: z.number(),
  lng: z.number(),
  images: z.array(z.instanceof(File)).optional(),
})


export function NewProblemForm() {

  const roles = keycloak.tokenParsed?.resource_access?.["react-client"].roles || []

  const { currentUser } = useGetMyUser();
  const { data: gov } = useMinistryById(currentUser?.govId);
  const { data: ministry } = useMinistryById(gov?.parentGovId);
  

  const { createProblem, isLoading } = useCreateProblem()
  const { updateProblem } = useUpdateProblem()
  const { mutateAsync: createAddress } = useCreateAddress()
  const { getPresignedUrls, uploadFileToS3 } = usePresignedUpload()

  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: 36.2021,
    lng: 37.1343,
  })

  const [selectedImages, setSelectedImages] = useState<File[]>([])

  const [ministryId, setMinistryId] = useState<number | null>(null);

  // if(roles.includes("ROLE_GOV")){
  //   setMinistryId(ministry?.id)
  // }

  useEffect(() => {
    if (ministry) {
      setMinistryId(ministry.id)
    }
  }, [ministry])

  

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      address: "",
      description: "",
      categoryId: 0,
      governorate: "",
      lat: 0,
      lng: 0,
    },
  })

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng })
    form.setValue("lat", lat)
    form.setValue("lng", lng)
  }

  const requestUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleLocationSelect(pos.coords.latitude, pos.coords.longitude)
        },
        (err) => {
          console.warn("الموقع غير متاح أو تم رفض الإذن:", err.message)
          alert("لم يتم منح إذن الموقع. سيتم عرض الموقع الافتراضي.")
        }
      )
    } else {
      alert("المتصفح لا يدعم ميزة الموقع الجغرافي.")
    }
  }


  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // 1. إنشاء العنوان أولًا
      const newAddress = await createAddress({
        city: data.governorate,
        description: data.address,
        latitude: data.lat,
        longitude: data.lng,
      });

      if (!newAddress?.id) {
        toast.error("فشل في إنشاء العنوان");
        return;
      }

      // 2. إنشاء الشكوى بدون صور
      const newProblem = await createProblem({
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        addressId: newAddress.id,
        isReal: true,
        forContribution: false,
        forDonation: false,
        createdDate: new Date().toISOString(),
        photoUrls: [],
      });

      if (!newProblem?.id) {
        toast.error("فشل في إنشاء الشكوى");
        return;
      }

      // 3. رفع الصور إن وجدت
      if (selectedImages.length > 0) {
        const presignedData = await getPresignedUrls(
          newProblem.id,
          selectedImages.length,
          selectedImages[0].type
        );

        await Promise.all(
          selectedImages.map((file, i) =>
            uploadFileToS3(presignedData[i].presignedUrl, file)
          )
        );

        const photoUrls = presignedData.map((item) => item.s3Key);

        // تحديث الشكوى بالصور
        await updateProblem({
          id: newProblem.id,
          data: {
            title: data.title,
            description: data.description,
            categoryId: data.categoryId,
            addressId: newAddress.id,
            isReal: true,
            forContribution: false,
            forDonation: false,
            createdDate: newProblem.createdDate,
            photoUrls,
          },
        });
      } else {
        // ✅ إعلام المستخدم بعدم وجود صور
        toast.warning("تم إنشاء الشكوى ولكن لم يتم إرفاق صور");
      }

      sessionStorage.setItem("showToastNewProblem", "تم إنشاء الشكوى بنجاح");
      window.location.replace(`http://localhost:5173/problems/${newProblem.id}`);
    } catch (err) {
      toast.error("فشل في إنشاء الشكوى");
      console.error(err);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="px-5 gap-2 m-0" dir="rtl">
        <div className="w-full grid grid-cols-1 gap-10">
          <div className="flex flex-col gap-7">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel className="font-semibold">الشكوى</FormLabel>
                  <FormControl>
                    <Input placeholder="رصيف مكسور" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel>المزيد من التفاصيل</FormLabel>
                  <FormControl>
                    <Input placeholder="رصيف مكسور في مكان ما" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {!roles.includes("ROLE_GOV") && (
              <div className="flex flex-col gap-2">
                <h1>الوزارة</h1>
                <MinistriesSelect setMinistry={(name, id) => setMinistryId(id)} />
              </div>
            )}


            <FormField

              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel className="font-semibold">صنف الشكوى</FormLabel>
                  <FormControl>
                    <ProblemCategorySelect
                      value={field.value}
                      onChange={field.onChange}
                      ministry={ministryId}
                    />

                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="governorate"
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel className="font-semibold">المحافظة</FormLabel>
                  <FormControl>
                    <GovernorateSelect {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel className="font-semibold">عنوان الشكوى</FormLabel>
                  <FormControl>
                    <Input placeholder="حلب، العزيزية" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
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

          <div className="flex flex-row-reverse justify-between gap-5">
            <div className="w-full flex flex-col gap-2">
              <h3>الموقع على الخريطة</h3>
              <Button type="button" variant="outline" onClick={requestUserLocation}>
                📍 استخدام موقعي الحالي
              </Button>
              <MapPicker
                key={`${location.lat}-${location.lng}`} 
                onLocationSelect={handleLocationSelect}
                isNew={true}
                lat={location.lat}
                lng={location.lng}
                isEdit={false}
              />
              <p>
                📍 الموقع الحالي: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </p>
              <h3 className="text-sm">قم بالضغط على الموقع على الخريطة</h3>
            </div>
          </div>

          <MultiImageUploader onFilesSelected={setSelectedImages} />
        </div>

        {/* <DialogPrimitive.Close> */}
          <Button type="submit" className="cursor-pointer mt-5" disabled={isLoading}>
            {isLoading ? "جاري الإرسال..." : (
              <>
                <h3>رفع الشكوى</h3>
                <Plus />
              </>
            )}
          </Button>
        {/* </DialogPrimitive.Close> */}
      </form>
    </Form>
  )
}
