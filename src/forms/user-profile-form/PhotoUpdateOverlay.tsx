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


const PhotoUpdateOverlay = () => {
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

  const onSubmit = () => {
    if (selectedFiles.length === 0) {
      // alert("الرجاء اختيار صورة أولاً.");
      console.log("الرجاء اختيار صورة أولاً.");
      return;
    }
    uploadToServer(selectedFiles);
  }

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
