import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, DollarSign, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod"
import ContributionCard from "./ContributionCard";
import { JSX, useState } from "react";
import DeleteDialog from "./DeleteDialog";



const formSchema = z.object({
  contribution: z.string(),
  budget: z.number(),
})

interface ContributionData {
  contribution: string
  budget: number
}

const contribution: ContributionData[] = [
  {
    contribution: "أستطيع حل المشكلة خلال أقل من 24 ساعة حيث أنني سوف اقوم بما يلي: - بالبداية سوف افحص مكان المشكلة. - ثم سوف اقوم بشراء المواد الأولية التي تلزمني - بعد ذلك سوف أقوم بإصلاح المشكلة:",
    budget: 120
  }
]

const Contributions = [ 
  {
    username: 'كهرباء حلب',
    date: '23/3/2025',
    contribution: "أستطيع حل المشكلة خلال أقل من 24 ساعة حيث أنني سوف اقوم بما يلي: - بالبداية سوف افحص مكان المشكلة. - ثم سوف اقوم بشراء المواد الأولية التي تلزمني - بعد ذلك سوف أقوم بإصلاح المشكلة:",
    budget: 120
  },
]

const SolutionForm = ({...prop}): JSX.Element => {

  const [editable, setEditable] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contribution: contribution[0].contribution,
      budget: contribution[0].budget
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    prop.setSolutionSet(true);
    prop.setSelfBudget(values.budget);
    setEditable(false);
    console.log(values)
  }

  const handleEdit = () => {
    setEditable(true);
  }

  return (
    <div className="flex flex-col gap-5">
      <Form {...form}>
        {editable
        ?(
          <form className="w-[100%] flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}  dir="rtl">
            <FormField
              control={form.control}
              name="contribution"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>حل المشكلة</FormLabel>
                  <FormControl>
                    <Textarea placeholder="استطيع حل المشكلة من خلال..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex flex-row w-full items-center justify-between">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem className="w-[20%]">
                    <FormLabel>التكلفة المتوقعة</FormLabel>
                    <div className="flex flex-row items-center gap-1">
                      <DollarSign />
                      <FormControl>
                        <Input placeholder="100" {...field} />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              {/* // TODO on submit change style */}
              <Button type="submit" className="mt-5 flex flex-row justify-around cursor-pointer w-[40%] h-[50px] text-white bg-black p-2  rounded-[10px] hover:bg-gray-800">
                <h3>تأكيد الحل</h3>
                <Check />
              </Button>
            </div>
          </form>
        ):(
          <div>
            <ContributionCard 
              username={Contributions[0].username}
              date={Contributions[0].date}
              contribution={Contributions[0].contribution}
              budget={Contributions[0].budget}
              isSelfSolv
            >
              <div className="flex flex-row-reverse">
                <Button onClick={handleEdit} variant={"ghost"} className="m-1 cursor-pointer">
                  <h3>تعديل</h3>
                  <Edit />
                </Button>
                
                <DeleteDialog />
              </div>
            </ContributionCard>
          </div>
        )}
      </Form> 


    </div>
  );
};

export default SolutionForm;