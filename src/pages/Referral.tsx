import React, { useState, useEffect } from "react";
import {
  Copy,
  Share2,
  Users,
  Gift,
  ArrowLeft,
  Check,
  MessageCircle,
  Mail,
  Twitter,
  Facebook,
  Trophy,
  Crown,
  Loader,
  DollarSign,
  AlertCircle,
  CreditCard,
  X,
  UserCheck,
  Heart,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/services";

interface ReferralInfo {
  referralCode: string;
  referralsCount: number;
  verifiedReferralsCount: number;
  subscribedReferralsCount: number;
  totalEarnings: number;
  availableBalance: number;
  minCashoutAmount: number;
}

interface ReferralUser {
  id: string;
  email: string;
  createdAt: string;
  verified: boolean;
  subscription?: string;
  plan?: string;
}

interface PaymentDetails {
  email: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  routingCode: string;
  walletAddress: string;
  cryptoType: string;
}

const Referrals: React.FC = () => {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);
  const [referrals, setReferrals] = useState<ReferralUser[]>([]);
  const [cashoutAmount, setCashoutAmount] = useState(0);
  const [converting, setConverting] = useState(false);
  const [conversionSuccess, setConversionSuccess] = useState<string | null>(
    null
  );

  const [showCashoutModal, setShowCashoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "paypal" | "bank" | "crypto"
  >("paypal");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    email: "",
    accountName: "",
    bankName: "",
    accountNumber: "",
    routingCode: "",
    walletAddress: "",
    cryptoType: "btc",
  });

  const referralLink = referralInfo
    ? `https://soulmatify.com/register?ref=${referralInfo.referralCode}`
    : "";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [infoResponse, referralsResponse] = await Promise.all([
          axiosInstance.get("/referrals/info"),
          axiosInstance.get("/referrals/referrals"),
        ]);

        setReferralInfo(infoResponse.data);
        setReferrals(referralsResponse.data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching referral data:", err);
        setError(err.response?.data?.message || "Failed to load referral data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const copyToClipboard = async (text: string, type: "code" | "link") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "code") {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const shareViaApp = (platform: string) => {
    if (!referralInfo) return;

    const message = `Join me on Soulmatify! Use my referral code ${referralInfo.referralCode} or this link: ${referralLink}`;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            referralLink
          )}`
        );
        break;
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
        break;
      case "email":
        window.open(
          `mailto:?subject=Join me on Soulmatify!&body=${encodeURIComponent(
            message
          )}`
        );
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: "Join me on Soulmatify!",
            text: message,
            url: referralLink,
          });
        }
    }
  };

  const getStatusText = (user: ReferralUser) => {
    if (!user.verified) return "Pending";
    return "Active";
  };

  const isPlanPaid = (user: ReferralUser) => {
    const planValue = user.plan || user.subscription;
    return planValue !== "Free" && planValue !== "Basic";
  };

  const handleCashout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!referralInfo || !cashoutAmount) return;

    if (cashoutAmount > (referralInfo.availableBalance || 0)) {
      setError("You don't have enough balance to cashout");
      return;
    }

    if (cashoutAmount < (referralInfo.minCashoutAmount || 20)) {
      setError(`Minimum cashout amount is $${referralInfo.minCashoutAmount || 20}`);
      return;
    }

    setConverting(true);
    try {
      const response = await axiosInstance.post("/payouts/request", {
        amount: cashoutAmount,
        paymentMethod,
        paymentDetails,
      });

      setReferralInfo({
        ...referralInfo,
        availableBalance: response.data.availableBalance,
      });

      setConversionSuccess(
        response.data.message ||
          `Successfully submitted cashout request for $${cashoutAmount}!`
      );
      setCashoutAmount(0);
      setShowCashoutModal(false);

      setTimeout(() => setConversionSuccess(null), 5000);
    } catch (err: any) {
      console.error("Error processing cashout:", err);
      setError(err.response?.data?.message || "Failed to process cashout");
    } finally {
      setConverting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1a1a]">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-gray-700 border-t-[#FF6B9D] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Gift size={24} className="text-[#FF6B9D] fill-[#FF6B9D] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !referralInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a] p-4 text-center">
        <div className="bg-red-900/20 border border-red-500/50 text-red-300 p-4 rounded-lg mb-4 flex items-center">
          <AlertCircle size={24} className="mr-2" />
          <span>Something went wrong</span>
        </div>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#FF6B9D] hover:bg-[#FF4D88] text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#1a1a1a] z-40 border-b border-gray-800">
        <div className="px-4 py-4 flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft size={24} className="text-gray-300" />
          </button>
          <div className="bg-[#FF6B9D] p-1.5 rounded-full">
            <Users size={16} className="text-white fill-white" />
          </div>
          <h1 className="text-lg font-bold text-white">referrals</h1>
        </div>
      </header>

      <div className="flex-1 px-4 pt-20 pb-24 overflow-y-auto">
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
            <div className="flex items-center">
              <AlertCircle size={20} className="mr-2" />
              <span>{error}</span>
            </div>
            <button className="text-red-300" onClick={() => setError(null)}>
              <X size={16} />
            </button>
          </div>
        )}

        {conversionSuccess && (
          <div className="bg-green-900/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
            <div className="flex items-center">
              <Check size={20} className="mr-2" />
              <span>{conversionSuccess}</span>
            </div>
            <button
              className="text-green-300"
              onClick={() => setConversionSuccess(null)}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#FF6B9D] to-[#FF4D88] text-white p-8 rounded-2xl mb-6">
          <div className="flex justify-center mb-4">
            <Gift size={40} />
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">
            Earn $5 Per Referral!
          </h2>
          <p className="text-center text-white/90 max-w-md mx-auto">
            Help your friends find love and earn cash! Get $5 for every friend who subscribes to a paid plan.
          </p>
        </div>

        {/* Earnings Card */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-2xl mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Available Balance</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">
                  ${referralInfo?.availableBalance?.toFixed(2) || '0.00'}
                </span>
                <span className="text-sm text-white/80">USD</span>
              </div>
              <p className="text-sm text-white/80 mt-1">
                From {referralInfo?.subscribedReferralsCount || 0} subscribed referral{referralInfo?.subscribedReferralsCount !== 1 ? 's' : ''}
              </p>
            </div>

            <button
              onClick={() => setShowCashoutModal(true)}
              disabled={(referralInfo?.availableBalance || 0) < (referralInfo?.minCashoutAmount || 20)}
              className="bg-white/15 hover:bg-white/25 text-white font-medium rounded-lg py-3 px-5 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DollarSign size={18} />
              <span>Cash Out</span>
            </button>
          </div>

          {(referralInfo?.availableBalance || 0) < (referralInfo?.minCashoutAmount || 20) && (
            <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2 text-sm">
              <AlertCircle size={16} />
              <span>
                You need at least ${referralInfo?.minCashoutAmount || 20} to cash out.
              </span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
            <Users size={24} className="text-[#FF6B9D] mb-2" />
            <div className="text-2xl font-bold text-white">
              {referralInfo?.referralsCount || 0}
            </div>
            <div className="text-xs text-gray-400">Total Referrals</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
            <UserCheck size={24} className="text-blue-500 mb-2" />
            <div className="text-2xl font-bold text-white">
              {referralInfo?.verifiedReferralsCount || 0}
            </div>
            <div className="text-xs text-gray-400">Verified</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
            <Crown size={24} className="text-purple-500 mb-2" />
            <div className="text-2xl font-bold text-white">
              {referralInfo?.subscribedReferralsCount || 0}
            </div>
            <div className="text-xs text-gray-400">Subscribed</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
            <DollarSign size={24} className="text-green-500 mb-2" />
            <div className="text-2xl font-bold text-white">
              ${referralInfo?.totalEarnings?.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs text-gray-400">Total Earned</div>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Your Referral Code
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Referral Code
              </label>
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                  {referralInfo?.referralCode || "Loading..."}
                </div>
                <button
                  onClick={() =>
                    referralInfo &&
                    copyToClipboard(referralInfo.referralCode, "code")
                  }
                  className="px-4 py-3 bg-[#FF6B9D] hover:bg-[#FF4D88] text-white rounded-lg transition-colors flex items-center gap-2"
                  disabled={!referralInfo}
                >
                  {copiedCode ? <Check size={18} /> : <Copy size={18} />}
                  {copiedCode ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Referral Link
              </label>
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-gray-800 rounded-lg border border-gray-700 text-white truncate">
                  {referralLink || "Loading..."}
                </div>
                <button
                  onClick={() =>
                    referralLink && copyToClipboard(referralLink, "link")
                  }
                  className="px-4 py-3 bg-[#FF6B9D] hover:bg-[#FF4D88] text-white rounded-lg transition-colors flex items-center gap-2"
                  disabled={!referralLink}
                >
                  {copiedLink ? <Check size={18} /> : <Copy size={18} />}
                  {copiedLink ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Share with Friends
          </h3>

          <div className="grid grid-cols-4 gap-3 mb-4">
            <button
              onClick={() => shareViaApp("whatsapp")}
              className="flex flex-col items-center gap-2 p-4 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors text-sm text-gray-300"
              disabled={!referralInfo}
            >
              <MessageCircle size={24} className="text-green-500" />
              WhatsApp
            </button>

            <button
              onClick={() => shareViaApp("email")}
              className="flex flex-col items-center gap-2 p-4 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors text-sm text-gray-300"
              disabled={!referralInfo}
            >
              <Mail size={24} className="text-blue-500" />
              Email
            </button>

            <button
              onClick={() => shareViaApp("twitter")}
              className="flex flex-col items-center gap-2 p-4 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors text-sm text-gray-300"
              disabled={!referralInfo}
            >
              <Twitter size={24} className="text-blue-400" />
              Twitter
            </button>

            <button
              onClick={() => shareViaApp("facebook")}
              className="flex flex-col items-center gap-2 p-4 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors text-sm text-gray-300"
              disabled={!referralInfo}
            >
              <Facebook size={24} className="text-blue-600" />
              Facebook
            </button>
          </div>

          <button
            onClick={() => shareViaApp("share")}
            className="w-full mt-4 py-3 bg-[#FF6B9D] hover:bg-[#FF4D88] text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            disabled={!referralInfo}
          >
            <Share2 size={18} />
            Share Link
          </button>
        </div>

        {/* How it Works */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            How It Works
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-[#FF6B9D] text-white flex items-center justify-center font-bold mb-3">
                1
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">
                  Share Your Code
                </h4>
                <p className="text-sm text-gray-400">
                  Send your referral code or link to friends who are single and
                  ready to mingle.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-[#FF6B9D] text-white flex items-center justify-center font-bold mb-3">
                2
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">
                  Friend Subscribes
                </h4>
                <p className="text-sm text-gray-400">
                  When your friend subscribes to any paid plan, you earn $5 instantly.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-[#FF6B9D] text-white flex items-center justify-center font-bold mb-3">
                3
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">
                  Cash Out Anytime
                </h4>
                <p className="text-sm text-gray-400">
                  Once you have ${referralInfo?.minCashoutAmount || 20}+, cash out via PayPal, bank transfer, or crypto!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral History */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Referral History
          </h3>

          {referrals.length === 0 ? (
            <div className="text-center py-8 bg-gray-800/50 rounded-lg">
              <Users size={40} className="text-gray-600 mx-auto mb-3" />
              <p className="text-white font-medium">
                You haven't referred anyone yet
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Share your code to start earning $5 per referral!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gray-800 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Plan</th>
                    <th className="px-6 py-3">Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {referrals.map((referral) => (
                    <tr key={referral.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-[#FF6B9D] text-white rounded-full flex items-center justify-center mr-3 text-sm">
                            {referral.email.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {referral.email}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(
                                referral.createdAt
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            referral.verified
                              ? "bg-green-900/30 text-green-400 border border-green-500/30"
                              : "bg-yellow-900/30 text-yellow-400 border border-yellow-500/30"
                          }`}
                        >
                          {getStatusText(referral)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isPlanPaid(referral)
                              ? "bg-blue-900/30 text-blue-400 border border-blue-500/30"
                              : "bg-gray-800 text-gray-400 border border-gray-700"
                          }`}
                        >
                          {isPlanPaid(referral) ? "Subscribed" : "Free"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {isPlanPaid(referral) ? (
                          <span className="text-green-400 font-medium">+$5.00</span>
                        ) : (
                          <span className="text-gray-500">$0.00</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 pb-safe z-40">
        <div className="flex items-center justify-around py-3 px-4">
          <button
            onClick={() => navigate('/for-you')}
            className="flex flex-col items-center gap-1 py-2 px-4"
          >
            <div className="text-gray-400">
              <Heart size={24} />
            </div>
            <span className="text-xs text-gray-400">Discover</span>
          </button>

          <button
            onClick={() => navigate('/matches')}
            className="flex flex-col items-center gap-1 py-2 px-4"
          >
            <div className="text-gray-400">
              <Sparkles size={24} />
            </div>
            <span className="text-xs text-gray-400">Matches</span>
          </button>

          <button
            onClick={() => navigate('/messages')}
            className="flex flex-col items-center gap-1 py-2 px-4"
          >
            <div className="text-gray-400">
              <MessageSquare size={24} />
            </div>
            <span className="text-xs text-gray-400">Messages</span>
          </button>

          <button className="flex flex-col items-center gap-1 py-2 px-4">
            <div className="text-[#FF6B9D]">
              <Users size={24} className="fill-[#FF6B9D]" />
            </div>
            <span className="text-xs text-[#FF6B9D] font-medium">Referrals</span>
          </button>
        </div>
      </div>

      {/* Cashout Modal */}
      {showCashoutModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  Cash Out
                </h2>
                <button
                  onClick={() => setShowCashoutModal(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleCashout} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Available Balance
                </label>
                <div className="text-2xl font-bold text-white">
                  ${referralInfo?.availableBalance?.toFixed(2) || '0.00'}{" "}
                  <span className="text-sm text-gray-500 font-normal">
                    USD
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Amount to Cash Out
                </label>
                <input
                  type="number"
                  min={referralInfo?.minCashoutAmount || 20}
                  max={referralInfo?.availableBalance || 0}
                  step="5"
                  value={cashoutAmount}
                  onChange={(e) => setCashoutAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] focus:border-[#FF6B9D] text-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum: ${referralInfo?.minCashoutAmount || 20}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    className={`border rounded-lg p-3 flex flex-col items-center ${
                      paymentMethod === "paypal"
                        ? "border-[#FF6B9D] bg-[#FF6B9D]/10"
                        : "border-gray-700 bg-gray-800"
                    }`}
                    onClick={() => setPaymentMethod("paypal")}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#0070BA] flex items-center justify-center text-white text-xs font-bold mb-1">
                      PP
                    </div>
                    <span className="text-xs font-medium text-white">PayPal</span>
                  </button>

                  <button
                    type="button"
                    className={`border rounded-lg p-3 flex flex-col items-center ${
                      paymentMethod === "bank"
                        ? "border-[#FF6B9D] bg-[#FF6B9D]/10"
                        : "border-gray-700 bg-gray-800"
                    }`}
                    onClick={() => setPaymentMethod("bank")}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white mb-1">
                      <CreditCard size={16} />
                    </div>
                    <span className="text-xs font-medium text-white">Bank</span>
                  </button>

                  <button
                    type="button"
                    className={`border rounded-lg p-3 flex flex-col items-center ${
                      paymentMethod === "crypto"
                        ? "border-[#FF6B9D] bg-[#FF6B9D]/10"
                        : "border-gray-700 bg-gray-800"
                    }`}
                    onClick={() => setPaymentMethod("crypto")}
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white mb-1">
                      ₿
                    </div>
                    <span className="text-xs font-medium text-white">Crypto</span>
                  </button>
                </div>
              </div>

              {/* PayPal Details */}
              {paymentMethod === "paypal" && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    PayPal Email
                  </label>
                  <input
                    type="email"
                    value={paymentDetails.email}
                    onChange={(e) =>
                      setPaymentDetails({
                        ...paymentDetails,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] focus:border-[#FF6B9D] text-white placeholder-gray-500"
                    placeholder="your-email@example.com"
                    required
                  />
                </div>
              )}

              {/* Bank Transfer Details */}
              {paymentMethod === "bank" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Account Name
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.accountName}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          accountName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] focus:border-[#FF6B9D] text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.bankName}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          bankName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] focus:border-[#FF6B9D] text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.accountNumber}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          accountNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] focus:border-[#FF6B9D] text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Routing/Swift Code
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.routingCode}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          routingCode: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] focus:border-[#FF6B9D] text-white"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Crypto Details */}
              {paymentMethod === "crypto" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Cryptocurrency
                    </label>
                    <select
                      value={paymentDetails.cryptoType}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          cryptoType: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] focus:border-[#FF6B9D] text-white"
                      required
                    >
                      <option value="btc">Bitcoin (BTC)</option>
                      <option value="eth">Ethereum (ETH)</option>
                      <option value="usdt">Tether (USDT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.walletAddress}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          walletAddress: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] focus:border-[#FF6B9D] text-white"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#FF6B9D] hover:bg-[#FF4D88] py-4 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#FF6B9D] disabled:bg-gray-700 disabled:cursor-not-allowed"
                  disabled={
                    cashoutAmount < (referralInfo?.minCashoutAmount || 20) ||
                    cashoutAmount > (referralInfo?.availableBalance || 0) ||
                    (paymentMethod === "paypal" && !paymentDetails.email) ||
                    (paymentMethod === "bank" &&
                      (!paymentDetails.accountName ||
                        !paymentDetails.bankName ||
                        !paymentDetails.accountNumber ||
                        !paymentDetails.routingCode)) ||
                    (paymentMethod === "crypto" &&
                      !paymentDetails.walletAddress) ||
                    converting
                  }
                >
                  {converting ? (
                    <span className="flex items-center justify-center">
                      <Loader size={20} className="animate-spin mr-2" />
                      Processing...
                    </span>
                  ) : (
                    "Submit Cash Out Request"
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Your request will be processed within 3-5 business days
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Referrals;
