import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  const initialValue = Math.min(Math.floor(max / 2), max);
  const [value, setValue] = useState<number>(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false); // حالة التبرع كمجهول

  const donationMutation = useCreateDonation(problemId);


  const handleSubmit = async (amount: number) => {
    if (amount <= 0) {
      toast.error("الرجاء اختيار مبلغ صحيح للتبرع");
      return;
    }

    console.log("donation payload", {
      amount,
      currency: "USD",
      paymentMethod: 'STRIPE',
      isAnonymous,
      successUrl: window.location.href,
      cancelUrl: window.location.href,
      idempotencyKey: uuidv4(),
    });


    setIsLoading(true);
    try {
      const response = await donationMutation.mutateAsync({
        amount,
        currency: "USD",
        paymentMethod: 'STRIPE',
        isAnonymous, // استخدم قيمة المجهولية
        successUrl: window.location.href,
        cancelUrl: window.location.href,
        idempotencyKey: uuidv4(),
      });


      if (response.sessionUrl) {
        window.location.href = response.sessionUrl;
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تنفيذ التبرع");
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
    <div className="flex flex-col gap-6 pb-6">
      {/* اختيار قيمة التبرع */}
      <div className="flex flex-col gap-4 items-center">
        <div className="w-full flex flex-col">
          <div className="flex flex-row-reverse gap-3 items-center">
            <h3 className="text-xl">0</h3>
            <Slider
              defaultValue={[value]}
              min={0}
              max={max}
              onValueChange={(vals) => setValue(vals[0])}
              disabled={isLoading}
            />
            <h3 className="text-xl">{max}</h3>
          </div>
          <p className="text-center text-[18px]">تم تحديد مبلغ {value} ليرة سورية</p>
        </div>

        {/* Checkbox للمجهولية */}
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

      {/* زر التبرع بكامل المبلغ */}
      <Button
        className="w-[50%] h-[60px] flex flex-col"
        onClick={() => handleSubmit(max)}
        disabled={isLoading || max <= 0}
      >
        <h3>التبرع بكامل المبلغ</h3>
        <h3 className="text-[12px]">المبلغ هو {max} ليرة سورية</h3>
      </Button>
    </div>
  );
};

export default DonationForm;
