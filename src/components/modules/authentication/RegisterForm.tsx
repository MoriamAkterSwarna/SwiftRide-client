/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Password from "@/components/ui/Password";
import { useRegisterMutation } from "@/redux/features/auth/auth.api";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";
import config from "@/config";
import { User, Car, Shield, CheckCircle } from "lucide-react";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" })
      .max(50),
    email: z.email({ message: "Please enter a valid email" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)"
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm Password must be at least 8 characters" }),
    role: z.enum(["USER", "DRIVER"], { message: "Please select a role" }),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [register] = useRegisterMutation();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "USER",
      agreeToTerms: false,
    },
  });

  const navigate = useNavigate();
  const selectedRole = form.watch("role");

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    console.log(data, "inside register form")
    const userInfo = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      agreeToTerms: data.agreeToTerms,
    };
    try {
      const result = await register(userInfo).unwrap();
      console.log("Registration successful:", result);
      toast.success("Registration successful! Please verify your email.");
      navigate("/verify", { state: data.email });
    } catch (error: any) {
      console.error("Registration failed:", error);
      const errorMessage =
        error?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  const roleDescriptions = {
    USER: {
      title: "Rider",
      description: "Book rides and travel comfortably",
      icon: User,
      features: ["Easy booking", "Live tracking", "Multiple payment options", "24/7 support"]
    },
    DRIVER: {
      title: "Driver",
      description: "Earn money by driving with SwiftRide",
      icon: Car,
      features: ["Flexible hours", "Competitive earnings", "Weekly payments", "Driver support"]
    }
  };

  return (
    <Card {...props} className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Join SwiftRide</CardTitle>
        <CardDescription>
          Create your account and start your journey with us
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>I want to:</FormLabel>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {Object.entries(roleDescriptions).map(([role, info]) => (
                      <div
                        key={role}
                        className={`relative cursor-pointer rounded-lg border p-4 transition-all ${field.value === role
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                          }`}
                        onClick={() => field.onChange(role)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <info.icon className="h-5 w-5 text-primary" />
                          <span className="font-medium">{info.title}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{info.description}</p>
                        <ul className="space-y-1">
                          {info.features.slice(0, 2).map((feature, index) => (
                            <li key={index} className="flex items-center gap-1 text-xs text-gray-500">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        {field.value === role && (
                          <div className="absolute top-2 right-2">
                            <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                              <CheckCircle className="h-3 w-3 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Basic Information */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john.doe@example.com"
                        {...field}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Password Fields */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Password {...field} placeholder="Create a strong password" />
                    </FormControl>
                    <FormDescription>
                      Must be at least 8 characters with uppercase, lowercase, and numbers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Password {...field} placeholder="Confirm your password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Terms and Conditions */}
            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal">
                      I agree to the{" "}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Driver-specific notice */}
            {selectedRole === "DRIVER" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Driver Requirements</h4>
                    <p className="text-sm text-blue-700">
                      You'll need to complete additional verification including background check,
                      vehicle inspection, and document upload after registration.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button className="w-full" type="submit" size="lg">
              Create Account
            </Button>
          </form>

          {/* Social Login */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => window.open(`${config.baseUrl}/auth/google`)}
              type="button"
              variant="outline"
              className="w-full cursor-pointer"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
