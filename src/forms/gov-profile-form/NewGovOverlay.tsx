import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react";
import NewGovForm from "./NewGovForm";

const NewGovOverlay = () => {

  return (
    <div>
      <Dialog>
        <DialogTrigger className="flex flex-row-reverse gap-5 items-center cursor-pointer bg-black text-white p-5 hover:bg-zinc-800">
          <Plus />
          <h3>جهة معنية جديدة</h3>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="flex flex-row-reverse">
            <DialogTitle>جهة معنية جديدة</DialogTitle>
          </DialogHeader>
          <NewGovForm />
          {/* <EditMainGovProfileForm /> */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewGovOverlay;
