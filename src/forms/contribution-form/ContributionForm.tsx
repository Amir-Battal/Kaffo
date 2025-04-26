import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, DollarSign, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod"
import ContributionCard from "./ContributionCard";
import { useState } from "react";
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
    username: 'أمير بطال',
    date: '23/3/2025',
    contribution: "استطيع حل المشكلة من خلال عدة نقاط أهمها النقطة الأولى من خلال شراء المواد الأولية",
    budget: 120
  },
  // {
  //   username: 'أمير بطال',
  //   date: '23/3/2025',
  //   contribution: "يمكن حل المشكلة من خلال...",
  //   budget: 120
  // },
  {
    username: 'أمير بطال',
    date: '23/3/2025',
    contribution: "أستطيع حل المشكلة خلال أقل من 24 ساعة حيث أنني سوف اقوم بما يلي: - بالبداية سوف افحص مكان المشكلة. - ثم سوف اقوم بشراء المواد الأولية التي تلزمني - بعد ذلك سوف أقوم بإصلاح المشكلة:",
    budget: 120
  },
]

const ContributionForm = () => {

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
                  <FormLabel>ساهم في حل المشكلة</FormLabel>
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
                <h3>تأكيد المساهمة</h3>
                <Check />
              </Button>
            </div>
          </form>
        ):(
          <div>
            <ContributionCard 
              username={Contributions[1].username}
              date={Contributions[1].date}
              contribution={Contributions[1].contribution}
              budget={Contributions[1].budget}
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
      
      <div className="flex flex-col gap-5">
        {Contributions.map((contribution) => (
          <ContributionCard 
            username={contribution.username}
            date={contribution.date}
            contribution={contribution.contribution}
            budget={contribution.budget}
          />
        ))}
      </div>


    </div>
  );
};

export default ContributionForm;