import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateDonation } from "@/hooks/use-donation";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

type DonationFormProps = {
  max: number;
  setDonation: (value: number) => void;
  setIsDonated: (value: boolean) => void;
  problemId: number;
};

const DonationForm = ({ max, setDonation, setIsDonated, problemId }: DonationFormProps) => {
  const [value, setValue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  const donationMutation = useCreateDonation(problemId);

  const handleSubmit = async (amount: number) => {
    if (amount <= 0) {
      toast.warning("الرجاء إدخال مبلغ صالح للتبرع.");
      return;
    }

    if (amount > max) {
      toast.warning(`أقصى مبلغ متاح للتبرع هو ${max} ل.ل`);
      return;
    }

    setIsLoading(true);
    try {
      const response = await donationMutation.mutateAsync({
        amount,
        currency: "LBP", // ✅ تغيير العملة
        paymentMethod: "STRIPE",
        isAnonymous,
        successUrl: window.location.href,
        cancelUrl: window.location.href,
        idempotencyKey: uuidv4(),
      });

      toast.success("تم إنشاء طلب التبرع بنجاح، سيتم تحويلك لبوابة الدفع...");
      if (response.sessionUrl) {
        window.location.href = response.sessionUrl;
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تنفيذ عملية التبرع. الرجاء المحاولة لاحقاً.");
    } finally {
      setIsLoading(false);
    }
  };

  if (max <= 0) {
    return (
      <div className="text-red-600 text-center font-bold text-xl">
        تم جمع كامل المبلغ المطلوب، لا يمكن التبرع حالياً.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-6 items-center">
      <div className="w-full flex flex-col gap-4 items-center">
        <label className="w-full text-right font-semibold">أدخل مبلغ التبرع (ل.ل)</label>
        <Input
          type="number"
          min={1}
          max={max}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          disabled={isLoading}
          className="w-full text-right"
          placeholder={`الحد الأقصى: ${max} ل.ل`}
        />

        <p className="text-center text-[16px] text-gray-600">
          أقصى مبلغ متاح للتبرع: {max} ل.ل
        </p>

        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            disabled={isLoading}
          />
          التبرع كمجهول
        </label>

        <Button
          className="w-[50%] h-[40px]"
          onClick={() => handleSubmit(value)}
          disabled={isLoading || value <= 0}
        >
          {isLoading ? "جارٍ التبرع..." : "تبرع"}
        </Button>
      </div>

      <Button
        className="w-[50%] h-[60px] flex flex-col"
        onClick={() => handleSubmit(max)}
        disabled={isLoading || max <= 0}
      >
        <h3>التبرع بكامل المبلغ</h3>
        <h3 className="text-[12px]">المبلغ هو {max} ل.ل</h3>
      </Button>
    </div>
  );
};

export default DonationForm;
