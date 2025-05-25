import { Check, ChevronLeft, Timer } from "lucide-react";
import { Button } from "./ui/button";
import { JSX } from "react";
import { useGetMyProblems, useGetProblemById, useUpdateProblemForContribution } from "@/hooks/use-problem";
import { useGetContributions } from "@/hooks/use-Contribution";

const IsForContribution = ({...prop}): JSX.Element => {

  const { mutateAsync: updateForContribution, isLoading } = useUpdateProblemForContribution();
  const { problem } = useGetProblemById(prop.problemId);
  
  const handleForCotnribution = () => {
    prop.setIsForContribution(true);
    prop.setIsSelfSolve(false);
    prop.setIsSelected(false);
    prop.setSolutionSet(false);
    prop.setIsForDonation();
    prop.setSelfFounded();
    console.log("Problem is For Contribution");
    updateForContribution({ problemId: prop.problemId, forContribution: true, isReal: true });
  }

  const handleSelfSolve = () => {
    prop.setIsForContribution(false);

    prop.setIsSelfSolve(true);
    prop.setIsSelected(false);
    prop.setSolutionSet(false);
    prop.setIsForDonation();
    prop.setSelfFounded();
    console.log("Problem is Self Solve");
  }

  return (

    <div className="flex flex-col gap-5">
      <h3>تفويض حل الشكوى</h3>
        {problem?.forContribution || prop.isForContribution && !prop.isSelected
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
          ):prop.isForContribution && prop.isSelected 
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
          ):prop.isSelfSolve && !prop.isForContribution
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