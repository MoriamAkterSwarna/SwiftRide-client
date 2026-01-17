import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OTPForm } from "@/components/modules/authentication/OTPForm";

import { useSendOtpMutation } from "@/redux/features/auth/auth.api";
import { toast } from "sonner";

const Verify = () => {
  const location = useLocation();
  console.log(location.state);
  const navigate = useNavigate();

  const [sendOtp] = useSendOtpMutation();

  const [confirmed, setConfirmed] = useState(false);

  const [email] = useState(location.state);
  // useEffect(() => {
  //     if(!email){
  //         navigate("/")
  //     }
  // }, [email]);

  const handleSendOtp = async() => {
    const toastId = toast.loading("Sending OTP...");

    try {


       const res = await sendOtp({email: email}).unwrap();
        setConfirmed(true);

        if(res.success){
           toast.success(res.message, {id: toastId});
        }
    } catch (error) {
        console.log(error);
    }
  };
  return confirmed ? (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-center">Verify Your Email Address</CardTitle>
        <CardDescription className="text-center">
          Verify your email address to complete your registration.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OTPForm />
      </CardContent>
    </Card>
  ) : (
    <Card className="w-full max-w-md mx-auto mt-10 text-center">
      <CardHeader>
        <CardTitle className="text-xl">Verify your email address</CardTitle>
        <CardDescription>
          We will send you an OTP at <br /> {email}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSendOtp} className="w-full">
          Confirm
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Verify;
