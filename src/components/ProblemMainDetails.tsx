import { Check, Image } from "lucide-react";
import { Badge } from "./ui/badge";
import MapPicker from "./MapPicker";
import ProblemOverlay from "@/forms/problem-form/ProblemOverlay";
import ContributionForm from "@/forms/contribution-form/ContributionForm";
import DonationForm from "@/forms/donation-form/DonationForm";
import ContributionCard from "@/forms/contribution-form/ContributionCard";
import PaginationComp from "./PaginationComp";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import SolveControl from "./SolveControl";
import { useParams } from "react-router-dom";
import { useGetProblemById } from "@/hooks/use-problem";
import { useAddress, useCities } from "@/hooks/use-Address";
import { useCategory } from "@/hooks/use-category";
import { useGetUserById } from "@/hooks/use-user";
import keycloak from "@/lib/keycloak";
// import * as jwt_decode from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import { useGetProblemPhotos } from "@/hooks/use-problem-photo";
import ImageGallery from "./ImageGallery";
import { toast } from "sonner";
import { useGetAcceptedContribution } from "@/hooks/use-Contribution";



type MainDetailsProp = {
  contribution?: boolean;
  donation?: boolean;
  problemId?: number;
};

const ProblemMainDetails = (prop: MainDetailsProp) => {
  const { problemId } = useParams();
  const [donation, setDonation] = useState<number>(0);
  const [isDonated, setIsDonated] = useState<boolean>(false);
  // const [isGov, setIsGov] = useState(true);


  const { problem, isLoading: isProblemLoading } = useGetProblemById(Number(problemId));
  const { photos, isLoading: isPhotosLoading } = useGetProblemPhotos(Number(problemId));


  const addressId = problem?.addressId;
  const categoryId = problem?.categoryId;
  const submittedByUserId = problem?.submittedByUserId;

  
  const { data: address } = useAddress(addressId ?? 0);
  const { data: category } = useCategory(categoryId ?? 0);
  const { data: user, isLoading: userLoading } = useGetUserById(submittedByUserId?.toString() ?? "");
  const { data: cities } = useCities();

  const { data: acceptedContribution } = useGetAcceptedContribution(Number(problemId));
  const { data: proposedUser } = useGetUserById(acceptedContribution?.proposedByUserId ?? "");


  const cityArabicName = cities?.find(c => c.value === address?.city)?.arabic ?? address?.city;

  const token = keycloak.token;
  type DecodedToken = {
    resource_access?: {
      [key: string]: {
        roles?: string[];
      };
    };
  };

  const decoded = token ? jwtDecode<DecodedToken>(token) : null;
  const roles = decoded?.resource_access?.["kafu-client"]?.roles ?? [];
  const isGov = roles.includes("ROLE_GOV");


  useEffect(() => {
      const toastMessage = sessionStorage.getItem("showToastDone");
      if (toastMessage) {
        toast(toastMessage,{
          style:{
            display: 'flex',
            flexDirection: 'row',
            gap: '20px',
            background: '#008c2f',
            color: '#fff',
            direction: 'rtl',
            border: 'none',
          },
          icon: <Check />,
          closeButton: true
        })
        sessionStorage.removeItem("showToastDone");
      }
    }, []);


  if (isProblemLoading) return <div>جاري تحميل التفاصيل...</div>;
  if (!problem) return <div>المشكلة غير موجودة</div>;
  if (userLoading) return <div>جاري تحميل بيانات المستخدم...</div>;


  return (
    <div className="flex flex-row gap-10 px-10">
      <div className="w-[60%] flex flex-col gap-15">
        <div className="flex flex-col gap-5">
          <h1 className="text-2xl">{problem.title}</h1>
          <p className="w-[80%] text-xl text-black">{problem.description}</p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="h-[30px] flex flex-row gap-2">
            <Badge className="rounded-none" variant="default">{cityArabicName}</Badge>
            <Badge className="rounded-none" variant="secondary">{category?.name}</Badge>
            <Badge className="rounded-none" variant="secondary">{address?.description}</Badge>
          </div>

          {isGov ? (
            <div className="flex flex-col gap-5">
              <h3>تاريخ إنشاء الشكوى: {new Date(problem.submissionDate).toLocaleDateString()}</h3>
              {user && (
                <UserCard
                  username={user.firstName + " " + user.lastName}
                  date={String(user.dateOfBirth)}
                  study={String(user.collegeDegree)}
                  job={String(user.job)}
                  details={String(user.description)}
                  address={`${cityArabicName}، ${address?.description}`}
                  phoneNumber={String(user.phone)}
                  email={user.email}
                />
              )}
            </div>
          ) : (
            <h3 className="text-[10]">{user?.firstName + " " + user?.lastName} - {new Date(problem.submissionDate).toLocaleDateString()}</h3>
          )}
        </div>

        {prop.contribution ? (
          <div className="flex flex-col gap-10">
            <h1 className="text-2xl">شارك في حل المشكلة وقدم اقتراحًا لحلها</h1>
            <ContributionForm problemId={Number(problemId)}/>
            <PaginationComp />
          </div>
        ) : prop.donation ? (
          <div className="flex flex-col gap-20">
            <div className="flex flex-col gap-5">
              <h1 className="text-2xl">شارك في حل المشكلة وقم بالتبرع</h1>
              {acceptedContribution && proposedUser && (
                <ContributionCard
                  username={`${proposedUser.firstName} ${proposedUser.lastName}`}
                  date={acceptedContribution.startDate}
                  contribution={acceptedContribution.description}
                  budget={acceptedContribution.estimatedCost}
                />
              )}

            </div>
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-5">
                <h1 className="text-2xl">آلية التبرع</h1>
                {isDonated ? (
                  <div className="flex flex-row gap-2 items-center">
                    <h3 className="text-[22px]">تم التبرع بمبلغ {donation} ليرة سورية</h3>
                    <Check size={30} />
                  </div>
                ) : null}
                <h3>التبرع بجزء من المبلغ</h3>  
              </div>
              <DonationForm
                  max={acceptedContribution?.estimatedCost || 0}
                  setDonation={setDonation}
                  setIsDonated={setIsDonated}
                  problemId={problemId}
                />

            </div>
          </div>
        ) : (
          <div>
            {isGov ? <SolveControl /> : (
              <div className="flex flex-row gap-5">
                <ProblemOverlay problemId={prop.problemId} status="edit" />
                <ProblemOverlay problemId={prop.problemId} status="delete" />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-[40%] flex flex-col gap-10">
        {isPhotosLoading ? (
            <div className="flex justify-center items-center bg-gray-100 w-full h-[350px]">جاري تحميل الصور...</div>
          ) : photos.length > 0 ? (
            <div className="w-full h-[350px]">
              <ImageGallery images={photos.map(photo => photo.s3Key)} />
            </div>
          ) : (
            <div className="flex justify-center items-center bg-gray-100 w-full h-[350px]">
              لا توجد صور متاحة
            </div>
          )}

        <div className="w-[75%] flex flex-col gap-2 z-0">
          <>
            <MapPicker disableMap lat={address?.latitude} lng={address?.longitude} onLocationSelect={() => {}} />
            <h3>{address ? `${cityArabicName}، ${address.description}` : "الموقع غير معروف"}</h3>
          </>

        </div>
      </div>
    </div>
  );
};

export default ProblemMainDetails;
