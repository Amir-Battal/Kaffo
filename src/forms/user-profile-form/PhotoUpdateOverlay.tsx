import { useUploadUserPhoto, useGetMyUser } from "@/hooks/use-user";
import { useRef } from "react";

const UploadPhotoButton = ({ userId }: { userId: number }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mutateAsync: uploadPhoto } = useUploadUserPhoto();
  const { refetch } = useGetMyUser();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const contentType = file.type;

    const urls = await uploadPhoto({ userId, contentType });

    // الآن نرفع الصورة فعليًا إلى S3
    await fetch(urls.presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
      body: file,
    });

    // نعيد جلب بيانات المستخدم حتى نحصل على photoUrl المحدث
    refetch();
  };

  return (
    <>
      <button onClick={() => inputRef.current?.click()} className="bg-black text-white hover:bg-zinc-800 hover:text-white cursor-pointer w-[50%] py-2 rounded-lg">
        تغيير الصورة
      </button>
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
};

export default UploadPhotoButton;
