import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChevronLeft, Image } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';


const CarouselProblemCard = () => {

  const percentage = 60;

  return (
    <Card dir="rtl" className="w-full h-[480px] m-0 p-0 rounded-none">
      <CardHeader className="m-0 p-0">
        <div className="flex justify-center items-center bg-gray-500 w-full h-[170px]">
          <Image className="text-white" size={50}/>
        </div>
        <div className="flex flex-col px-6 gap-2 mt-2">
          <CardDescription className="text-sm">أمير بطال - 23/3/2025</CardDescription>
          <CardTitle className="text-xl">رصيف مكسور</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="w-full flex flex-col gap-5">
        <p className="text-sm">إحدى بلاطات الوصيف مكسورة تؤدي إلى إصابة الناس وعرقلتهم أثناء المشي.</p>
        <div className="w-[100px] flex flex-row justify-between gap-2">
          <Badge className="rounded-none" variant="default">محافظة حلب</Badge>
          <Badge className="rounded-none" variant="secondary">رصيف مكسور</Badge>
          <Badge className="rounded-none" variant="secondary">بلدية حلب</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-[100px] flex flex-row justify-between items-center gap-5">
          <Button className="cursor-pointer">
            <h3>المزيد من التفاصيل</h3>
            <ChevronLeft />
          </Button>
          <CircularProgressbarWithChildren
            value={percentage}
            className="w-[80px]"
            styles={buildStyles({
              pathTransitionDuration: 0.5,
              pathColor: `rgba(70, 70, 70, ${percentage / 100})`,
              trailColor: '#d6d6d6',
              backgroundColor: '#3e98c7',
            })}
          >
            <h3 className="text-xl">{percentage}%</h3>
          </CircularProgressbarWithChildren>
        </div>
      </CardFooter>
    </Card>

  );
};

export default CarouselProblemCard;