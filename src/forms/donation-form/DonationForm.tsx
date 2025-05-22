import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateDonation } from "@/hooks/use-donation";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Check } from "lucide-react";

type DonationFormProps = {
  max: number;
  setDonation: (value: number) => void;
  setIsDonated: (value: boolean) => void;
  problemId: number;
};

const DonationForm = ({ max, setDonation, setIsDonated, problemId }: DonationFormProps) => {
  const [value, setValue] = useState<number>(Math.floor(max / 2));
  const [isLoading, setIsLoading] = useState(false);

  const donationMutation = useCreateDonation(problemId);

  const handleSubmit = async (amount: number) => {
  if (amount <= 0) {
    toast.error("الرجاء اختيار مبلغ صحيح للتبرع");
    return;
  }

  setIsLoading(true);
  try {
    const response = await donationMutation.mutateAsync({
      amount,
      currency: "SYP",
      paymentMethod: "STRIPE",
      isAnonymous: true,
      successUrl: window.location.href, // يُفضل هنا URL خاص بصفحة "نجاح الدفع"
      cancelUrl: window.location.href, // وصفحة "فشل/إلغاء الدفع"
      idempotencyKey: uuidv4(),
    });

    // التوجيه إلى Stripe
    if (response.redirectUrl) {
      window.location.href = response.redirectUrl;
    }
  } catch (error) {
    toast.error("حدث خطأ أثناء تنفيذ التبرع");
  } finally {
    setIsLoading(false);
  }
};



  return (
    <div className="flex flex-col gap-6 pb-6">
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
        <h3 className="text-[12px]">المبلغ هو {max} ليرة سورية</h3>
      </Button>
    </div>
  );
};

export default DonationForm;
