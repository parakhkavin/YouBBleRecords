import React from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";

export default function PaymentForm({ clientSecret, onPaid }: { clientSecret: string; onPaid: () => void }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      onPaid();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <PaymentElement />
      <Button type="submit" className="w-full bg-yellow-400 text-black font-bold hover:bg-yellow-300">
        Pay Now
      </Button>
    </form>
  );
}
