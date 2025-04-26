import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const ConcernedPartySelect = ({...props}) : React.JSX.Element => {

  const handleChange = (value: string) => {
    props.setParty(value);
  }

  return (
    <Select dir="rtl" name="ministry" onValueChange={handleChange}>
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
      

        {props.ministry === 'وزارة الإدارة المحلية والبيئة'
        ?(
          <SelectContent>
            {props.gov === 'حلب'
            ?(
              <SelectItem value="بلدية حلب">بلدية حلب</SelectItem>
            ): props.gov === 'دمشق'
            ?(
              <SelectItem value="بلدية دمشق">بلدية دمشق</SelectItem>
            ): props.gov === 'حمص'
            ?(
              <SelectItem value="بلدية حمص">بلدية حمص</SelectItem>
            ): props.gov === 'حماة'
            ?(
              <SelectItem value="بلدية حماة">بلدية حماة</SelectItem>
            ): props.gov === 'الحسكة'
            ?(
              <SelectItem value="بلدية الحسكة">بلدية الحسكة</SelectItem>
            ): props.gov === 'السويداء'
            ?(
              <SelectItem value="بلدية السويداء">بلدية السويداء</SelectItem>
            ):(
              <SelectItem value="اخرى">اخرى</SelectItem>
            )}
          </SelectContent>
        ): props.ministry === 'وزارة الطاقة' ?(
          <SelectContent>
            <SelectItem value="شركة كهرباء حلب">شركة كهرباء حلب</SelectItem>
            <SelectItem value="شركة كهرباء دمشق">شركة كهرباء دمشق</SelectItem>
            <SelectItem value="شركة كهرباء حمص">شركة كهرباء حمص</SelectItem>
            <SelectItem value="شركة مياه حلب">شركة مياه حلب</SelectItem>
            <SelectItem value="شركة مياه دمشق">شركة مياه دمشق</SelectItem>
            <SelectItem value="شركة مياه حمص">شركة مياه حمص</SelectItem>
            <SelectItem value="اخرى">اخرى</SelectItem>
          </SelectContent>
        ):(
          <SelectContent>
            <SelectItem value="اخرى">اخرى</SelectItem>
          </SelectContent>
        )}
    </Select>
  );
};

export default ConcernedPartySelect;