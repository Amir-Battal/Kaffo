import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Check, Delete, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { JSX } from "react";
import keycloak from "@/lib/keycloack";
import { useDeleteUser } from "@/hooks/use-user";


const DeleteOverlay = ({...props}): JSX.Element => {

  const { deleteUser } = useDeleteUser();

  const handleYes = async () => {
    if (!props.userId) return;
  
    try {
      await deleteUser(props.userId);
      keycloak.logout(); // ⬅️ يسجل الخروج بعد الحذف
    } catch (err) {
      console.error("فشل الحذف:", err);
    }
  };

  return (
    <div className="w-full">
      <Dialog>
        <DialogTrigger className="w-full items-center cursor-pointer pr-20">
          <Button className="w-[80%] h-[40px] flex flex-row gap-10 cursor-pointer text-red-500">
            <h3>حذف الحساب</h3>
            <Delete />
          </Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col gap-10">
          <DialogHeader className="flex flex-row-reverse">
            <DialogTitle>هل أنت متأكد أنك تريد حذف الحساب؟</DialogTitle>
          </DialogHeader>

          <div>
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteOverlay;