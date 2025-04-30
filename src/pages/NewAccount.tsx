import { Briefcase, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const NewAccount = () => {
  return (
    <div className="w-full flex flex-col gap-10 px-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl">إنشاء حساب</h1>
        <h3>قم بإختيار صفة الحساب الذي تريد إنشاءه</h3>
      </div>
      <div className="w-full flex flex-row justify-between gap-20 text-center">
        <div className="w-full flex flex-col gap-5 items-center">
          <Link to='/user-profile' className="w-full h-[100px] flex flex-row justify-around items-center cursor-pointer text-white bg-black p-2  rounded-[10px] hover:bg-gray-800">
            <h3 className="text-xl">حساب مستخدم عادي</h3>
            <UserPlus />
          </Link>
        </div>

        <div className="w-full flex flex-col gap-5 items-center">
          <Link to='/gov-profile' className="w-full h-[100px] flex flex-row justify-around items-center cursor-pointer text-white bg-black p-2  rounded-[10px] hover:bg-gray-800">
            <h3 className="text-xl">حساب جهة معنية</h3>
            <Briefcase />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewAccount;