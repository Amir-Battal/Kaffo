import { Check, ChevronLeft, Timer } from "lucide-react";
import { Button } from "./ui/button";
import { JSX } from "react";

const IsForDonation = ({...prop}): JSX.Element => {

  
  const handleForDonation = () => {
    prop.setIsForDonation(true);
    prop.setSelfFounded(true);
    console.log("Cost is For Donation");
  }

  const handleSelfFounded = () => {
    prop.setIsForDonation(false);
    prop.setSelfFounded(true);
    console.log("Cost is Self Founded");
  }

  return (

    <div className="flex flex-col gap-5">
      <h3>تغطية التكاليف</h3>

      {prop.isForDonation && !prop.donationDone
        ?(
          <div className="w-[45%] flex flex-row gap-5">
            <Button className="w-full h-[40px] cursor-pointer" type="button" onClick={handleSelfFounded}>
              <h3>تغطية التكاليف</h3>
              <ChevronLeft />
            </Button>
            <Button className="w-full h-[40px] cursor-pointer bg-orange-500 hover:bg-orange-300" type="button" onClick={handleForDonation}>
              <h3>تفويض التكلفة للتبرع</h3>
              <Timer />
            </Button>
          </div>
        ):prop.isForDonation && prop.donationDone
        ?(
          <div className="w-[45%] flex flex-row gap-5">
            <Button className="w-full h-[40px] cursor-pointer" type="button" onClick={handleSelfFounded}>
              <h3>تغطية التكاليف</h3>
              <ChevronLeft />
            </Button>
            <Button className="w-full h-[40px] cursor-pointer bg-green-600 hover:bg-green-800" type="button" onClick={handleForDonation}>
              <h3>تم إتمام التبرع</h3>
              <Check />
            </Button>
          </div>
        ):prop.isForDonation === false
        ?(
          <div className="w-[45%] flex flex-row gap-5">
            <Button className="w-full h-[40px] cursor-pointer bg-green-600 hover:bg-green-800" type="button" onClick={handleSelfFounded}>
              <h3>تغطية التكاليف</h3>
              <Check />
            </Button>
            <Button className="w-full h-[40px] cursor-pointer" type="button" onClick={handleForDonation}>
              <h3>تفويض التكلفة للتبرع</h3>
              <ChevronLeft />
            </Button>
          </div>
        ):(
          <div className="w-[45%] flex flex-row gap-5">
            <Button className="w-full h-[40px] cursor-pointer" type="button" onClick={handleSelfFounded}>
              <h3>تغطية التكاليف</h3>
              <ChevronLeft />
            </Button>
            <Button className="w-full h-[40px] cursor-pointer" type="button" onClick={handleForDonation}>
              <h3>تفويض التكلفة للتبرع</h3>
              <ChevronLeft />
            </Button>
          </div>
        )
      }
    </div>
  );
};

export default IsForDonation;