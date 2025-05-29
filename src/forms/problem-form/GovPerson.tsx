import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Building2, Check, Edit, Mail, Smartphone, User } from "lucide-react"
import { JSX, useState } from "react"


const formSchema = z.object({
  username: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  concernedGov: z.string(),
})

interface govPersonData {
  username: string;
  phoneNumber: string;
  email: string;
  concernedGov: string;

}

const govPerson: govPersonData[] = [
  {
    username: 'أمير بطال',
    phoneNumber: '0999 999 999',
    email: ' amir@example.com',
    concernedGov: 'مديرية مياه حلب'
  },
]




const GovPerson = ({...props}): JSX.Element => {

  const [govSelected, setGovSelected] = useState(props.govSelected ? true : false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: govPerson[0].username,
      phoneNumber: govPerson[0].phoneNumber,
      email: govPerson[0].email,
      concernedGov: govPerson[0].concernedGov
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setGovSelected(true);
    props.setGovSelected(true);
    console.log(values)
  }


  const handleEdit = () => {
    govSelected ? setGovSelected(false) : setGovSelected(true);
  }


  return (
    <div>
      {govSelected
        ?(
          <div className="flex flex-col gap-5">
              {!props.govSelected && (
                <div className="flex flex-row justify-between">
                  <h1 className="text-xl">ممثل عن الجهة المعنية</h1>
                  <Button onClick={handleEdit} variant={"ghost"} className="m-1 cursor-pointer">
                    <h3>تعديل</h3>
                    <Edit />
                  </Button>
                </div>
              )}
            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex flex-row gap-2 justify-between">
                <div className="w-full border-2 flex flex-row items-center gap-2 p-4">
                  <User size={40} color="#A9A9A9" />
                  <div>
                    <h3 className="text-lg">الاسم</h3>
                    <h3 className="text-sm">{govPerson[0].username}</h3>
                  </div>
                </div>
                <div className="w-full border-2 flex flex-row items-center gap-2 p-4">
                  <Building2 size={40} color="#A9A9A9" />
                  <div>
                    <h3 className="text-lg">الجهة المعنية</h3>
                    <h3 className="text-sm">{govPerson[0].concernedGov}</h3>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-row gap-2 justify-between">
                <div className="w-full border-2 flex flex-row items-center gap-2 p-4">
                  <Smartphone size={40} color="#A9A9A9" />
                  <div>
                    <h3 className="text-lg">رقم الهاتف</h3>
                    <h3 className="text-sm" dir="ltr">{govPerson[0].phoneNumber}</h3>
                  </div>
                </div>
                <div className="w-full border-2 flex flex-row items-center gap-2 p-4">
                  <Mail size={40} color="#A9A9A9" />
                  <div>
                    <h3 className="text-lg">البريد الإلكتروني</h3>
                    <h3 className="text-sm">{govPerson[0].email}</h3>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ):(
        <div className="flex flex-col gap-5">
          <h1 className="text-xl">اختيار ممثل عن الجهة المعنية</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="m-0 flex flex-col gap-10" dir="rtl">
              <div className="w-full grid grid-cols-1 gap-10">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="gap-2">
                      <FormLabel className="font-semibold">الاسم</FormLabel>
                      <FormControl>
                        <Input placeholder="أحمد أحمد" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex flex-row justify-between gap-5">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem className="gap-2 w-full">
                        <FormLabel>رقم الهاتف</FormLabel>
                        <FormControl>
                          <Input placeholder="0999 999 999" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="gap-2 w-full">
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input placeholder="anything@exmaple.com" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" className="w-[45%] h-[40px] cursor-pointer">
                <h3>تأكيد المعلومات</h3>
                <Check />
              </Button>
            </form>
          </Form>
        </div>

        )
      }
    </div>
  );
};

export default GovPerson;