import { Check, ChevronLeft, X } from "lucide-react";
import { Button } from "./ui/button";
import { JSX } from "react";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";


const formSchema = z.object({
  comment: z.string(),
})

interface Comment {
  comment: string
}

const comment: Comment[] = [
  {
    comment: "تم رفض المشكلة بسبب ...",
  }
]

const IsReal = ({...prop}): JSX.Element => {

  
  const handleReal = () => {
    prop.setIsReal(true);
    console.log("Problem is Real");
  }

  const handleNotReal = () => {
    prop.setIsReal(false);
    console.log("Problem is Not Real");
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  }

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        comment: comment[0].comment,
      },
    })

  return (

    <div className="flex flex-col gap-5">
      <h3>بعد التحقق من الشكوى من الشخص المعني وأرض الواقع</h3>
        {prop.isReal
          ?(
            <div className="w-[45%] flex flex-row gap-5">
              <Button className="w-full h-[40px] cursor-pointer bg-green-600 hover:bg-green-800" type="button" onClick={handleReal}>
                <h3>حقيقية</h3>
                <Check />
              </Button>
              <Button className="w-full h-[40px] cursor-pointer" type="button" onClick={handleNotReal}>
                <h3>غير حقيقية</h3>
                <ChevronLeft />
              </Button>
            </div>
          ):prop.isReal === false
          ?(
            <div className="flex flex-col gap-5">
              <div className="w-[45%] flex flex-row gap-5">
                <Button className="w-full h-[40px] cursor-pointer" type="button" onClick={handleReal}>
                  <h3>حقيقية</h3>
                  <ChevronLeft />
                </Button>
                <Button className="w-full h-[40px] cursor-pointer bg-red-600 hover:bg-red-800" type="button" onClick={handleNotReal}>
                  <h3>غير حقيقية</h3>
                  <X />
                </Button>
              </div>
              <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>سبب الرفض</FormLabel>
                      <FormControl>
                        <Input placeholder="100" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                  <Button type="submit" className="mt-5 flex flex-row justify-around cursor-pointer w-[40%] h-[50px] text-white bg-black p-2  rounded-[10px] hover:bg-gray-800">
                    <h3>تأكيد السبب</h3>
                    <ChevronLeft />
                  </Button>
                </form>
                </Form>
              </div>
            </div>
          ):(
            <div className="w-[45%] flex flex-row gap-5">
              <Button className="w-full h-[40px] cursor-pointer" type="button" onClick={handleReal}>
                <h3>حقيقية</h3>
                <ChevronLeft />
              </Button>
              <Button className="w-full h-[40px] cursor-pointer" type="button" onClick={handleNotReal}>
                <h3>غير حقيقية</h3>
                <ChevronLeft />
              </Button>
            </div>
          )
        }
    </div>
  );
};

export default IsReal;