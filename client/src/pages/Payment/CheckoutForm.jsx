import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth.js";
import useAxiosSecure from "../../hooks/useAxiosSecure.js";

const CheckoutFrom = () => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const axiosSecure = useAxiosSecure();

  const [transaction, setTransaction] = useState();
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState(5);
  const [customPrice, setCustomPrice] = useState("");

  const options = [5, 10, 20, 50, 100];
  const totalDonation = selectedOption > 0 && selectedOption !== "custom" ? selectedOption : (customPrice ? Number(customPrice) : 0);

  useEffect(() => {
    if (totalDonation > 0) {
      axiosSecure
        .post("/create-payment-intent", { price: totalDonation })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
        });
    }
  }, [axiosSecure, totalDonation]);

  const handleCustomPriceChange = (event) => {
    setSelectedOption("custom");
    setCustomPrice(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const card = elements.getElement(CardElement);

    if (card == null) {
      setIsProcessing(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
      setIsProcessing(false);
    } else {
      setError("");

      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: card,
            billing_details: {
              email: user?.email || "anonymous",
              name: user?.displayName || "anonymous",
            },
          },
        });

      if (confirmError) {
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: confirmError.message,
          confirmButtonColor: "#dc2626",
        });
        setIsProcessing(false);
      } else {
        if (paymentIntent.status === "succeeded") {
          setTransaction(paymentMethod.id);

          const payment = {
            email: user.email,
            transactionId: paymentIntent.id,
            price: totalDonation,
            date: new Date(),
          };

          const res = await axiosSecure.post("/payments", payment);

          if (res.data.donationResult.insertedId) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Donation Successful!",
              text: `Transaction ID: ${paymentIntent.id}`,
              confirmButtonColor: "#dc2626",
              showConfirmButton: false,
              timer: 2000,
            });
            setTimeout(() => {
              navigate("/dashboard/paymentHistory");
            }, 2000);
          }
        }
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-red-600 px-6 md:px-8 py-6">
        <h1 className="text-2xl font-bold text-white">Make a Donation</h1>
        <p className="text-red-100 mt-1">Secure payment with Stripe</p>
      </div>

      {/* Form Content */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Donation Amount Section */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Donation Amount <span className="text-red-600">*</span>
          </label>

          {/* Preset Options */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setSelectedOption(option);
                  setCustomPrice("");
                }}
                className={`py-3 px-4 rounded-md font-semibold transition-all ${
                  selectedOption === option
                    ? "bg-red-600 text-white ring-2 ring-red-400"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                ${option}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Or Enter Custom Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-500 text-lg">$</span>
              <input
                type="number"
                placeholder="Enter custom amount"
                value={customPrice}
                onChange={handleCustomPriceChange}
                min="1"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
            </div>
          </div>

          {/* Amount Summary */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Donation Amount</p>
            <p className="text-2xl font-bold text-red-600">
              ${totalDonation.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Card Element Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Card Details <span className="text-red-600">*</span>
            </label>
            <div className="p-4 border border-gray-300 rounded-md bg-white hover:border-red-600 transition-colors">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#374151",
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                      "::placeholder": {
                        color: "#9CA3AF",
                      },
                    },
                    invalid: {
                      color: "#dc2626",
                      iconColor: "#dc2626",
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800 font-semibold">
                ⚠️ {error}
              </p>
            </div>
          )}

          {/* Success Message */}
          {transaction && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800 font-semibold">
                ✓ Payment Successful!
              </p>
              <p className="text-xs text-green-700 mt-1">
                Transaction ID: {transaction}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!stripe || !clientSecret || totalDonation === 0 || isProcessing}
            className="w-full py-3 px-4 rounded-md bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold transition-colors text-lg"
          >
            {isProcessing ? "Processing Payment..." : `Donate $${totalDonation.toFixed(2)}`}
          </button>
        </form>

        {/* Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-blue-800">
            <strong>ℹ️ Test Card:</strong> Use 4242 4242 4242 4242 with any future expiry date and any 3-digit CVC for testing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFrom;
