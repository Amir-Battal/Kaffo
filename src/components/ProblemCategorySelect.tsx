import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react";


const ProblemCategorySelect = ({...props}) : React.JSX.Element => {

  const [category, setCategory] = useState(props.category);

  const handleChange = (value: string) => {
    if(props.setGov){
      props.setCategory(value);
    }
    else {
      setCategory(value);
    }
  }

  return (
    <Select dir="rtl" name="category" value={category} onValueChange={handleChange}>
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
        <SelectItem value="أرصفة">أرصفة</SelectItem>
        <SelectItem value="طرقات">طرقات</SelectItem>
        <SelectItem value="انقاض">انقاض</SelectItem>
        <SelectItem value="حفريات">حفريات</SelectItem>
        <SelectItem value="كهرباء">كهرباء</SelectItem>
        <SelectItem value="مياه">مياه</SelectItem>
      </SelectContent>
    </Select>

  );
};

export default ProblemCategorySelect;