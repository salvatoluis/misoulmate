import React, { useState, useEffect } from "react";
import {
  Check,
  Crown,
  ArrowLeft,
  Loader,
  AlertCircle,
  Home,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "@/services";

interface PaymentDetails {
  success: boolean;
  planType: string;
  amount: number;
  currency: string;
  status: string;
  paymentId?: string;
  expiresAt?: string;
  createdAt: string;
  message: string;
}

const PaymentSuccess: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const planId = searchParams.get("planId");
  const hasError = searchParams.get("error") === "true";
  
  const API_URL = "https://api.soulmatify.com/api/v1";

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!planId) {
        setError("No payment information found. Please try again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(`${API_URL}/plans/payment/${planId}`);
        
        if (response.data) {
          setPaymentDetails(response.data);
          
          if (hasError && response.data.success) {
          } else if (hasError || !response.data.success) {
            setError(response.data.message || "Payment processing failed.");
          }
        } else {
          setError("Could not retrieve payment information.");
        }
      } catch (err: any) {
        console.error("Error fetching payment details:", err);
        setError(
          err.response?.data?.message || 
          "Unable to retrieve payment information. Please contact support."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [planId, hasError]);

  const handleReturnToApp = () => {
    navigate("/subscription");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleRetryPayment = () => {
    navigate("/subscription");
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center">
            <button onClick={() => navigate(-1)} className="mr-4">
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              Processing Payment
            </h1>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-[#FF6B81]/10 mb-6">
              <Loader size={28} className="text-[#FF6B81] animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Loading Payment Details
            </h2>
            <p className="text-gray-600">
              Please wait while we retrieve your payment information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isSuccess = paymentDetails?.success && !error;

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">
            {isSuccess ? "Payment Successful" : "Payment Failed"}
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
          {isSuccess ? (
            <>
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-green-100 mb-6">
                <Check size={28} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                {paymentDetails?.message}
              </p>

              {paymentDetails && (
                <div className="bg-[#FF6B81]/5 border border-[#FF6B81]/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Crown size={20} className="text-[#FF6B81]" />
                    <span className="font-semibold text-gray-800">
                      {paymentDetails.planType} Plan Activated
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      Amount: {paymentDetails.currency} ${paymentDetails.amount}
                    </p>
                    {paymentDetails.expiresAt && (
                      <p>
                        Active until {new Date(paymentDetails.expiresAt).toLocaleDateString()}
                      </p>
                    )}
                    {paymentDetails.paymentId && (
                      <p className="text-xs text-gray-500 mt-2">
                        Payment ID: {paymentDetails.paymentId}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleReturnToApp}
                  className="w-full py-3 bg-[#FF6B81] hover:bg-[#D86D72] text-white font-medium rounded-xl transition-colors"
                >
                  View My Subscription
                </button>
                <button
                  onClick={handleGoHome}
                  className="w-full py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Home size={18} />
                  Return to Home
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Error State */}
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-red-100 mb-6">
                <AlertCircle size={28} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Payment Failed
              </h2>
              <p className="text-gray-600 mb-6">
                {error || paymentDetails?.message || "Something went wrong with your payment."}
              </p>

              {paymentDetails && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Plan:</strong> {paymentDetails.planType}</p>
                    <p><strong>Amount:</strong> {paymentDetails.currency} ${paymentDetails.amount}</p>
                    <p><strong>Status:</strong> {paymentDetails.status}</p>
                    {paymentDetails.paymentId && (
                      <p><strong>Payment ID:</strong> {paymentDetails.paymentId}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleRetryPayment}
                  className="w-full py-3 bg-[#FF6B81] hover:bg-[#D86D72] text-white font-medium rounded-xl transition-colors"
                >
                  Try Payment Again
                </button>
                <button
                  onClick={handleGoHome}
                  className="w-full py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Home size={18} />
                  Return to Home
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Need help? Contact our support team at{" "}
                  <a
                    href="mailto:support@soulmatify.com"
                    className="text-[#FF6B81] hover:underline"
                  >
                    support@soulmatify.com
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;