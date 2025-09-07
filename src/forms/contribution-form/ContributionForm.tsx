import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Badge, Check, DollarSign, Edit } from "lucide-react";

import ContributionCard from "./ContributionCard";
import DeleteDialog from "./DeleteDialog";

import {
  useGetMyContribution,
  useCreateContribution,
  useUpdateContribution,
  useDeleteContribution,
  useGetContributions,
} from "../../hooks/use-Contribution";
import { toast } from "sonner";
import { useGetUserById } from "@/hooks/use-user";
import { useGetAllProblemProgress } from "@/hooks/use-progress";



const schema = z.object({
  contribution: z.string().min(1, "يرجى إدخال وصف المساهمة"),
  budget: z.coerce.number().min(1, "يرجى إدخال تكلفة صحيحة"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  problemId: number;
}

const ContributionForm: React.FC<Props> = ({ problemId }) => {
  const [isEditing, setIsEditing] = useState(false);

  const { data: userContribution } = useGetMyContribution(problemId);
  const { contributions } = useGetContributions(problemId);

  const { data: userCotnributionDetails } = useGetUserById(userContribution?.proposedByUserId);

  // console.log(contributions);

  const AvailableApprovedContribution = contributions?.filter((c) => c.status === "APPROVED");


  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      contribution: "",
      budget: 0,
    },
  });

  useEffect(() => {
    if (userContribution && isEditing) {
      methods.reset({
        contribution: userContribution.description || "",
        budget: userContribution.estimatedCost || 0,
      });
    }
  }, [userContribution, isEditing, methods]);

  const createMutation = useCreateContribution(problemId);
  const updateMutation = useUpdateContribution(problemId, userContribution?.id ?? -1);
  const deleteMutation = useDeleteContribution(problemId, userContribution?.id ?? -1);

  const onSubmit = (data: FormData) => {
    const payload = {
      description: data.contribution,
      estimatedCost: data.budget,
      problemId,
      status: "PENDING_APPROVAL",
    };

    if (userContribution && isEditing) {
      updateMutation.mutate(payload, {
        onSuccess: () => {
          setIsEditing(false);
          toast("تم تعديل المساهمة بنجاح" );
        },
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          methods.reset();
          toast("تم إنشاء المساهمة بنجاح" );
        },
      });
    }
  };

  const onDelete = () => {
    if (!userContribution?.id) return;
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setIsEditing(false);
        methods.reset({ contribution: "", budget: 0 });
        toast("تم حذف المساهمة بنجاح" );
      },
    });
  };

  const renderForm = () => (
    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        control={methods.control}
        name="contribution"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ساهم في حل الشكوى</FormLabel>
            <FormControl>
              <Textarea
                placeholder="أقترح حل الشكوى عبر..."
                {...field}
                ref={field.ref}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="flex items-center justify-between">
        <FormField
          control={methods.control}
          name="budget"
          render={({ field }) => (
            <FormItem className="w-1/4">
              <FormLabel>التكلفة المتوقعة</FormLabel>
              <div className="flex items-center gap-1">
                <DollarSign />
                <FormControl>
                  <Input
                    type="number"
                    placeholder="100"
                    {...field}
                    ref={field.ref}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-[40%] h-[50px] bg-black text-white hover:bg-gray-800">
          {isEditing ? "تحديث المساهمة" : "إرسال المساهمة"}
          <Check className="ml-2" />
        </Button>
      </div>
    </form>
  );

  const renderUserContribution = () =>
    userContribution && !isEditing && (
      <ContributionCard
        username={userCotnributionDetails?.firstName + " " + userCotnributionDetails?.lastName}
        date={userContribution.creationDate || ""}
        contribution={userContribution.description || ""}
        budget={userContribution.estimatedCost || 0}
        userPhoto={userCotnributionDetails?.photoUrl}
        status={userContribution.status}
      >
        {/* <div className={` text-white text-sm flex justify-center items-center w-[30%] h-[50px]
          ${userContribution?.status === "REJECTED"
            ? "bg-red-600"
            : userContribution?.status === "PENDING_APPROVAL"
            ? "bg-amber-500"
            : "bg-green-600"
          }`}>
          <h1>
            {userContribution?.status === "REJECTED"
              ? "تم رفض المساهمة"
              : userContribution?.status === "PENDING_APPROVAL"
              ? "قيد المراجعة"
              : "تم قبول المساهمة"
            }
          </h1>
        </div> */}
        {userContribution.status === "PENDING_APPROVAL" && (
          <div className="flex flex-row-reverse gap-2 mt-2">
            <Button onClick={() => setIsEditing(true)} variant="ghost">
              تعديل <Edit className="ml-1" />
            </Button>
            <DeleteDialog onConfirm={onDelete} />
          </div>
        )}
      </ContributionCard>
    );

  const renderOtherContributions = () =>
    contributions
      ?.filter((c) => c.id !== userContribution?.id)
      .map((c) => (
        <ContributionCard
          key={c.id}
          username={`${c.user.firstName} ${c.user.lastName}`}
          date={c.creationDate}
          contribution={c.description}
          budget={c.estimatedCost}
          userPhoto={c.user.photoUrl}
          // status={c.status}
        />
      ));

      // console.log("test", userContribution);

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-6" dir="rtl">
    
        {((!userContribution || isEditing) && (AvailableApprovedContribution.length === 0)) ? renderForm() : renderUserContribution()}
        <div className="flex flex-col gap-4">
          {renderOtherContributions()}
        </div>
      </div>
    </FormProvider>
  );
};

export default ContributionForm;
