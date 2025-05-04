import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PhotoUpdateOverlay from "./PhotoUpdateOverlay";
import { JSX } from "react";


const UserPhoto = ({...props}): JSX.Element => {
  return (
    <div className="w-full flex flex-col items-center gap-5 pr-20">
      <Avatar className="w-full h-full rounded-none">
        <AvatarImage src={`${props.photoUrl}`} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <PhotoUpdateOverlay />
    </div>
    

  );
};

export default UserPhoto;