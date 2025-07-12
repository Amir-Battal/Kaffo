import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PhotoUpdateOverlay from "./PhotoUpdateOverlay";
import { useGetMyUser, useGetUserById } from "@/hooks/use-user";
import { useParams } from "react-router-dom";
import keycloak from "@/lib/keycloak";

const UserPhoto = ({ photoUrl }: { photoUrl?: string }) => {
  const { userId } = useParams();

  const { currentUser } = useGetMyUser();
  const { data: user } = useGetUserById(Number(userId));
  
  const roles = keycloak.tokenParsed?.resource_access?.["react-client"].roles || []


  return (
    <div className="w-full flex flex-col items-center gap-5 pr-20">
      <Avatar className="w-full h-full rounded-none">
        <AvatarImage src={photoUrl} className="w-full object-cover object-center"/>
        {/* <AvatarImage className="w-full object-cover object-center"/> */}
        <AvatarFallback className="w-full h-[375px] rounded-none">{currentUser?.firstName.split("")[0]}</AvatarFallback>
      </Avatar>
      <PhotoUpdateOverlay userId={roles.includes("ROLE_ADMIN") ? Number(user?.id) : Number(currentUser?.id)} />
    </div>
  );
};

export default UserPhoto;
