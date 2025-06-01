import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Ban, Check } from "lucide-react";

import { Badge } from "./ui/badge";
import MapPicker from "./MapPicker";
import ImageGallery from "./ImageGallery";
import ProblemOverlay from "@/forms/problem-form/ProblemOverlay";
import ContributionForm from "@/forms/contribution-form/ContributionForm";
import ContributionCard from "@/forms/contribution-form/ContributionCard";
import DonationForm from "@/forms/donation-form/DonationForm";
import UserCard from "./UserCard";
import SolveControl from "./SolveControl";

import { useGetProblemById } from "@/hooks/use-problem";
import { useGetProblemPhotos } from "@/hooks/use-problem-photo";
import { useGetAcceptedContribution, useGetSolutionById } from "@/hooks/use-Contribution";
import { useGetProblemDonations, useGetPublicDonors } from "@/hooks/use-donation";
import { useGetMyUser, useGetUserById } from "@/hooks/use-user";
import { useAddress, useCities } from "@/hooks/use-Address";
import { useCategory } from "@/hooks/use-category";

import keycloak from "@/lib/keycloak";
import GovPerson from "@/forms/problem-form/GovPerson";
import ProgressPreview from "./ProgressPreview";
import { useMinistryById } from "@/hooks/use-gov";
import { useGetProblemProgress } from "@/hooks/use-progress";

type MainDetailsProp = {
  contribution?: boolean;
  donation?: boolean;
  problemId?: number;
};

