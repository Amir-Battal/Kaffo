import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import GovernorateSelect from "@/components/GovernorateSelect"
import { Textarea } from "@/components/ui/textarea"
import DatePicker from "@/components/DatePicker"
import { Button } from "@/components/ui/button"
import { Check, Edit } from "lucide-react"
import { useState } from "react"

const formSchema = z.object({
  governorate: z.string(),
  address: z.string(),
  birth: z.string(),
  study: z.string(),
  work: z.string(),
  about: z.string(),
})

const tDate: Date = new Date(2010, 0, 10);
const birthDate = tDate.toLocaleDateString('en-US', 
  {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

interface SecondaryData {
  governorate: string;
  address: string;
  birth: string;
  study: string;
  work: string;
  about: string;
}

const user: SecondaryData[] = [
  {
    governorate: 'حلب',
    address: 'حلب، الجميلية',
    birth: birthDate,
    study: 'الهندسة المعلوماتية',
    work: 'مهندس برمجيات',
    about: 'هذا النص تجريبي يصف وصف عن المستخدم حيث أن المستخدم يجب أن يملئ هذا الحقل من أجل وصف ما هي المهارات التي يملكها ويستطيع العمل بها لتعطي موثوقية لتسليمه العمل على الأنشطة التطوعية'
  },
]

export function SecondaryForm() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      governorate: user[0].governorate,
      address: user[0].address,
      birth: user[0].birth,
      study: user[0].study,
      work: user[0].work,
      about: user[0].about,
    },
  })
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    values.governorate = governorate;
    values.birth = nDate.toLocaleDateString('en-US', 
      {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    console.log(values)
    setEditable(false);
  }

  const [editable, setEditable] = useState(false);

  const handleEdit = () => {
    setEditable(true);
  }

  const [governorate, setGovernorate] = useState(user[0].governorate);
  const [newDate, setNewDate] = useState(user[0].birth);
  const nDate: Date = new Date(newDate);


  return (
    <Form {...form}>
          {editable
          ? (
            <form className="w-[100%]" onSubmit={form.handleSubmit(onSubmit)}  dir="rtl">
            <div className="space-y-8 w-full flex flex-col gap-6 py-1">
              <div className="flex flex-row w-full justify-between gap-10">
                <FormField
                    control={form.control}
                    name="governorate"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>المحافظة</FormLabel>
                        <FormControl>
                          <GovernorateSelect setGov={setGovernorate} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>العنوان</FormLabel>
                      <FormControl>
                        <Input placeholder="حلب، العزيزية" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="birth"
                render={( ...field ) => (
                  <FormItem className="w-full">
                    <FormLabel>تاريخ الميلاد</FormLabel>
                    <FormControl>
                      <DatePicker setNewDate={setNewDate} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex flex-row justify-between gap-10">
                <FormField
                  control={form.control}
                  name="study"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>الدراسة</FormLabel>
                      <FormControl>
                        <Input placeholder="صيدلة" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="work"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>العمل</FormLabel>
                      <FormControl>
                        <Input placeholder="مهندس مدني" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>وصف عنك</FormLabel>
                    <FormControl>
                      <Textarea placeholder="قم بكتابة وصف عنك" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className=" flex flex-row justify-around cursor-pointer w-[40%] h-[50px] text-white bg-black p-2  rounded-[10px] hover:bg-gray-800">
                <h3>تأكيد التعديل</h3>
                <Check />
              </Button>
            </div>
            </form>
          ):(
            <div  dir="rtl">
            <div className="space-y-8 w-full flex flex-col gap-6 py-1">
              <div className="flex flex-row w-full justify-between gap-10">
                <FormField
                    disabled
                    control={form.control}
                    name="governorate"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>المحافظة</FormLabel>
                        <FormControl>
                          <GovernorateSelect setGov={setGovernorate} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                <FormField
                  disabled
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>العنوان</FormLabel>
                      <FormControl>
                        <Input className="text-gray-400" placeholder="حلب، العزيزية" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                disabled
                control={form.control}
                name="birth"
                render={( ...field ) => (
                  <FormItem className="w-full">
                    <FormLabel>تاريخ الميلاد</FormLabel>
                    <FormControl>
                      <DatePicker {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex flex-row justify-between gap-10">
                <FormField
                  disabled
                  control={form.control}
                  name="study"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>الدراسة</FormLabel>
                      <FormControl>
                        <Input className="text-gray-400" placeholder="صيدلة" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  disabled
                  control={form.control}
                  name="work"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>العمل</FormLabel>
                      <FormControl>
                        <Input className="text-gray-400" placeholder="مهندس مدني" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                disabled
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>وصف عنك</FormLabel>
                    <FormControl>
                      <Textarea placeholder="قم بكتابة وصف عنك" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="button" onClick={handleEdit} className="flex flex-row justify-around cursor-pointer w-[40%] h-[50px] text-white bg-black p-2  rounded-[10px] hover:bg-gray-800">
                <h3>تعديل البيانات الثانوية</h3>
                <Edit />
              </Button>
            </div>
            </div>
          )}
    </Form>
  )
}
