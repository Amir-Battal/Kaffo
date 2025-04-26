import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Check, Delete, Edit, X } from "lucide-react";
import { EditProblemForm } from "./EditProblemForm";
import * as DialogPrimitive from "@radix-ui/react-dialog"


type EditProp = {
  status: String;
  isMyAucation?: boolean;
}

const ProblemOverlay = ({...props}: EditProp) => {

  const handleYes = () => {
    console.log("Problem Deleted");
  }
  
  return (
    <div>
      <Dialog>
        {props.status === 'edit' 
          ?(
            <div>
              <DialogTrigger className=" flex flex-col items-center cursor-pointer">
                {props.isMyAucation
                  ?(
                    <Button className="cursor-pointer">
                      {/* <h3>تعديل</h3> */}
                      <Edit />
                    </Button>
                  ):(
                    <Button className="cursor-pointer">
                      <h3>تعديل</h3>
                      <Edit />
                    </Button>
                    
                  )
                }
              </DialogTrigger>

              <DialogContent className="min-w-[50%] h-[94%] overflow-y-scroll">
                <DialogHeader className="h-[10%] flex flex-row-reverse">
                  <DialogTitle>تعديل بيانات المشكلة</DialogTitle>
                </DialogHeader>

                <EditProblemForm />
              </DialogContent>
            </div>
          ): props.status === 'delete'
          ?(
            <div>
              <DialogTrigger className=" flex flex-col items-center cursor-pointer">
              {props.isMyAucation
                  ?(
                    <Button className="cursor-pointer">
                      {/* <h3>تعديل</h3> */}
                      <Delete />
                    </Button>
                  ):(
                    <Button className="cursor-pointer">
                      <h3>حذف</h3>
                      <Delete />
                    </Button>
                    
                  )
                }
              </DialogTrigger>

              <DialogContent>
                <DialogHeader className="h-[10%] flex flex-row-reverse">
                  <DialogTitle>هل أنت متأكد من أنك تريد حذف المشكلة</DialogTitle>
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
            </div>
          ): <div></div>
        }
      </Dialog>
    </div>
  );
};

export default ProblemOverlay;