const ProblemMainDetails = (prop: MainDetailsProp) => {
  
  //[/]|[\][/]|[\][/]|[\] KEYCLOAK [/]|[\][/]|[\][/]|[\]
  const roles = keycloak.tokenParsed?.resource_access?.["react-client"].roles || []


  //[/]|[\][/]|[\][/]|[\] PROBLEM [/]|[\][/]|[\][/]|[\]
  const { problemId } = useParams();
  const numericProblemId = Number(problemId);

  const { problem, isLoading: isProblemLoading } = useGetProblemById(numericProblemId);
  const { photos, isLoading: isPhotosLoading } = useGetProblemPhotos(numericProblemId);

  const addressId = problem?.addressId ?? 0;
  const categoryId = problem?.categoryId ?? 0;
  const submittedByUserId = problem?.submittedByUserId?.toString() ?? "";

  const { data: problemProgress } = useGetProblemProgress(numericProblemId);

  console.log(problemProgress);
  
  
  //[/]|[\][/]|[\][/]|[\] CONTRIBUTIONS [/]|[\][/]|[\][/]|[\]
  const { data: acceptedContribution } = useGetAcceptedContribution(numericProblemId,);

  const { data: onlyAcceptedSolution } = useGetSolutionById(numericProblemId, acceptedContribution?.id);


  const startDateObj = new Date(onlyAcceptedSolution?.startDate);
  const endDateObj = new Date(onlyAcceptedSolution?.endDate);

  console.log(acceptedContribution);
  const diffInTime = endDateObj.getTime() - startDateObj.getTime(); // الفارق بالملي ثانية
  const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24)); // تحويله إلى أيام
  
  const proposedUserId = acceptedContribution?.proposedByUserId ?? "";
  

  //[/]|[\][/]|[\][/]|[\] USER [/]|[\][/]|[\][/]|[\]
  const { currentUser } = useGetMyUser();
  const { data: user, isLoading: userLoading } = useGetUserById(submittedByUserId);
  const { data: govPerson } = useGetUserById(problem?.approvedByUserId?.toString() ?? "");
  const { data: govMinistry } = useMinistryById(govPerson?.govId);
  const { data: parentMinistry } = useMinistryById(govMinistry?.parentGovId);


  const { data: proposedUser } = useGetUserById(proposedUserId, { enabled: !!proposedUserId });


  //[/]|[\][/]|[\][/]|[\] DONATIONS [/]|[\][/]|[\][/]|[\]
  const [donation, setDonation] = useState<number>(0);
  const [isDonated, setIsDonated] = useState<boolean>(false);

  const { data: donations = [], isLoading: isLoadingDonations, isError } = useGetProblemDonations(numericProblemId);
  const { data: publicDonors = [] } = useGetPublicDonors(numericProblemId);

  const successfulDonations = donations.filter(d => d.status === "SUCCESS");
  const donorIds = successfulDonations.filter(d => !d.isAnonymous).map(d => d.donorId);
  const totalDonated = successfulDonations.reduce((sum, d) => sum + d.amount, 0);
  const remainingAmount = (acceptedContribution?.estimatedCost || 0) - totalDonated;
  


  

  //[/]|[\][/]|[\][/]|[\] ADDRESS [/]|[\][/]|[\][/]|[\]
  const { data: address } = useAddress(addressId);
  const { data: cities } = useCities();
  const { data: userAddress } = useAddress(user?.addressId);

  const cityArabicName = cities?.find(c => c.value === address?.city)?.arabic ?? address?.city;


  //[/]|[\][/]|[\][/]|[\] CATEGORY [/]|[\][/]|[\][/]|[\]
  const { data: category } = useCategory(categoryId);  



  const location = useLocation();
  const toastMessage = location.state?.toastMessage;
  const toastType = location.state?.type;


  useEffect(() => {
    const keys = [
      { key: "showToastNewProblem", icon: <Check />, bg: "#008c2f" },
      { key: "showToastProblemEdit", icon: <Check />, bg: "#008c2f" },
      { key: "showToastContributionSet", icon: <Check />, bg: "#008c2f" },
      { key: "showToastContributionUpdate", icon: <Check />, bg: "#008c2f" },
      { key: "showToastContributionDelete", icon: <Ban />, bg: "#cc1100" },
    ];

    for (const { key, icon, bg } of keys) {
      const message = sessionStorage.getItem(key);
      if (message) {
        toast(message, {
          style: {
            display: 'flex',
            flexDirection: 'row',
            gap: '20px',
            background: bg,
            color: '#fff',
            direction: 'rtl',
            border: 'none',
          },
          icon,
          closeButton: true,
        });
        sessionStorage.removeItem(key);
      }
    }
  }, []);


  if (isProblemLoading) return <div>جاري تحميل التفاصيل...</div>;
  if (!problem) return <div>المشكلة غير موجودة</div>;
  if (userLoading) return <div>جاري تحميل بيانات المستخدم...</div>;
  if (isLoadingDonations) return <p>جاري تحميل التبرعات...</p>;
  if (isError) return <p>حدث خطأ أثناء تحميل التبرعات</p>;


  return (
    <div className="flex flex-col gap-5">
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

            {roles.includes("ROLE_GOV")
              ?(
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-5">
                    <h3>تاريخ إنشاء الشكوى: {new Date(problem.submissionDate).toLocaleDateString()}</h3>
                    {user && (
                      <UserCard
                        username={`${user.firstName} ${user.lastName}`}
                        date={String(user.dateOfBirth)}
                        study={String(user.collegeDegree)}
                        job={String(user.job)}
                        details={String(user.description)}
                        address={`${userAddress?.description}`}
                        phoneNumber={String(user.phone)}
                        email={user.email}
                        isGov={(user.firstName === currentUser?.firstName) && currentUser.govId ? true : false}
                      />
                    )}
                  </div>

                  <div>
                    {problem.submittedByUserId === currentUser?.id && (
                      <div className="flex flex-row gap-5">
                        <ProblemOverlay problemId={numericProblemId} status="edit" />
                        <ProblemOverlay problemId={numericProblemId} status="delete" />
                      </div>  
                    )}
                    <SolveControl problemId={numericProblemId} />
                  </div>

                </div>
              ):(
                <div className="flex flex-col gap-5">
                  <h3 className="text-[10]">{user?.firstName + " " + user?.lastName} - {new Date(problem.submissionDate).toLocaleDateString()}</h3>
                  
                  {prop.contribution 
                    ? (
                      <div className="flex flex-col gap-10">
                        <h1 className="text-2xl">شارك في حل المشكلة وقدم اقتراحًا لحلها</h1>
                        <ContributionForm problemId={numericProblemId} />
                        {/* <PaginationComp /> */}
                      </div>
                    ):prop.donation ? (
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
                                {publicDonors?.content?.map((donation: any) => (
                                    <li key={donation.id} className="bg-gray-100 p-3 rounded-md">
                                      <div className="flex justify-between">
                                        <span>{donation.isAnonymous ? "متبرع مجهول" : `${donation.firstName} ${donation.lastName}`}</span>
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
                    <div className="flex flex-col gap-5">
                      <div>
                        {(currentUser?.id === problem?.submittedByUserId) && (!problem.isReal) ? (
                            <div className="flex flex-row gap-5">
                              <ProblemOverlay problemId={numericProblemId} status="edit" />
                              <ProblemOverlay problemId={numericProblemId} status="delete" />
                            </div>
                          ):(<div></div>)
                        }
                      </div>
        
                      <div className="flex flex-col gap-10">
                        <div>
                          {(problem.isReal && acceptedContribution)
                          && (
                            <div className="flex flex-col gap-5">
                              <h1 className="text-2xl font-semibold">المساهمة المعتمدة</h1>
                              <ContributionCard
                                username={`${proposedUser?.firstName} ${proposedUser?.lastName}`}
                                date={acceptedContribution?.creationDate}
                                contribution={acceptedContribution?.description}
                                budget={acceptedContribution?.estimatedCost}
                              />
                            </div>
                          )}
                        </div>

                        {govPerson && problem.isReal && (
                          <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                              <h1 className="text-2xl font-semibold">الجهة المعنية</h1>
                              <h3>تفاصيل التواصل مع الجهة المعنية</h3>
                            </div>
                            <GovPerson
                              username={govPerson.firstName + " " + govPerson.lastName}
                              phoneNumber={govPerson.phone}
                              email={govPerson.email}
                              concernedGov={govMinistry?.name}
                              parentMinistry={parentMinistry?.name}
                              govSelected 
                            />
                          </div>
                        )}

                        <div className="flex flex-col gap-10">
                          {(problem.isReal && acceptedContribution && onlyAcceptedSolution?.startDate) &&
                            <div className="flex flex-col gap-5">
                              <h1 className="text-2xl font-semibold">الوقت المتوقع لإنهاء المشروع</h1>
                              <div className="flex flex-col gap-2">
                                <h3 className="text-lg">يجب إنهاء المشروع خلال <b>{diffInDays}</b> أيام حيث ان المدة المتوقعة لإنهاء المشروع هي</h3>
                                <h3 className="text-lg">من تاريخ <b>{onlyAcceptedSolution?.startDate}</b> إلى تاريخ <b>{onlyAcceptedSolution?.endDate}</b></h3>
                              </div>
                            </div>
                          }      
                          {(problem.isReal && problem.forDonation) && publicDonors &&
                            <div className="flex flex-col gap-5">
                              <h1 className="text-2xl font-semibold">الأشخاص المتبرعين لحل المشكلة</h1>
                              {publicDonors?.content?.map((donation) => (
                                <h3 className="text-lg">تم التبرع بمبلغ <b>{donation.amount}</b> من قبل السيد/ة <b>{donation.firstName + donation.lastName}</b> بتاريخ <b>{donation.donationDate.split("T")[0]}</b></h3>
                              ))}
                              <div className="text-lg font-semibold text-green-700">
                                تم جمع {totalDonated} / {acceptedContribution?.estimatedCost} {acceptedContribution?.currency}
                              </div>
                              {remainingAmount <= 0 && (
                                <div className="text-red-600 font-bold">تم جمع كامل المبلغ المطلوب</div>
                              )}
                            </div>
                          }
                        </div>
                      </div>
                      
                    </div>
                  )}

                </div>
              )
            }
          </div>
        </div>

        {/* عرض الصور والموقع */}
        <div className="w-[40%] flex flex-col gap-10">
          {isPhotosLoading 
            ? (
              <div className="flex justify-center items-center bg-gray-100 w-full h-[350px]">جاري تحميل الصور...</div>
            ) : photos.length > 0 ? (
              <div className="w-full h-[350px]">
                <ImageGallery images={photos.map(photo => photo.s3Key)} />
              </div>
            ) : (
              <div className="flex justify-center items-center bg-gray-100 w-full h-[350px]">
                لا توجد صور متاحة
              </div>
            )
          }

          <div className="w-[100%] flex flex-col gap-2 z-0">
            <MapPicker disableMap lat={address?.latitude} lng={address?.longitude} onLocationSelect={() => {}} />
            <h3>{address ? `${cityArabicName}، ${address.description}` : "الموقع غير معروف"}</h3>
          </div>
        </div>
      </div>


      {!roles.includes("ROLE_GOV") && (!prop.donation && !prop.contribution) && problemProgress && (
        <div className="flex flex-col gap-10 px-10 ml-10">
          <h1 className="text-2xl font-semibold">تقدم حل المشكلة</h1>
          <ProgressPreview 
            problemId={numericProblemId}
          />
        </div>
      )}
    </div>
  );
};

export default ProblemMainDetails;
