import React, { useState } from "react";
import {
  Check,
  X,
  Crown,
  Zap,
  Star,
  ChevronDown,
  ArrowLeft,
  CreditCard,
  Gift,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  billingOptions: {
    duration: string;
    pricePerPeriod: number;
    totalPrice: number;
  }[];
}

const Subscription: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const navigate = useNavigate();
  const [selectedBillingOption, setSelectedBillingOption] = useState<
    Record<string, number>
  >({
    basic: 0,
    pro: 0,
    premium: 0,
  });

  const plans: Plan[] = [
    {
      id: "basic",
      name: "Basic",
      price: 9.99,
      pricePeriod: "per week",
      duration: "1 Week Access",
      description: "Perfect for trying out premium features",
      color: "blue",
      icon: <Zap size={20} />,
      features: [
        { text: "View other users profile", included: true },
        { text: "Send and receive images", included: true },
        { text: "Unlimited matches", included: true },
        { text: "Send unlimited messages", included: true },
        { text: "Full access to compatibility test", included: true },
        { text: "Message translation", included: true },
        { text: "24/7 support", included: true },
        { text: "Top on browse page", included: false },
        { text: "See who viewed your profile", included: false },
        { text: "Hide profile from other users", included: false },
        { text: "Premium verification badge", included: false },
        { text: "AI chat assist", included: false },
      ],
      billingOptions: [
        { duration: "1 Week", pricePerPeriod: 9.99, totalPrice: 9.99 },
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: 24.99,
      pricePeriod: "per month",
      duration: "1 Month Access",
      popular: true,
      description: "Most popular choice for serious daters",
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
        { text: "Top on browse page", included: false },
        { text: "See who viewed your profile", included: false },
        { text: "Hide profile from other users", included: false },
        { text: "Premium verification badge", included: false },
        { text: "AI chat assist", included: false },
      ],
      billingOptions: [
        { duration: "1 Month", pricePerPeriod: 24.99, totalPrice: 24.99 },
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: 119.99,
      pricePeriod: "per year",
      duration: "1 Year Access",
      savings: "Save 60%",
      description: "Ultimate dating experience with all premium features",
      color: "purple",
      icon: <Shield size={20} />,
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
      billingOptions: [
        { duration: "1 Year", pricePerPeriod: 119.99, totalPrice: 119.99 },
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

  const getCurrentBillingOption = () => {
    const plan = getCurrentPlan();
    if (!plan) return null;

    return plan.billingOptions[selectedBillingOption[plan.id]];
  };

  const getEquivalentMonthlyPrice = (plan: Plan) => {
    if (plan.id === "basic") return plan.price * 4.33;
    if (plan.id === "pro") return plan.price; 
    if (plan.id === "premium") return plan.price / 12;
    return plan.price;
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
          <div className="grid grid-cols-3 border-b border-gray-200">
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
                      {plan.id === "premium" && (
                        <div className="text-[#FF6B81] text-sm font-medium mt-1">
                          Only {formatCurrency(getEquivalentMonthlyPrice(plan))}
                          /month
                        </div>
                      )}
                      {plan.savings && (
                        <div className="text-green-600 text-sm font-medium mt-1">
                          {plan.savings} vs monthly
                        </div>
                      )}
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
                        You'll be charged {formatCurrency(plan.price)} for{" "}
                        {plan.duration.toLowerCase()} of {plan.name}.
                      </p>
                      <p>
                        <span className="font-medium">Access: </span>
                        All premium features are activated immediately after
                        payment confirmation.
                      </p>
                      <p>
                        <span className="font-medium">Renewal: </span>
                        This is a one-time payment. No automatic renewal unless
                        you choose to upgrade again.
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
              Your current plan: Free
            </h3>
            <p className="text-sm text-gray-500">
              Limited features • Upgrade to unlock full potential!
            </p>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-semibold text-gray-800">
              Order Summary
            </div>
            <div>
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-xl font-bold text-gray-800">
                {formatCurrency(getCurrentBillingOption()?.totalPrice || 0)}
              </div>
            </div>
          </div>

          <button className="w-full py-3.5 bg-[#FF6B81] hover:bg-[#D86D72] text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
            <CreditCard size={18} />
            Subscribe Now
          </button>

          <div className="text-center mt-4 text-xs text-gray-500">
            By subscribing, you agree to our Terms of Service and Privacy
            Policy.
          </div>
        </div>

        {/* Value Proposition */}
        <div className="bg-gradient-to-r from-[#FF6B81]/10 to-[#D86D72]/10 rounded-xl p-6 mb-6 border border-[#FF6B81]/20">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Why Choose Premium?
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mx-auto mb-3">
                <Crown size={24} className="text-[#FF6B81]" />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">
                Premium Features
              </h4>
              <p className="text-sm text-gray-600">
                Access all features including AI chat assist and premium badge
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mx-auto mb-3">
                <Zap size={24} className="text-[#FF6B81]" />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">
                Better Visibility
              </h4>
              <p className="text-sm text-gray-600">
                Appear at the top of browse pages and get more profile views
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mx-auto mb-3">
                <Shield size={24} className="text-[#FF6B81]" />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">
                Privacy Control
              </h4>
              <p className="text-sm text-gray-600">
                Hide your profile when needed and browse anonymously
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="rounded-xl overflow-hidden shadow-sm mb-6">
          <div className="p-5 bg-[#FF6B81]/5 border-l-4 border-[#FF6B81]">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-[#FF6B81] to-[#D86D72] flex items-center justify-center">
                    <span className="text-white font-bold">M</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-[#FFE066] fill-[#FFE066] mr-0.5"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 italic">
                  "The Premium plan changed everything! The AI chat assist
                  helped me write better messages, and being at the top of
                  browse pages got me so many more matches. Found my soulmate
                  within 2 months!"
                </p>
                <div className="mt-2 text-sm font-medium text-gray-800">
                  Michael, 31 • Premium Member
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            <div>
              <div className="font-medium text-gray-700 mb-1">
                What's the difference between the plans?
              </div>
              <p className="text-sm text-gray-600">
                Basic and Pro include all core features for 1 week and 1 month
                respectively. Premium adds exclusive features like AI chat
                assist, premium verification badge, and enhanced visibility for
                a full year.
              </p>
            </div>

            <div>
              <div className="font-medium text-gray-700 mb-1">
                Do these plans auto-renew?
              </div>
              <p className="text-sm text-gray-600">
                No, these are one-time payments with no automatic renewal. You
                can upgrade again anytime when your current plan expires.
              </p>
            </div>

            <div>
              <div className="font-medium text-gray-700 mb-1">
                What is AI chat assist?
              </div>
              <p className="text-sm text-gray-600">
                Our AI helps you craft better messages, suggests conversation
                starters, and provides tips to improve your dating conversations
                and increase your success rate.
              </p>
            </div>

            <div>
              <div className="font-medium text-gray-700 mb-1">
                Can I change plans?
              </div>
              <p className="text-sm text-gray-600">
                Yes, you can upgrade to a higher plan anytime. The new features
                will be activated immediately and extend your current
                subscription period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
