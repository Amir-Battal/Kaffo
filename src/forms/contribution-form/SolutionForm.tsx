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
import { SolutionDTO } from "@/types";
import keycloak from "@/lib/keycloak";

import axios from "axios";
import { useGetMyUser, useGetUserById } from "@/hooks/use-user";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const schema = z.object({
  contribution: z.string().min(10, "يرجى كتابة تفاصيل كافية"),
  budget: z.coerce.number().positive("يجب أن تكون قيمة موجبة"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  problemId: number;
  setSolutionSet: (value: boolean) => void;
  setSelfBudget: (value: number) => void;
  setIsSelected: (value: boolean) => void;
}

const SolutionForm: React.FC<Props> = ({
  problemId,
  setSolutionSet,
  setSelfBudget,
  setIsSelected,
}) => {
  const [isEditing, setIsEditing] = useState(false);


  // جلب مساهمة المستخدم الحالي
  const { data: userContribution, isLoading } = useGetMyContribution(problemId);
  const { currentUser } = useGetMyUser();


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


  const { data: proposedUser } = useGetUserById(userContribution?.proposedByUserId);


  // إرسال النموذج (إنشاء أو تحديث)
  const onSubmit = (data: FormData) => {
    const payload: Partial<SolutionDTO> = {
      description: data.contribution,
      estimatedCost: data.budget,
      problemId,
      forContribution: false,
    };

    if (userContribution && isEditing) {
      updateMutation.mutate(
        {
          ...payload,
          status: "APPROVED",
        },
        {
          onSuccess: () => {
            setIsEditing(false);
            setSolutionSet(true);
            setSelfBudget(data.budget);
            setIsSelected(true);
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: async (created) => {
          try {
            // استدعاء مباشر لتحديث الحل الذي تم إنشاؤه
            const accessToken = keycloak.token;
            await axios.put(
              `${API_BASE_URL}/api/v1/problems/${problemId}/solutions/${created.id}`,
              { 
                ...payload,
                status: "APPROVED",
                acceptedReason: 'التكلف بالحل من قبل الجهة المعنية',
                acceptedByUserId: currentUser?.id
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
              }
            );

            methods.reset();
            setSolutionSet(true);
            setSelfBudget(data.budget);
            setIsEditing(false);
            setIsSelected(true);
          } catch (error) {
            console.error("فشل تحديث الحالة إلى APPROVED", error);
          }
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
        setIsSelected(false);
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
                  <FormLabel>حل الشكوى</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="استطيع حل الشكوى من خلال..."
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
            username={proposedUser?.firstName + " " + proposedUser?.lastName}
            date={new Date(userContribution.creationDate).toLocaleDateString()}
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
