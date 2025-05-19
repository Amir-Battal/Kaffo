import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import * as DialogPrimitive from "@radix-ui/react-dialog"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import ProblemCategorySelect from "@/components/ProblemCategorySelect"
import GovernorateSelect from "@/components/GovernorateSelect"

import { useState } from "react"
import MapPicker from "@/components/MapPicker"
import { useCreateProblem } from "@/hooks/use-problem"
import { toast } from "sonner"
import { useCreateAddress } from "@/hooks/use-Address"
import { useCreateCategory } from "@/hooks/use-category"
import { MultiImageUploader } from "./MultiImageUploader"
import { usePresignedUpload } from "@/hooks/use-problem-photo"
// import FileUploader from "@/components/FileUploader" // يمكن تفعيله لاحقًا

const formSchema = z.object({
  title: z.string(),
  address: z.string(),
  description: z.string(),
  categoryId: z.number(),
  governorate: z.string(),
  lat: z.number(),
  lng: z.number(),
  images: z.array(z.instanceof(File)).optional(),
});



interface problemData {
  title: string;
  address: string;
  details: string;
  categoryId: number;
  governorate: string;
  lat: number;
  lng: number;
}

export function NewProblemForm() {

  const { createProblem, isLoading } = useCreateProblem();

  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: 36.2021,
    lng: 37.1343,
  })
  const [governorate, setGovernorate] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [selectedImages, setSelectedImages] = useState<File[]>([])


  const { mutateAsync: createAddress } = useCreateAddress();
  const { mutateAsync: createCategory } = useCreateCategory();

  const { getPresignedUrls, uploadFileToS3 } = usePresignedUpload();

  

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng })
  }
  

  const requestUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          form.setValue('lat', position.coords.latitude);
          form.setValue('lng', position.coords.longitude);
        },
        (error) => {
          console.warn("الموقع غير متاح أو تم رفض الإذن:", error.message)
          alert("لم يتم منح إذن الموقع. سيتم عرض الموقع الافتراضي.")
        }
      )
    } else {
      alert("المتصفح لا يدعم ميزة الموقع الجغرافي.")
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      address: '',
      description: '',
      categoryId: 0,
      governorate: '',
      lat: 0,
      lng: 0,
    },
  })

  // NewProblemForm.tsx (المهم فقط الدالة onSubmit و استدعاءات الصور)

const onSubmit = async (data: z.infer<typeof formSchema>) => {
  try {
    // 1. إنشاء/إحضار التصنيف
    let catId = data.categoryId;
    if (!catId && data.categoryName) {
      const newCat = await createCategory({
        name: data.categoryName,
        govId: 1, // عدل حسب الحاجة
      });
      catId = newCat.id;
    }

    // 2. إنشاء العنوان
    const newAddress = await createAddress({
      city: data.governorate,
      description: data.address,
      latitude: data.lat,
      longitude: data.lng,
    });

    // 3. إنشاء المشكلة بدون روابط الصور أولاً
    const newProblem = await createProblem({
      title: data.title,
      description: data.description,
      categoryId: catId,
      addressId: newAddress.id,
      isReal: true,
      forContribution: false,
      forDonation: false,
      createdDate: new Date().toISOString(),
      photoUrls: [], // فارغة الآن، نحدثها بعد رفع الصور
    });

    // 4. إذا هناك صور مرفوعة، نطلب روابط التحميل الموقعة
    let photoUrls: string[] = [];
    if (selectedImages.length > 0) {
      const presignedData = await getPresignedUrls(newProblem.id, selectedImages.length);
      await Promise.all(
        selectedImages.map((file, i) =>
          uploadFileToS3(presignedData[i].presignedUrl, file)
        )
      );
      // نجمع مفاتيح الصور للربط في الـ problem لاحقاً
      photoUrls = presignedData.map((item) => item.s3Key);

      // 5. تحديث المشكلة مع روابط الصور (PATCH أو PUT حسب الـ API)
      await createProblem({
        ...newProblem,
        photoUrls,
      });
    }

    toast.success("تم إنشاء المشكلة بنجاح!");
  } catch (err) {
    toast.error("فشل في إنشاء المشكلة");
    console.error(err);
  }
};

  
  
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="px-5 gap-2 m-0" dir="rtl">
        <div className="w-full grid grid-cols-1 gap-10">
          <div className="w-full h-full flex flex-col gap-7">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel className="font-semibold">المشكلة</FormLabel>
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

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel className="font-semibold">صنف المشكلة</FormLabel>
                  <FormControl>
                    <ProblemCategorySelect
                      value={field.value}
                      onChange={field.onChange}
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
                    <GovernorateSelect setGov={setGovernorate} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel className="font-semibold">عنوان المشكلة</FormLabel>
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
                key={`${location.lat}-${location.lng}`} // هذا يجبر React على إعادة بناء المكون عند تغير الموقع
                onLocationSelect={handleLocationSelect}
                isNew={true}
                lat={location.lat}
                lng={location.lng}
                isEdit={false}
              />
              <p>📍 الموقع الحالي: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>


              <h3 className="text-sm">قم بالضغط على الموقع على الخريطة</h3>
            </div>
          </div>

          <MultiImageUploader
            onFilesSelected={(files) => setSelectedImages(files)}
          />

        </div>

        <DialogPrimitive.Close>
          <Button type="submit" className="cursor-pointer mt-5" disabled={isLoading}>
            {isLoading ? "جاري الإرسال..." : (
              <>
                <h3>رفع المشكلة</h3>
                <Plus />
              </>
            )}
          </Button>
        </DialogPrimitive.Close>

      </form>
    </Form>
  )
}
