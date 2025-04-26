import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react";


const ProblemStatusSelect = ({...props}) : React.JSX.Element => {

  const [status, setStatus] = useState(props.status);

  const handleChange = (value: string) => {
    // props.setStatus(value);
    setStatus(value);
  }

  return (
    <Select dir="rtl" name="status" value={status} onValueChange={handleChange}>
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
      <SelectContent>
        <SelectItem value="جاري المعالجة">جاري المعالجة</SelectItem>
        <SelectItem value="تم رفض الشكوى">تم رفض الشكوى</SelectItem>
        <SelectItem value="تم حل المشكلة">تم حل المشكلة</SelectItem>
      </SelectContent>
    </Select>

  );
};

export default ProblemStatusSelect;