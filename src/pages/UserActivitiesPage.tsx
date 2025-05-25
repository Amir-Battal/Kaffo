import { Copy, Folder, HandHeart } from "lucide-react";
import { Link } from "react-router-dom";

const UserActivitiesPage = () => {
  return (
    <div className="w-full flex flex-col gap-10 px-10">
      <h1 className="text-xl">قم بإختيار حالة المشاركة التي ترغب بعرضها:</h1>
      <div className="w-full flex flex-row justify-between gap-7 text-center">
        <div className="w-full flex flex-col items-center">
          <Link to='/user-activities/aucations' className="w-full h-[100px] flex flex-row justify-around items-center cursor-pointer text-white bg-black p-2  rounded-[10px] hover:bg-gray-800">
            <h3 className="text-xl">الشكاوي</h3>
            <Folder />
          </Link>
        </div>

        
        <div className="w-full flex flex-col items-center">
          <Link to='/user-activities/contributions' className="w-full h-[100px] flex flex-row justify-around items-center cursor-pointer text-white bg-black p-2  rounded-[10px] hover:bg-gray-800">
            <h3 className="text-xl">المساهمات</h3>
            <Copy />
          </Link>
        </div>

        <div className="w-full flex flex-col items-center">
          <Link to='/user-activities/donations' className="w-full h-[100px] flex flex-row justify-around items-center cursor-pointer text-white bg-black p-2  rounded-[10px] hover:bg-gray-800">
            <h3 className="text-xl">التبرعات</h3>
            <HandHeart />
          </Link>
        </div>
        {/* <div className="w-full flex flex-col gap-5 items-center">
          <Link to='/user-activities/volunteering' className="w-full h-[100px] flex flex-row justify-around items-center cursor-pointer text-white bg-black p-2  rounded-[10px] hover:bg-gray-800">
            <h3 className="text-xl">التطوع</h3>
            <Heart />
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default UserActivitiesPage;