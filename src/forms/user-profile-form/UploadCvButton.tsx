import { useRef } from "react";
import { useUploadUserCv, useGetMyUser } from "@/hooks/use-user";

const UploadCvButton = ({ userId }: { userId: number }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mutateAsync: uploadCv } = useUploadUserCv();
  const { refetch } = useGetMyUser();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const contentType = file.type;
    if (contentType !== "application/pdf") {
      alert("الرجاء رفع ملف PDF فقط");
      return;
    }

    const { presignedUrl } = await uploadCv({ userId, contentType });

    await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
      body: file,
    });

    refetch(); // لإعادة جلب رابط الـ CV إن كان جزءاً من بيانات المستخدم
  };

  return (
    <>
      <button
        onClick={() => inputRef.current?.click()}
        className="bg-black text-white hover:bg-zinc-800 px-10 py-2 rounded-lg cursor-pointer"
      >
        رفع السيرة الذاتية
      </button>
      <input
        type="file"
        ref={inputRef}
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
};

export default UploadCvButton;
