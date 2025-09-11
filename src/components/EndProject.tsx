import { JSX, useEffect, useState } from "react";
import DateRangePicker from "./DateRangePicker";
import { Button } from "./ui/button";
import { Check, Edit } from "lucide-react";
import { useUpdateContributionDates } from "@/hooks/use-Contribution";
// import { useUpdateContributionDates, useUpdateSolutionStatus } from "@/hooks/use-Contribution";
import { useGetProblemById, useUpdateProblemStatus } from "@/hooks/use-problem";


interface EndProjectProps {
  contributionId?: number;
  problemId?: number;
  setIsEndProject: (val: boolean) => void;
  startDate?: string;
  endDate?: string;
}


const EndProject = ({ contributionId, problemId, setIsEndProject, startDate, endDate }: EndProjectProps): JSX.Element => {

  const [date, setDate] = useState<any>();
  const [isDateSet, setIsDateSet] = useState<Boolean>();
  const [isEditing, setIsEditing] = useState<boolean>(false);


  const { mutate: updateDates } = useUpdateContributionDates({
    problemId,
    onSuccess: (updated) => {
      console.log("تم التحديث بنجاح:", updated);
    },
  });
  // const { mutate: updateSolutionStatus } = useUpdateSolutionStatus();
  const { mutate: updateProblemStatus } = useUpdateProblemStatus();

  const {problem} = useGetProblemById(Number(problemId));
  


  const formatLocalDate = (input: Date | string): string => {
    const date = input instanceof Date ? input : new Date(input);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date value: " + input);
    }
    return date.toLocaleDateString("en-CA", { timeZone: "Asia/Riyadh" }); 
  };



  // useEffect(() => {
    console.log("problemId", problemId);
    console.log("contributionId", contributionId);
  // }, [])

  useEffect(() => {
    if (startDate && endDate) {
      setDate({
        from: new Date(startDate),
        to: new Date(endDate)
      });
      
      setIsDateSet(true);
      setIsEndProject(true);
    }
  }, []);



  const handleSubmitDate = () => {
    if (!date?.from || !date?.to || !contributionId || !problemId) return;

    updateDates({
      contributionId,
      startDate: formatLocalDate(date.from),
      endDate: formatLocalDate(date.to),
      status: "WORK_IN_PROGRESS"
    });

    updateProblemStatus({
      isReal: problem?.isReal,
      forContribution: problem?.forContribution,
      forDonation: problem?.forDonation,
      problemId: problemId,
      status: "WORK_IN_PROGRESS"
    });

    setIsDateSet(true);
    setIsEndProject(true);
    setIsEditing(false); 
  };


  const handleEditDate = () => {
    setIsEditing(true);
    setIsDateSet(false);
  };

  console.log("isDateSet", isDateSet);
  console.log("date", date);


  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl">الوقت المتوقع لإنهاء المشروع</h1>
        <h3>قم بتحديد المدة المتوقعة من الحقل التالي</h3>
      </div>

      <DateRangePicker
        setDate={setDate} 
        isDateSet={!isEditing && isDateSet}
        date={date} 

        startDate={startDate}
        endDate={endDate}
      />

      {isDateSet && date ? (
        <div>
          {problem?.status !== "RESOLVED" && (
            <div className="flex flex-col gap-5">
              {!isEditing ? (
                <Button type="button" onClick={handleEditDate} className="w-[45%] h-[40px] flex flex-row gap-5 cursor-pointer">
                  <h3>تعديل التاريخ</h3>
                  <Edit />
                </Button>
              ) : (
                <Button onClick={handleSubmitDate} className="w-[45%] h-[40px] cursor-pointer bg-green-600 hover:bg-green-800">
                  <h3>تأكيد التعديل</h3>
                  <Check />
                </Button>
              )}
              <div>
                <h3>
                  تم تحديد التاريخ
                  <span> من <span className="font-bold">{date.from.toString().split(' ', 4).join(' ')}</span></span>
                  <span> إلى <span className="font-bold">{date.to.toString().split(' ', 4).join(' ')}</span></span>
                </h3>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Button onClick={handleSubmitDate} className="w-[45%] h-[40px] cursor-pointer ">
          <h3>تأكيد التاريخ</h3>
          <Check />
        </Button>
      )}
    </div>
  );
};

export default EndProject;