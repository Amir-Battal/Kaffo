import { Check, ChevronLeft, Timer } from "lucide-react";
import { Button } from "./ui/button";
import { JSX, useEffect, useState } from "react";
import { useGetProblemById, useUpdateProblemForDonation } from "@/hooks/use-problem";
import { useUpdateSolutionStatus } from "@/hooks/use-Contribution";

const IsForDonation = ({...prop}): JSX.Element => {

  const [isForDonation, setIsForDonation] = useState<boolean>();

  const { mutate: updateForDonation } = useUpdateProblemForDonation();
  const { mutate: updateSolutionStatus } = useUpdateSolutionStatus();
  const { problem } = useGetProblemById(prop.problemId);

  
  const handleForDonation = () => {
    updateForDonation({
      problemId: prop.problemId,
      forDonation: true,
      isReal: problem?.isReal,
      forContribution: problem?.forContribution,
      status: "PENDING_FUNDING"
    });
    updateSolutionStatus({
      problemId: prop.problemId,
      solutionId: prop.acceptedContribution.id,
      status: "PENDING_FUNDING"
    })

    prop.setIsForDonation(true);
    setIsForDonation(true);
    prop.setSelfFounded(false);
    // console.log("Cost is For Donation");
  }

  const handleSelfFounded = () => {
    updateForDonation({
      problemId: prop.problemId,
      forDonation: false,
      isReal: problem?.isReal,
      forContribution: problem?.forContribution,
      status: "WORK_IN_PROGRESS"
    });
    prop.setIsForDonation(false);
    setIsForDonation(false);
    prop.setSelfFounded(true);
    // console.log("Cost is Self Founded");
  }

  useEffect(() => {
    if(problem?.forDonation){
      setIsForDonation(true);
    } else{
      setIsForDonation(false);
    }
  }, [])

  // console.log("forDonation", prop.isForDonation);
  // console.log("selfFounded", prop.selfFounded);


  return (

    <div className="flex flex-col gap-5">
      <h3>تغطية التكاليف</h3>

      {/* {(prop.isForDonation && !prop.donationDone) || (problem?.forDonation && !prop.donationDone) || isForDonation */}
      {isForDonation && !prop.donationDone
        ?(
          <div className="w-[45%] flex flex-row gap-5">
            <Button className="w-full h-[40px] cursor-pointer" type="button" onClick={handleSelfFounded}>
              <h3>تغطية التكاليف</h3>
              <ChevronLeft />
            </Button>
            <Button className="w-full h-[40px] cursor-pointer bg-orange-500 hover:bg-orange-300" type="button" onClick={handleForDonation}>
              <h3>تفويض التكلفة للتبرع</h3>
              <Timer />
            </Button>
          </div>
        ):prop.isForDonation && prop.donationDone
        ?(
          <div className="w-[45%] flex flex-row gap-5">
            <Button disabled className="w-full h-[40px] cursor-pointer" type="button" onClick={handleSelfFounded}>
              <h3>تغطية التكاليف</h3>
              <ChevronLeft />
            </Button>
            <Button disabled className="w-full h-[40px] cursor-pointer bg-green-600 hover:bg-green-800" type="button" onClick={handleForDonation}>
              <h3>تم إتمام التبرع</h3>
              <Check />
            </Button>
          </div>
        // ):(prop.selfFounded) || (!problem?.forDonation) || !isForDonation
        ):!isForDonation && problem?.status !== "RESOLVED" 
        ?(
          <div className="w-[45%] flex flex-row gap-5">
            <Button className="w-full h-[40px] cursor-pointer bg-green-600 hover:bg-green-800" type="button" onClick={handleSelfFounded}>
              <h3>تغطية التكاليف</h3>
              <Check />
            </Button>
            <Button className="w-full h-[40px] cursor-pointer" type="button" onClick={handleForDonation}>
              <h3>تفويض التكلفة للتبرع</h3>
              <ChevronLeft />
            </Button>
          </div>
        ):!isForDonation && problem?.status === "RESOLVED" 
        ?(
          <div className="w-[45%] flex flex-row gap-5">
            <Button disabled className="w-full h-[40px] cursor-pointer bg-green-600 hover:bg-green-800" type="button" onClick={handleSelfFounded}>
              <h3>تغطية التكاليف</h3>
              <Check />
            </Button>
            <Button disabled className="w-full h-[40px] cursor-pointer" type="button" onClick={handleForDonation}>
              <h3>تفويض التكلفة للتبرع</h3>
              <ChevronLeft />
            </Button>
          </div>
        ):(
          <div className="w-[45%] flex flex-row gap-5">
            <Button className="w-full h-[40px] cursor-pointer" type="button" onClick={handleSelfFounded}>
              <h3>تغطية التكاليف</h3>
              <ChevronLeft />
            </Button>
            <Button className="w-full h-[40px] cursor-pointer" type="button" onClick={handleForDonation}>
              <h3>تفويض التكلفة للتبرع</h3>
              <ChevronLeft />
            </Button>
          </div>
        )
      }
    </div>
  );
};

export default IsForDonation;