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

import { Check, DollarSign, Edit, Trash2 } from "lucide-react";

import ContributionCard from "./ContributionCard";
import DeleteDialog from "./DeleteDialog";

import {
  useGetMyContribution,
  useCreateContribution,
  useUpdateContribution,
  useDeleteContribution,
} from "@/hooks/use-Contribution";

const schema = z.object({
  contribution: z.string().min(10, "يرجى كتابة تفاصيل كافية"),
  budget: z.coerce.number().positive("يجب أن تكون قيمة موجبة"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  problemId: number;
  setSolutionSet: (value: boolean) => void;
  setSelfBudget: (value: number) => void;
}

const SolutionForm: React.FC<Props> = ({
  problemId,
  setSolutionSet,
  setSelfBudget,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // جلب مساهمة المستخدم الحالي
  const { data: userContribution, isLoading } = useGetMyContribution(problemId);

  // تهيئة الفورم
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      contribution: "",
      budget: 0,
    },
  });

  // إعادة تعيين القيم عند تحميل المساهمة أو الدخول في وضع التعديل
  useEffect(() => {
    if (userContribution && isEditing) {
      methods.reset({
        contribution: userContribution.description,
        budget: userContribution.estimatedCost,
      });
    }
    // لو المساهمة موجودة وبدأت غير في وضع التعديل - نعرض بيانات المساهمة لكن لا نعيد تعيين الفورم
    if (userContribution && !isEditing) {
      setSelfBudget(userContribution.estimatedCost);
      setSolutionSet(true);
    }
    if (!userContribution) {
      setSolutionSet(false);
      setSelfBudget(0);
    }
  }, [userContribution, isEditing, methods, setSolutionSet, setSelfBudget]);

  // ميوتيشنات إنشاء، تحديث، حذف
  const createMutation = useCreateContribution(problemId);
  const updateMutation = useUpdateContribution(problemId, userContribution?.id ?? -1);
  const deleteMutation = useDeleteContribution(problemId, userContribution?.id ?? -1);

  // إرسال النموذج (إنشاء أو تحديث)
  const onSubmit = (data: FormData) => {
    const payload = {
      description: data.contribution,
      estimatedCost: data.budget,
      problemId,
      forContribution: false,
      status: userContribution?.status ?? "ACCEPTED",
    };

    if (userContribution && isEditing) {
      console.log(payload);
      updateMutation.mutate(payload, {
        onSuccess: () => {
          setIsEditing(false);
          setSolutionSet(true);
          setSelfBudget(data.budget);
        },
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          methods.reset();
          setSolutionSet(true);
          setSelfBudget(data.budget);
          setIsEditing(false);
        },
      });
    }
  };

  // حذف المساهمة
  const onDelete = () => {
    if (!userContribution?.id) return;
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        methods.reset({ contribution: "", budget: 0 });
        setIsEditing(true); // السماح بإنشاء مساهمة جديدة
        setSolutionSet(false);
        setSelfBudget(0);
      },
    });
  };

  if (isLoading) return <div>جاري التحميل...</div>;

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-6" dir="rtl">
        {/* عرض الفورم عند عدم وجود مساهمة أو في وضع التعديل */}
        {(!userContribution || isEditing) ? (
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={methods.control}
              name="contribution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>حل المشكلة</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="استطيع حل المشكلة من خلال..."
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

              <Button
                type="submit"
                className="w-[40%] h-[50px] bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2"
              >
                {userContribution ? "تحديث الحل" : "تأكيد الحل"}
                <Check />
              </Button>
            </div>
          </form>
        ) : (
          // عرض مساهمة المستخدم مع خيارات التعديل والحذف
          <ContributionCard
            username="أنا"
            date={new Date(userContribution.createdAt).toLocaleDateString("ar-EG")}
            contribution={userContribution.description}
            budget={userContribution.estimatedCost}
            isSelfSolv
          >
            <div className="flex flex-row-reverse gap-2 mt-2">
              <Button
                onClick={() => setIsEditing(true)}
                variant="ghost"
                className="flex items-center gap-1"
              >
                تعديل <Edit />
              </Button>

              <DeleteDialog
                onConfirm={onDelete}
                title="حذف الحل"
                description="هل أنت متأكد من حذف هذا الحل؟ لا يمكن التراجع عن هذه العملية."
                trigger={
                  <Button variant="ghost" className="text-red-500 flex items-center gap-1">
                    حذف <Trash2 />
                  </Button>
                }
              />
            </div>
          </ContributionCard>
        )}
      </div>
    </FormProvider>
  );
};

export default SolutionForm;
