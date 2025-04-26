import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Check, Delete, X } from "lucide-react";

const DeleteDialog = () => {

  const handleYes = () => {
    console.log("Contribution Deleted");
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger className=" flex flex-col items-center cursor-pointer">
          <Button type="button" variant={"ghost"} className="m-1 cursor-pointer">
            <h3>حذف</h3>
            <Delete />
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader className="h-[10%] flex flex-row-reverse">
            <DialogTitle>هل أنت متأكد من أنك تريد حذف المساهمة</DialogTitle>
          </DialogHeader>

          <DialogPrimitive.Close className="flex flex-row w-full justify-between px-20">
            <Button className="w-[40%] h-[40px] cursor-pointer">
              <h3>لا</h3>
              <X />
            </Button>
            <Button className="w-[40%] h-[40px] cursor-pointer" type="button" onClick={handleYes}>
              <h3>نعم</h3>
              <Check />
            </Button>
          </DialogPrimitive.Close>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteDialog;