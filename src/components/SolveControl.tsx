import { JSX, useEffect, useState } from "react";
import IsReal from "./IsReal";
import IsForContribution from "./IsForContribution";
import SolutionForm from "@/forms/contribution-form/SolutionForm";
import IsForDonation from "./IsForDonation";
import ProblemProgress from "@/forms/problem-form/ProblemProgress";
import GovPerson from "@/forms/problem-form/GovPerson";
import EndProject from "./EndProject";
import { useGetAcceptedContribution, useGetAllProblemsContribution, useGetContributions, useGetGovSolution, useGetPendingContributions, useGetRejectedContributions, useSelectContribution, useUnselectContribution } from "@/hooks/use-Contribution";
import { useGetProblemById } from "@/hooks/use-problem";
import keycloak from "@/lib/keycloak";
import { useGetMyUser } from "@/hooks/use-user";
import SelectContributionsProcess from "./SelectContributionsProcess";
import { useCreateDonation, useGetProblemDonations, useGetPublicDonors } from "@/hooks/use-donation";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";



const SolveControl = ({ problemId }: { problemId: number }): JSX.Element => {
  const [isReal, setIsReal] = useState<boolean>();

  //[/]|[\][/]|[\][/]|[\] CONTRIBUTIONS [/]|[\][/]|[\][/]|[\]
  //[/]|[\][/]|[\] ForContribution [/]|[\][/]|[\]
  const [isForContribution, setIsForContribution] = useState<boolean>();
  const [isSelected, setIsSelected] = useState<boolean>();
  const [selectedContribution, setSelectedContribution] = useState<any>();
  
  //[/]|[\][/]|[\] SelfSolve [/]|[\][/]|[\] 
  const [isSelfSolve, setIsSelfSolve] = useState<boolean>();
  const [solutionSet, setSolutionSet] = useState<boolean>();


  //[/]|[\][/]|[\][/]|[\] Donation [/]|[\][/]|[\][/]|[\]
  //[/]|[\][/]|[\] ForDonation [/]|[\][/]|[\]
  const [isForDonation, setIsForDonation] = useState<boolean>();
  const [donationDone, setDonationDone] = useState<boolean>();

  //[/]|[\][/]|[\] SelfFounded [/]|[\][/]|[\]
  const [selfFounded, setSelfFounded] = useState<boolean>();
  const [selfBudget, setSelfBudget] = useState<number>();


  //[/]|[\][/]|[\] TODO [/]|[\][/]|[\]
  const [govSelected, setGovSelected] = useState(false);
  const [isEndProject, setIsEndProject] = useState<boolean>();



  const [pendContributions, setPendContributions] = useState<any>();

  const [isDateSet, setIsDateSet] = useState<Boolean>();


  const [isPayLoading, setIsPayLoading] = useState(false);





  //[/]|[\] Get All Contributions by ProblemId [/]|[\]
  const { contributions } = useGetContributions(problemId);

  //[/]|[\] Get Problem by ProblemId [/]|[\]
  const { problem } = useGetProblemById(problemId);

  //[/]|[\] Get CurrentUser [/]|[\]
  const { currentUser } = useGetMyUser();

  //[/]|[\] Get All Pending Contributions [/]|[\]
  const { data: pendingContribution } = useGetPendingContributions(problemId);
  //[/]|[\] Get All Pending Contributions [/]|[\]
  const { data: elseContribution } = useGetAllProblemsContribution(problemId);
  //[/]|[\] Get Accepted Contribution [/]|[\]
  const { data: acceptedContribution } = useGetAcceptedContribution(problemId);


  //[/]|[\][/]|[\][/]|[\] Donation [/]|[\][/]|[\][/]|[\]
  const { data: donations = [], isLoading: isLoadingDonations, isError } = useGetProblemDonations(problemId);
  const { data: publicDonors = [] } = useGetPublicDonors(problemId);
  const donationMutation = useCreateDonation(problemId);
  

  const successfulDonations = donations.filter(d => d.status === "SUCCESS");
  const donorIds = successfulDonations.filter(d => !d.isAnonymous).map(d => d.donorId);
  const totalDonated = successfulDonations.reduce((sum, d) => sum + d.amount, 0);
  const remainingAmount = (acceptedContribution?.estimatedCost || 0) - totalDonated;



  //[/]|[\] Get Gov Solution [/]|[\]
  const { data: govSolution } = useGetGovSolution(problemId);

  //[/]|[\] Selected Solution and Reject other [/]|[\]
  const { mutate: selectContribution, isLoading } = useSelectContribution({
    problemId,
    currentUser,
    contributions,
    onSuccess: (selected) => {
      setIsSelected(true);
      setSelectedContribution(selected);
    },
  });

  //[/]|[\] Make all solutions in Pending_Approval [/]|[\]
  const { mutate: unselectContribution, isLoading: unselecting } = useUnselectContribution({
    problemId,
    contributions,
    onSuccess: () => {
      setIsSelected(false);
      setSelectedContribution(undefined);
    },
  });




  //[/]|[\] while govSolution changed, Check if there is gov solution set is setSolve = true [/]|[\]
  useEffect(() => {
    if (govSolution) {
      setIsSelfSolve(true);
    }
  }, [govSolution]);

  //[/]|[\] while problem changed, Check if problem is forContribution or not [/]|[\]
  useEffect(() => {
    if(problem?.forContribution ){
      setIsForContribution(true);
    }
    if(!problem?.forContribution){
      setIsForContribution(false);
    }
  }, [problem])

  useEffect(() => {
    if(problem?.forContribution ){
      setIsForContribution(true);
    }
    if(!problem?.forContribution){
      setIsForContribution(false);
    }
    if(govSolution){
      setIsSelfSolve(true);
    }
    if(acceptedContribution){
      setIsSelected(true);
    }
    if(pendingContribution?.length === 0){
      setPendContributions(elseContribution);
    }
    if(problem?.forDonation){
      setIsForDonation(true);
    }
    if(!problem?.forDonation){
      setSelfFounded(true);
    }
    if(acceptedContribution?.startDate && acceptedContribution.endDate){
      setIsDateSet(true);
    }
    if(remainingAmount === 0){
      setDonationDone(true)
    }
  }, [])


  useEffect(() => {
    if(pendingContribution){
      setPendContributions(pendingContribution);
    }
    if(pendingContribution?.length === 0){
      setPendContributions(elseContribution);
    }
  }, [pendingContribution])



  //[/]|[\] while acceptedContribution changed, Check if there is acceptedContribution and compare between contributions and find the match [/]|[\]
  // useEffect(() => {
  //   if (acceptedContribution && contributions?.length) {
  //     const match = contributions.find(c => c.id === acceptedContribution.id );
  //     if (match.proposedByUserId !== match.acceptedByUserId) {
  //       setSelectedContribution(match);
  //       setIsSelected(true);
  //       setIsForContribution(true);
  //     }
  //   }
  // }, [acceptedContribution]);


  //[/]|[\]  [/]|[\]
  // console.log("isForDonation", isForDonation);
  // console.log("selfFounded", selfFounded);


  const handleGovPay = async (amount: number) => {
    if (amount <= 0) {
      toast.error("الرجاء اختيار مبلغ صحيح للتبرع");
      return;
    }

    setIsPayLoading(true);
    try {
      const response = await donationMutation.mutateAsync({
        amount,
        currency: "USD",
        paymentMethod: 'STRIPE',
        isAnonymous: false,
        successUrl: window.location.href,
        cancelUrl: window.location.href,
        idempotencyKey: uuidv4(),
      });


      if (response.sessionUrl) {
        window.location.href = response.sessionUrl;
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تنفيذ التبرع");
    } finally {
      setIsPayLoading(false);
    }
  };



  return (
    <div className="flex flex-col gap-10 mt-10">
      <div className="flex flex-col gap-8">
        <h1 className="text-xl">وضع الشكوى</h1>

        <IsReal setIsReal={setIsReal} isReal={isReal} problemId={problemId} />

        {isReal && (
          <div className="flex flex-col gap-8">
            <IsForContribution
              isForContribution={isForContribution}
              setIsForContribution={setIsForContribution}

              isSelected={isSelected}
              setIsSelected={setIsSelected}

              isSelfSolve={isSelfSolve}
              setIsSelfSolve={setIsSelfSolve}

              setSolutionSet={setSolutionSet}

              setIsForDonation={setIsForDonation}
              setSelfFounded={setSelfFounded}

              problemId={problemId}
              
              acceptedContribution={acceptedContribution}
              contributions={contributions}
              accessToken={keycloak.token}
            />

            {(isForContribution ) 
              ? (
                <SelectContributionsProcess
                  isSelected={isSelected}
                  isForContribution={isForContribution}
                  selectedContribution={selectedContribution}

                  contributions={contributions}

                  // pendingContributions={pendingContribution}
                  acceptedContribution={acceptedContribution}
                  selectContribution={selectContribution}
                  unselectContribution={unselectContribution}

                  setSelectedContribution={setSelectedContribution}

                  setIsSelected={setIsSelected}

                  pendContributions={pendContributions}
                  elseContribution={elseContribution}

                />
              ) : (
                <SolutionForm
                  key={solutionSet ? "withSolution" : "withoutSolution"}
                  problemId={problemId}
                  setSolutionSet={setSolutionSet}
                  setSelfBudget={setSelfBudget}
                />
              )}



            {(isSelected || solutionSet) && (
              <div className="flex flex-col gap-5">
                <IsForDonation
                  setIsForDonation={setIsForDonation}
                  isForDonation={isForDonation}
                  setSelfFounded={setSelfFounded}
                  isDateSet={isDateSet}
                  donationDone={donationDone}

                  problemId={problemId}
                  acceptedContribution={acceptedContribution}
                />

                {/* {isForDonation || problem?.forDonation ? ( */}
                {isForDonation ? (
                  <div className="flex flex-col gap-5">
                    {publicDonors?.content?.map((donation) => (
                      <h3 className="text-lg">تم التبرع بمبلغ <b>{donation.amount}</b> من قبل  <b>{donation.firstName + " " + donation.lastName}</b> بتاريخ <b>{donation.donationDate.split("T")[0]}</b></h3>
                    ))}
                    <div className="text-lg font-semibold text-green-700">
                      تم جمع {totalDonated} / {acceptedContribution?.estimatedCost}
                    </div>
                    {remainingAmount >=0 && !donationDone && (
                      <div className="flex flex-col gap-5">
                        <div>المبلغ المتبقي: {remainingAmount}</div>
                        <Button
                          className="w-[50%] h-[60px] flex flex-col cursor-pointer"
                          onClick={() => handleGovPay(remainingAmount)}
                          disabled={isPayLoading || remainingAmount <= 0}
                        >
                          <h3>التبرع بكامل المبلغ المتبقي</h3>
                          <h3 className="text-[12px]">المبلغ هو {remainingAmount} ليرة سورية</h3>
                        </Button>
                      </div>
                    )}
                    {remainingAmount <= 0 && (
                      <div className="text-red-600 font-bold">تم جمع كامل المبلغ المطلوب</div>
                    )}
                    {donationDone && (
                      <div className="flex flex-col gap-5">
                        <EndProject 
                          setIsEndProject={setIsEndProject} 
                          contributionId={acceptedContribution?.id!}  
                          problemId={problemId}

                          startDate={acceptedContribution?.startDate}
                          endDate={acceptedContribution?.endDate}
                        />
                        {isEndProject && <ProblemProgress problemId={problemId} solutionId={acceptedContribution?.id} />}
                      </div>
                    )}
                  </div>
                ) : selfFounded ? (
                  <div className="flex flex-col gap-10">
                    <EndProject 
                      setIsEndProject={setIsEndProject} 
                      contributionId={acceptedContribution?.id!}  
                      problemId={problemId}

                      startDate={acceptedContribution?.startDate}
                      endDate={acceptedContribution?.endDate}
                    />
                    {isEndProject && <ProblemProgress problemId={problemId} solutionId={acceptedContribution?.id} />}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SolveControl;
