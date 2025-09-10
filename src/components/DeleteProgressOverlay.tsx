import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Check, Trash2, X } from "lucide-react"
import { JSX } from "react"

interface DeleteProgressOverlayProps {
  onConfirm: () => void
}

const DeleteProgressOverlay = ({ onConfirm }: DeleteProgressOverlayProps): JSX.Element => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="h-[40px] flex flex-row gap-2 cursor-pointer text-white bg-red-600 hover:bg-red-700"
        >
          <Trash2 />
          <span>حذف التقدم</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col gap-6">
        <DialogHeader className="flex flex-row-reverse">
          <DialogTitle className="text-lg font-semibold">
            هل أنت متأكد من حذف التقدم؟
          </DialogTitle>
        </DialogHeader>

        <div>
          <DialogPrimitive.Close className="flex flex-row w-full justify-between px-10">
            <Button
              type="button"
              variant="outline"
              className="w-[40%] h-[40px] cursor-pointer"
            >
              <span>لا</span>
              <X />
            </Button>

            <Button
              type="button"
              onClick={onConfirm}
              className="w-[40%] h-[40px] cursor-pointer bg-red-600 hover:bg-red-800"
            >
              <span>نعم</span>
              <Check />
            </Button>
          </DialogPrimitive.Close>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteProgressOverlay
