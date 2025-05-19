import { MainProfileForm } from "@/forms/user-profile-form/MainProfileForm";
import { Separator } from "@/components/ui/separator";
import UserPhoto from "@/forms/user-profile-form/UserPhoto";
import EditOverlay from "@/forms/user-profile-form/EditOverlay";
import { SecondaryForm } from "@/forms/user-profile-form/SecondaryForm";
import DeleteOverlay from "@/forms/user-profile-form/DeleteOverlay";
import { useGetMyUser } from "@/hooks/use-user";
import { User } from "@/types";
import UploadCvButton from "@/forms/user-profile-form/UploadCvButton";
import { Check, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";


const UserProfilePage = () => {

    const { currentUser, isLoading } = useGetMyUser();

    const isSecondaryDataComplete = (user: User | undefined): boolean => {
      if (!user) return false;
    
      return (
        !!user.dateOfBirth &&
        !!user.collegeDegree &&
        !!user.job &&
        !!user.description &&
        !!user.addressId // نتحقق فقط من وجود ID، لأن البيانات الكاملة تُجلب لاحقًا
      );
    };

    useEffect(() => {
      const toastMessage = sessionStorage.getItem("showToast");
      if (toastMessage) {
        toast(toastMessage,{
          style:{
            display: 'flex',
            flexDirection: 'row',
            gap: '20px',
            background: '#008c2f',
            color: '#fff',
            direction: 'rtl',
            border: 'none',
          },
          icon: <Check />,
          closeButton: true
        })
        sessionStorage.removeItem("showToast");
      }
    }, []);
      
  return (
    <div className="flex flex-col">
      <div className="w-full flex flex-row justify-between px-10 gap-10">
        <div className="w-[60%] flex flex-col">
          <div className="w-full">
            <div className="flex flex-row justify-between">
              <h1 className="text-3xl" >البيانات الشخصية</h1>
              <EditOverlay user={currentUser} isLoading={isLoading} />
            </div>
            {/* // NOTE: phone number is required  */}
            <MainProfileForm user={currentUser} isLoading={isLoading} />
          </div>

          <Separator/>
          
          <div className="w-full my-5 py-5">
            {!isSecondaryDataComplete(currentUser) && (
              <h3 className="text-gray-400">
                يرجى إكمال البيانات الشخصية لتستطيع المشاركة في الأنشطة الخاصة بالمنصة
              </h3>
            )}
            <SecondaryForm user={currentUser} isLoading={isLoading} />
          </div>
        </div>

        <div className="w-[40%] h-full flex flex-col gap-30 justify-between items-center">
          <UserPhoto photoUrl={currentUser?.photoUrl} />

          <div className="flex flex-col gap-10 justify-center items-center pr-20">
            {currentUser?.cvUrl && (
              <a
                href={currentUser.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white w-full text-center px-4 py-2 rounded-lg hover:bg-zinc-800 underline flex flex-row justify-between"
              >
                <h3>عرض السيرة الذاتية</h3>
                <FileText />
              </a>
            )}
            <UploadCvButton userId={Number(currentUser?.id)} />
          </div>

        </div>
      </div>
      <DeleteOverlay userId={currentUser?.id} />
    </div>
  );
};

export default UserProfilePage;