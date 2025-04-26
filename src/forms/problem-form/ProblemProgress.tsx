import FileUploader from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ProblemProgress = () => {

  const [value, setValue] = useState<number | any>()
  const handleChange = (values: number[]) => {
    setValue(values[0])
    // onChange?.(values[0])
  }
  


  function onSubmit(values: z.infer<typeof formSchema>) {
    values.progress = value;
    console.log(values)

    uploadToServer(selectedFiles);
    console.log(selectedFiles);
  }


  const formSchema = z.object({
    comment: z.string(),
    progress: z.number(),
  })

  const problemProgress = [
    {
      comment: 'تم إنجاز مرحلة التخطيط لحل المشكلة',
      progress: 50
    },
  ]

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: problemProgress[0].comment,
      progress: problemProgress[0].progress
    },
  })


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
    <div>
      <div>
        <div className="flex flex-col gap-5">
          <h3>نسبة إنجاز الحل</h3>
          <div className="w-full flex flex-col">
            <div className="flex flex-row-reverse gap-2">
              <h3 className="text-xl">0</h3>
              <Slider
                defaultValue={[0]}
                min={0}
                max={100}
                onValueChange={handleChange}
                // {...props}
              />
              <h3 className="text-xl">100</h3>
            </div>

            <p className="text-center text-[18px]">
              نسبة الإنجاز {value} %
            </p>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel className="font-semibold">إضافة تعليق</FormLabel>
                  <FormControl>
                    <Input placeholder="تعليق عن نسبة الإنجاز" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="w-full flex flex-col gap-2">
              <h3>صور المشكلة</h3>
              <FileUploader onFilesChange={setSelectedFiles} /> 
              <h4>أسماء الملفات:</h4>
              <ul>
                {selectedFiles.map((file: File) => <li key={file.name}>{file.name}</li>)}
              </ul>
            </div>

            <Button type="submit" className="w-[50%] cursor-pointer">
              <h3>تأكيد</h3>
              <Check />
            </Button>
          </form>
        </Form>
      </div>
      

    </div>
  );
};

export default ProblemProgress;