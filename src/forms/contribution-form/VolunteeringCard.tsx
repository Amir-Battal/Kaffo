import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign } from "lucide-react";
import { Image } from "lucide-react";

type VolunteeringCardProp = {
  username?: string,
  date?: string,
  problem_type?: string,
  time?: string,
  budget?: string | number,
  status?: string,
}

const VolunteeringCard = (prop: VolunteeringCardProp) => {

  return (
    <div className="flex flex-col border-2 border-solid gap-5">
      <div className="flex flex-row justify-between items-start p-3">
        <div className="">
          <div className="pb-4">
            <h3>{prop.username} - {prop.date}</h3>
            <h1 className="text-xl p-2 pr-0">{prop.problem_type}</h1>
            <p>إحدى بلاطات الرصيف مكسورة تؤدي إلى إصابة الناس وعرقلتهم أثناء المشي.</p>
            <div className="flex flex-row gap-2 pt-5">
              <Badge className="rounded-none" variant="default">محافظة حلب</Badge>
              <Badge className="rounded-none" variant="secondary">رصيف مكسور</Badge>
              <Badge className="rounded-none" variant="secondary">بلدية حلب</Badge>
            </div>
          </div>
          <div className="pt-5">
            <div className="flex flex-row items-center gap-2 pb-3">
              <Avatar className="w-[40px] h-[40px] rounded-none">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h3>{prop.username} - {prop.time}</h3>
            </div>
              <Textarea
                className="w-full"
                placeholder="أستطيع حل الشكوى خلال اقل من 24 ساعة حيث أنني سوق أقوم بما يلي:"
                disabled 
              />
          </div>
        </div>
          <div className="flex justify-center items-center bg-gray-500 w-[250px] h-[250px]">
            <Image className="text-white" size={60}/>
          </div>
      </div>
      <div className="flex flex-row justify-between items-center pl-5">
        <div className="flex flex-col gap-2 px-5">
          <h3>التكلفة المتوقعة</h3>
          <div className="flex flex-row w-[50%] items-center justify-between mb-4">
              <DollarSign/>
              <Input
                className="w-full"
                value={prop.budget}
                placeholder="100"
                disabled
              />
          </div>
        </div>
        <Button>
          <h3>المزيد من التفاصيل</h3>
        </Button>
      </div>
    </div>
  );
};

export default VolunteeringCard;