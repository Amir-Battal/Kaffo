import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, DollarSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Image } from "lucide-react"


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
  problem_type?: string,
  budget?: number,
  status?: string,
  children?: React.ReactNode,
  isSelfSolv?: boolean,
  isMyContribution?: boolean,
}

const ContributionCard = (prop: ContributionCardProp) => {

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
    })

  return (
    <Form {...form}>
      <form className="w-[100%] flex flex-col gap-5 border-2 pb-5 p-2"  dir="rtl">
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
          {prop.status
          ?(
            <Badge className={`w-[20%] h-[35px] ml-1 ${prop.status === 'جاري المعالجة'
              ? 'bg-orange-600'
              : prop.status === 'التعديل مسموح'
                ? 'bg-blue-600'
                : prop.status === 'تم الرفض'
                  ? 'bg-red-600'
                  : prop.status === 'تم القبول'
                    ? 'bg-green-600'
                    : 'bg-fuchsia-600'}`}>
                      <h3 className="text-lg">{prop.status}</h3>
            </Badge>
          ):(
            <div></div>
          )}
          {prop.children}
        </div>
        
        <div className="flex flex-row justify-between items-start">
          <div className="pb-4">
            <div>
              <h1 className="text-xl p-2 pr-0">{prop.problem_type}</h1>
              {prop.problem_type
                ?(
                  <div></div>
                ):(
                  <h1 className="text-xl p-2 pr-0">{prop.problem_type}</h1>
                )
              }
              {prop.children}
            </div>
            <p>إحدى بلاطات الرصيف مكسورة تؤدي إلى إصابة الناس وعرقلتهم أثناء المشي.</p>
            <div className="flex flex-row gap-2 pt-5">
              <Badge className="rounded-none" variant="default">محافظة حلب</Badge>
              <Badge className="rounded-none" variant="secondary">رصيف مكسور</Badge>
              <Badge className="rounded-none" variant="secondary">بلدية حلب</Badge>
            </div>
            <div className="flex flex-col gap-2 pt-10">
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
                placeholder="استطيع حل المشكلة من خلال ..." 
                disabled 
              />
            </div>
          </div>
          <div className="flex justify-center items-center bg-gray-500 w-[250px] h-[250px]">
            <Image className="text-white" size={60}/>
          </div>
        </div>

        <div className="flex flex-row justify-between items-center pl-1">
          <div className="w-full flex flex-col gap-2 px-2">
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
          {prop.isMyContribution
            ?(
              <Button>
                <h3>الذهاب إلى مكان المساهمة</h3>
                <ChevronLeft />
              </Button>
            ):(
              <div></div>
            )
          }
        </div>
      </form>
    </Form>
  );
};

export default ContributionCard;