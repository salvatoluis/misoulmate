import React, { useState } from 'react';
import { Check, X, Crown, Zap, Star, ChevronDown, ArrowLeft, CreditCard, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Plan {
    id: string;
    name: string;
    price: number;
    pricePeriod: string;
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
        months: number;
        pricePerMonth: number;
        totalPrice: number;
    }[];
}

const Subscription: React.FC = () => {
    const [selectedPlan, setSelectedPlan] = useState<string>('gold');
    const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
    const navigate = useNavigate();
    const [selectedBillingOption, setSelectedBillingOption] = useState<Record<string, number>>({
        'basic': 0,
        'gold': 1,
        'platinum': 1,
        'diamond': 1,
    });

    const plans: Plan[] = [
        {
            id: 'basic',
            name: 'Basic',
            price: 0,
            pricePeriod: 'Free',
            description: 'Essential features to get started on your dating journey',
            color: 'gray',
            icon: <User size={20} />,
            features: [
                { text: 'Create your profile', included: true },
                { text: 'View & like up to 10 profiles daily', included: true },
                { text: 'Message your matches', included: true },
                { text: 'Basic filters', included: true },
                { text: 'See who likes you', included: false },
                { text: 'Advanced filters', included: false },
                { text: 'Priority in search results', included: false },
                { text: 'Rewind to profiles you passed', included: false },
                { text: 'Incognito mode', included: false },
            ],
            billingOptions: [
                { months: 0, pricePerMonth: 0, totalPrice: 0 },
            ]
        },
        {
            id: 'gold',
            name: 'Gold',
            price: 25,
            pricePeriod: 'per month',
            savings: 'Save 60%',
            popular: true,
            description: 'Enhanced features to maximize your chances of finding love',
            color: 'gold',
            icon: <Zap size={20} />,
            features: [
                { text: 'Everything in Basic', included: true },
                { text: 'Unlimited likes', included: true },
                { text: 'See who likes you', included: true },
                { text: 'Advanced filters', included: true },
                { text: '5 Super Likes per week', included: true },
                { text: 'Rewind to profiles you passed', included: true },
                { text: 'Priority in search results', included: false },
                { text: 'Incognito mode', included: false },
                { text: 'Read receipts', included: false },
            ],
            billingOptions: [
                { months: 1, pricePerMonth: 25, totalPrice: 25 },
                { months: 12, pricePerMonth: 10, totalPrice: 120 },
            ]
        },
        {
            id: 'platinum',
            name: 'Platinum',
            price: 40,
            pricePeriod: 'per month',
            savings: 'Save 67%',
            description: 'Premium experience with exclusive features for serious daters',
            color: 'primary',
            icon: <Crown size={20} />,
            features: [
                { text: 'Everything in Gold', included: true },
                { text: 'Priority in search results', included: true },
                { text: 'Incognito mode', included: true },
                { text: 'Read receipts', included: true },
                { text: 'Unlimited Super Likes', included: true },
                { text: 'Monthly profile boost', included: true },
                { text: 'Message before matching', included: true },
                { text: 'See who visited your profile', included: true },
                { text: 'Priority customer support', included: true },
            ],
            billingOptions: [
                { months: 1, pricePerMonth: 40, totalPrice: 40 },
                { months: 12, pricePerMonth: 13.33, totalPrice: 160 },
            ]
        },
        {
            id: 'diamond',
            name: 'Diamond',
            price: 60,
            pricePeriod: 'per month',
            savings: 'Save 70%',
            description: 'Elite experience with all premium features and exclusive perks',
            color: 'blue',
            icon: <DiamondIcon size={20} />,
            features: [
                { text: 'Everything in Platinum', included: true },
                { text: 'VIP profile badge', included: true },
                { text: 'Weekly profile boost', included: true },
                { text: 'See when messages are read', included: true },
                { text: 'Premium matching algorithm', included: true },
                { text: 'Advanced statistics and insights', included: true },
                { text: 'Exclusive virtual events', included: true },
                { text: 'Personalized matchmaking tips', included: true },
                { text: 'Dedicated relationship coach', included: true },
            ],
            billingOptions: [
                { months: 1, pricePerMonth: 60, totalPrice: 60 },
                { months: 12, pricePerMonth: 18.33, totalPrice: 220 },
            ]
        },
    ];

    const togglePlanDetails = (planId: string) => {
        setExpandedPlan(expandedPlan === planId ? null : planId);
    };

    const handleBillingOptionChange = (planId: string, index: number) => {
        setSelectedBillingOption({
            ...selectedBillingOption,
            [planId]: index
        });
    };

    const formatCurrency = (amount: number) => {
        return `$${amount.toFixed(2)}`;
    };

    const getCurrentPlan = () => {
        return plans.find(plan => plan.id === selectedPlan);
    };

    const getCurrentBillingOption = () => {
        const plan = getCurrentPlan();
        if (!plan) return null;

        return plan.billingOptions[selectedBillingOption[plan.id]];
    };

    const getBillingText = (months: number) => {
        if (months === 1) return 'Monthly';
        if (months === 3) return '3 Months';
        if (months === 6) return '6 Months';
        if (months === 12) return 'Annual';
        return '';
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Upgrade Your Dating Experience</h2>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        Unlock premium features to increase your chances of finding that special someone.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
                    <div className="grid grid-cols-4 border-b border-gray-200">
                        {plans.map(plan => (
                            <button
                                key={plan.id}
                                className={`py-4 text-center relative ${selectedPlan === plan.id
                                    ? 'text-[#FF6B81] font-medium'
                                    : 'text-gray-600 hover:text-gray-800'
                                    } transition-colors`}
                                onClick={() => setSelectedPlan(plan.id)}
                            >
                                <span className="flex items-center justify-center gap-1.5">
                                    {plan.icon}
                                    {plan.name}
                                </span>
                                {selectedPlan === plan.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B81]"></div>
                                )}
                                {plan.popular && (
                                    <div className="absolute -top-0.5 right-4 bg-[#FF6B81] text-white text-xs px-1.5 py-0.5 rounded-b-md">
                                        Popular
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    {plans.map(plan => plan.id === selectedPlan && (
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
                                    <p className="text-gray-600">{plan.description}</p>
                                </div>

                                {plan.id !== 'basic' && (
                                    <div className="mt-4 md:mt-0 text-right">
                                        <div className="text-3xl font-bold text-gray-800">
                                            {formatCurrency(plan.billingOptions[selectedBillingOption[plan.id]].pricePerMonth)}
                                        </div>
                                        <div className="text-gray-500 text-sm">per month</div>
                                        {plan.savings && (
                                            <div className="text-[#FF6B81] text-sm font-medium mt-1">
                                                {plan.savings} with annual plan
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {plan.id !== 'basic' && (
                                <div className="mb-6">
                                    <label className="block text-sm text-gray-700 mb-2">Billing Options</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {plan.billingOptions.map((option, index) => (
                                            <button
                                                key={index}
                                                className={`border rounded-lg p-3 text-center ${selectedBillingOption[plan.id] === index
                                                    ? 'border-[#FF6B81] bg-[#FF6B81]/5 text-[#FF6B81]'
                                                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                                    } transition-colors`}
                                                onClick={() => handleBillingOptionChange(plan.id, index)}
                                            >
                                                <div className="font-medium">{getBillingText(option.months)}</div>
                                                <div className="text-sm">
                                                    {option.months === 0
                                                        ? 'Free'
                                                        : `${formatCurrency(option.pricePerMonth)}/mo`}
                                                </div>
                                                {index > 0 && (
                                                    <div className="text-xs mt-1 text-primary font-medium">
                                                        Save {Math.round((1 - option.pricePerMonth / plan.billingOptions[0].pricePerMonth) * 100)}%
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3 mb-6">
                                <div className="text-lg font-semibold text-gray-800 mb-3">Features</div>
                                {plan.features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center"
                                    >
                                        {feature.included ? (
                                            <div className="w-5 h-5 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mr-3">
                                                <Check size={12} className="text-[#FF6B81]" />
                                            </div>
                                        ) : (
                                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                                <X size={12} className="text-gray-400" />
                                            </div>
                                        )}
                                        <span className={feature.included ? 'text-gray-800' : 'text-gray-400'}>
                                            {feature.text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {plan.id !== 'basic' && (
                                <div
                                    className="border-t border-gray-200 pt-4 mt-6 text-sm text-gray-500 flex justify-between items-center cursor-pointer"
                                    onClick={() => togglePlanDetails(plan.id)}
                                >
                                    <span>View plan details</span>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform ${expandedPlan === plan.id ? 'rotate-180' : ''}`}
                                    />
                                </div>
                            )}

                            {/* Plan Details Expandable Section */}
                            {expandedPlan === plan.id && (
                                <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 space-y-2">
                                    <p>
                                        <span className="font-medium">Billing: </span>
                                        You'll be charged {formatCurrency(plan.billingOptions[selectedBillingOption[plan.id]].totalPrice)} for {plan.billingOptions[selectedBillingOption[plan.id]].months} month{plan.billingOptions[selectedBillingOption[plan.id]].months > 1 ? 's' : ''} of {plan.name}.
                                    </p>
                                    <p>
                                        <span className="font-medium">Renewal: </span>
                                        Your subscription will automatically renew. You can cancel anytime before your next billing cycle.
                                    </p>
                                    <p>
                                        <span className="font-medium">Refunds: </span>
                                        Subscriptions are non-refundable. Manage your subscription in your profile settings.
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Current Plan Highlight */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                        <Gift size={20} className="text-primary" />
                    </div>
                    <div className="flex-grow">
                        <h3 className="font-medium text-gray-700">Your current plan: Basic (Free)</h3>
                        <p className="text-sm text-gray-500">Upgrade now to enjoy premium features!</p>
                    </div>
                </div>

                {/* Checkout Button */}
                {selectedPlan !== 'basic' && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-lg font-semibold text-gray-800">Order Summary</div>
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
                            By subscribing, you agree to our Terms of Service and Privacy Policy.
                        </div>
                    </div>
                )}

                {/* Testimonials */}
                <div className="rounded-xl overflow-hidden shadow-sm mb-6">
                    <div className="p-5 bg-[#FF6B81]/5 border-l-4 border-[#FF6B81]">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 mr-4">
                                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                                    <img src="/images/testimonial-1.jpg" alt="User" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center mb-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} className="text-[#FFE066] fill-[#FFE066] mr-0.5" />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-600 italic">
                                    "Upgrading to Gold was the best decision I made! I met my partner within a month, and we've been together for over a year now. The advanced filters helped me find exactly what I was looking for."
                                </p>
                                <div className="mt-2 text-sm font-medium text-gray-800">
                                    Sarah, 28 • Premium Member
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>

                    <div className="space-y-4">
                        <div>
                            <div className="font-medium text-gray-700 mb-1">
                                How will upgrading improve my experience?
                            </div>
                            <p className="text-sm text-gray-600">
                                Premium plans offer enhanced features like unlimited likes, seeing who likes you, advanced filters, and priority placement in search results, significantly increasing your chances of finding a match.
                            </p>
                        </div>

                        <div>
                            <div className="font-medium text-gray-700 mb-1">
                                Can I cancel my subscription anytime?
                            </div>
                            <p className="text-sm text-gray-600">
                                Yes, you can cancel your subscription at any time through your profile settings. Your premium features will remain active until the end of your billing period.
                            </p>
                        </div>

                        <div>
                            <div className="font-medium text-gray-700 mb-1">
                                What payment methods do you accept?
                            </div>
                            <p className="text-sm text-gray-600">
                                We accept all major credit cards, debit cards, and PayPal. All payments are processed securely.
                            </p>
                        </div>

                        <div>
                            <div className="font-medium text-gray-700 mb-1">
                                Is my payment information secure?
                            </div>
                            <p className="text-sm text-gray-600">
                                Yes, we use industry-standard encryption to protect your payment information. We never store your full credit card details on our servers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Adding User component for basic plan icon
const User: React.FC<{ size: number }> = ({ size }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    );
};

// Diamond icon for the Diamond plan
const DiamondIcon: React.FC<{ size: number }> = ({ size }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 2H8L3 8l9 14 9-14-5-6z" />
            <path d="M12 22V8" />
            <path d="M3 8h18" />
        </svg>
    );
};

export default Subscription;