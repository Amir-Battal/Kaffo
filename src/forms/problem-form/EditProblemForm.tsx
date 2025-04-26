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
import FileUploader from "@/components/FileUploader"



const formSchema = z.object({
  title: z.string(),
  details: z.string(),
  category: z.string(),
  governorate: z.string(),
  lat: z.number() ,
  lng: z.number()
  // coordinate: z.object({
  //   lat: z.number(), lng: z.number()
  // }),
})

interface problemData {
  title: string;
  details: string;
  category: string;
  governorate: string;
  lat: number;
  lng: number;
}

const problem: problemData[] = [
  {
    title: 'حلب العزيزية',
    details: 'رصيف مكسور في مكان ما',
    category: 'أرصفة',
    governorate: 'حلب',
    lat: 36.208465, 
    lng: 37.1555411,
  },
]


export function EditProblemForm() {

  const [location, setLocation] = useState<{ lat: number; lng: number }>({lat: problem[0].lat, lng: problem[0].lng});
  const [governorate, setGovernorate] = useState(problem[0].governorate);
  const [category, setCategory] = useState(problem[0].category);

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    // console.log("الموقع المحدد:", lat, lng);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: problem[0].title,
      details: problem[0].details,
      category: problem[0].category,
      governorate: problem[0].governorate,
      lat: problem[0].lat,
      lng: problem[0].lng,
    },
  })
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    values.governorate = governorate;
    values.category = category;
    values.lat = location?.lat
    values.lng = location?.lng

    if (selectedFiles.length === 0) {
      // alert("الرجاء اختيار صورة أولاً.");
      console.log("الرجاء اختيار صورة أولاً.");
      return;
    }
    uploadToServer(selectedFiles);
    console.log(selectedFiles);

    console.log(location);
    console.log(values)
  }

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const uploadToServer = async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const response = await fetch('http://localhost:4000/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    console.log('تم الرفع:', data.fileNames);
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
                  <FormLabel className="font-semibold">عنوان المشكلة</FormLabel>
                  <FormControl>
                    <Input placeholder="حلب، العزيزية" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details"
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
              name="category"
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel className="font-semibold">صنف المشكلة</FormLabel>
                  <FormControl>
                    {/* <Input placeholder="0999 999 999" {...field} /> */}
                    <ProblemCategorySelect setCategory={setCategory} {...field} />
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
          </div>

          <div className="flex flex-row-reverse justify-between gap-5">
            <div className=" w-full flex flex-col gap-2">
              <h3>الموقع على الخريطة</h3>
              <MapPicker onLocationSelect={handleLocationSelect} isNew={false} lat={problem[0].lat} lng={problem[0].lng} isEdit={true} />
              <h3 className="text-sm">قم بالضغط على الموقع على الخريطة</h3>
            </div>
            <div className="w-full flex flex-col gap-2">
              <h3>صور المشكلة</h3>
              <FileUploader onFilesChange={setSelectedFiles} /> 
              <h4>أسماء الملفات:</h4>
              <ul>
                {selectedFiles.map((file: File) => <li key={file.name}>{file.name}</li>)}
              </ul>
            </div>
          </div>
        </div>
        
        <DialogPrimitive.Close>
          <Button type="submit" className="cursor-pointer">
            <h3>رفع المشكلة</h3>
            <Plus />
          </Button>
        </DialogPrimitive.Close>
      </form>
    </Form>
  )
}
