import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ChevronLeft, Image } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button";
import '../../index.css'
import FileUploader from "@/components/FileUploader";
import { useState } from "react";
import keycloak from "@/lib/keycloak";


const PhotoUpdateOverlay = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const uploadToS3 = async (file: File): Promise<string | null> => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/aws/presign?fileName=${file.name}&fileType=${file.type}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    });

    const { presignedUrl, fileUrl } = await res.json();

    // Step 2: رفع الملف إلى S3
    await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    return fileUrl;
  } catch (err) {
    console.error("❌ فشل في رفع الصورة إلى S3", err);
    return null;
  }
};

const onSubmit = async () => {
  if (selectedFiles.length === 0) {
    console.log("الرجاء اختيار صورة أولاً.");
    return;
  }

  const uploadedUrls = await Promise.all(selectedFiles.map(uploadToS3));
  console.log("✅ روابط الصور:", uploadedUrls);

  // يمكنك هنا حفظ الرابط في الواجهة أو إرساله للسيرفر لتحديث `photoUrl` في حساب المستخدم
};


  return (
    <div>
      <Dialog>
        <DialogTrigger className="flex flex-row justify-around cursor-pointer w-full text-white bg-black p-2 px-3  rounded-[10px] hover:bg-gray-800 gap-2">
          <h3>تغيير الصورة الشخصية</h3>
          <Image />
        </DialogTrigger>

        <DialogContent dir="rtl">
          <DialogHeader dir="ltr" className="flex flex-row-reverse">
            <DialogTitle>رفع الصورة الشخصية</DialogTitle>
          </DialogHeader>

          <FileUploader onFilesChange={setSelectedFiles} />

          <h4>أسماء الملفات:</h4>
          <ul>
            {selectedFiles.map((file: File) => <li key={file.name}>{file.name}</li>)}
          </ul>

          <DialogPrimitive.Close>
            <Button type="button" onClick={onSubmit} className="w-[60%] flex flex-row cursor-pointer">
              <h3>تأكيد</h3>
              <ChevronLeft />
            </Button>
          </DialogPrimitive.Close>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotoUpdateOverlay;
