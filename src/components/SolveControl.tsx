import { JSX, use, useEffect, useState } from "react";
import IsReal from "./IsReal";
import IsForContribution from "./IsForContribution";
import ContributionCard from "@/forms/contribution-form/ContributionCard";
import { Button } from "./ui/button";
import { Check, Edit } from "lucide-react";
import PaginationComp from "./PaginationComp";
import SolutionForm from "@/forms/contribution-form/SolutionForm";
import IsForDonation from "./IsForDonation";
import Donations from "./Donations";
import ProblemProgress from "@/forms/problem-form/ProblemProgress";
import GovPerson from "@/forms/problem-form/GovPerson";
import EndProject from "./EndProject";
import { useGetContributions } from "@/hooks/use-Contribution";
import { useGetProblemById } from "@/hooks/use-problem";


type ContributionCard = {
  username: string,
  date: string,
  contribution: string,
  budget: number,
}

const SolveControl = ({...props}): JSX.Element => {

  const [isReal, setIsReal] = useState<Boolean>();
  const [isForContribution, setIsForContribution] = useState<Boolean>();
  const [isSelected, setIsSelected] = useState<Boolean>();
  const [selectedContribution, setSelectedContribution] = useState<ContributionCard>();
  const [isSelfSolve, setIsSelfSolve] = useState<Boolean>();
  const [solutionSet, setSolutionSet] = useState<Boolean>();

  const [isForDonation, setIsForDonation] = useState<Boolean>();
  const [selfFounded, setSelfFounded] = useState<Boolean>();
  const [donationDone, setDonationDone] = useState<Boolean>();

  const [selfBudget, setSelfBudget] = useState<number>();

  const [govSelected, setGovSelected] = useState(false);

  const [isEndProject, setIsEndProject] = useState<Boolean>();

  const { contributions } = useGetContributions(props.problemId);
  console.log(contributions);
  const { problem } = useGetProblemById(props.problemId);
  
  useEffect(() => {
    if (contributions && contributions.length > 0) {
      const selfSolveExists = contributions.some(
        (contribution) => contribution.proposedByUserId === contribution.acceptedByUserId
      );
      setIsSelfSolve(selfSolveExists);
    }
  }, [contributions]);
  

  // const Contributions = [
  //   {
  //     username: 'أمير بطال',
  //     date: '23/3/2025',
  //     contribution: "استطيع حل المشكلة من خلال عدة نقاط أهمها النقطة الأولى من خلال شراء المواد الأولية",
  //     budget: 120
  //   },
  //   {
  //     username: 'أمير بطال',
  //     date: '23/3/2025',
  //     contribution: "يمكن حل المشكلة من خلال...",
  //     budget: 120
  //   },
  //   {
  //     username: 'أمير بطال',
  //     date: '23/3/2025',
  //     contribution: "أستطيع حل المشكلة خلال أقل من 24 ساعة حيث أنني سوف اقوم بما يلي: - بالبداية سوف افحص مكان المشكلة. - ثم سوف اقوم بشراء المواد الأولية التي تلزمني - بعد ذلك سوف أقوم بإصلاح المشكلة:",
  //     budget: 120
  //   },
  // ]

  const handleSelect = (contribution: ContributionCard) => {
    setIsSelected(true);
    setSelectedContribution(contribution);
  }

  const handleUnSelect = () => {
    setIsSelected(false);
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-8">
        <h1 className="text-xl">وضع الشكوى</h1>

        <IsReal setIsReal={setIsReal} isReal={isReal} problemId={props.problemId}/>
        {isReal
          ?(
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-5">
                <IsForContribution 
                  setIsForContribution={setIsForContribution} 
                  isForContribution={isForContribution} 
                  isSelected={isSelected} 
                  setIsSelfSolve={setIsSelfSolve} 
                  isSelfSolve={isSelfSolve}
                  setIsSelected={setIsSelected}
                  setSolutionSet={setSolutionSet}
                  setIsForDonation={setIsForDonation}
                  setSelfFounded={setSelfFounded}
                  problemId={props.problemId}
                />
                {isForContribution || problem?.forContribution
                  ?(
                    // TODO: Make in a isolated component
                    <div className="flex flex-col gap-5">
                      {isSelected
                        ?(
                          <ContributionCard 
                            username={selectedContribution?.username}
                            date={selectedContribution?.date}
                            contribution={selectedContribution?.contribution}
                            budget={selectedContribution?.budget}
                          >
                            <div className="flex flex-row-reverse">
                              <Button type="button" onClick={handleUnSelect} className="m-1 cursor-pointer" variant={'ghost'}>
                                <h3>حل آخر</h3>
                                <Edit />
                              </Button>
                            </div>
                          </ContributionCard>
                        ):(
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-5">
                              {contributions.map((contribution) => (
                                <ContributionCard 
                                  username={contribution.user.firstName + " " + contribution.user.lastName}
                                  date={contribution.startDate}
                                  contribution={contribution.description}
                                  budget={contribution.estimatedCost}
                                >
                                  <div className="flex flex-row-reverse">
                                    <Button type="button" onClick={() => handleSelect(contribution)} variant={"ghost"} className="m-1 cursor-pointer">
                                      <h3>اختيار الحل</h3>
                                      <Check />
                                    </Button>
                                  </div>
                                </ContributionCard>
                              ))}
                            </div>
                            <PaginationComp />
                          </div>
                        )
                      }
                    </div>
                  ):isSelfSolve
                    ?(
                      <div>
                        <SolutionForm
                          problemId={props.problemId}
                          setSolutionSet={setSolutionSet}
                          setSelfBudget={setSelfBudget}
                        />
                      </div>
                    ):(
                      <div></div>
                    )
                }
              </div>

              <div>
              {/* // isSelected => select Contribution &&  solutionSet => gov set Solution */}
              {isSelected || solutionSet
                ?(
                  <div className="flex flex-col gap-5">
                    <IsForDonation 
                      setIsForDonation={setIsForDonation}
                      isForDonation={isForDonation}
                      setSelfFounded={setSelfFounded}
                      donationDone={donationDone}
                    />
                    {isForDonation
                      ?(
                        <div className="flex flex-col gap-5">ق
                          <Donations 
                            setDonationDone={setDonationDone} 
                            donationDone={donationDone} 
                            expectedDonate={selectedContribution?.budget || selfBudget}
                          />
                          {isSelected && donationDone || isSelfSolve && donationDone
                            ?(
                              <GovPerson setGovSelected={setGovSelected} />
                            ):(
                              <div></div>
                            )
                          }
                          {govSelected
                            ?(
                              <div>
                                <EndProject setIsEndProject={setIsEndProject} />
                                {isEndProject
                                  ?(
                                    <ProblemProgress />
                                  ):(
                                    <div></div>
                                  )
                                }
                              </div>
                            ):(
                              <div></div>
                            )
                          }
                        </div>
                      ):selfFounded
                      ?(
                        <div className="flex flex-col gap-10">
                          <EndProject setIsEndProject={setIsEndProject} />
                          {isEndProject
                            ?(
                              <ProblemProgress />
                            ):(
                              <div></div>
                            )
                          }
                          
                        </div>
                      ):(
                        <div></div>
                      )
                    }
                  </div>
                ):(
                  <div></div>
                )
              }
              </div>
            </div>
          ):(
            <div></div>
          )
        }
      </div>
    </div>
  );
};

export default SolveControl;