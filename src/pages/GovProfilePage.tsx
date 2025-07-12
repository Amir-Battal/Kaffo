import { Separator } from "@/components/ui/separator";
import UserPhoto from "@/forms/user-profile-form/UserPhoto";
import DeleteOverlay from "@/forms/user-profile-form/DeleteOverlay";
import { SecondaryGovForm } from "@/forms/gov-profile-form/SecondaryGovForm";
import { MainGovProfileForm } from "@/forms/gov-profile-form/MainGovProfileForm";
import EditGovOverlay from "@/forms/gov-profile-form/EditGovOverlay";
import { useGetMyUser } from "@/hooks/use-user";
import { useEffect } from "react";
import { toast } from "sonner";
import { Check, FileText } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGovById } from "@/hooks/use-gov";
import keycloak from "@/lib/keycloak";
import Categories from "@/components/Categories";
import UploadCvButton from "@/forms/user-profile-form/UploadCvButton";


const GovProfilePage = () => {
  const { govId } = useParams();

  const { currentUser } = govId ? useGovById(Number(govId)) : useGetMyUser();

  const roles = keycloak.tokenParsed?.resource_access?.["react-client"].roles || []


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

  console.log("currentUser", currentUser);

  return (
    <div className={`flex flex-col ${currentUser?.keycloakId ? 'gap-10' : 'gap-40'}`}>
      <div className="w-full flex flex-row justify-between px-10 gap-10">
        <div className="w-[60%] flex flex-col">
          <div className="w-full">
            <div className="flex flex-row justify-between">
              <h1 className="text-3xl" >البيانات الشخصية</h1>
              <EditGovOverlay />
            </div>
            <MainGovProfileForm />
          </div>

          <Separator/>
          
          <div className="w-full my-5 py-5">
            <h3 className="text-gray-400 my-5">يفضل إكمال البيانات لتعزيز المصداقية</h3>
            <SecondaryGovForm isMinistry={currentUser?.keycloakId ? false : true} userId={currentUser?.id} />
          </div>

          {roles.includes("ROLE_ADMIN") && (
            <Categories />
          )}


        </div>

        <div className="w-[40%] h-full flex flex-col gap-30 justify-between items-center">
          <UserPhoto photoUrl={currentUser?.photoUrl}  />

          {currentUser?.keycloakId && (
            <div className="flex flex-col gap-10 justify-center items-center pr-20">
              {(currentUser?.cvUrl) && (
                <a
                  href={currentUser?.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black text-white w-full text-center px-4 py-2 rounded-lg hover:bg-zinc-800 underline flex flex-row justify-between"
                >
                  <h3>عرض السيرة الذاتية</h3>
                  <FileText />
                </a>
              )}
              <UploadCvButton userId={currentUser?.id} />
            </div>
          )}
        </div>
      </div>
      <DeleteOverlay userId={currentUser?.id} />
    </div>
  );
};

export default GovProfilePage;