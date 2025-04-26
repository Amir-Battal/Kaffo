import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod"


const formSchema = z.object({
  username: z.string(),
  date: z.string(),
  contribution: z.string(),
  budget: z.number(),
})

type ContributionCardProp = {
  username?: string,
  date?: string,
  contribution?: string,
  budget?: number,
  children?: React.ReactNode,
  isSelfSolv?: boolean
}

const ContributionCard = (prop: ContributionCardProp) => {

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
    })

  return (
    <Form {...form}>
      <form className="w-[100%] flex flex-col gap-5 border-2 pb-5"  dir="rtl">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            {prop.isSelfSolv
              ?(
                <div></div>
              ):(
                <Avatar className="w-[40px] h-[40px] rounded-none">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              )
            }
            <h3>{prop.username} - {prop.date}</h3>
          </div>
          {prop.children}
        </div>

        <div className="flex flex-col gap-2 px-2">
          {prop.isSelfSolv
            ?(
              <FormLabel>حل المشكلة</FormLabel>
            ):(
              <FormLabel>المساهمة في حل المشكلة</FormLabel>
            )
          }
          <Textarea 
            className="w-full"
            value={prop.contribution} 
            placeholder="استطيع حل المشكلة من خلال..." 
            disabled 
          />
        </div>

        <div className="flex flex-col gap-2 px-2">
          <FormLabel>التكلفة المتوقعة</FormLabel>
          <div className="flex flex-row w-[20%] items-center justify-between">
            <DollarSign/>
            <Input
              className="w-full"
              value={prop.budget}
              placeholder="100" 
              disabled
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ContributionCard;