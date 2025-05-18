import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
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
import { SolutionDTO } from "../../types";

const formSchema = z.object({
  contribution: z.string().min(1),
  budget: z.coerce.number().min(1),
});

interface Props {
  problemId: number;
}

const ContributionForm = ({ problemId }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: userContribution, isLoading } = useGetMyContribution(problemId);
  const { contributions } = useGetContributions(problemId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contribution: "",
      budget: 0,
    },
  });

  const createContribution = useCreateContribution(problemId);
  const updateContribution = useUpdateContribution(problemId, userContribution?.id ?? 0);
  const deleteContribution = useDeleteContribution(problemId, userContribution?.id ?? 0);

  useEffect(() => {
    if (userContribution) {
      form.setValue("contribution", userContribution.description || "");
      form.setValue("budget", userContribution.estimatedCost || 0);
    }
  }, [userContribution]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const mutation = userContribution ? updateContribution : createContribution;
    mutation.mutate(values, {
      onSuccess: () => setIsEditing(false),
    });
  };

  const handleEdit = () => setIsEditing(true);

  const handleDelete = () => {
    deleteContribution.mutate(undefined, {
      onSuccess: () => {
        setIsEditing(false);
        form.reset({ contribution: "", budget: 0 });
      },
    });
  };

  const renderForm = () => (
    <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(handleSubmit)}>
      <FormField
        control={form.control}
        name="contribution"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ساهم في حل المشكلة</FormLabel>
            <FormControl>
              <Textarea placeholder="استطيع حل المشكلة من خلال..." {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="flex items-center justify-between">
        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem className="w-1/4">
              <FormLabel>التكلفة المتوقعة</FormLabel>
              <div className="flex items-center gap-1">
                <DollarSign />
                <FormControl>
                  <Input placeholder="100" type="number" {...field} />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-[40%] h-[50px] bg-black text-white hover:bg-gray-800">
          <span>تأكيد المساهمة</span>
          <Check />
        </Button>
      </div>
    </form>
  );

  const renderUserCard = () =>
    userContribution && (
      <ContributionCard
        username={userContribution.username || "أنت"}
        date={userContribution.createdAt || ""}
        contribution={userContribution.description || ""}
        budget={userContribution.estimatedCost || 0}
        isMyContribution
      >
        <div className="flex flex-row-reverse">
          <Button onClick={handleEdit} variant="ghost">
            <h3>تعديل</h3>
            <Edit />
          </Button>
          <DeleteDialog onConfirm={handleDelete} />
        </div>
      </ContributionCard>
    );

  const renderOtherContributions = () =>
    contributions
      ?.filter((contribution) => contribution.id !== userContribution?.id)
      .map((contribution) => (
        <ContributionCard
          key={contribution.id}
          username={`${contribution.user.firstName} ${contribution.user.lastName}`}
          date={contribution.createdAt}
          contribution={contribution.description}
          budget={contribution.estimatedCost}
        />
      ));

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <Form {...form}>
        {isEditing || !userContribution ? renderForm() : renderUserCard()}
      </Form>
      <div className="flex flex-col gap-4">{renderOtherContributions()}</div>
    </div>
  );
};

export default ContributionForm;
