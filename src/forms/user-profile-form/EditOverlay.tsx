import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit } from "lucide-react";
import { EditMainForm } from "./EditMainForm";
import { JSX } from "react";


const EditOverlay = ({...props}): JSX.Element => {


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
            {/* <DialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </DialogDescription> */}
          </DialogHeader>
          <EditMainForm user={props.user} isLoading={props.isLoading} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditOverlay;