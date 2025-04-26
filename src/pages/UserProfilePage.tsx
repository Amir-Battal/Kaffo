import { MainProfileForm } from "@/forms/user-profile-form/MainProfileForm";
import { Separator } from "@/components/ui/separator";
import UserPhoto from "@/forms/user-profile-form/UserPhoto";
import EditOverlay from "@/forms/user-profile-form/EditOverlay";
import { SecondaryForm } from "@/forms/user-profile-form/SecondaryForm";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import DeleteOverlay from "@/forms/user-profile-form/DeleteOverlay";

// import initFile from '../assets/Amir-Battal-Resume V3.4.0.pdf';

const UserProfilePage = () => {

  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);


  const handleCVUpload = async () => {
    if (!selectedFile) {
      // alert("يرجى اختيار ملف PDF أولاً.");
      console.log("يرجى اختيار ملف PDF أولاً.");
      return;
    }
  
    if (selectedFile.type !== "application/pdf") {
      // alert("الرجاء رفع ملف بصيغة PDF فقط.");
      console.log("الرجاء رفع ملف بصيغة PDF فقط.");
      return;
    }
  
    const formData = new FormData();
    formData.append('resume', selectedFile);
  
    try {
      const response = await fetch('http://localhost:4000/upload-resume', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      console.log("✅ تم رفع السيرة الذاتية:", data.fileName);
      // alert("تم رفع السيرة الذاتية بنجاح.");

      setUploadedFileName(data.fileName);

      // بإمكانك تخزين الرابط أو عرضه لاحقًا
    } catch (err) {
      console.error("❌ فشل رفع السيرة الذاتية", err);
      // alert("حدث خطأ أثناء رفع الملف.");
    }
  };
  


  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // console.log(initFile.split('assets/')[1]);


  return (
      <div className="w-full flex flex-row justify-between px-10 gap-10">
        <div className="w-[60%] flex flex-col">
          <div className="w-full">
            <div className="flex flex-row justify-between">
              <h1 className="text-3xl" >البيانات الشخصية</h1>
              <EditOverlay />
            </div>
            <MainProfileForm />
          </div>

          <Separator/>
          
          <div className="w-full">
            <h3 className="text-gray-400 my-5">يرجى إكمال البيانات الشخصية لتستطيع المشاركة في الأنشطة الخاصة بالمنصة</h3>
            <SecondaryForm />
          </div>
        </div>

        <div className="w-[40%] h-full flex flex-col gap-30 justify-between items-center">
          <UserPhoto  />
          <div className="w-full pr-20 flex flex-col gap-5">
            <div className="grid w-full max-w-sm gap-1.5">
              <Label htmlFor="picture">السيرة الذاتية</Label>
              <Input id="picture" type="file" onChange={(e: any) => setSelectedFile(e.target.files[0])} />

              {/* // عرض السيرة الذاتية */}
              {uploadedFileName && (
                <a
                  href={`http://localhost:4000/resumes/${uploadedFileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline mt-2"
                >
                  عرض السيرة الذاتية
                </a>
              )}

            </div>

            <Button className="cursor-pointer w-[50%]" type="button" onClick={handleCVUpload}>
              <h3>رفع السيرة الذاتية</h3>
              <Upload />
            </Button>
          </div>
          <DeleteOverlay />
        </div>
      </div>
  );
};

export default UserProfilePage;