import { Check, ChevronLeft, Timer } from "lucide-react";
import { Button } from "./ui/button";
import { JSX, useEffect, useState } from "react";
import { pendingAllProblems, rejectAllProblems, useGetProblemById, useUpdateProblemForContribution } from "@/hooks/use-problem";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const IsForContribution = ({...prop}): JSX.Element => {

  const { mutateAsync: updateForContribution, isLoading } = useUpdateProblemForContribution();
  const { problem } = useGetProblemById(prop.problemId);

  // const [isForContribution, setIsForContribution] = useState<boolean>();

  

  const handleForCotnribution = () => {
    updateForContribution({ problemId: prop.problemId, forContribution: true, isReal: true });
    prop.setIsForContribution(true);


    // prop.setIsSelfSolve(false);
    // prop.setIsSelected(false);
    // prop.setSolutionSet(false);
    // prop.setIsForDonation();
    // prop.setSelfFounded();
    console.log("Problem is For Contribution");
    pendingAllProblems(prop.contributions, prop.problemId);
  }

  const handleSelfSolve = async () => {
    updateForContribution({ problemId: prop.problemId, forContribution: false, isReal: true });
    prop.setIsForContribution(false);

    // prop.setIsSelfSolve(true);
    // prop.setIsSelected(false);
    // prop.setSolutionSet(false);
    // prop.setIsForDonation();
    // prop.setSelfFounded();
    console.log("Problem is Self Solve");
    rejectAllProblems(prop.contributions, prop.problemId);
  }

  // useEffect(() => {
  //   if(problem?.forContribution){
  //     problem.forContribution ? prop.setIsForContribution(true) : prop.setIsForContribution(false);
  //   }
  // }, [problem?.forContribution])

  return (

    <div className="flex flex-col gap-5">
      <h3>تفويض حل الشكوى</h3>
        {/* {(problem?.forContribution && !prop.isSelected) || (prop.isForContribution && !prop.isSelected) */}
        {(prop.isForContribution && !prop.isSelected)
          ?(
            <div className="w-[45%] flex flex-row gap-5">
              <Button className="w-full h-[40px] cursor-pointer" type="button" onClick={handleSelfSolve}>
                <h3>التكفل بالحل</h3>
                <ChevronLeft />
              </Button>
              <Button className="w-full h-[40px] cursor-pointer bg-orange-500 hover:bg-orange-300" type="button" onClick={handleForCotnribution}>
                <h3>تفويض الحل للمساهمات</h3>
                <Timer />
              </Button>
            </div>
          ):(prop.isSelected) 
          ?(
            <div className="w-[45%] flex flex-row gap-5">
              <Button className="w-full h-[40px] cursor-pointer" type="button" onClick={handleSelfSolve}>
                <h3>التكفل بالحل</h3>
                <Check />
              </Button>
              <Button className="w-full h-[40px] cursor-pointer bg-green-600 hover:bg-green-800" type="button" onClick={handleForCotnribution}>
                <h3>تم اختيار المساهمة</h3>
                <Check />
              </Button>
            </div>
          ):prop.isSelfSolve
          ?(
            <div className="w-[45%] flex flex-row gap-5">
              <Button className="w-full h-[40px] cursor-pointer bg-green-600 hover:bg-green-800" type="button" onClick={handleSelfSolve}>
                <h3>التكفل بالحل</h3>
                <Check />
              </Button>
              <Button className="w-full h-[40px] cursor-pointer" type="button" onClick={handleForCotnribution}>
                <h3>تفويض الحل للمساهمات</h3>
                <ChevronLeft />
              </Button>
            </div>
          ):(
            <div className="w-[45%] flex flex-row gap-5">
              <Button className="w-full h-[40px] cursor-pointer" type="button" onClick={handleSelfSolve}>
                <h3>التكفل بالحل</h3>
                <ChevronLeft />
              </Button>
              <Button className="w-full h-[40px] cursor-pointer" type="button" onClick={handleForCotnribution}>
                <h3>تفويض الحل للمساهمات</h3>
                <ChevronLeft />
              </Button>
            </div>
          )
        }
    </div>
  );
};

export default IsForContribution;