import { Separator } from "@/components/ui/separator";
import UserPhoto from "@/forms/user-profile-form/UserPhoto";
import DeleteOverlay from "@/forms/user-profile-form/DeleteOverlay";
import { SecondaryGovForm } from "@/forms/gov-profile-form/SecondaryGovForm";
import { MainGovProfileForm } from "@/forms/gov-profile-form/MainGovProfileForm";
import EditGovOverlay from "@/forms/gov-profile-form/EditGovOverlay";


const GovProfilePage = () => {

  return (
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
          
          <div className="w-full">
            <h3 className="text-gray-400 my-5">يفضل إكمال البيانات لتعزيز المصداقية</h3>
            <SecondaryGovForm />
          </div>
        </div>

        <div className="w-[40%] h-full flex flex-col gap-30 justify-between items-center">
          <UserPhoto  />
          <DeleteOverlay />
        </div>
      </div>
  );
};

export default GovProfilePage;