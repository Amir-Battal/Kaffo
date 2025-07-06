import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useCategoriesByGovId,
  useCreateCategory,
  useDeleteCategory,
} from "@/hooks/use-category";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { Check, X } from "lucide-react";


const Categories = () => {
  const { govId } = useParams();
  const numericGovId = Number(govId);

  const [newTag, setNewTag] = useState("");

  const { data: tags = [], isLoading } = useCategoriesByGovId(numericGovId);
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = newTag.trim();
    if (!trimmed) return;

    createCategory.mutate(
      { name: trimmed, govId: numericGovId },
      {
        onSuccess: () => {
          toast.success("تمت إضافة التصنيف بنجاح");
          setNewTag("");
        },
      }
    );
  };

  const handleDeleteTag = (id: number) => {
    deleteCategory.mutate({ id, govId: numericGovId });
  };

  return (
    <div className="px-10">
      <Separator className="my-5" />
      <h2 className="text-xl mb-4 font-semibold">إدارة التصنيفات الخاصة بالجهة المعنية</h2>

      {/* التصنيفات الحالية */}
      <div className="flex flex-wrap gap-2 mb-4">
        {isLoading ? (
          <p>جاري التحميل...</p>
        ) : (
          tags.map((tag) => (
            <div
              key={tag.id}
              className="bg-gray-100 text-sm px-4 py-1 flex items-center gap-2"
            >
              {tag.name}
              <Dialog>
                <DialogTrigger>
                  <button
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    ×
                  </button>
                </DialogTrigger>
                <DialogContent className="flex flex-col gap-10">
                  <DialogHeader className="flex flex-row-reverse">
                    <DialogTitle>هل أنت متأكد أنك تريد حذف التصنيف؟</DialogTitle>
                  </DialogHeader>

                  <div>
                    <DialogPrimitive.Close className="flex flex-row w-full justify-between px-20">
                      <Button className="w-[40%] h-[40px] cursor-pointer">
                        <h3>لا</h3>
                        <X />
                      </Button>
                      <Button className="w-[40%] h-[40px] cursor-pointer" type="button" onClick={() => handleDeleteTag(tag.id!)}>
                        <h3>نعم</h3>
                        <Check />
                      </Button>
                    </DialogPrimitive.Close>
                  </div>
                </DialogContent>
              </Dialog>
              
            </div>
          ))
        )}
      </div>

      {/* إضافة تصنيف */}
      <form
        onSubmit={handleAddTag}
        className="flex items-center gap-3 w-full max-w-md"
      >
        <input
          type="text"
          className="border px-3 py-1 w-full"
          placeholder="اسم التصنيف"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-1 hover:bg-gray-800 cursor-pointer"
        >
          إضافة
        </button>
      </form>
    </div>
  );
};

export default Categories;
