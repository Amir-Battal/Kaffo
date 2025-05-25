// ProblemMainDetails.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { Check } from "lucide-react";

import { Badge } from "./ui/badge";
import MapPicker from "./MapPicker";
import ImageGallery from "./ImageGallery";
import PaginationComp from "./PaginationComp";
import ProblemOverlay from "@/forms/problem-form/ProblemOverlay";
import ContributionForm from "@/forms/contribution-form/ContributionForm";
import ContributionCard from "@/forms/contribution-form/ContributionCard";
import DonationForm from "@/forms/donation-form/DonationForm";
import UserCard from "./UserCard";
import SolveControl from "./SolveControl";

import { useGetProblemById } from "@/hooks/use-problem";
import { useGetProblemPhotos } from "@/hooks/use-problem-photo";
import { useGetAcceptedContribution } from "@/hooks/use-Contribution";
import { useGetProblemDonations, useGetPublicDonors } from "@/hooks/use-donation";
import { useGetUserById } from "@/hooks/use-user";
import { useAddress, useCities } from "@/hooks/use-Address";
import { useCategory } from "@/hooks/use-category";

import keycloak from "@/lib/keycloak";

type MainDetailsProp = {
  contribution?: boolean;
  donation?: boolean;
  problemId?: number;
};

const ProblemMainDetails = (prop: MainDetailsProp) => {
  const { problemId } = useParams();
  const numericProblemId = Number(problemId);

  const [donation, setDonation] = useState<number>(0);
  const [isDonated, setIsDonated] = useState<boolean>(false);

  const { problem, isLoading: isProblemLoading } = useGetProblemById(numericProblemId);
  const { photos, isLoading: isPhotosLoading } = useGetProblemPhotos(numericProblemId);
  const { data: acceptedContribution } = useGetAcceptedContribution(numericProblemId);
  const { data: donations = [], isLoading: isLoadingDonations, isError } = useGetProblemDonations(numericProblemId);

  const addressId = problem?.addressId ?? 0;
  const categoryId = problem?.categoryId ?? 0;
  const submittedByUserId = problem?.submittedByUserId?.toString() ?? "";

  const { data: address } = useAddress(addressId);
  const { data: category } = useCategory(categoryId);
  const { data: user, isLoading: userLoading } = useGetUserById(submittedByUserId);
  const { data: cities } = useCities();

  const proposedUserId = acceptedContribution?.proposedByUserId ?? "";
  const { data: proposedUser } = useGetUserById(proposedUserId, { enabled: !!proposedUserId });

  const successfulDonations = donations.filter(d => d.status === "SUCCESS");
  const donorIds = successfulDonations.filter(d => !d.isAnonymous).map(d => d.donorId);
  
  const { data: publicDonors } = useGetPublicDonors(numericProblemId);
  console.log(publicDonors?.content);



  const cityArabicName = cities?.find(c => c.value === address?.city)?.arabic ?? address?.city;

  // const token = keycloak.token;
  // type DecodedToken = { resource_access?: { [key: string]: { roles?: string[] } } };
  // const decoded = token ? jwtDecode<DecodedToken>(token) : null;
  // const roles = decoded?.resource_access?.["kafu-client"]?.roles ?? [];
  // const isGov = roles.includes("ROLE_GOV");

  const roles = keycloak.tokenParsed?.resource_access?.["react-client"].roles || []


  const totalDonated = successfulDonations.reduce((sum, d) => sum + d.amount, 0);
  const remainingAmount = (acceptedContribution?.estimatedCost || 0) - totalDonated;

  useEffect(() => {
    const toastMessage = sessionStorage.getItem("showToastDone");
    if (toastMessage) {
      toast(toastMessage, {
        style: {
          display: 'flex',
          flexDirection: 'row',
          gap: '20px',
          background: '#008c2f',
          color: '#fff',
          direction: 'rtl',
          border: 'none',
        },
        icon: <Check />,
        closeButton: true,
      });
      sessionStorage.removeItem("showToastDone");
    }
  }, []);

  if (isProblemLoading) return <div>جاري تحميل التفاصيل...</div>;
  if (!problem) return <div>المشكلة غير موجودة</div>;
  if (userLoading) return <div>جاري تحميل بيانات المستخدم...</div>;
  if (isLoadingDonations) return <p>جاري تحميل التبرعات...</p>;
  if (isError) return <p>حدث خطأ أثناء تحميل التبرعات</p>;

  return (
    <div className="flex flex-row gap-10 px-10">
      <div className="w-[60%] flex flex-col gap-15">
        {/* عنوان ووصف المشكلة */}
        <div className="flex flex-col gap-5">
          <h1 className="text-2xl">{problem.title}</h1>
          <p className="w-[80%] text-xl text-black">{problem.description}</p>
        </div>

        {/* تفاصيل إضافية */}
        <div className="flex flex-col gap-5">
          <div className="h-[30px] flex flex-row gap-2">
            <Badge className="rounded-none" variant="default">{cityArabicName}</Badge>
            <Badge className="rounded-none" variant="secondary">{category?.name}</Badge>
            <Badge className="rounded-none" variant="secondary">{address?.description}</Badge>
          </div>

          {roles.includes("ROLE_GOV") ? (
            <div className="flex flex-col gap-5">
              <h3>تاريخ إنشاء الشكوى: {new Date(problem.submissionDate).toLocaleDateString()}</h3>
              {user && (
                <UserCard
                  username={`${user.firstName} ${user.lastName}`}
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

        {/* نموذج المساهمة أو التبرع */}
        {prop.contribution ? (
          <div className="flex flex-col gap-10">
            <h1 className="text-2xl">شارك في حل المشكلة وقدم اقتراحًا لحلها</h1>
            <ContributionForm problemId={numericProblemId} />
            {/* <PaginationComp /> */}
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
              {isDonated && (
                <div className="flex flex-row gap-2 items-center">
                  <h3 className="text-[22px]">تم التبرع بمبلغ {donation} ليرة سورية</h3>
                  <Check size={30} />
                </div>
              )}
              <h3>التبرع بجزء من المبلغ</h3>
              <DonationForm
                max={remainingAmount > 0 ? remainingAmount : 0}
                setDonation={setDonation}
                setIsDonated={setIsDonated}
                problemId={numericProblemId}
              />

              {successfulDonations.length > 0 && (
                <div className="flex flex-col gap-4 mt-4">
                  <h2 className="text-xl font-bold">المتبرعون:</h2>
                  <ul className="flex flex-col gap-2">
                    {successfulDonations.map((donation: any) => (
                        <li key={donation.id} className="bg-gray-100 p-3 rounded-md">
                          <div className="flex justify-between">
                            <span>
                              {/* {donation.isAnonymous ? "متبرع مجهول" : `ID ${donation.donorId}`} */}
                              {donation.isAnonymous
                                ? "متبرع مجهول"
                                : publicDonors?.content.map((donor) => (<h1>{donor.firstName}  {donor.lastName}</h1>))
                                // : (() => {
                                //     const donor = publicDonors?.content.find((d) => d.id === donation.donorId);
                                //     return donor ? `${donor.firstName} ${donor.lastName}` : `ID ${donation.donorId}`;
                                //   })()}
                              }
                            </span>
                            <span>{donation.amount} {donation.currency}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            بتاريخ: {new Date(donation.donationDate).toLocaleDateString()}
                          </div>
                        </li>
                      ))}
                  </ul>
                  <div className="text-lg font-semibold text-green-700">
                    تم جمع {totalDonated} / {acceptedContribution?.estimatedCost} {acceptedContribution?.currency}
                  </div>
                  {remainingAmount <= 0 && (
                    <div className="text-red-600 font-bold">تم جمع كامل المبلغ المطلوب</div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {roles.includes("ROLE_GOV") ? <SolveControl problemId={prop.problemId} /> : (
              <div className="flex flex-row gap-5">
                <ProblemOverlay problemId={prop.problemId} status="edit" />
                <ProblemOverlay problemId={prop.problemId} status="delete" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* عرض الصور والموقع */}
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
          <MapPicker disableMap lat={address?.latitude} lng={address?.longitude} onLocationSelect={() => {}} />
          <h3>{address ? `${cityArabicName}، ${address.description}` : "الموقع غير معروف"}</h3>
        </div>
      </div>
    </div>
  );
};

export default ProblemMainDetails;
