// components/ProblemImageManager.tsx
import { useGetProblemPhotos, usePresignedUpload, useDeleteProblemPhoto } from "@/hooks/use-problem-photo";
import { useState } from "react";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "react-query";

interface Props {
  problemId: number;
}

export default function ProblemImageManager({ problemId }: Props) {
  const { photos, isLoading } = useGetProblemPhotos(problemId);
  const { getPresignedUrls, uploadFileToS3 } = usePresignedUpload();
  const { mutate: deletePhoto, isLoading: isDeleting } = useDeleteProblemPhoto();

  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient(); // أضف هذا أعلى المكون إن لم يكن موجودًا

  const handleDelete = (photoId: number) => {
    if (confirm("هل أنت متأكد من حذف الصورة؟")) {
      deletePhoto({ problemId, photoId });
    }
  };


const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  try {
    setUploading(true);
    const presigned = await getPresignedUrls(problemId, files.length);

    await Promise.all(
      Array.from(files).map((file, i) =>
        uploadFileToS3(presigned[i].presignedUrl, file)
      )
    );

    toast.success("تم رفع الصور بنجاح!");

    // ✅ تحديث الصور مباشرة بعد الرفع
    queryClient.invalidateQueries(["problemPhotos", problemId]);
  } catch (err) {
    toast.error("فشل رفع الصور");
  } finally {
    setUploading(false);
  }
};


  return (
    <div className="flex flex-col gap-4 mt-6">
      <h3 className="text-lg font-bold">الصور الحالية</h3>
      {isLoading ? (
        <p>جاري التحميل...</p>
      ) : photos.length === 0 ? (
        <p>لا توجد صور مرفوعة بعد.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative border rounded-lg overflow-hidden">
              <img src={photo.s3Key} alt="صورة" className="w-full h-40 object-cover" />
              <button
                onClick={() => handleDelete(photo.id)}
                className="absolute top-2 left-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                disabled={isDeleting}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <label className="block font-medium mb-2">إضافة صور جديدة:</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
