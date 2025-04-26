import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "react-router-dom";

const SidebarHeaderElements = () => {
  return (
    <div>
      <Link to="/user-profile" className="w-[100%] flex flex-row gap-2 p-1">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <div className="pt-1">
          <h1 className="text-sm">أمير بطال</h1>
          <h4 className="text-sm text-gray-400">amir@example.com</h4>
        </div>
      </Link>
    </div>
  );
};

export default SidebarHeaderElements;