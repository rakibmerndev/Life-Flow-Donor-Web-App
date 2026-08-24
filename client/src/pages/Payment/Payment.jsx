import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Helmet } from "react-helmet";
import CheckoutFrom from "./CheckoutForm";

const Payment = () => {
  const stripePromise = loadStripe(import.meta.env.VITE_GATEWAY);
  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8 flex items-center justify-center">
      <Helmet>
        <title>LifeFlowDonor | Payment</title>
      </Helmet>
      <div className="w-full max-w-2xl">
        <Elements stripe={stripePromise}>
          <CheckoutFrom />
        </Elements>
      </div>
    </div>
  );
};

export default Payment;
