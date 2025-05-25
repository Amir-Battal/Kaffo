import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe("pk_test_YourPublishableKeyHere");

const CheckoutForm = ({ problemId, amount }: { problemId: number; amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string>("");

  useEffect(() => {
    // طلب إنشاء PaymentIntent للسيرفر
    axios.post(`/api/v1/problems/${problemId}/create-payment-intent`, { amount })
      .then(res => setClientSecret(res.data.clientSecret))
      .catch(() => alert("حدث خطأ في إنشاء عملية الدفع"));
  }, [problemId, amount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
      },
    });

    if (error) {
      alert(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      alert("تم الدفع بنجاح! شكراً لتبرعك.");
      // توجيه أو تحديث الصفحة حسب الحاجة
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{ hidePostalCode: true }} />
      <button type="submit" disabled={!stripe}>ادفع {amount} USD</button>
    </form>
  );
};

const DonationPage = ({ problemId, amount }: { problemId: number; amount: number }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm problemId={problemId} amount={amount} />
  </Elements>
);

export default DonationPage;
