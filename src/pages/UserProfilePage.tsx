import { MainProfileForm } from "@/forms/user-profile-form/MainProfileForm";
import { Separator } from "@/components/ui/separator";
import UserPhoto from "@/forms/user-profile-form/UserPhoto";
import EditOverlay from "@/forms/user-profile-form/EditOverlay";
import { SecondaryForm } from "@/forms/user-profile-form/SecondaryForm";
import DeleteOverlay from "@/forms/user-profile-form/DeleteOverlay";
import { useGetMyUser, useGetUserById } from "@/hooks/use-user";
import { User } from "@/types";
import UploadCvButton from "@/forms/user-profile-form/UploadCvButton";
import { Check, FileText } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import keycloak from "@/lib/keycloak";
import MainEmployeeForm from "@/forms/user-profile-form/MainEmployeeForm";
import SecondaryEmployeeForm from "@/forms/user-profile-form/SecondaryEmployeeForm";
import EditGovOverlay from "@/forms/gov-profile-form/EditGovOverlay";


const UserProfilePage = () => {

  const { userId } = useParams();

  const { currentUser, isLoading } = useGetMyUser();
  const { data: user } = useGetUserById(Number(userId));
  
  console.log(user);

  const roles = keycloak.tokenParsed?.resource_access?.["react-client"].roles || []


  const isSecondaryDataComplete = (user: User | undefined): boolean => {
    if (!user) return false;
  
    return (
      !!user.dateOfBirth &&
      !!user.collegeDegree &&
      !!user.job &&
      !!user.description &&
      !!user.addressId
    );
  };

  useEffect(() => {
    const toastMessage = sessionStorage.getItem("showToastEdit") || sessionStorage.getItem("showToastSecondaryEdit");
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
      sessionStorage.removeItem("showToastEdit");
      sessionStorage.removeItem("showToastSecondaryEdit");
    }
  }, []);
      
  return (
    <div className="flex flex-col">
      <div className="w-full flex flex-row justify-between px-10 gap-10">
        <div className="w-[60%] flex flex-col">
          <div className="w-full">
            <div className="flex flex-row justify-between">
              <h1 className="text-3xl" >البيانات الشخصية</h1>
              {user?.govId
                ?(
                  <EditGovOverlay isEmployee />
                ):(
                  <EditOverlay user={currentUser} isLoading={isLoading} />
                )
              }
            </div>
            {/* // NOTE: phone number is required  */}
            {user?.govId 
              ? (
                <MainEmployeeForm />
              ):(
                <MainProfileForm user={roles.includes("ROLE_ADMIN") ? user : currentUser} isLoading={isLoading} />
              )
            }
          </div>

          <Separator/>
          
          <div className="w-full my-5 py-5">
            {/* {!isSecondaryDataComplete(currentUser) || !isSecondaryDataComplete(user) && (
              <h3 className="text-gray-400">
                يرجى إكمال البيانات الشخصية لتستطيع المشاركة في الأنشطة الخاصة بالمنصة
              </h3>
            )} */}
            {user?.govId
              ?(
                <SecondaryEmployeeForm userId={user.id} />
              ):(
                <SecondaryForm user={roles.includes("ROLE_ADMIN") ? user : currentUser} isLoading={isLoading} />
              )
            }
          </div>
        </div>

        <div className="w-[40%] h-full flex flex-col gap-30 justify-between items-center">
          <UserPhoto photoUrl={roles.includes("ROLE_ADMIN") ? user?.photoUrl : currentUser?.photoUrl} />

          <div className="flex flex-col gap-10 justify-center items-center pr-20">
            {(user?.cvUrl || currentUser?.cvUrl) && (
              <a
                href={roles.includes("ROLE_ADMIN") ? user?.cvUrl : currentUser?.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white w-full text-center px-4 py-2 rounded-lg hover:bg-zinc-800 underline flex flex-row justify-between"
              >
                <h3>عرض السيرة الذاتية</h3>
                <FileText />
              </a>
            )}
            <UploadCvButton userId={Number(roles.includes("ROLE_ADMIN") ? user?.id : currentUser?.id)} />
          </div>

        </div>
      </div>
      <DeleteOverlay userId={roles.includes("ROLE_ADMIN") ? user?.id : currentUser?.id} />
    </div>
  );
};

export default UserProfilePage;