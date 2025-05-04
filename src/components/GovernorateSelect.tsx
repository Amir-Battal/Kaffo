import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCities } from "@/hooks/use-Address";
import { useEffect, useState } from "react";


// interface City {
//   arabic: string;
//   english: string;
//   value: string;
// }



const GovernorateSelect = ({...props}) : React.JSX.Element => {

  const { data: cities, isLoading, isError } = useCities()
  const [selected, setSelected] = useState(props.gov || "")



  useEffect(() => {
    if (props.gov) setSelected(props.gov)
  }, [props.gov])


const handleChange = (value: string) => {
  setSelected(value);
  if(props.setGov){
    props.setGov(value);
  }
}

  if (isLoading) {
    return <p>...جاري تحميل المحافظات</p>
  }

  if (isError) {
    return <p className="text-red-500">فشل في تحميل المحافظات</p>
  }


  return (
    <Select dir="rtl" name="governorate" value={selected} onValueChange={handleChange}>
      {props.disabled
      ?(
        <SelectTrigger disabled  className="w-full border-0 bg-none border-b-2 border-b-gray-300 rounded-none">
          <SelectValue placeholder={
            cities?.find((city) => city.english === props.value)?.arabic || "اختر محافظة"
          } />
        </SelectTrigger>
      ):(
        <SelectTrigger className="w-full border-0 bg-none border-b-2 border-b-gray-300 rounded-none cursor-pointer hover:bg-accent">
          <SelectValue placeholder={
            cities?.find((city) => city.english === props.value)?.arabic || "اختر محافظة"
          } />
        </SelectTrigger>
      )}
      {/* <SelectTrigger className="w-full border-0 bg-none border-b-2 border-b-gray-300 rounded-none cursor-pointer hover:bg-accent">
        <SelectValue placeholder={props.value} />
      </SelectTrigger> */}

      <SelectContent>
        {cities?.map((city) => (
          <SelectItem key={city.value} value={city.value}>
            {city.arabic}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

  );
};

export default GovernorateSelect;