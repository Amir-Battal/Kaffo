import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PhotoUpdateOverlay from "./PhotoUpdateOverlay";
import { useGetMyUser } from "@/hooks/use-user";

const UserPhoto = ({ photoUrl }: { photoUrl?: string }) => {

  const { currentUser } = useGetMyUser();

  return (
    <div className="w-full flex flex-col items-center gap-5 pr-20">
      <Avatar className="w-full h-full rounded-none">
        <AvatarImage src={photoUrl} className="w-full object-cover object-center"/>
        {/* <AvatarImage className="w-full object-cover object-center"/> */}
        <AvatarFallback className="w-full h-[375px] rounded-none">CN</AvatarFallback>
      </Avatar>
      <PhotoUpdateOverlay userId={Number(currentUser?.id)} />
    </div>
  );
};

export default UserPhoto;
