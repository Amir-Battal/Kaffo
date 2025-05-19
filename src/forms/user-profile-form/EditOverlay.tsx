import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit } from "lucide-react";
import { EditMainForm } from "./EditMainForm";
import { JSX, useState } from "react";

const EditOverlay = ({ ...props }): JSX.Element => {
  const [open, setOpen] = useState(false); // التحكم بفتح/إغلاق الـ Dialog

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="flex flex-col items-center cursor-pointer">
          <Edit />
          <h3>تعديل</h3>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="flex flex-row-reverse">
            <DialogTitle>تعديل البيانات الأساسية</DialogTitle>
          </DialogHeader>

          {/* تمرير onSuccess لإغلاق الـ Dialog بعد النجاح */}
          <EditMainForm
            user={props.user}
            isLoading={props.isLoading}
            onSuccess={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditOverlay;
