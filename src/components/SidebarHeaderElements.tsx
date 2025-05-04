import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGetMyUser } from "@/hooks/use-user";
import { Link } from "react-router-dom";

const SidebarHeaderElements = () => {

  const { currentUser, isLoading } = useGetMyUser();


  if (isLoading) return <p>جاري التحميل...</p>;
  if (!currentUser) return <p>لم يتم العثور على المستخدم</p>;

  return (
    <div>
      <Link to="/user-profile" className="w-[100%] flex flex-row gap-2 p-1">
        <Avatar>
          <AvatarImage src={`${currentUser.photoUrl}`} />
          <AvatarFallback>K</AvatarFallback>
        </Avatar>
        <div className="pt-1">
          <h1 className="text-sm">{currentUser.firstName} {currentUser.lastName}</h1>
          <h4 className="text-sm text-gray-400">{currentUser.email}</h4>
        </div>
      </Link>
    </div>
  );
};

export default SidebarHeaderElements;