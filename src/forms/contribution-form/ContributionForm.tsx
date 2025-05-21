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

import { Check, DollarSign, Edit } from "lucide-react";

import ContributionCard from "./ContributionCard";
import DeleteDialog from "./DeleteDialog";

import {
  useGetMyContribution,
  useCreateContribution,
  useUpdateContribution,
  useDeleteContribution,
  useGetContributions,
} from "../../hooks/use-Contribution";

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

  // جلب مساهمة المستخدم الحالي والمساهمات الأخرى
  const { data: userContribution } = useGetMyContribution(problemId);
  const { contributions } = useGetContributions(problemId);

  // تهيئة الفورم مع zod
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      contribution: "",
      budget: 0,
    },
  });

  // التغير عند تغيير بيانات مساهمة المستخدم (تعبئة الفورم تلقائياً عند الدخول في وضع التعديل)
  useEffect(() => {
    if (userContribution && isEditing) {
      methods.reset({
        contribution: userContribution.description || "",
        budget: userContribution.estimatedCost || 0,
      });
    }
  }, [userContribution, isEditing, methods]);

  // الميوتيشنز لإنشاء وتحديث وحذف
  const createMutation = useCreateContribution(problemId);
  const updateMutation = useUpdateContribution(problemId, userContribution?.id ?? -1);
  const deleteMutation = useDeleteContribution(problemId, userContribution?.id ?? -1);

  // دالة الإرسال
  const onSubmit = (data: FormData) => {
    const payload = {
      description: data.contribution,
      estimatedCost: data.budget,
      problemId,
    };
    console.log(payload);

    if (userContribution && isEditing) {
      updateMutation.mutate(payload, {
        onSuccess: () => setIsEditing(false),
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => methods.reset(),
      });
    }
  };

  // حذف المساهمة
  const onDelete = () => {
    if (!userContribution?.id) return;
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setIsEditing(false);
        methods.reset({ contribution: "", budget: 0 });
      },
    });
  };

  // واجهة النموذج
  const renderForm = () => (
    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        control={methods.control}
        name="contribution"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ساهم في حل المشكلة</FormLabel>
            <FormControl>
              <Textarea
                placeholder="أقترح حل المشكلة عبر..."
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

  // واجهة مساهمة المستخدم مع خيارات التعديل والحذف
  const renderUserContribution = () =>
    userContribution && !isEditing && (
      <ContributionCard
        username="أنت"
        date={userContribution.createdAt || ""}
        contribution={userContribution.description || ""}
        budget={userContribution.estimatedCost || 0}
      >
        <div className="flex flex-row-reverse gap-2 mt-2">
          <Button onClick={() => setIsEditing(true)} variant="ghost">
            تعديل <Edit className="ml-1" />
          </Button>
          <DeleteDialog onConfirm={onDelete} />
        </div>
      </ContributionCard>
    );

  // عرض مساهمات المستخدمين الآخرين
  const renderOtherContributions = () =>
    contributions
      ?.filter((c) => c.id !== userContribution?.id)
      .map((c) => (
        <ContributionCard
          key={c.id}
          username={`${c.user.firstName} ${c.user.lastName}`}
          date={c.createdAt}
          contribution={c.description}
          budget={c.estimatedCost}
        />
      ));

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-6" dir="rtl">
        {/* إذا لم توجد مساهمة أو في حالة التعديل، عرض النموذج */}
        {(!userContribution || isEditing) ? renderForm() : renderUserContribution()}

        <div className="flex flex-col gap-4">
          {renderOtherContributions()}
        </div>
      </div>
    </FormProvider>
  );
};

export default ContributionForm;
