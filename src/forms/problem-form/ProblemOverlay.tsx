import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Delete, Edit, X } from "lucide-react";
import { EditProblemForm } from "./EditProblemForm";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useDeleteProblem } from "@/hooks/use-problem";
import { useDeleteAllProblemPhotos } from "@/hooks/use-problem-photo";
import { toast } from "sonner";
import { useEffect } from "react";

type EditProp = {
  status: string;
  isMyAucation?: boolean;
  problemId?: number;
};

const ProblemOverlay = ({ status, isMyAucation, problemId }: EditProp) => {
  const { mutateAsync: deleteAllPhotos } = useDeleteAllProblemPhotos();
  const { deleteProblem, isLoading } = useDeleteProblem();

  const handleDelete = async () => {
    if (!problemId) return;
    try {
      // 1. حذف الصور
      await deleteAllPhotos(problemId);

      // 2. حذف المشكلة
      await deleteProblem(problemId);

      sessionStorage.setItem("showToastDelete", "تم حذف المشكلة بنجاح");
      if(isMyAucation) {
        window.location.replace("http://localhost:5173/user-activities/aucations");
      } else{
        window.location.replace("http://localhost:5173/problems");
      }
    } catch (err) {
      toast.error("حدث خطأ أثناء حذف المشكلة");
      console.error("Delete failed:", err);
    }
  };

  const renderTriggerButton = (label: string, Icon: React.ElementType) => (
    <DialogTrigger className="flex flex-col items-center cursor-pointer">
      <Button className="cursor-pointer">
        {!isMyAucation && <h3 className="mr-2">{label}</h3>}
        <Icon />
      </Button>
    </DialogTrigger>
  );

  return (
    <div>
      <Dialog>
        {status === "edit" && (
          <div>
            {renderTriggerButton("تعديل", Edit)}

            <DialogContent className="min-w-[50%] h-[94%] overflow-y-scroll">
              <DialogHeader className="h-[10%] flex flex-row-reverse">
                <DialogTitle>تعديل بيانات المشكلة</DialogTitle>
              </DialogHeader>

              <EditProblemForm problemId={problemId} />
            </DialogContent>
          </div>
        )}

        {status === "delete" && (
          <div>
            {renderTriggerButton("حذف", Delete)}

            <DialogContent>
              <DialogHeader className="h-[10%] flex flex-row-reverse">
                <DialogTitle>
                  هل أنت متأكد من أنك تريد حذف المشكلة؟
                </DialogTitle>
              </DialogHeader>

              <DialogPrimitive.Close className="flex flex-row w-full justify-between px-20 mt-4">
                <Button className="w-[40%] h-[40px] cursor-pointer">
                  <h3>لا</h3>
                  <X />
                </Button>
                <Button
                  className="w-[40%] h-[40px] cursor-pointer"
                  type="button"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  <h3>نعم</h3>
                  <Check />
                </Button>
              </DialogPrimitive.Close>
            </DialogContent>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default ProblemOverlay;
