import { useUploadUserPhoto } from "@/hooks/use-user";
import { useRef } from "react";

const UploadPhotoButton = ({ userId }: { userId: number }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const uploadPhoto = useUploadUserPhoto();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      // 1. احصل على رابط الرفع
      const { presignedUrl, accessUrl } = await uploadPhoto.mutateAsync(userId);

      // 2. ارفع الصورة مباشرة إلى S3
      await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
          "x-amz-acl": "public-read", // ✅ مهم جدًا للسماح بالعرض العلني
        },
        body: file,
      });


      console.log("✅ Photo uploaded successfully:", accessUrl);
      // يمكنك الآن حفظ accessUrl في قاعدة البيانات أو تحديث واجهة المستخدم
    } catch (err) {
      console.error("❌ Upload failed", err);
    }
  };

  return (
    <div>
      <button onClick={() => inputRef.current?.click()} className="bg-blue-600 px-4 py-2 text-white rounded">
        اختر صورة
      </button>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default UploadPhotoButton;
