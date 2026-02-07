import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { setSession } from "@/redux/features/auth/authSessionSlice";
import { useAppDispatch } from "@/redux/hook";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleCallback = () => {
      try {
        const userParam = searchParams.get("user");
        const error = searchParams.get("error");

        if (error) {
          toast.error(error);
          navigate("/login");
          return;
        }

        if (!userParam) {
          toast.error("Authentication failed. Please try again.");
          navigate("/login");
          return;
        }

        const user = JSON.parse(decodeURIComponent(userParam));

        if (!user.isVerified) {
          toast.error("Your account is not verified. Please verify your account.");
          navigate("/verify", { state: { email: user.email } });
          return;
        }

        toast.success("Login successful!");
        localStorage.setItem("sr_has_session", "1");
        dispatch(setSession());
        const role = user.role?.toLowerCase();

        if (role === "admin" || role === "super_admin") {
          navigate("/admin");
        } else if (role === "driver" || role === "rider") {
          navigate("/driver");
        } else {
          navigate("/user");
        }
      } catch (error) {
        console.error("Google callback error:", error);
        toast.error("Authentication failed. Please try again.");
        navigate("/login");
      }
    };

    handleCallback();
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
