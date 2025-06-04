import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronLeft, DollarSign, Image } from "lucide-react";
import { useGetProblemById } from "@/hooks/use-problem";
import { useGetUserById } from "@/hooks/use-user";
import { useCategory } from "@/hooks/use-category";
import { useAddress } from "@/hooks/use-Address";
import { Link } from "react-router-dom";

const formSchema = z.object({
  username: z.string(),
  date: z.string(),
  contribution: z.string(),
  budget: z.number(),
});

type ContributionCardProps = {
  username?: string;
  date?: string;
  problemId?: number;
  contribution?: string;
  description?: string;
  problem_type?: string;
  budget?: number;
  status?: string;
  children?: React.ReactNode;
  isSelfSolv?: boolean;
  isMyContribution?: boolean;
  contributions?: boolean;
};

const ContributionCard = ({
  username,
  date,
  problemId,
  contribution,
  description,
  problem_type,
  budget,
  status,
  children,
  isSelfSolv,
  isMyContribution,
}: ContributionCardProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "جاري المعالجة":
        return "bg-orange-600";
      case "التعديل مسموح":
        return "bg-blue-600";
      case "تم الرفض":
        return "bg-red-600";
      case "تم القبول":
        return "bg-green-600";
      default:
        return "bg-fuchsia-600";
    }
  };

  const { problem} = useGetProblemById(problemId);
  const { data: user } = useGetUserById(problem?.submittedByUserId);
  const { data: address } = useAddress(problem?.addressId);
  const { data: category } = useCategory(problem?.addressId);

  console.log(address)
  console.log(category)

  return (
    <Form {...form}>
      <form className="w-full flex flex-col gap-5 border-2 pb-5 p-4" dir="rtl">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {!isSelfSolv && (
              <Avatar className="w-10 h-10 rounded-none">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
            <h3>{user?.firstName + " " + user?.lastName} - {problem?.submissionDate.split("T")[0]}</h3>
          </div>

          {status && (
            <Badge className={`w-1/5 h-9 ml-1 ${getStatusColor(status)}`}>
              <span className="text-lg">{status}</span>
            </Badge>
          )}

          {children}
        </div>

        {/* Content */}
        <div className="flex justify-between gap-4">
          {/* Left side - problem info */}
          <div className="flex-1 space-y-4">
            <h1 className="text-xl">{problem?.title}</h1>

            {isMyContribution
              ?(
                <div>
                  <p>{problem?.description}</p>
                  <div className="flex flex-wrap gap-2 pt-5">
                    <Badge className="rounded-none">{address?.city}</Badge>
                    <Badge className="rounded-none" variant="secondary">{category?.name}</Badge>
                    {/* <Badge className="rounded-none" variant="secondary">بلدية حلب</Badge> */}
                  </div>
                </div>
              ):(
                <div></div>
              )
            }

            <div className="flex flex-col gap-2 pt-6">
              <FormLabel>{isSelfSolv ? "حل المشكلة" : "المساهمة في حل المشكلة"}</FormLabel>
              <Textarea
                className="w-full"
                value={contribution}
                placeholder="استطيع حل المشكلة من خلال ..."
                disabled
              />
            </div>
          </div>

          {/* Right side - image preview */}
          {isMyContribution
            ?(
              <div className="w-[250px] h-[250px] bg-gray-500 flex justify-center items-center">
                <Image className="text-white" size={60} />
              </div>
            ):(
              <div></div>
            )
          }
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2 w-1/3">
            <FormLabel>التكلفة المتوقعة</FormLabel>
            <div className="flex items-center gap-2">
              <DollarSign />
              <Input className="w-full" value={budget} placeholder="100" disabled />
            </div>
          </div>

          {isMyContribution && (

            // <Button onClick={() => {window.location.replace(`http://localhost:5173/contribution/${problemId}`)}}>
            //   <span>الذهاب إلى مكان المساهمة</span>
            //   <ChevronLeft />
            // </Button>
            <Link
              to={`/problems/${problemId}`}
              className="flex flex-row items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              <h3>الذهاب إلى مكان المساهمة</h3>
              <ChevronLeft />
            </Link>
          )}
        </div>
      </form>
    </Form>
  );
};

export default ContributionCard;
