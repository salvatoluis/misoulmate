import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  Crown,
  Zap,
  ChevronDown,
  ArrowLeft,
  CreditCard,
  Gift,
  Loader,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/services";

interface Plan {
  id: string;
  name: string;
  price: number;
  pricePeriod: string;
  duration: string;
  savings?: string;
  popular?: boolean;
  features: {
    text: string;
    included: boolean;
  }[];
  description: string;
  color: string;
  icon: React.ReactNode;
}

interface UserPlan {
  planType: string;
  expiresAt: string | null;
  features: Record<string, any>;
}

const API_URL = "https://api.soulmatify.com/api/v1";

const Subscription: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("premium");
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card">(
    "paypal"
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axiosInstance.get(`${API_URL}/plans/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserPlan(response.data);
      } catch (error) {
        console.error("Error fetching user plan:", error);
      }
    };

    fetchUserPlan();
  }, []);

  const plans: Plan[] = [
    {
      id: "free",
      name: "Free",
      price: 0,
      pricePeriod: "free forever",
      duration: "Unlimited Access",
      description: "Basic features to get you started",
      color: "gray",
      icon: <Zap size={20} />,
      features: [
        { text: "View other users profile", included: true },
        { text: "Limited matches per day", included: true },
        { text: "Limited messages per day", included: true },
        { text: "Basic compatibility test", included: true },
        { text: "Message translation", included: false },
        { text: "24/7 support", included: false },
        { text: "Top on browse page", included: false },
        { text: "See who viewed your profile", included: false },
        { text: "Hide profile from other users", included: false },
        { text: "Premium verification badge", included: false },
        { text: "AI chat assist", included: false },
        { text: "Unlimited likes", included: false },
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
      color: "gold",
      icon: <Crown size={20} />,
      features: [
        { text: "View other users profile", included: true },
        { text: "Send and receive images", included: true },
        { text: "Unlimited matches", included: true },
        { text: "Send unlimited messages", included: true },
        { text: "Full access to compatibility test", included: true },
        { text: "Message translation", included: true },
        { text: "24/7 support", included: true },
        { text: "Top on browse page", included: true },
        { text: "See who viewed your profile", included: true },
        { text: "Hide profile from other users", included: true },
        { text: "Premium verification badge", included: true },
        { text: "AI chat assist", included: true },
      ],
    },
  ];

  const togglePlanDetails = (planId: string) => {
    setExpandedPlan(expandedPlan === planId ? null : planId);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getCurrentPlan = () => {
    return plans.find((plan) => plan.id === selectedPlan);
  };

  const handleSubscribe = async () => {
    if (selectedPlan === "free") {
      try {
        setLoading(true);
        const response = await axiosInstance.post(`/plans/subscribe`, {
          planType: "Free",
        });

        setSuccess("Successfully subscribed to Free plan");
        setUserPlan(response.data);
        setLoading(false);
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
            setSuccess("Successfully subscribed to Premium plan");
            setUserPlan(response.data.plan);
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

  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to cancel subscription");
        setLoading(false);
        return;
      }

      const response = await axiosInstance.post(
        `${API_URL}/plans/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(
          response.data.message || "Successfully cancelled subscription"
        );
        const userPlanResponse = await axiosInstance.get(
          `${API_URL}/plans/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserPlan(userPlanResponse.data);
      } else {
        setError(response.data.message || "Failed to cancel subscription");
      }
      setLoading(false);
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Failed to cancel subscription"
      );
      setLoading(false);
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
    <div className="bg-gray-50 min-h-screen pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Premium Plans</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
            <button
              className="float-right text-red-700"
              onClick={() => setError(null)}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
            <button
              className="float-right text-green-700"
              onClick={() => setSuccess(null)}
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-[#FF6B81]/10 mb-4">
            <Crown size={28} className="text-[#FF6B81]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Upgrade Your Dating Experience
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Choose the perfect plan to find your special someone with unlimited
            access to all features.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="grid grid-cols-2 border-b border-gray-200">
            {plans.map((plan) => (
              <button
                key={plan.id}
                className={`py-4 text-center relative ${
                  selectedPlan === plan.id
                    ? "text-[#FF6B81] font-medium"
                    : "text-gray-600 hover:text-gray-800"
                } transition-colors`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <span className="flex items-center justify-center gap-1.5 text-sm md:text-base">
                  {plan.icon}
                  {plan.name}
                </span>
                {selectedPlan === plan.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B81]"></div>
                )}
                {plan.popular && (
                  <div className="absolute -top-0.5 right-2 bg-[#FF6B81] text-white text-xs px-1.5 py-0.5 rounded-b-md">
                    Popular
                  </div>
                )}
              </button>
            ))}
          </div>

          {plans.map(
            (plan) =>
              plan.id === selectedPlan && (
                <div key={plan.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                        {plan.icon}
                        {plan.name}
                        {plan.popular && (
                          <span className="text-xs bg-[#FF6B81]/10 text-[#FF6B81] px-2 py-0.5 rounded-full">
                            Most Popular
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-600 mb-2">{plan.description}</p>
                      <p className="text-sm font-medium text-[#FF6B81]">
                        {plan.duration}
                      </p>
                    </div>

                    <div className="mt-4 md:mt-0 text-right">
                      <div className="text-3xl font-bold text-gray-800">
                        {formatCurrency(plan.price)}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {plan.pricePeriod}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="text-lg font-semibold text-gray-800 mb-3">
                      Features Included
                    </div>
                    <div className="grid md:grid-cols-2 gap-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          {feature.included ? (
                            <div className="w-5 h-5 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mr-3 flex-shrink-0">
                              <Check size={12} className="text-[#FF6B81]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <X size={12} className="text-gray-400" />
                            </div>
                          )}
                          <span
                            className={`text-sm ${
                              feature.included
                                ? "text-gray-800"
                                : "text-gray-400"
                            }`}
                          >
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className="border-t border-gray-200 pt-4 mt-6 text-sm text-gray-500 flex justify-between items-center cursor-pointer"
                    onClick={() => togglePlanDetails(plan.id)}
                  >
                    <span>View plan details</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        expandedPlan === plan.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* Plan Details Expandable Section */}
                  {expandedPlan === plan.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 space-y-2">
                      <p>
                        <span className="font-medium">Billing: </span>
                        {plan.id === "free"
                          ? "Free plan with no charges."
                          : `You'll be charged ${formatCurrency(
                              plan.price
                            )} per month for the ${plan.name} plan.`}
                      </p>
                      <p>
                        <span className="font-medium">Access: </span>
                        All premium features are activated immediately after
                        payment confirmation.
                      </p>
                      <p>
                        <span className="font-medium">Renewal: </span>
                        {plan.id === "free"
                          ? "No renewal needed for the free plan."
                          : "Monthly subscription with automatic renewal. You can cancel anytime."}
                      </p>
                      <p>
                        <span className="font-medium">Support: </span>
                        24/7 customer support available throughout your
                        subscription period.
                      </p>
                    </div>
                  )}
                </div>
              )
          )}
        </div>

        {/* Current Plan Highlight */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
            <Gift size={20} className="text-gray-600" />
          </div>
          <div className="flex-grow">
            <h3 className="font-medium text-gray-700">
              Your current plan: {userPlan?.planType || "Free"}
            </h3>
            <p className="text-sm text-gray-500">
              {userPlan?.planType === "Premium"
                ? `Premium features • Expires on ${new Date(
                    userPlan.expiresAt || ""
                  ).toLocaleDateString()}`
                : "Limited features • Upgrade to unlock full potential!"}
            </p>
          </div>
          {userPlan?.planType === "Premium" && (
            <button
              onClick={handleCancelSubscription}
              className="text-sm text-red-500 hover:text-red-700 px-3 py-1 border border-red-300 rounded-md"
              disabled={loading}
            >
              {loading ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                "Cancel"
              )}
            </button>
          )}
        </div>

        {/* Payment Method Selection - Only show for Premium plan */}
        {selectedPlan === "premium" && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="text-lg font-semibold text-gray-800 mb-4">
              Payment Method
            </div>
            <div className="flex space-x-4 mb-6">
              <button
                className={`flex-1 p-4 border rounded-lg flex flex-col items-center ${
                  paymentMethod === "paypal"
                    ? "border-[#FF6B81] bg-[#FF6B81]/5"
                    : "border-gray-200 bg-white"
                }`}
                onClick={() => setPaymentMethod("paypal")}
              >
                <div className="w-10 h-10 bg-[#0070BA] text-white rounded-md flex items-center justify-center mb-2">
                  <span className="font-bold text-xs">PayPal</span>
                </div>
                <span className="text-sm font-medium">PayPal</span>
                <span className="text-xs text-gray-500 mt-1">
                  Fast & secure
                </span>
              </button>
              <button
                className={`flex-1 p-4 border rounded-lg flex flex-col items-center ${
                  paymentMethod === "card"
                    ? "border-[#FF6B81] bg-[#FF6B81]/5"
                    : "border-gray-200 bg-white"
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                <div className="w-10 h-10 bg-gray-800 text-white rounded-md flex items-center justify-center mb-2">
                  <CreditCard size={20} />
                </div>
                <span className="text-sm font-medium">Credit Card</span>
                <span className="text-xs text-gray-500 mt-1">
                  Visa, Mastercard, Amex
                </span>
              </button>
            </div>

            {/* Credit Card Form */}
            {paymentMethod === "card" && (
              <div className="space-y-4 mb-6 p-4 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={cardDetails.firstName}
                      onChange={handleCardInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={cardDetails.lastName}
                      onChange={handleCardInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="number"
                    value={cardDetails.number}
                    onChange={handleCardInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Month
                    </label>
                    <input
                      type="text"
                      name="expireMonth"
                      value={cardDetails.expireMonth}
                      onChange={handleCardInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="MM"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Year
                    </label>
                    <input
                      type="text"
                      name="expireYear"
                      value={cardDetails.expireYear}
                      onChange={handleCardInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="YYYY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleCardInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Type
                  </label>
                  <select
                    name="type"
                    value={cardDetails.type}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, type: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
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

        {/* Checkout Button */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-semibold text-gray-800">
              Order Summary
            </div>
            <div>
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-xl font-bold text-gray-800">
                {formatCurrency(getCurrentPlan()?.price || 0)}
              </div>
            </div>
          </div>

          <button
            className="w-full py-3.5 bg-[#FF6B81] hover:bg-[#D86D72] text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleSubscribe}
            disabled={loading || userPlan?.planType === selectedPlan}
          >
            {loading ? (
              <Loader size={20} className="animate-spin" />
            ) : (
              <>
                {selectedPlan === "free" ? (
                  "Continue with Free Plan"
                ) : paymentMethod === "paypal" ? (
                  <>
                    <img
                      src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png"
                      alt="PayPal"
                      height="20"
                    />
                    Pay with PayPal
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Pay with Card
                  </>
                )}
              </>
            )}
          </button>

          <div className="text-center mt-4 text-xs text-gray-500">
            By subscribing, you agree to our Terms of Service and Privacy
            Policy.
          </div>
        </div>

      </div>
    </div>
  );
};

export default Subscription;
