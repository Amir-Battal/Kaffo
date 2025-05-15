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
import keycloak from "@/lib/keycloak";


const LogoutDialog = () => {


  const handleYes = () => {
    console.log("Logout Successfully");
    keycloak.logout({
      redirectUri: window.location.origin,
    });
  }

  return (
    <div dir="ltr" className="w-full">
      <Dialog>
        <DialogTrigger className="w-full items-center cursor-pointer">
          <Button className="w-full flex flex-row gap-10 cursor-pointer">
            <h3>تسجيل الخروج</h3>
            <Delete />
          </Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col gap-10">
          <DialogHeader className="flex flex-row-reverse">
            <DialogTitle>هل أنت متأكد أنك تريد تسجيل الخروج؟</DialogTitle>
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

export default LogoutDialog;