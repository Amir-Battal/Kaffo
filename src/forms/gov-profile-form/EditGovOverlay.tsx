import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit } from "lucide-react";
import { EditMainGovProfileForm } from "./EditMainGovProfileForm";
import { JSX } from "react";
import EditMainEmployeeProfileForm from "../user-profile-form/EditMainEmployeeProfileForm";


const EditGovOverlay = ({...props}):JSX.Element => {
  return (
    <div>
      <Dialog>
        <DialogTrigger className="flex flex-col items-center cursor-pointer">
          <Edit />
          <h3>تعديل</h3>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="flex flex-row-reverse">
            <DialogTitle>تعديل البيانات الأساسية</DialogTitle>
          </DialogHeader>
          {props.isEmployee
            ?(
              <EditMainEmployeeProfileForm />
            ):(
              <EditMainGovProfileForm />
            )
          }
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditGovOverlay;