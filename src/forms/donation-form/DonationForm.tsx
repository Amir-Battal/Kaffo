import { Slider } from "@/components/ui/slider"
import { useState } from "react";
import { Button } from "@/components/ui/button";

// type SliderProps = React.ComponentProps<typeof Slider>


// const DonationForm = ({ max=100, ...props }: SliderProps) => {
const DonationForm = ({ ...props }): React.JSX.Element => {
  const [value, setValue] = useState<number>(props.max/2)

  const handleChange = (values: number[]) => {
    setValue(values[0])
    // onChange?.(values[0])
  }

  const handleDonate = () => {
    console.log(value);
    setValue(props.max/2);

    props.setDonation(value);
    props.setIsDonated(true);

  }

  const handleFullyDonate = () => {
    console.log(props.max);

    props.setDonation(props.max);
    props.setIsDonated(true); 
  }

  return (
    <div className="flex flex-col gap-20 pb-10">
      <div className="flex flex-col gap-5 items-center">
        <div className="w-full flex flex-col">
          <div className="flex flex-row-reverse gap-2">
            <h3 className="text-xl">0</h3>
            <Slider
              defaultValue={[value]}
              min={0}
              max={props.max}
              onValueChange={handleChange}
              {...props}
            />
            <h3 className="text-xl">{props.max}</h3>
          </div>

          <p className="text-center text-[18px]">
            تم تحديد مبلغ {value} ليرة سورية
          </p>
        </div>

        <Button className="w-[50%] h-[40px] cursor-pointer" onClick={handleDonate}>
          <h3>تبرع</h3>
        </Button>
      </div>

      <Button className="w-[50%] h-[60px] cursor-pointer flex flex-col" onClick={handleFullyDonate}>
        <h3>التبرع بكامل المبلغ</h3>
        <h3 className="text-[12px]">المبلغ هو {props.max} ليرة سورية</h3>
      </Button>
    </div>
  );
};

export default DonationForm;