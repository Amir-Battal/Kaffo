import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, Image } from "lucide-react";
import { Badge } from "./ui/badge";
import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar";
import { Link } from "react-router-dom";
import ProblemOverlay from "@/forms/problem-form/ProblemOverlay";
import { ProblemDTO } from "@/types";
// import UserPhoto from "@/forms/user-profile-form/UserPhoto";
import { useGetProblemPhotos } from "@/hooks/use-problem-photo";
import { useAddress, useCities } from "@/hooks/use-Address";
import { useCategory } from "@/hooks/use-category";
import { useGetUserById } from "@/hooks/use-user";

type ProblemCardProp = {
  problem: ProblemDTO;
  contribution?: boolean;
  donation?: boolean;
  myAucation?: boolean;
};

const ProblemCard = ({ problem, contribution, donation, myAucation }: ProblemCardProp) => {

  const { photos, isLoading } = useGetProblemPhotos(problem.id);

  const photoUrl = photos.length > 0 ? photos[0].s3Key : null;

  const { data: address } = useAddress(problem.addressId);
  const { data: category } = useCategory(problem.categoryId);
  const { data: user, isLoading: userLoading } = useGetUserById(problem.submittedByUserId?.toString() ?? "");
    const { data: cities } = useCities();
  
    const cityArabicName = cities?.find(c => c.value === address?.city)?.arabic ?? address?.city;



  const percentage = 60; // يمكن استبداله لاحقًا بقيمة حقيقية من الـ problem

  return (
    <Card className="w-[90%] h-[480px] m-0 p-0 rounded-none">
      <CardHeader className="m-0 p-0">
      <div className="bg-gray-500 w-full h-[170px] relative">
          {myAucation && (
            <div className="flex flex-row gap-2 absolute m-2 z-10">
              <ProblemOverlay isMyAucation status={"edit"} />
              <ProblemOverlay isMyAucation status={"delete"} />
            </div>
          )}
          {isLoading ? (
            <div className="h-full flex justify-center items-center text-white">جارٍ التحميل...</div>
          ) : photoUrl ? (
            <img src={photoUrl} alt="صورة المشكلة" className="w-full h-full object-cover" />
          ) : (
            <div className="h-full flex justify-center items-center">
              <Image className="text-white" size={50} />
            </div>
          )}
      </div>

        <div className="flex flex-row justify-between px-6 items-center">
          <div className="flex flex-col gap-2 mt-2">
            <CardDescription className="text-sm">
              {user?.firstName} {user?.lastName ?? "مستخدم مجهول"} -{" "}
              {new Date(problem.submissionDate).toLocaleDateString()}
            </CardDescription>
            <CardTitle className="text-xl">{problem.title}</CardTitle>
          </div>
          {myAucation && (
            <Badge className="w-[40%] h-[50px] bg-amber-500">
              <h1>{problem.status}</h1>
            </Badge>
          )}
        </div>
      </CardHeader>
      {/* <CardContent className="flex flex-col gap-5">
        <p className="text-sm">{problem.description}</p>
        <div className="flex flex-row gap-2">
          <Badge className="rounded-none" variant="default">
            {problem.address?.governorate}
          </Badge>
          <Badge className="rounded-none" variant="secondary">
            {problem.category}
          </Badge>
          <Badge className="rounded-none" variant="secondary">
            {problem.address?.municipality}
          </Badge>
        </div>
      </CardContent> */}
      <CardContent className="flex flex-col gap-5">
        <p className="text-sm">{problem.description}</p>
        <div className="flex flex-row gap-2">
          <Badge className="rounded-none" variant="default">
            {cityArabicName ?? "غير معروف"}
          </Badge>
          <Badge className="rounded-none" variant="secondary">
            {category?.name ?? "غير معروف"}
          </Badge>
          <Badge className="rounded-none" variant="secondary">
            {address?.description ?? "غير معروف"}
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        {contribution ? (
          <Link
            to={`/volunteering/contributions/${problem.id}`}
            className="w-[80%] flex flex-row justify-around cursor-pointer text-white bg-black p-2  rounded-[10px] hover:bg-gray-800"
          >
            <h3>المساهمة في حل المشكلة</h3>
            <ChevronLeft />
          </Link>
        ) : donation ? (
          <Link
            to={`/volunteering/donations/${problem.id}`}
            className="w-[80%] flex flex-row justify-around cursor-pointer text-white bg-black p-2  rounded-[10px] hover:bg-gray-800"
          >
            <h3>التبرع لحل المشكلة</h3>
            <ChevronLeft />
          </Link>
        ) : (
          <div className="w-full flex flex-row justify-between items-center gap-5">
            <Link
              to={`/problems/${problem.id}`}
              className="flex flex-row justify-around cursor-pointer w-[60%] text-white bg-black p-2  rounded-[10px] hover:bg-gray-800"
            >
              <h3>المزيد من التفاصيل</h3>
              <ChevronLeft />
            </Link>
            <CircularProgressbarWithChildren
              value={percentage}
              className="w-[80px]"
              styles={buildStyles({
                pathTransitionDuration: 0.5,
                pathColor: `rgba(70, 70, 70, ${percentage / 100})`,
                trailColor: "#d6d6d6",
              })}
            >
              <h3 className="text-xl">{percentage}%</h3>
            </CircularProgressbarWithChildren>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProblemCard;
