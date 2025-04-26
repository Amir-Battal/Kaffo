import { DollarSign, MessagesSquare } from "lucide-react";
import { Link } from "react-router-dom";

const VolunteeringPage = () => {
  return (
    <div className="w-full flex flex-col gap-10 px-10">
      <h1 className="text-xl">قم بإختيار حالة التطوع التي ترغب بالتطوع من خلالها:</h1>
      <div className="w-full flex flex-row justify-between gap-20 text-center">
        <div className="w-full flex flex-col gap-5 items-center">
          <Link to='/volunteering/contributions' className="w-full h-[100px] flex flex-row justify-around items-center cursor-pointer text-white bg-black p-2  rounded-[10px] hover:bg-gray-800">
            <h3 className="text-xl">المساهمة في حل المشكلة</h3>
            <MessagesSquare />
          </Link>
          <h3 className="w-[75%] text-[18px]">هنا تستطيع تقديم اقتراح للمساهمة في حل المشكلة.</h3>
        </div>

        <div className="w-full flex flex-col gap-5 items-center">
          <Link to='/volunteering/donations' className="w-full h-[100px] flex flex-row justify-around items-center cursor-pointer text-white bg-black p-2  rounded-[10px] hover:bg-gray-800">
            <h3 className="text-xl">التبرع لحل المشكلة</h3>
            <DollarSign />
          </Link>
          <h3 className="w-[75%] text-[18px]">في هذه الحالة تستطيع التبرع بمبلغ مالي للمساعدة في حل المشكلة..</h3>
        </div>
      </div>
    </div>
  );
};

export default VolunteeringPage;