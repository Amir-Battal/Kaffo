import { JSX, useState } from "react";
import DateRangePicker from "./DateRangePicker";
import { Button } from "./ui/button";
import { Check } from "lucide-react";



const EndProject = ({...props}): JSX.Element => {

  const [date, setDate] = useState<any>();
  const [isDateSet, setIsDateSet] = useState<Boolean>();
  const handleSubmitDate = () => {
    if (isDateSet && date) {
      setIsDateSet(false)
      props.setIsEndProject(false);
    }else if(!isDateSet && date){
      setIsDateSet(true)
      props.setIsEndProject(true);
    }
    // setIsDateSet(true);
    console.log(date);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl">الوقت المتوقع لإنهاء المشروع</h1>
        <h3>قم بتحديد المدة المتوقعة من الحقل التالي</h3>
      </div>
      <DateRangePicker setDate={setDate} isDateSet={isDateSet} date={date} />
      {isDateSet && date
        ?(
          <div className="flex flex-col gap-5">
            <Button onClick={handleSubmitDate} className="w-[45%] h-[40px] cursor-pointer bg-green-600 hover:bg-green-800">
              <h3>تم تحديد التاريخ</h3>
              <Check />
            </Button>
            <div>
              {date 
                ?(
                  <h3>
                    تم تحديد التاريخ
                    <span> من <span className="font-bold">{date.from.toString().split(' ', 4).join(' ')}</span></span>
                    <span> إلى <span className="font-bold">{date.to.toString().split(' ', 4).join(' ')}</span></span>
                  </h3>
                ):(
                  <h3>لم يتم تحديد التاريخ</h3>
                )
              }
            </div>
          </div>
        ):(
          <Button onClick={handleSubmitDate} className="w-[45%] h-[40px] cursor-pointer ">
            <h3>تأكيد التاريخ</h3>
            <Check />
          </Button>
        )
      }
    </div>
  );
};

export default EndProject;