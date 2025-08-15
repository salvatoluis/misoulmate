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
  Heart,
  Trophy,
  Calendar,
  Crown,
  Loader,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/services";

interface ReferralInfo {
  referralCode: string;
  referralsCount: number;
  verifiedReferralsCount: number;
  points: number;
}

interface ReferralUser {
  id: string;
  email: string;
  createdAt: string;
  verified: boolean;
  subscription: string;
}

interface PointTransaction {
  id: string;
  amount: number;
  transactionType: "referral" | "signup" | "conversion" | "other";
  description: string;
  createdAt: string;
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
  const [convertPoints, setConvertPoints] = useState<number>(0);
  const [converting, setConverting] = useState(false);
  const [conversionSuccess, setConversionSuccess] = useState<string | null>(
    null
  );

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "matched":
        return "text-green-600 bg-green-100";
      case "joined":
        return "text-blue-600 bg-blue-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusFromUser = (user: ReferralUser) => {
    return user.verified ? "joined" : "pending";
  };

  const getStatusText = (user: ReferralUser) => {
    if (!user.verified) return "Pending";
    return "Active";
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

      // Update referral info with new points balance
      setReferralInfo({
        ...referralInfo,
        points: response.data.points,
      });

      // Fetch updated transactions
      const transactionsResponse = await axiosInstance.get(
        "/referrals/points/transactions"
      );
      setTransactions(transactionsResponse.data);

      setConversionSuccess(`Successfully converted ${convertPoints} points!`);
      setConvertPoints(0);

      // Clear success message after 3 seconds
      setTimeout(() => setConversionSuccess(null), 3000);
    } catch (err: any) {
      console.error("Error converting points:", err);
      setError(err.response?.data?.message || "Failed to convert points");
    } finally {
      setConverting(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader
            size={40}
            className="animate-spin text-[#FF6B81] mx-auto mb-4"
          />
          <p className="text-gray-600">Loading referral data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !referralInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-sm">
          <div className="text-red-500 mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#FF6B81] text-white rounded-lg hover:bg-[#D86D72] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Refer Friends</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Error banner */}
        {error && (
          <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
            <div className="mr-2">⚠️</div>
            <div>{error}</div>
            <button className="ml-auto" onClick={() => setError(null)}>
              ×
            </button>
          </div>
        )}

        {/* Success message */}
        {conversionSuccess && (
          <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start">
            <div className="mr-2">✅</div>
            <div>{conversionSuccess}</div>
            <button
              className="ml-auto"
              onClick={() => setConversionSuccess(null)}
            >
              ×
            </button>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-[#FF6B81]/10 mb-4">
            <Users size={28} className="text-[#FF6B81]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Share the Love
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Help your friends find love and earn rewards! For every friend who
            joins and finds a match, you both win.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mx-auto mb-2">
              <Users size={20} className="text-[#FF6B81]" />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {referralInfo?.referralsCount || 0}
            </div>
            <div className="text-sm text-gray-600">Friends Referred</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
              <Heart size={20} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {referralInfo?.verifiedReferralsCount || 0}
            </div>
            <div className="text-sm text-gray-600">Verified Friends</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-2">
              <Calendar size={20} className="text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {(referralInfo?.referralsCount || 0) -
                (referralInfo?.verifiedReferralsCount || 0)}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
              <Crown size={20} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {referralInfo?.points || 0}
            </div>
            <div className="text-sm text-gray-600">Points Balance</div>
          </div>
        </div>

        {/* Referral Code & Link */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Your Referral Code
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Referral Code
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 p-3 bg-gray-50 rounded-lg border font-mono text-lg text-center">
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
              <label className="block text-sm text-gray-600 mb-2">
                Referral Link
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 p-3 bg-gray-50 rounded-lg border text-sm truncate">
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
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Share with Friends
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => shareViaApp("whatsapp")}
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={!referralInfo}
            >
              <MessageCircle size={24} className="text-green-600" />
              <span className="text-sm font-medium">WhatsApp</span>
            </button>

            <button
              onClick={() => shareViaApp("email")}
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={!referralInfo}
            >
              <Mail size={24} className="text-gray-600" />
              <span className="text-sm font-medium">Email</span>
            </button>

            <button
              onClick={() => shareViaApp("twitter")}
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={!referralInfo}
            >
              <Twitter size={24} className="text-blue-400" />
              <span className="text-sm font-medium">Twitter</span>
            </button>

            <button
              onClick={() => shareViaApp("facebook")}
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={!referralInfo}
            >
              <Facebook size={24} className="text-blue-600" />
              <span className="text-sm font-medium">Facebook</span>
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

        {/* Convert Points to Coins */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Convert Points to Coins
          </h3>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              You have{" "}
              <span className="font-medium">{referralInfo?.points || 0}</span>{" "}
              points available to convert.
            </p>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <input
              type="number"
              min="1"
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
                !referralInfo ||
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

          <p className="text-xs text-gray-500">
            Note: Points will be converted to coins at a 1:1 ratio. Conversions
            cannot be undone.
          </p>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            How It Works
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#FF6B81]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#FF6B81] font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">
                  Share Your Code
                </h4>
                <p className="text-sm text-gray-600">
                  Send your referral code or link to friends who are single and
                  ready to mingle.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#FF6B81]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#FF6B81] font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Friend Joins</h4>
                <p className="text-sm text-gray-600">
                  Your friend signs up using your code and you both get rewarded
                  with points!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#FF6B81]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#FF6B81] font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Earn Rewards</h4>
                <p className="text-sm text-gray-600">
                  Convert your points to coins and use them for premium
                  features!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral History */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Referral History
          </h3>

          {referrals.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Users size={36} className="mx-auto mb-2 text-gray-300" />
              <p>You haven't referred anyone yet</p>
              <p className="text-sm mt-1">
                Share your code to start earning rewards!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B81] to-[#D86D72] flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {referral.email.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {referral.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        getStatusFromUser(referral)
                      )}`}
                    >
                      {getStatusText(referral)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Transaction History
          </h3>

          {transactions.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Trophy size={36} className="mx-auto mb-2 text-gray-300" />
              <p>No transactions yet</p>
              <p className="text-sm mt-1">Refer friends to earn points!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-800">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </div>
                  </div>

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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rewards Section */}
        <div className="bg-gradient-to-r from-[#FF6B81]/10 to-[#D86D72]/10 rounded-xl p-6 mb-6 border border-[#FF6B81]/20">
          <div className="flex items-center gap-3 mb-4">
            <Trophy size={24} className="text-[#FF6B81]" />
            <h3 className="text-lg font-semibold text-gray-800">
              Reward Tiers
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/80 rounded-lg p-4">
              <div className="text-center">
                <Gift size={20} className="text-[#FF6B81] mx-auto mb-2" />
                <div className="font-bold text-gray-800">Friend Joins</div>
                <div className="text-sm text-gray-600 mb-2">
                  50 points for your friend
                </div>
                <div className="text-[#FF6B81] font-medium">Sign-up bonus!</div>
              </div>
            </div>

            <div className="bg-white/80 rounded-lg p-4">
              <div className="text-center">
                <Heart size={20} className="text-green-600 mx-auto mb-2" />
                <div className="font-bold text-gray-800">
                  Successful Referral
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  100 points for you
                </div>
                <div className="text-green-600 font-medium">
                  Referral bonus!
                </div>
              </div>
            </div>

            <div className="bg-white/80 rounded-lg p-4">
              <div className="text-center">
                <Crown size={20} className="text-blue-600 mx-auto mb-2" />
                <div className="font-bold text-gray-800">Super Referrer</div>
                <div className="text-sm text-gray-600 mb-2">
                  5+ successful referrals
                </div>
                <div className="text-blue-600 font-medium">VIP status!</div>
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
                How do I know if my referral was successful?
              </div>
              <p className="text-sm text-gray-600">
                You'll receive points when your friend joins using your code.
                You can track all your referrals in the history section above.
              </p>
            </div>

            <div>
              <div className="font-medium text-gray-700 mb-1">
                When do I receive my points?
              </div>
              <p className="text-sm text-gray-600">
                Points are added to your account immediately when your friend
                successfully signs up using your referral code.
              </p>
            </div>

            <div>
              <div className="font-medium text-gray-700 mb-1">
                Is there a limit to how many people I can refer?
              </div>
              <p className="text-sm text-gray-600">
                No limit! Refer as many friends as you'd like. The more people
                you refer, the more points you'll earn.
              </p>
            </div>

            <div>
              <div className="font-medium text-gray-700 mb-1">
                How do I convert my points to coins?
              </div>
              <p className="text-sm text-gray-600">
                Use the points conversion section above. Simply enter the number
                of points you want to convert and click the "Convert" button.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referrals;
