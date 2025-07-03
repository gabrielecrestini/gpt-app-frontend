// src/components/CheckoutForm.tsx
"use client";
import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { LoaderCircle } from "lucide-react";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/fucina?payment_success=true`,
      },
    });

    if (error) {
      setErrorMessage(error.message || "Si è verificato un errore imprevisto.");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button 
        disabled={isLoading || !stripe || !elements} 
        className="w-full mt-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 rounded-lg font-bold flex items-center justify-center gap-2 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? <LoaderCircle className="animate-spin"/> : 'Paga Ora'}
      </button>
      {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
    </form>
  );
}