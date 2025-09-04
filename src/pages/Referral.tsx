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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/services";

interface ReferralInfo {
  referralCode: string;
  referralsCount: number;
  verifiedReferralsCount: number;
  subscribedReferralsCount: number;
  points: number;
  redeemablePoints: number;
  minRedemptionAmount: number;
}

interface ReferralUser {
  id: string;
  email: string;
  createdAt: string;
  verified: boolean;
  subscription?: string;
  plan?: string;
}

interface PointTransaction {
  id: string;
  amount: number;
  transactionType: "referral" | "signup" | "conversion" | "other";
  description: string;
  createdAt: string;
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
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [convertPoints, setConvertPoints] = useState(0);
  const [converting, setConverting] = useState(false);
  const [conversionSuccess, setConversionSuccess] = useState<string | null>(
    null
  );

  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(400);
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
        const [infoResponse, referralsResponse, transactionsResponse] =
          await Promise.all([
            axiosInstance.get("/referrals/info"),
            axiosInstance.get("/referrals/referrals"),
            axiosInstance.get("/referrals/points/transactions"),
          ]);

        setReferralInfo(infoResponse.data);
        setReferrals(referralsResponse.data);
        setTransactions(transactionsResponse.data);
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

    const message = `Join me on this amazing dating app! Use my referral code ${referralInfo.referralCode} or this link: ${referralLink}`;

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
          `mailto:?subject=Join me on this dating app!&body=${encodeURIComponent(
            message
          )}`
        );
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: "Join me on this dating app!",
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

  const handleRedeemPoints = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!referralInfo || !pointsToRedeem) return;

    if (pointsToRedeem > (referralInfo.redeemablePoints || 0)) {
      setError("You don't have enough redeemable points");
      return;
    }

    if (pointsToRedeem < 400) {
      setError("Minimum redemption amount is 400 points");
      return;
    }

    setConverting(true);
    try {
      const response = await axiosInstance.post("/payouts/request", {
        pointsToConvert: pointsToRedeem,
        paymentMethod,
        paymentDetails,
      });

      setReferralInfo({
        ...referralInfo,
        points: response.data.points,
        redeemablePoints: response.data.redeemablePoints,
      });

      const transactionsResponse = await axiosInstance.get(
        "/referrals/points/transactions"
      );
      setTransactions(transactionsResponse.data);

      setConversionSuccess(
        response.data.message ||
          `Successfully submitted redemption request for ${pointsToRedeem} points!`
      );
      setPointsToRedeem(400);
      setShowRedeemModal(false);

      setTimeout(() => setConversionSuccess(null), 5000);
    } catch (err: any) {
      console.error("Error redeeming points:", err);
      setError(err.response?.data?.message || "Failed to redeem points");
    } finally {
      setConverting(false);
    }
  };

  const handleConvertPoints = async () => {
    if (!convertPoints || convertPoints <= 0 || !referralInfo) return;

    if (convertPoints > referralInfo.points) {
      setError("You don't have enough points to convert");
      return;
    }

    setConverting(true);
    try {
      const response = await axiosInstance.post("/referrals/points/convert", {
        points: convertPoints,
      });

      setReferralInfo({
        ...referralInfo,
        points: response.data.points,
      });

      const transactionsResponse = await axiosInstance.get(
        "/referrals/points/transactions"
      );
      setTransactions(transactionsResponse.data);

      setConversionSuccess(`Successfully converted ${convertPoints} points!`);
      setConvertPoints(0);

      setTimeout(() => setConversionSuccess(null), 3000);
    } catch (err: any) {
      console.error("Error converting points:", err);
      setError(err.response?.data?.message || "Failed to convert points");
    } finally {
      setConverting(false);
    }
  };

  const getDollarValue = (points: number) => {
    return (points * 0.05).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size={24} className="animate-spin text-[#FF6B81] mr-2" />
        <span>Loading referral data...</span>
      </div>
    );
  }

  if (error && !referralInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 flex items-center">
          <AlertCircle size={24} className="mr-2" />
          <span>Something went wrong</span>
        </div>
        <p className="mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#FF6B81] text-white rounded-lg hover:bg-[#D86D72] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Refer Friends</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 pb-20">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
            <div className="flex items-center">
              <AlertCircle size={20} className="mr-2" />
              <span>{error}</span>
            </div>
            <button className="text-red-700" onClick={() => setError(null)}>
              ×
            </button>
          </div>
        )}

        {conversionSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
            <div className="flex items-center">
              <Check size={20} className="mr-2" />
              <span>{conversionSuccess}</span>
            </div>
            <button
              className="text-green-700"
              onClick={() => setConversionSuccess(null)}
            >
              ×
            </button>
          </div>
        )}

        <div className="bg-gradient-to-r from-[#FF6B81] to-[#FF8E8E] text-white p-8 rounded-xl mb-6">
          <div className="flex justify-center mb-4">
            <Gift size={40} />
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">
            Share the Love
          </h2>
          <p className="text-center text-white/90 max-w-md mx-auto">
            Help your friends find love and earn rewards! For every friend who
            joins and finds a match, you both win.
          </p>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-xl mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Redeemable Points</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {referralInfo?.redeemablePoints || 0}
                </span>
                <span className="text-sm text-white/80">
                  ${getDollarValue(referralInfo?.redeemablePoints || 0)} USD
                </span>
              </div>
              <p className="text-sm text-white/80 mt-1">
                Points from subscribed referrals only
              </p>
            </div>

            <button
              onClick={() => setShowRedeemModal(true)}
              disabled={(referralInfo?.redeemablePoints || 0) < 400}
              className="bg-white/15 hover:bg-white/25 text-white font-medium rounded-lg py-3 px-5 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DollarSign size={18} />
              <span>Redeem Points</span>
            </button>
          </div>

          {(referralInfo?.redeemablePoints || 0) < 400 && (
            <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2 text-sm">
              <AlertCircle size={16} />
              <span>
                You need at least 400 points from subscribed referrals to
                redeem.
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <Users size={24} className="text-[#FF6B81] mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {referralInfo?.referralsCount || 0}
            </div>
            <div className="text-xs text-gray-500">Friends Referred</div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <UserCheck size={24} className="text-blue-500 mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {referralInfo?.verifiedReferralsCount || 0}
            </div>
            <div className="text-xs text-gray-500">Verified Friends</div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <Crown size={24} className="text-purple-500 mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {referralInfo?.subscribedReferralsCount || 0}
            </div>
            <div className="text-xs text-gray-500">Subscribed Friends</div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <Gift size={24} className="text-green-500 mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {referralInfo?.points || 0}
            </div>
            <div className="text-xs text-gray-500">Points Balance</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Your Referral Code
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Referral Code
              </label>
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800">
                  {referralInfo?.referralCode || "Loading..."}
                </div>
                <button
                  onClick={() =>
                    referralInfo &&
                    copyToClipboard(referralInfo.referralCode, "code")
                  }
                  className="px-4 py-3 bg-[#FF6B81] text-white rounded-lg hover:bg-[#D86D72] transition-colors flex items-center gap-2"
                  disabled={!referralInfo}
                >
                  {copiedCode ? <Check size={18} /> : <Copy size={18} />}
                  {copiedCode ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Referral Link
              </label>
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 truncate">
                  {referralLink || "Loading..."}
                </div>
                <button
                  onClick={() =>
                    referralLink && copyToClipboard(referralLink, "link")
                  }
                  className="px-4 py-3 bg-[#FF6B81] text-white rounded-lg hover:bg-[#D86D72] transition-colors flex items-center gap-2"
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
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Share with Friends
          </h3>

          <div className="grid grid-cols-4 gap-3 mb-4">
            <button
              onClick={() => shareViaApp("whatsapp")}
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={!referralInfo}
            >
              <MessageCircle size={24} className="text-green-500" />
              WhatsApp
            </button>

            <button
              onClick={() => shareViaApp("email")}
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={!referralInfo}
            >
              <Mail size={24} className="text-blue-500" />
              Email
            </button>

            <button
              onClick={() => shareViaApp("twitter")}
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={!referralInfo}
            >
              <Twitter size={24} className="text-blue-400" />
              Twitter
            </button>

            <button
              onClick={() => shareViaApp("facebook")}
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={!referralInfo}
            >
              <Facebook size={24} className="text-blue-600" />
              Facebook
            </button>
          </div>

          <button
            onClick={() => shareViaApp("share")}
            className="w-full mt-4 py-3 bg-[#FF6B81] text-white rounded-lg hover:bg-[#D86D72] transition-colors flex items-center justify-center gap-2"
            disabled={!referralInfo}
          >
            <Share2 size={18} />
            Share Link
          </button>
        </div>

        {/* Legacy Convert Points to Coins Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Convert Points to Coins
          </h3>

          <div className="mb-4">
            <p className="text-gray-600 mb-2">
              You have{" "}
              <span className="font-semibold">{referralInfo?.points || 0}</span>{" "}
              points available to convert.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              max={referralInfo?.points || 0}
              value={convertPoints}
              onChange={(e) =>
                setConvertPoints(
                  Math.min(
                    parseInt(e.target.value) || 0,
                    referralInfo?.points || 0
                  )
                )
              }
              className="flex-1 p-3 bg-gray-50 rounded-lg border"
              placeholder="Enter points to convert"
            />
            <button
              onClick={handleConvertPoints}
              disabled={
                !convertPoints ||
                convertPoints <= 0 ||
                convertPoints > (referralInfo?.points || 0) ||
                converting
              }
              className="px-4 py-3 bg-[#FF6B81] text-white rounded-lg hover:bg-[#D86D72] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {converting ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Gift size={18} />
              )}
              {converting ? "Converting..." : "Convert"}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Note: Points will be converted to coins at a 1:1 ratio. Conversions
            cannot be undone.
          </p>
        </div>

        {/* How it Works */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            How It Works
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-[#FF6B81] text-white flex items-center justify-center font-bold mb-3">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">
                  Share Your Code
                </h4>
                <p className="text-sm text-gray-600">
                  Send your referral code or link to friends who are single and
                  ready to mingle.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-[#FF6B81] text-white flex items-center justify-center font-bold mb-3">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">
                  Friend Subscribes
                </h4>
                <p className="text-sm text-gray-600">
                  When your friend subscribes to a paid plan, you earn 100
                  points for each subscription.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-[#FF6B81] text-white flex items-center justify-center font-bold mb-3">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">
                  Redeem Rewards
                </h4>
                <p className="text-sm text-gray-600">
                  Once you have 400+ points from subscribed referrals, redeem
                  them for cash! Each 100 points = $5.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral History */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Referral History
          </h3>

          {referrals.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Users size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-800 font-medium">
                You haven't referred anyone yet
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Share your code to start earning rewards!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Plan</th>
                    <th className="px-6 py-3">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {referrals.map((referral) => (
                    <tr key={referral.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-[#FF6B81] text-white rounded-full flex items-center justify-center mr-3">
                            {referral.email.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">
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

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            referral.verified
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {getStatusText(referral)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isPlanPaid(referral)
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {isPlanPaid(referral)
                            ? "Subscribed"
                            : "Free"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-col">
                          {referral.verified && <span>+50 (signup)</span>}
                          {isPlanPaid(referral) && (
                            <span className="text-green-600">
                              +100 (subscription)
                            </span>
                          )}
                          {!referral.verified && !isPlanPaid(referral) && (
                            <span className="text-gray-500">0</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Transaction History
          </h3>

          {transactions.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Gift size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-800 font-medium">No transactions yet</p>
              <p className="text-gray-500 text-sm mt-1">
                Refer friends to earn points!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-800">
                          {transaction.description}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div
                          className={
                            transaction.amount > 0
                              ? "text-green-600 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {transaction.amount} points
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Reward Tiers
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Gift size={24} className="text-[#FF6B81] mr-2" />
                <h4 className="font-semibold text-gray-800">Friend Signs Up</h4>
              </div>
              <div className="text-xl font-bold text-gray-800 mb-1">
                50 points
              </div>
              <p className="text-sm text-gray-500">Sign-up bonus!</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Crown size={24} className="text-amber-500 mr-2" />
                <h4 className="font-semibold text-gray-800">
                  Friend Subscribes
                </h4>
              </div>
              <div className="text-xl font-bold text-gray-800 mb-1">
                100 points
              </div>
              <p className="text-sm text-gray-500">Subscription bonus!</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Trophy size={24} className="text-purple-500 mr-2" />
                <h4 className="font-semibold text-gray-800">Super Referrer</h4>
              </div>
              <div className="text-xl font-bold text-gray-800 mb-1">
                5+ successful referrals
              </div>
              <p className="text-sm text-gray-500">VIP status!</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <h4 className="font-medium text-gray-800 mb-2">
                How do I know if my referral was successful?
              </h4>
              <p className="text-sm text-gray-600">
                You'll receive points when your friend joins using your code.
                You can track all your referrals in the history section above.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h4 className="font-medium text-gray-800 mb-2">
                When do I receive my points?
              </h4>
              <p className="text-sm text-gray-600">
                Points are added to your account immediately when your friend
                successfully signs up using your referral code.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h4 className="font-medium text-gray-800 mb-2">
                How can I redeem my points for cash?
              </h4>
              <p className="text-sm text-gray-600">
                You can redeem points earned from subscribed referrals when you
                have at least 400 points. Each 100 points equals $5, and you'll
                need to provide your payment details for the payout.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h4 className="font-medium text-gray-800 mb-2">
                Is there a limit to how many people I can refer?
              </h4>
              <p className="text-sm text-gray-600">
                No limit! Refer as many friends as you'd like. The more people
                you refer, the more points you'll earn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Redeem Points Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  Redeem Points
                </h2>
                <button
                  onClick={() => setShowRedeemModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleRedeemPoints} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Points
                </label>
                <div className="text-2xl font-bold text-gray-800">
                  {referralInfo?.redeemablePoints || 0}{" "}
                  <span className="text-sm text-gray-500 font-normal">
                    points
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  These are points from subscribed referrals only
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points to Redeem
                </label>
                <input
                  type="number"
                  min="400"
                  max={referralInfo?.redeemablePoints || 400}
                  step="100"
                  value={pointsToRedeem}
                  onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B81] focus:border-[#FF6B81]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Value: ${getDollarValue(pointsToRedeem)} USD (Minimum: 400
                  points)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    className={`border rounded-lg p-3 flex flex-col items-center ${
                      paymentMethod === "paypal"
                        ? "border-[#FF6B81] bg-[#FF6B81]/5"
                        : "border-gray-200"
                    }`}
                    onClick={() => setPaymentMethod("paypal")}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#0070BA] flex items-center justify-center text-white text-xs font-bold mb-1">
                      PP
                    </div>
                    <span className="text-xs font-medium">PayPal</span>
                  </button>

                  <button
                    type="button"
                    className={`border rounded-lg p-3 flex flex-col items-center ${
                      paymentMethod === "bank"
                        ? "border-[#FF6B81] bg-[#FF6B81]/5"
                        : "border-gray-200"
                    }`}
                    onClick={() => setPaymentMethod("bank")}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white mb-1">
                      <CreditCard size={16} />
                    </div>
                    <span className="text-xs font-medium">Bank</span>
                  </button>

                  <button
                    type="button"
                    className={`border rounded-lg p-3 flex flex-col items-center ${
                      paymentMethod === "crypto"
                        ? "border-[#FF6B81] bg-[#FF6B81]/5"
                        : "border-gray-200"
                    }`}
                    onClick={() => setPaymentMethod("crypto")}
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white mb-1">
                      ₿
                    </div>
                    <span className="text-xs font-medium">Crypto</span>
                  </button>
                </div>
              </div>

              {/* PayPal Details */}
              {paymentMethod === "paypal" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B81] focus:border-[#FF6B81]"
                    placeholder="your-email@example.com"
                    required
                  />
                </div>
              )}

              {/* Bank Transfer Details */}
              {paymentMethod === "bank" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B81] focus:border-[#FF6B81]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B81] focus:border-[#FF6B81]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B81] focus:border-[#FF6B81]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B81] focus:border-[#FF6B81]"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Crypto Details */}
              {paymentMethod === "crypto" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B81] focus:border-[#FF6B81]"
                      required
                    >
                      <option value="btc">Bitcoin (BTC)</option>
                      <option value="eth">Ethereum (ETH)</option>
                      <option value="usdt">Tether (USDT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B81] focus:border-[#FF6B81]"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#FF6B81] hover:bg-[#D86D72] py-4 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B81] disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={
                    pointsToRedeem < 400 ||
                    pointsToRedeem > (referralInfo?.redeemablePoints || 0) ||
                    pointsToRedeem % 100 !== 0 ||
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
                    "Submit Redemption Request"
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