import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PhotoUpdateOverlay from "./PhotoUpdateOverlay";
import { useGetMyUser } from "@/hooks/use-user";

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

const UserPhoto = ({ photoUrl }: { photoUrl?: string }) => {

  const { currentUser } = useGetMyUser();
  
  const fullUrl = `${S3_BASE_URL}/${photoUrl}`;

  return (
    <div className="w-full flex flex-col items-center gap-5 pr-20">
      <Avatar className="w-full h-full rounded-none">
        <AvatarImage src={fullUrl} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <PhotoUpdateOverlay userId={Number(currentUser?.id)} />
    </div>
  );
};

export default UserPhoto;
