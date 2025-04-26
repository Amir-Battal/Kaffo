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
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Check, Edit } from "lucide-react"
import { useState } from "react"

const formSchema = z.object({
  address: z.string(),
  about: z.string(),
})


interface SecondaryData {
  address: string;
  about: string;
}

const user: SecondaryData[] = [
  {
    address: 'حلب، الجميلية',
    about: 'هذا النص تجريبي يصف وصف عن المستخدم حيث أن المستخدم يجب أن يملئ هذا الحقل من أجل وصف ما هي المهارات التي يملكها ويستطيع العمل بها لتعطي موثوقية لتسليمه العمل على الأنشطة التطوعية'
  },
]

export function SecondaryGovForm() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: user[0].address,
      about: user[0].about,
    },
  })
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    setEditable(false);
  }

  const [editable, setEditable] = useState(false);

  const handleEdit = () => {
    setEditable(true);
  }


  return (
    <Form {...form}>
          {editable
          ? (
            <form className="w-[100%]" onSubmit={form.handleSubmit(onSubmit)}  dir="rtl">
            <div className="space-y-8 w-full flex flex-col gap-6 py-1">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>العنوان</FormLabel>
                      <FormControl>
                        <Input placeholder="حلب، العزيزية" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />


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
