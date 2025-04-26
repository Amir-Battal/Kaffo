import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const MinistriesSelect = ({...props}) : React.JSX.Element => {

  const handleChange = (value: string) => {
    props.setMinistry(value);
  }

  return (
    <Select dir="rtl" name="concernedParty" onValueChange={handleChange}>
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
        <SelectItem value="وزارة الطاقة">وزارة الطاقة</SelectItem>
        <SelectItem value="وزارة العدل">وزارة العدل</SelectItem>
        <SelectItem value="وزارة الداخلية">وزارة الداخلية</SelectItem>
        <SelectItem value="وزارة المالية">وزارة المالية</SelectItem>
        <SelectItem value="وزارة الاقتصاد والصناعة">وزارة الاقتصاد والصناعة</SelectItem>
        <SelectItem value="وزارة الأوقاف">وزارة الأوقاف</SelectItem>
        <SelectItem value="وزارة التربية">وزارة التربية</SelectItem>
        <SelectItem value="وزارة التعليم العالي">وزارة التعليم العالي</SelectItem>
        <SelectItem value="وزارة الصحة">وزارة الصحة</SelectItem>
        <SelectItem value="وزارة الشؤون الاجتماعية والعمل">وزارة الشؤون الاجتماعية والعمل</SelectItem>
        <SelectItem value="وزارة الدفاع">وزارة الدفاع</SelectItem>
        <SelectItem value="وزارة الإدارة المحلية والبيئة">وزارة الإدارة المحلية والبيئة</SelectItem>
        <SelectItem value="وزارة الاتصالات وتقانة المعلومات">وزارة الاتصالات وتقانة المعلومات</SelectItem>
        <SelectItem value="وزارة النقل">وزارة النقل</SelectItem>
        <SelectItem value="وزارة الزراعة">وزارة الزراعة</SelectItem>
        <SelectItem value="وزارة الأشغال العامة والإسكان">وزارة الأشغال العامة والإسكان</SelectItem>
        <SelectItem value="وزارة الثقافة">وزارة الثقافة</SelectItem>
        <SelectItem value="وزارة السياحة">وزارة السياحة</SelectItem>
        <SelectItem value="وزارة الرياضة والشباب">وزارة الرياضة والشباب</SelectItem>
        <SelectItem value="وزارة التنمية الإدارية">وزارة التنمية الإدارية</SelectItem>
        <SelectItem value="وزارة الطوارئ والكوارث">وزارة الطوارئ والكوارث</SelectItem>
        <SelectItem value="اخرى">اخرى</SelectItem>
      </SelectContent>
    </Select>

  );
};

export default MinistriesSelect;