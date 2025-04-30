import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, DollarSign } from "lucide-react";

type DonationCardProp = {
  username?: string,
  time?: string,
  date?: string,
  budget?: string | number,
}

const DonationCard = (prop: DonationCardProp) => {

  return (
    <div className="flex flex-col border-2 border-solid gap-5">
      <div className="flex flex-row items-center gap-2">
        <Avatar className="w-[40px] h-[40px] rounded-none">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h3>{prop.username} - {prop.time}</h3>
      </div>
      <div className="flex flex-col gap-2 px-2">
        <h2>تم التبرع بالمبلغ التالي في تاريخ {prop.date}</h2>
      </div>
      <div className="flex flex-row justify-between items-center pl-5">
        <div className="flex flex-col gap-2 px-5">
          <h3>المبلغ المتبرع به</h3>
          <div className="flex flex-row w-[50%] items-center justify-between mb-4">
              <DollarSign/>
              <Input
                className="w-full"
                value={prop.budget}
                placeholder="100"
              />
          </div>
        </div>
        <Button>
          <h3>الذهاب إلى مكان التبرع</h3>
          <ChevronLeft />
        </Button>
      </div>
    </div>
  );
};

export default DonationCard;