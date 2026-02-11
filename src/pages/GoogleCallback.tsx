/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router";
// import { toast } from "sonner";
// import { setSession } from "@/redux/features/auth/authSessionSlice";
// import { useAppDispatch } from "@/redux/hook";

// const GoogleCallback = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     const handleCallback = () => {
//       try {
//         const userParam = searchParams.get("user");
//         const error = searchParams.get("error");

//         if (error) {
//           toast.error(error);
//           navigate("/login");
//           return;
//         }

//         if (!userParam) {
//           toast.error("Authentication failed. Please try again.");
//           navigate("/login");
//           return;
//         }

//         const user = JSON.parse(decodeURIComponent(userParam));

//         if (!user.isVerified) {
//           toast.error("Your account is not verified. Please verify your account.");
//           navigate("/verify", { state: { email: user.email } });
//           return;
//         }

//         toast.success("Login successful!");
//         localStorage.setItem("sr_has_session", "1");
//         dispatch(setSession());
//         const role = user.role?.toLowerCase();

//         if (role === "admin" || role === "super_admin") {
//           navigate("/admin");
//         } else if (role === "driver" || role === "rider") {
//           navigate("/driver");
//         } else {
//           navigate("/user");
//         }
//       } catch (error) {
//         console.error("Google callback error:", error);
//         toast.error("Authentication failed. Please try again.");
//         navigate("/login");
//       }
//     };

//     handleCallback();
//   }, [searchParams, navigate, dispatch]);

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
//         <p className="mt-4 text-gray-600">Completing authentication...</p>
//       </div>
//     </div>
//   );
// };

// export default GoogleCallback;
// src/pages/GoogleCallback.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router";
// import { toast } from "sonner"; // Uncomment if you want toast notifications

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const userParam = params.get("user");

    if (!accessToken || !refreshToken || !userParam) {
      // toast?.error("Authentication failed. Please try again.");
      navigate("/login?error=Google login failed");
      return;
    }

    let user;
    try {
      user = JSON.parse(decodeURIComponent(userParam));
    } catch (e) {
      // toast?.error("Malformed user data. Please try again.");
      navigate("/login?error=Google login failed");
      return;
    }


    // Store tokens in cookies (expires in 7 days)
    document.cookie = `accessToken=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
    document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
 

    // Redirect based on user role
    const role = user.role?.toLowerCase();
    if (role === "admin" || role === "super_admin") {
      navigate("/admin");
    } else if (role === "driver" || role === "rider") {
      navigate("/driver");
    } else {
      navigate("/user");
    }
  }, [navigate]);

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