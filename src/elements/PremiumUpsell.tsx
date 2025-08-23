import { Shield, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface PremiumUpsellProps {
  message?: string;
}

const PremiumUpsell: React.FC<PremiumUpsellProps> = ({
  message = "Unlock this feature with Premium",
}) => {
    const navigate = useNavigate();

  return (
    <motion.div
      className="text-center py-12 px-6 bg-gradient-to-br from-pink-50 to-white rounded-2xl shadow-sm border border-pink-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-[#FF6B81]/10 flex items-center justify-center">
          <Shield className="text-[#FF6B81]" size={36} />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-center gap-2">
        <Crown className="text-yellow-500" size={20} />
        Premium Required
      </h3>

      <p className="text-gray-600 mt-2">{message}</p>

      <button
        onClick={() => navigate("/subscription")}
        className="mt-5 px-6 py-2.5 bg-[#FF6B81] text-white font-medium rounded-xl shadow hover:bg-[#ff566f] transition-all"
      >
        Upgrade to Premium
      </button>
    </motion.div>
  );
};

export default PremiumUpsell;
