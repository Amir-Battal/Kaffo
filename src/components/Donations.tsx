import { Check, ChevronLeft, Timer } from "lucide-react";
import DateRangePicker from "./DateRangePicker";
import { Button } from "./ui/button";
import { JSX, useEffect, useState } from "react";
import { useGetAcceptedContribution } from "@/hooks/use-Contribution";

const Donations = ({...props}): JSX.Element => {

  const [date, setDate] = useState();
  const [donationProceed, setDonationProceed] = useState<Boolean>();
  const [donationDone, setDonationDone] = useState<Boolean>();

  const [isDateSet, setIsDateSet] = useState<Boolean>();
  const [isEditing, setIsEditing] = useState<boolean>(false);


  const { data: acceptedContribution } = useGetAcceptedContribution(props.problemId);
  

  const handleSubmitDate = () => {
    // props.setDonationDone(true);
    if(props.expectedDonate === TotalDonation){
      setDonationDone(true);
      props.setDonationDone(true);
      setDonationProceed(false);
    } else{
      setDonationProceed(true);
    }
    console.log(date);
  }

  // useEffect(() => {
  //   if(date){

  //   }
  // }, [])

  const Donations = [
    {
      username: 'أمير بطال',
      date: '23/3/2025',
      donate: 50,
    },
    {
      username: 'أمير بطال',
      date: '23/3/2025',
      donate: 50,
    },
    {
      username: 'أمير بطال',
      date: '23/3/2025',
      donate: 20,
    },
  ]

  const TotalDonation: number = Donations.reduce((total, item) => total + item.donate, 0);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl">الوقت المتوقع لإيقاف التبرعات</h1>
          <h3>قم بتحديد المدة المتوقعة من الحقل التالي</h3>
        </div>
        <DateRangePicker
            setDate={setDate} 
            isDateSet={!isEditing && isDateSet}
            date={date} 
    
            startDate={props.startDate}
            endDate={props.endDate}
          />

        {donationDone
          ?(
            <div></div>
          ):(
            <div>
              {donationProceed
                ?(
                  <Button onClick={handleSubmitDate} className="w-[45%] h-[40px] cursor-pointer bg-orange-500 hover:bg-orange-300">
                    <h3>بانتظار جمع المبلغ</h3>
                    <Timer />
                  </Button>
                ):(
                  <Button onClick={handleSubmitDate} className="w-[45%] h-[40px] cursor-pointer ">
                    <h3>طرح الحل للتبرع</h3>
                    <ChevronLeft />
                  </Button>
                )
              }
            </div>
          )
        }
      </div>
      <div className="flex flex-col gap-5">
        {donationProceed
          ?(
            <div>
              <h3 className="text-xl">الأشخاص المتبرعين لحل الشكوى</h3>
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-2">
                  {Donations.map((item) => (
                    <h3>تم التبرع لحل هذه الشكوى بقيمة 
                      <span className="font-bold"> {item.donate} ليرة سورية </span>من قبل 
                      <span className="font-bold"> {item.username} </span>بتاريخ: 
                      <span className="font-bold"> {item.date}</span>
                    </h3>
                  ))}
                </div>
                <h3 className="text-xl">المبلغ الذي تم جمعة حتى الآن <span className="font-bold"> {TotalDonation} ليرة سورية </span></h3>
              </div>
            </div>
          ):donationDone
          ?(
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-2">
                {Donations.map((item) => (
                    <h3>تم التبرع لحل هذه الشكوى بقيمة 
                      <span className="font-bold"> {item.donate} ليرة سورية </span>من قبل 
                      <span className="font-bold"> {item.username} </span>بتاريخ: 
                      <span className="font-bold"> {item.date}</span>
                    </h3>
                ))}
              </div>
              <div className="flex flex-row gap-2 items-center">
                <h3 className="text-xl">تم جمع كامل المبلغ <span className="font-bold"> {TotalDonation} ليرة سورية </span></h3>
                <Check />
              </div>
            </div>
          ):(
            <div></div>
          )
        }
      </div>
    </div>

  );
};

export default Donations;