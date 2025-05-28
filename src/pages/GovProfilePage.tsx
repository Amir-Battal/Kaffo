import { Separator } from "@/components/ui/separator";
import UserPhoto from "@/forms/user-profile-form/UserPhoto";
import DeleteOverlay from "@/forms/user-profile-form/DeleteOverlay";
import { SecondaryGovForm } from "@/forms/gov-profile-form/SecondaryGovForm";
import { MainGovProfileForm } from "@/forms/gov-profile-form/MainGovProfileForm";
import EditGovOverlay from "@/forms/gov-profile-form/EditGovOverlay";
import { useGetMyUser } from "@/hooks/use-user";


const GovProfilePage = () => {

  const { currentUser } = useGetMyUser();

  return (
    <div className="flex flex-col">
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
            <SecondaryGovForm userId={currentUser?.id} />
          </div>
        </div>

        <div className="w-[40%] h-full flex flex-col gap-30 justify-between items-center">
          <UserPhoto photoUrl={currentUser?.photoUrl}  />
        </div>
      </div>
      <DeleteOverlay userId={currentUser?.id} />
    </div>
  );
};

export default GovProfilePage;