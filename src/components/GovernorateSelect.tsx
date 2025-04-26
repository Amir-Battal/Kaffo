import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react";


const GovernorateSelect = ({...props}) : React.JSX.Element => {

  const [governorate, setGovernorate] = useState(props.gov);


  const handleChange = (value: string) => {
    if(props.setGov){
      props.setGov(value);
    }
    else {
      setGovernorate(value);
    }
  }


  return (
    <Select dir="rtl" name="governorate" value={governorate} onValueChange={handleChange}>
      {props.disabled
      ?(
        <SelectTrigger disabled  className="w-full border-0 bg-none border-b-2 border-b-gray-300 rounded-none">
          <SelectValue placeholder={props.value} />
        </SelectTrigger>
      ):(
        <SelectTrigger className="w-full border-0 bg-none border-b-2 border-b-gray-300 rounded-none cursor-pointer hover:bg-accent">
          <SelectValue placeholder={props.value} />
        </SelectTrigger>
      )}
      {/* <SelectTrigger className="w-full border-0 bg-none border-b-2 border-b-gray-300 rounded-none cursor-pointer hover:bg-accent">
        <SelectValue placeholder={props.value} />
      </SelectTrigger> */}

      <SelectContent>
        <SelectItem value="دمشق">دمشق</SelectItem>
        <SelectItem value="ريف دمشق">ريف دمشق</SelectItem>
        <SelectItem value="حلب">حلب</SelectItem>
        <SelectItem value="حمص">حمص</SelectItem>
        <SelectItem value="حماة">حماة</SelectItem>
        <SelectItem value="إدلب">إدلب</SelectItem>
        <SelectItem value="القنيطرة">القنيطرة</SelectItem>
        <SelectItem value="درعا">درعا</SelectItem>
        <SelectItem value="السويداء">السويداء</SelectItem>
        <SelectItem value="طرطوس">طرطوس</SelectItem>
        <SelectItem value="اللاذقية">اللاذقية</SelectItem>
        <SelectItem value="الرقة">الرقة</SelectItem>
        <SelectItem value="دير الزور">دير الزرو</SelectItem>
        <SelectItem value="الحسكة">الحسكة</SelectItem>
      </SelectContent>
    </Select>

  );
};

export default GovernorateSelect;