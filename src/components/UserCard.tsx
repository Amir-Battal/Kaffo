import { Badge } from "./ui/badge";
import { Mail, MapPin, Smartphone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type UserCardProps = {
  username?: String;
  date?: String;
  study?: String;
  job?: String;
  details?: String;
  address?: String;
  phoneNumber?: String;
  email?: String;

  isGov?: Boolean;
}

const UserCard = (prop: UserCardProps) => {

  return (
    <div className="flex flex-col gap-5 border-2 py-5">
      <div className="flex flex-row justify-between gap-5">
        <div className="w-[20%] mt-[-20px]">
          <Avatar className="w-[100px] h-[100px] rounded-none">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>أب</AvatarFallback>
          </Avatar>
        </div>
        <div className="w-full flex flex-col gap-2">
          {prop.isGov 
            ? (
            <div>
              <div>
                <h1 className="text-xl font-bold">{prop.username}</h1>
              </div>
            </div>
            ):(
            <div>
              <div>
                <h1 className="text-xl font-bold">{prop.username}</h1>
                <h3>تاريخ الميلاد: {prop.date}</h3>
              </div>
              <div>
                <h2><span className="font-bold">الدراسة: </span>{prop.study}</h2>
                <h2><span className="font-bold">العمل: </span>{prop.job}</h2>
              </div>
            </div>

            )
          }
          <p className="w-[90%]">{prop.details}</p>
        </div>
      </div>
      <div className="w-full h-[40px] flex flex-row justify-center gap-5 px-2">
        <Badge className="w-[30%] flex flex-row gap-2">
          <MapPin />
          <h3 className="text-[15px]">{prop.address}</h3>
        </Badge>
        <Badge dir="ltr" className="w-[30%] flex flex-row gap-2">
          <h3 className="text-[15px]">{prop.phoneNumber}</h3>
          <Smartphone />
        </Badge>
        <Badge className="w-[30%] flex flex-row gap-2">
          <Mail />
          <h3 className="text-[15px]">{prop.email}</h3>
        </Badge>
      </div>
    </div>
  );
};

export default UserCard;