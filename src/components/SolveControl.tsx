import { JSX, useEffect, useState } from "react";
import IsReal from "./IsReal";
import IsForContribution from "./IsForContribution";
import SolutionForm from "@/forms/contribution-form/SolutionForm";
import IsForDonation from "./IsForDonation";
import Donations from "./Donations";
import ProblemProgress from "@/forms/problem-form/ProblemProgress";
import GovPerson from "@/forms/problem-form/GovPerson";
import EndProject from "./EndProject";
import { useGetAcceptedContribution, useGetAllProblemsContribution, useGetContributions, useGetGovSolution, useGetPendingContributions, useGetRejectedContributions, useSelectContribution, useUnselectContribution } from "@/hooks/use-Contribution";
import { useGetProblemById, useUpdateProblemForContribution } from "@/hooks/use-problem";
import keycloak from "@/lib/keycloak";
import { useGetMyUser } from "@/hooks/use-user";
import SelectContributionsProcess from "./SelectContributionsProcess";


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
  console.log("isForDonation", isForDonation);
  console.log("selfFounded", selfFounded);



  return (
    <div className="flex flex-col gap-10">
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
                    <Donations
                      setDonationDone={setDonationDone}
                      donationDone={donationDone}
                      expectedDonate={selectedContribution?.budget || selfBudget}

                      solutionId={acceptedContribution?.id}

                      startDate={acceptedContribution?.startDate}
                      endDate={acceptedContribution?.endDate}
                    />
                    {(donationDone && (isSelected || isSelfSolve)) && (
                      <GovPerson setGovSelected={setGovSelected} />
                    )}
                    {govSelected && (
                      <div>
                        <EndProject setIsEndProject={setIsEndProject} />
                        {isEndProject && <ProblemProgress />}
                      </div>
                    )}
                  </div>
                // ) : selfFounded || !problem?.forDonation ? (
                ) : selfFounded ? (
                  <div className="flex flex-col gap-10">
                    <EndProject 
                      setIsEndProject={setIsEndProject} 
                      contributionId={acceptedContribution?.id!}  
                      problemId={problemId}

                      startDate={acceptedContribution?.startDate}
                      endDate={acceptedContribution?.endDate}
                    />
                    {isEndProject && <ProblemProgress />}
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
