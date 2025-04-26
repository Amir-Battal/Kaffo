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
// import { Button } from "./ui/button";
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { Link } from "react-router-dom";
import ProblemOverlay from "@/forms/problem-form/ProblemOverlay";

type ProblemCardProp = {
  num: number;
  contribution?: boolean;
  donation?: boolean;
  myAucation?: boolean;
}

const ProblemCard = (prop: ProblemCardProp ) => {

  const percentage = 60;

  return (
    <Card className="w-[90%] h-[480px] m-0 p-0 rounded-none">
      <CardHeader className="m-0 p-0">
          {prop.myAucation
            ?(
              <div dir="ltr" className="bg-gray-500 w-full h-[170px]">
                <div className="flex flex-row gap-2 absolute m-2">
                  <ProblemOverlay isMyAucation status={'edit'} />
                  <ProblemOverlay isMyAucation status={'delete'} />
                </div>
                <div className="h-full flex justify-center items-center">
                  <Image className="text-white" size={50}/>
                </div>
              </div>
            ):(
              <div className="flex justify-center items-center bg-gray-500 w-full h-[170px]">
                <Image className="text-white" size={50}/>
              </div>
            )
          }
          <div className="flex flex-row justify-between px-6 items-center">
            <div className="flex flex-col gap-2 mt-2">
              <CardDescription className="text-sm">أمير بطال - 23/3/2025</CardDescription>
              <CardTitle className="text-xl">رصيف مكسور</CardTitle>
            </div>
            {prop.myAucation
              ?(
                <Badge className="w-[40%] h-[50px] bg-amber-500">
                  <h1>جاري المعالجة</h1>
                </Badge>
              ):(
                <div></div>
              )
            }
            
          </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <p className="text-sm">إحدى بلاطات الوصيف مكسورة تؤدي إلى إصابة الناس وعرقلتهم أثناء المشي.</p>
        <div className="flex flex-row gap-2">
          <Badge className="rounded-none" variant="default">محافظة حلب</Badge>
          <Badge className="rounded-none" variant="secondary">رصيف مكسور</Badge>
          <Badge className="rounded-none" variant="secondary">بلدية حلب</Badge>
        </div>
      </CardContent>
      <CardFooter>
          {prop.contribution 
            ? (
                <Link to={`/volunteering/contributions/${prop.num}`} className="w-[80%] flex flex-row justify-around cursor-pointer text-white bg-black p-2  rounded-[10px] hover:bg-gray-800">
                  <h3>المساهمة في حل المشكلة</h3>
                  <ChevronLeft />
                </Link>
            ): prop.donation
            ?(
                <Link to={`/volunteering/donations/${prop.num}`} className="w-[80%] flex flex-row justify-around cursor-pointer text-white bg-black p-2  rounded-[10px] hover:bg-gray-800">
                  <h3>التبرع لحل المشكلة</h3>
                  <ChevronLeft />
                </Link>

            ):(
              <div className="w-full flex flex-row justify-between items-center gap-5">
                <Link to={`/problems/${prop.num}`} className="flex flex-row justify-around cursor-pointer w-[60%] text-white bg-black p-2  rounded-[10px] hover:bg-gray-800">
                  <h3>المزيد من التفاصيل</h3>
                  <ChevronLeft />
                </Link>
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
            )
          }
      </CardFooter>
    </Card>

  );
};

export default ProblemCard;