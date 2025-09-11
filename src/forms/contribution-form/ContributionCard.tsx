import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Form, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronLeft, DollarSign, FileText, Image } from "lucide-react";
import { useGetProblemById } from "@/hooks/use-problem";
import { useGetUserById } from "@/hooks/use-user";
import { useCategory } from "@/hooks/use-category";
import { useAddress, useCities } from "@/hooks/use-Address";
import { Link } from "react-router-dom";
import { useMinistryById } from "@/hooks/use-gov";

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
  budget?: number;
  status?: string;
  children?: React.ReactNode;
  isSelfSolv?: boolean;
  isMyContribution?: boolean;
  contributions?: boolean;
  isEmployee?: boolean;
  gov?: string;
  ministry?: string;
  userPhoto?: string;

  proposedByUserId?: string;
  suggestionContributions?: boolean;
};

const ContributionCard = ({
  username,
  date,
  problemId,
  contribution,
  description,
  budget,
  status,
  children,
  isSelfSolv,
  isMyContribution,
  isEmployee,
  gov,
  ministry,
  userPhoto,
  proposedByUserId,
  suggestionContributions
}: ContributionCardProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING_APPROVAL":
        return "bg-amber-600";
      case "REJECTED":
        return "bg-red-600";
      default:
        return "bg-green-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING_APPROVAL":
        return "قيد المراجعة";
      case "REJECTED":
        return "تم رفض المساهمة";
      default:
        return "تم قبول المساهمة";
    }
  };

  const { problem} = useGetProblemById(problemId);
  // const { data: user } = useGetUserById(Number(problem?.submittedByUserId));
  const { data: user } = useGetUserById(problem?.submittedByUserId);
  const { data: address } = useAddress(Number(problem?.addressId));
  const { data: category } = useCategory(problem?.categoryId);

  const { data: cities } = useCities();
  const cityArabicName = cities?.find(c => c.value === address?.city)?.arabic ?? address?.city;

  const {data: contributor} = useGetUserById(proposedByUserId);
  const {data: contributorAddress} = useAddress(contributor?.addressId);
  const cityOfContributor = cities?.find(c => c.value === contributorAddress?.city)?.arabic ?? contributorAddress?.city;


  console.log("contributor", contributor);
  // const ContributorDetails = (user: ContributionCardProps | undefined): boolean => {
  //   if (!user) return false;
    
  //   return (
  //     !!user.email &&
  //     !!user.phone &&
  //     !!user.dateOfBirth &&
  //     !!user.collegeDegree &&
  //     !!user.job &&
  //     !!user.cvUrl
  //     // !!user.description &&
  //     // !!user.addressId
  //   );
  // }

  // TODO: COMPLETE CONTRIBUTOR DETAILS

  return (
    <Form {...form}>
      <form className="w-full flex flex-col gap-5 border-2 pb-5 p-4" dir="rtl">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
              {!isSelfSolv && (
                <Avatar className="w-10 h-10 rounded-none">
                  <AvatarImage src={contributor?.photoUrl} />
                  <AvatarFallback>{username?.split("")[0]}</AvatarFallback>
                </Avatar>
              )}
              {isMyContribution 
                ?(
                  <h3>{username} - {problem?.submissionDate.split("T")[0]}</h3>
                ):(
                  <h3>{username} - {date}</h3>
                )
              }
            </div>
            <div>
              {isEmployee && (
                <h3>الجهة المعنية التابع لها: <span className="font-bold">{gov}, {ministry}</span></h3>
              )}
              {suggestionContributions && (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-15">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-[14px]"><span className="font-bold text-[14px]">البريد الإلكتروني: </span>{contributor?.email}</h3>
                      <h3 className="text-[14px]"><span className="font-bold text-[14px]">رقم الهاتف: </span><span dir="ltr">{contributor?.phone}</span></h3>
                      <h3 className="text-[14px]"><span className="font-bold text-[14px]">العنوان: </span>{cityOfContributor}, {contributorAddress?.description}</h3>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-[14px]"><span className="font-bold text-[14px]">الدراسة: </span>{contributor?.collegeDegree}</h3>
                      <h3 className="text-[14px]"><span className="font-bold text-[14px]">العمل: </span><span dir="ltr">{contributor?.job}</span></h3>
                      <h3 className="text-[14px]"><span className="font-bold text-[14px]">تاريخ الميلاد: </span><span dir="ltr">{contributor?.dateOfBirth}</span></h3>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[14px]"><span className="font-bold text-[14px]">الوصف: </span><span dir="ltr">{contributor?.description}</span></p>
                    {contributor?.cvUrl &&(
                      <a
                        href={contributor?.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black text-white w-full text-center px-4 py-2 rounded-lg hover:bg-zinc-800 underline flex flex-row justify-between"
                      >
                        <h3>عرض السيرة الذاتية</h3>
                        <FileText />
                      </a>
                    )}
                  </div>

                </div>
              )}
            </div>
          </div>

          {status && (
            <Badge className={`w-1/4 h-9 ml-1 ${getStatusColor(status)}`}>
              <span className="text-[16px]">{getStatusLabel(status)}</span>
            </Badge>
          )}

          {children}
        </div>

        {/* Content */}
        <div className="flex justify-between gap-4">
          {/* Left side - problem info */}
          <div className="flex-1 space-y-4">

            {isMyContribution
              ?(
                <div>
                  <h1 className="text-xl">{problem?.title}</h1>
                  <p className="mt-5">{problem?.description}</p>
                  <div className="flex flex-wrap gap-2 pt-5">
                    <Badge className="rounded-none">{cityArabicName}</Badge>
                    <Badge className="rounded-none" variant="secondary">{category?.name}</Badge>
                    <Badge className="rounded-none" variant="secondary">{address?.description}</Badge>
                  </div>
                </div>
              ):(
                <div>
                  <h1></h1>
                </div>
              )
            }

            <div className="flex flex-col gap-2 pt-6">
              <FormLabel>{isSelfSolv ? "حل الشكوى" : "المساهمة في حل الشكوى"}</FormLabel>
              <Textarea
                className="w-full"
                value={contribution}
                placeholder="استطيع حل الشكوى من خلال ..."
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
