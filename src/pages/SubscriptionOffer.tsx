import React, { useState } from "react";
import {
  Check,
  X,
  Crown,
  Zap,
  Loader,
  CreditCard,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/services";

interface Plan {
  id: string;
  name: string;
  price: number;
  pricePeriod: string;
  duration: string;
  popular?: boolean;
  features: {
    text: string;
    included: boolean;
  }[];
  description: string;
  icon: React.ReactNode;
}

const SubscriptionOffer: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("premium");
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card">(
    "paypal"
  );
  const [error, setError] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    type: "visa",
    expireMonth: "",
    expireYear: "",
    cvv: "",
    firstName: "",
    lastName: "",
  });

  const navigate = useNavigate();

  const plans: Plan[] = [
    {
      id: "free",
      name: "Free",
      price: 0,
      pricePeriod: "free forever",
      duration: "Unlimited Access",
      description: "Basic features to get you started",
      icon: <Zap size={20} />,
      features: [
        { text: "Limited matches per day", included: true },
        { text: "Limited messages per day", included: true },
        { text: "Basic compatibility test", included: true },
        { text: "Message translation", included: false },
        { text: "24/7 support", included: false },
        { text: "See who viewed your profile", included: false },
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: 25.0,
      pricePeriod: "per month",
      duration: "1 Month Access",
      popular: true,
      description: "All features unlocked for serious daters",
      icon: <Crown size={20} />,
      features: [
        { text: "Unlimited matches", included: true },
        { text: "Send unlimited messages", included: true },
        { text: "Full access to compatibility test", included: true },
        { text: "Message translation", included: true },
        { text: "24/7 support", included: true },
        { text: "See who viewed your profile", included: true },
        { text: "Premium verification badge", included: true },
        { text: "AI chat assist", included: true },
      ],
    },
  ];

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const handleSkip = () => {
    navigate("/onboarding");
  };

  const handleSubscribe = async () => {
    if (selectedPlan === "free") {
      try {
        setLoading(true);
        await axiosInstance.post(`/plans/subscribe`, {
          planType: "Free",
        });
        navigate("/onboarding");
      } catch (error: any) {
        setError(
          error.response?.data?.message || "Failed to subscribe to Free plan"
        );
        setLoading(false);
      }
    } else if (selectedPlan === "premium") {
      if (paymentMethod === "paypal") {
        try {
          setLoading(true);

          const response = await axiosInstance.post(`/plans/subscribe`, {
            planType: "Premium",
          });

          // Redirect to PayPal
          if (response.data.paymentUrl) {
            window.location.href = response.data.paymentUrl;
          } else {
            setError("Failed to generate PayPal payment URL");
            setLoading(false);
          }
        } catch (error: any) {
          setError(
            error.response?.data?.message ||
              "Failed to subscribe to Premium plan"
          );
          setLoading(false);
        }
      } else if (paymentMethod === "card") {
        try {
          setLoading(true);

          const response = await axiosInstance.post(`/plans/subscribe/card`, {
            planType: "Premium",
            cardDetails: cardDetails,
          });

          if (response.data.success) {
            navigate("/onboarding");
          } else {
            setError(response.data.message || "Failed to process card payment");
          }
          setLoading(false);
        } catch (error: any) {
          setError(
            error.response?.data?.message || "Failed to process card payment"
          );
          setLoading(false);
        }
      }
    }
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value,
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 fixed inset-0 overflow-auto">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-[#FF6B81]/20 mb-4">
            <Crown size={32} className="text-[#FF6B81]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to Soulmatify!
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Unlock premium features to maximize your chances of finding your perfect match
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-start max-w-2xl mx-auto">
            <svg
              className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
            <button
              className="ml-auto text-red-300"
              onClick={() => setError(null)}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Plans Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {plans.map((plan) => (
            <button
              key={plan.id}
              className={`relative bg-gray-800/50 border-2 rounded-2xl p-6 text-left transition-all ${
                selectedPlan === plan.id
                  ? "border-[#FF6B81] bg-gray-800/80"
                  : "border-gray-700 hover:border-gray-600"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] text-white text-xs px-4 py-1 rounded-full font-medium">
                  <Sparkles size={12} className="inline mr-1" />
                  Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    plan.id === "premium"
                      ? "bg-[#FF6B81]/20 text-[#FF6B81]"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {plan.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-sm text-gray-400">{plan.description}</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">
                    {formatCurrency(plan.price)}
                  </span>
                  <span className="text-gray-400 text-sm">
                    /{plan.pricePeriod}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{plan.duration}</p>
              </div>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {feature.included ? (
                      <div className="w-5 h-5 rounded-full bg-[#FF6B81]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={12} className="text-[#FF6B81]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <X size={12} className="text-gray-500" />
                      </div>
                    )}
                    <span
                      className={`text-sm ${
                        feature.included ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Selection Indicator */}
              {selectedPlan === plan.id && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#FF6B81] flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Payment Method - Only for Premium */}
        {selectedPlan === "premium" && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Choose Payment Method
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                className={`p-4 border-2 rounded-xl flex flex-col items-center transition-all ${
                  paymentMethod === "paypal"
                    ? "border-[#FF6B81] bg-[#FF6B81]/10"
                    : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
                }`}
                onClick={() => setPaymentMethod("paypal")}
              >
                <div className="w-12 h-12 bg-[#0070BA] text-white rounded-lg flex items-center justify-center mb-2">
                  <span className="font-bold text-sm">PayPal</span>
                </div>
                <span className="text-sm font-medium text-white">PayPal</span>
                <span className="text-xs text-gray-400 mt-1">
                  Fast & secure
                </span>
              </button>

              <button
                className={`p-4 border-2 rounded-xl flex flex-col items-center transition-all ${
                  paymentMethod === "card"
                    ? "border-[#FF6B81] bg-[#FF6B81]/10"
                    : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                <div className="w-12 h-12 bg-gray-700 text-white rounded-lg flex items-center justify-center mb-2">
                  <CreditCard size={24} />
                </div>
                <span className="text-sm font-medium text-white">
                  Credit Card
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  Visa, Mastercard
                </span>
              </button>
            </div>

            {/* Card Form */}
            {paymentMethod === "card" && (
              <div className="space-y-4 p-4 border border-gray-700 rounded-xl bg-gray-800/30">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={cardDetails.firstName}
                      onChange={handleCardInputChange}
                      className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 focus:border-[#FF6B81] transition-all text-white placeholder-gray-400"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={cardDetails.lastName}
                      onChange={handleCardInputChange}
                      className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 focus:border-[#FF6B81] transition-all text-white placeholder-gray-400"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="number"
                    value={cardDetails.number}
                    onChange={handleCardInputChange}
                    className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 focus:border-[#FF6B81] transition-all text-white placeholder-gray-400"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Month
                    </label>
                    <input
                      type="text"
                      name="expireMonth"
                      value={cardDetails.expireMonth}
                      onChange={handleCardInputChange}
                      className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 focus:border-[#FF6B81] transition-all text-white placeholder-gray-400"
                      placeholder="MM"
                      maxLength={2}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Year
                    </label>
                    <input
                      type="text"
                      name="expireYear"
                      value={cardDetails.expireYear}
                      onChange={handleCardInputChange}
                      className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 focus:border-[#FF6B81] transition-all text-white placeholder-gray-400"
                      placeholder="YYYY"
                      maxLength={4}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleCardInputChange}
                      className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 focus:border-[#FF6B81] transition-all text-white placeholder-gray-400"
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Card Type
                  </label>
                  <select
                    name="type"
                    value={cardDetails.type}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, type: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 focus:border-[#FF6B81] transition-all text-white"
                    required
                  >
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="amex">American Express</option>
                    <option value="discover">Discover</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 max-w-md mx-auto">
          <button
            className="w-full py-3.5 bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] hover:from-[#D86D72] hover:to-[#9A4DD9] text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg shadow-[#FF6B81]/25 hover:shadow-xl hover:shadow-[#FF6B81]/35 disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <>
                {selectedPlan === "free" ? (
                  "Continue with Free Plan"
                ) : paymentMethod === "paypal" ? (
                  <>
                    <img
                      src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png"
                      alt="PayPal"
                      className="h-5 mr-2"
                    />
                    Pay with PayPal
                  </>
                ) : (
                  <>
                    <CreditCard size={18} className="mr-2" />
                    Pay ${plans.find((p) => p.id === selectedPlan)?.price}
                  </>
                )}
              </>
            )}
          </button>

          <button
            className="w-full py-3.5 bg-transparent border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center"
            onClick={handleSkip}
            disabled={loading}
          >
            Skip for now
            <ArrowRight size={18} className="ml-2" />
          </button>
        </div>

        <div className="text-center mt-6 text-xs text-gray-500 max-w-md mx-auto">
          By subscribing, you agree to our Terms of Service and Privacy Policy.
          You can cancel anytime.
        </div>
      </div>
    </div>
  );
};

export default SubscriptionOffer;
