import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OTPForm } from "@/components/modules/authentication/OTPForm";
const Verify = () => {
    const location = useLocation();
    console.log(location.state)
    const navigate= useNavigate()

    const [email] = useState(location.state)
    // useEffect(() => {
    //     if(!email){
    //         navigate("/")
    //     }
    // }, [email]);
 return (
   <Card className="w-full max-w-md mx-auto mt-10">
     <CardHeader>
       <CardTitle className="text-center">Verify Your Email Address</CardTitle>
       
       
     </CardHeader>
        <CardContent>
         <OTPForm />
     </CardContent>
     
   </Card>
 );
};

export default Verify;