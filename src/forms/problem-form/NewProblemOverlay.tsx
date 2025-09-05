import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react";
import { NewProblemForm } from "./NewProblemForm";
import { User } from "@/types";
import { useGetMyUser } from "@/hooks/use-user";


const NewProblemOverlay = () => {
  const {currentUser} = useGetMyUser();
  const isSecondaryDataComplete = (user: User | undefined): boolean => {
    if (!user) return false;
  
    return (
      !!user.dateOfBirth &&
      !!user.collegeDegree &&
      !!user.job &&
      !!user.description &&
      !!user.addressId
    );
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger className=" flex flex-col items-center cursor-pointer">
          {isSecondaryDataComplete(currentUser) && (
            <Button className="cursor-pointer">
              <h3>شكوى جديدة</h3>
              <Plus />
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="min-w-[50%] h-[94%] overflow-y-scroll">
          <DialogHeader className="h-[10%] flex flex-row-reverse">
            <DialogTitle>إنشاء شكوى جديدة</DialogTitle>
          </DialogHeader>
          <NewProblemForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewProblemOverlay;