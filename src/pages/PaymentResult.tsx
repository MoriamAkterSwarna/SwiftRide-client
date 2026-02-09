import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentResult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const paymentInfo = useMemo(() => {
    const status = searchParams.get("status") || "unknown";
    const transactionId = searchParams.get("transactionId") || "";
    const amount = searchParams.get("amount") || "";
    const message = searchParams.get("message") || "";

    return { status, transactionId, amount, message };
  }, [searchParams]);

  const isSuccess = paymentInfo.status.toLowerCase() === "success";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm text-center">
        <div className="flex justify-center mb-4">
          {isSuccess ? (
            <CheckCircle className="h-14 w-14 text-green-600" />
          ) : (
            <XCircle className="h-14 w-14 text-red-600" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {isSuccess ? "Payment Successful" : "Payment Not Completed"}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {paymentInfo.message ||
            (isSuccess
              ? "Your payment was completed successfully."
              : "Your payment could not be completed. Please try again.")}
        </p>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-6">
          {paymentInfo.transactionId ? (
            <p>Transaction ID: {paymentInfo.transactionId}</p>
          ) : null}
          {paymentInfo.amount ? <p>Amount: {paymentInfo.amount}</p> : null}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button
            onClick={() => navigate("/user/my-rides")}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Back to My Rides
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
