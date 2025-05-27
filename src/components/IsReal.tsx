import { Check, ChevronLeft, Edit, X } from "lucide-react";
import { Button } from "./ui/button";
import { JSX, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, } from "./ui/form";
import { useApproveOrRejectProblem, useGetProblemById, useUpdateProblemForContribution, } from "@/hooks/use-problem";
import { useGetAcceptedContribution } from "@/hooks/use-Contribution";


const formSchema = z.object({
  comment: z.string().min(5, "سبب الرفض يجب أن لا يقل عن 5 أحرف"),
});

interface IsRealProps {
  isReal: boolean | null;
  setIsReal: (value: boolean | undefined) => void;
  problemId: number;
}

const IsReal = ({ isReal, setIsReal, problemId }: IsRealProps): JSX.Element => {

  const { mutate: approveOrRejectProblem } = useApproveOrRejectProblem();
  const { mutateAsync: updateForContribution } = useUpdateProblemForContribution();
  const {data: acceptedContribution} = useGetAcceptedContribution(problemId);
  
  const { problem } = useGetProblemById(problemId);

  const [edit, setEdit] = useState<boolean>();


  useEffect(() => {
    if(!problem?.rejectionReason){
      setEdit(true);
    }
  }, [problem?.rejectionReason])

  useEffect(() => {
    if (problem?.isReal !== undefined && problem?.isReal !== isReal) {
      setIsReal(problem.isReal);
    }
  }, [problem?.isReal]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: problem?.rejectionReason || "",
    },
  });

  const handleReal = () => {
    if(acceptedContribution){
      updateForContribution({ problemId: problemId, forContribution: true, isReal: true });
      setIsReal(true);
    } else{
      approveOrRejectProblem(
        {
          problemId,
          isReal: true,
        },
        {
          onSuccess: () => setIsReal(true),
        }
      );
    }
  };

  const handleNotReal = () => {
    approveOrRejectProblem(
      {
        problemId,
        isReal: false,
      },
      {
        onSuccess: () => setIsReal(false),
      }
    );
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    approveOrRejectProblem(
      {
        problemId,
        isReal: false,
        rejectionReason: values.comment,
      },
      {
        onSuccess: () => setIsReal(false),
      }
    );
    setEdit(false);
  };


  const handleRejectEdit = () => {
    setEdit(true);
  }

  return (
    <div className="flex flex-col gap-5">
      <h3>بعد التحقق من الشكوى من الشخص المعني وأرض الواقع</h3>

      {isReal && (
        <div className="w-[45%] flex flex-row gap-5">
          <Button
            className="w-full h-[40px] cursor-pointer bg-green-600 hover:bg-green-800"
            type="button"
            onClick={handleReal}
          >
            <h3>حقيقية</h3>
            <Check />
          </Button>
          <Button
            className="w-full h-[40px] cursor-pointer"
            type="button"
            onClick={handleNotReal}
          >
            <h3>غير حقيقية</h3>
            <ChevronLeft />
          </Button>
        </div>
      )}

      {!isReal && (
        <div className="flex flex-col gap-5">
          <div className="w-[45%] flex flex-row gap-5">
            <Button
              className="w-full h-[40px] cursor-pointer"
              type="button"
              onClick={handleReal}
            >
              <h3>حقيقية</h3>
              <ChevronLeft />
            </Button>
            <Button
              className="w-full h-[40px] cursor-pointer bg-red-600 hover:bg-red-800"
              type="button"
              onClick={handleNotReal}
            >
              <h3>غير حقيقية</h3>
              <X />
            </Button>
          </div>
          <Form {...form}>
            <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                disabled={problem?.rejectionReason && !edit ? true : false}
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>سبب الرفض</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="يرجى كتابة سبب رفض الشكوى"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex flex-row justify-between">
                { edit && (
                  <Button
                    type="submit"
                    className="flex flex-row justify-around cursor-pointer w-[40%] h-[50px] text-white bg-black p-2 rounded-[10px] hover:bg-gray-800"
                  >
                    <h3>تأكيد السبب</h3>
                    <ChevronLeft />
                  </Button>
                  
                )}
                {!edit && (
                  <button className="flex flex-row gap-2 justify-end cursor-pointer" type="button" onClick={handleRejectEdit}>
                    <h3>تعديل</h3>
                    <Edit />
                  </button>
                )}
              </div>
            </form>
          </Form>
        </div>
      )}

      {isReal === undefined && (
        <div className="w-[45%] flex flex-row gap-5">
          <Button
            className="w-full h-[40px] cursor-pointer"
            type="button"
            onClick={handleReal}
          >
            <h3>حقيقية</h3>
            <ChevronLeft />
          </Button>
          <Button
            className="w-full h-[40px] cursor-pointer"
            type="button"
            onClick={handleNotReal}
          >
            <h3>غير حقيقية</h3>
            <ChevronLeft />
          </Button>
        </div>
      )}
    </div>
  );
};

export default IsReal;
