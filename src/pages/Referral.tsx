import React, { useState } from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ReferralStats {
  totalReferred: number;
  successfulMatches: number;
  pendingReferrals: number;
  rewardsEarned: number;
}

interface ReferralHistory {
  id: string;
  name: string;
  status: "pending" | "joined" | "matched";
  dateReferred: string;
  reward?: number;
}

const Referrals: React.FC = () => {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const userReferralCode = "LOVE2024SARAH";
  const referralLink = `https://yourapp.com/join?ref=${userReferralCode}`;

  const stats: ReferralStats = {
    totalReferred: 12,
    successfulMatches: 4,
    pendingReferrals: 3,
    rewardsEarned: 45,
  };

  const referralHistory: ReferralHistory[] = [
    {
      id: "1",
      name: "Emma Wilson",
      status: "matched",
      dateReferred: "2024-01-15",
      reward: 15,
    },
    {
      id: "2",
      name: "Mike Johnson",
      status: "joined",
      dateReferred: "2024-01-20",
      reward: 10,
    },
    {
      id: "3",
      name: "Lisa Chen",
      status: "pending",
      dateReferred: "2024-01-25",
    },
    {
      id: "4",
      name: "David Brown",
      status: "matched",
      dateReferred: "2024-02-01",
      reward: 15,
    },
  ];

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
    const message = `Join me on this amazing dating app! Use my referral code ${userReferralCode} or this link: ${referralLink}`;

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

  const getStatusText = (status: string) => {
    switch (status) {
      case "matched":
        return "Found Love";
      case "joined":
        return "Active";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

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
              {stats.totalReferred}
            </div>
            <div className="text-sm text-gray-600">Friends Referred</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
              <Heart size={20} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {stats.successfulMatches}
            </div>
            <div className="text-sm text-gray-600">Found Love</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-2">
              <Calendar size={20} className="text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {stats.pendingReferrals}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
              <Crown size={20} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              ${stats.rewardsEarned}
            </div>
            <div className="text-sm text-gray-600">Rewards Earned</div>
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
                  {userReferralCode}
                </div>
                <button
                  onClick={() => copyToClipboard(userReferralCode, "code")}
                  className="px-4 py-3 bg-[#FF6B81] text-white rounded-lg hover:bg-[#D86D72] transition-colors flex items-center gap-2"
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
                  {referralLink}
                </div>
                <button
                  onClick={() => copyToClipboard(referralLink, "link")}
                  className="px-4 py-3 bg-[#FF6B81] text-white rounded-lg hover:bg-[#D86D72] transition-colors flex items-center gap-2"
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
            >
              <MessageCircle size={24} className="text-green-600" />
              <span className="text-sm font-medium">WhatsApp</span>
            </button>

            <button
              onClick={() => shareViaApp("email")}
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Mail size={24} className="text-gray-600" />
              <span className="text-sm font-medium">Email</span>
            </button>

            <button
              onClick={() => shareViaApp("twitter")}
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Twitter size={24} className="text-blue-400" />
              <span className="text-sm font-medium">Twitter</span>
            </button>

            <button
              onClick={() => shareViaApp("facebook")}
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Facebook size={24} className="text-blue-600" />
              <span className="text-sm font-medium">Facebook</span>
            </button>
          </div>

          <button
            onClick={() => shareViaApp("share")}
            className="w-full mt-4 py-3 bg-[#FF6B81] text-white rounded-lg hover:bg-[#D86D72] transition-colors flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            Share Link
          </button>
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
                  Your friend signs up using your code and you both get 1 week
                  of premium features free!
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
                  When your friend finds their first match, you both earn $15 in
                  app credits!
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

          <div className="space-y-3">
            {referralHistory.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B81] to-[#D86D72] flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {referral.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {referral.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(referral.dateReferred).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {referral.reward && (
                    <div className="text-[#FF6B81] font-medium text-sm">
                      +${referral.reward}
                    </div>
                  )}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      referral.status
                    )}`}
                  >
                    {getStatusText(referral.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
                  1 week premium free
                </div>
                <div className="text-[#FF6B81] font-medium">
                  For both of you!
                </div>
              </div>
            </div>

            <div className="bg-white/80 rounded-lg p-4">
              <div className="text-center">
                <Heart size={20} className="text-green-600 mx-auto mb-2" />
                <div className="font-bold text-gray-800">First Match</div>
                <div className="text-sm text-gray-600 mb-2">
                  $15 app credits
                </div>
                <div className="text-green-600 font-medium">Each of you!</div>
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
                You'll receive a notification when your friend joins using your
                code, and another when they find their first match. You can also
                track all your referrals in the history section above.
              </p>
            </div>

            <div>
              <div className="font-medium text-gray-700 mb-1">
                When do I receive my rewards?
              </div>
              <p className="text-sm text-gray-600">
                Premium features are activated immediately when your friend
                joins. App credits are added to your account within 24 hours of
                your friend's first successful match.
              </p>
            </div>

            <div>
              <div className="font-medium text-gray-700 mb-1">
                Is there a limit to how many people I can refer?
              </div>
              <p className="text-sm text-gray-600">
                No limit! Refer as many friends as you'd like. The more people
                you help find love, the more rewards you'll earn.
              </p>
            </div>

            <div>
              <div className="font-medium text-gray-700 mb-1">
                Can I refer someone who already has an account?
              </div>
              <p className="text-sm text-gray-600">
                No, referral rewards only apply to new users who sign up using
                your referral code or link.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referrals;
