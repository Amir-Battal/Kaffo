import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";

import FileUploader from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

import { toast } from "sonner";
import { useCreateProblemProgress, useGetProblemProgress } from "@/hooks/use-progress";
import { usePresignedUpload } from "@/hooks/use-problem-photo";
import { useUpdateSolutionStatus } from "@/hooks/use-Contribution";

const formSchema = z.object({
  comment: z.string().min(1, "الرجاء إضافة تعليق"),
  progress: z.number().min(0).max(100),
});

const ProblemProgress = ({ problemId, solutionId }: { problemId: number; solutionId: number }) => {
  const [value, setValue] = useState<number>(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [lastPercentage, setLastPercentage] = useState(0);

  const createProgress = useCreateProblemProgress(problemId);
  const { getPresignedUrls, uploadFileToS3 } = usePresignedUpload();
  const { data: lastProgress, isLoading: isProgressLoading } = useGetProblemProgress(problemId);
  const { mutate: updateSolutionStatus } = useUpdateSolutionStatus();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
      progress: 0,
    },
  });

  useEffect(() => {
    if (lastProgress) {
      setLastPercentage(lastProgress.percentage);
      setValue(lastProgress.percentage);
    }
  }, [lastProgress]);

const onSubmit = async (values: z.infer<typeof formSchema>) => {
  values.progress = value;

  try {
    let photoIds: number[] = [];

    // 1. أنشئ التقدم أولاً بدون صور واحصل على progressId
    const progress = await createProgress.mutateAsync({
      comment: values.comment,
      percentage: value,
      progressDate: new Date().toISOString(),
      problemId,
      solutionId,
      photoIds: [],
    });

    // 2. ارفع الصور باستخدام progress.id
    if (selectedFiles.length > 0) {
      const presigned = await Promise.all(
        selectedFiles.map((file) =>
          getPresignedUrls(problemId, 1, file.type || "application/octet-stream", progress.id).then(
            (urls) => urls[0]
          )
        )
      );

      for (let i = 0; i < selectedFiles.length; i++) {
        await uploadFileToS3(presigned[i].presignedUrl, selectedFiles[i]);
        photoIds.push(presigned[i].photoId);
      }

      // ⛔️ لا تعيد استدعاء createProgress مرة ثانية
      // ✅ الصور ستكون مربوطة تلقائيًا بالـ progress.id
    }

    if (value === 100) {
      updateSolutionStatus({
        problemId,
        solutionId,
        status: "RESOLVED",
      });
    }

    toast.success("تم إضافة التقدم بنجاح");
    form.reset();
    setValue(lastPercentage);
    setSelectedFiles([]);
  } catch (error) {
    toast.error("حدث خطأ أثناء إضافة التقدم");
    console.error(error);
  }
};




  return (
    <div className="flex flex-col gap-8">
      {lastProgress && !isProgressLoading && (
        <div className="bg-gray-100 p-4 rounded-xl border text-right">
          <h4 className="text-lg font-semibold mb-2">آخر تقدم مسجل</h4>
          <p><span className="font-medium">النسبة:</span> {lastProgress.percentage}%</p>
          <p><span className="font-medium">التعليق:</span> {lastProgress.comment}</p>
          <p><span className="font-medium">التاريخ:</span> {new Date(lastProgress.progressDate).toLocaleDateString()}</p>
        </div>
      )}

      {lastProgress?.percentage === 100 ? (
        <></>
      ) : (
        <div className="flex flex-col gap-6">
          <h3 className="text-xl font-semibold text-right">إضافة نسبة إنجاز جديدة</h3>

          <div className="flex flex-row-reverse items-center gap-3">
            <span className="text-lg">0</span>
            <Slider
              min={lastPercentage}
              max={100}
              defaultValue={[lastPercentage]}
              value={[value]}
              onValueChange={([newValue]) => {
                if (newValue >= lastPercentage) {
                  setValue(newValue);
                }
              }}
            />
            <span className="text-lg">100</span>
          </div>

          <p className="text-center text-[18px]">نسبة الإنجاز {value}%</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">إضافة تعليق</FormLabel>
                    <FormControl>
                      <Input placeholder="تعليق عن نسبة الإنجاز" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="w-full flex flex-col gap-2">
                <FormLabel className="font-semibold">صور الشكوى</FormLabel>
                <FileUploader onFilesChange={setSelectedFiles} />
                {selectedFiles.length > 0 && (
                  <ul className="list-disc pr-4 text-right text-sm text-gray-600">
                    {selectedFiles.map((file) => (
                      <li key={file.name}>{file.name}</li>
                    ))}
                  </ul>
                )}
              </div>

              <Button type="submit" className="w-1/2 self-center">
                <span>تأكيد</span>
                <Check className="ml-2" />
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default ProblemProgress;
