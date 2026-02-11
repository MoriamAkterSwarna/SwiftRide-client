/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Card,

} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRegisterMutation } from "@/redux/features/auth/auth.api";
import { useNavigate, Link } from "react-router";
import {  useState } from "react";
import Password from "@/components/ui/Password";
import { CheckCircle, Shield, Car, User } from "lucide-react";
import { motion } from "motion/react";

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
        message: "Password must contain uppercase, lowercase, number, and special character (!@#$%^&*)"
      }),
    confirmPassword: z.string().min(8),
    role: z.enum(["USER", "DRIVER"], { message: "Please select a role" }),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const roleOptions = {
  USER: {
    title: "Ride as Passenger",
    description: "Book rides easily",
    icon: User,
    features: ["Real-time tracking", "Safe rides", "Multiple payment options"],
  },
  DRIVER: {
    title: "Drive & Earn",
    description: "Earn on your schedule",
    icon: Car,
    features: ["Flexible hours", "Best rates", "24/7 support"],
  },
};

export function RegisterForm({ className }: React.ComponentProps<typeof Card>) {
  const [register] = useRegisterMutation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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

  const selectedRole = form.watch("role");

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    try {
      const response = await register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      }).unwrap();

      if (response?.success) {
        navigate("/login", { state: { email: values.email } });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      form.setError("email", {
        type: "manual",
        message: error?.data?.message || "Registration failed",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign up</h1>
          <p className="text-gray-600 text-sm">
            Create your account to get started with SwiftRide
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-900 mb-3 block">
                    I want to:
                  </FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(roleOptions).map(([roleKey, roleInfo]) => {
                      const IconComponent = roleInfo.icon;
                      return (
                        <motion.div
                          key={roleKey}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="relative cursor-pointer"
                          onClick={() => field.onChange(roleKey)}
                        >
                          <div
                            className={`relative rounded-xl border-2 p-4 transition-all duration-200 ${
                              field.value === roleKey
                                ? "border-emerald-500 bg-emerald-50/50"
                                : "border-gray-200 bg-white hover:border-emerald-300"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                field.value === roleKey
                                  ? "bg-emerald-500 text-white"
                                  : "bg-gray-100 text-gray-600"
                              }`}>
                                <IconComponent className="h-4 w-4" />
                              </div>
                              <span className="font-semibold text-sm text-gray-900">
                                {roleInfo.title}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">
                              {roleInfo.description}
                            </p>
                            {field.value === roleKey && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle className="h-5 w-5 text-emerald-500" />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name & Email */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
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
                    <FormLabel className="text-sm font-medium text-gray-900">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        {...field}
                        type="email"
                        className="rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Passwords */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">
                      Set password
                    </FormLabel>
                    <FormControl>
                      <Password
                        {...field}
                        placeholder="Enter password"
                        className="rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </FormControl>
                    <div className="text-xs text-gray-500 mt-1">
                      Must include: uppercase, lowercase, number & special character
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">
                      Confirm password
                    </FormLabel>
                    <FormControl>
                      <Password
                        {...field}
                        placeholder="Confirm password"
                        className="rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Driver Notice */}
            {selectedRole === "DRIVER" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3"
              >
                <Shield className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 text-sm mb-1">
                    Driver Verification Required
                  </h4>
                  <p className="text-xs text-blue-700">
                    You'll need background check, vehicle inspection, and document verification.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Terms */}
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
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 cursor-pointer"
                    />
                  </FormControl>
                  <div className="text-xs text-gray-600 leading-relaxed">
                    I agree to the{" "}
                    <Link to="/terms" className="text-emerald-600 font-medium hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-emerald-600 font-medium hover:underline">
                      Privacy Policy
                    </Link>
                  </div>
                </FormItem>
              )}
            />
            <FormMessage />

            {/* Submit Button */}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 h-12 text-white font-semibold rounded-lg transition-all"
              >
                {isLoading ? "Creating account..." : "Sign up →"}
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-500">
              <span className="px-2 bg-white">or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <Button
            type="button"
            variant="outline"
            className="w-full border-2 border-emerald-200 hover:bg-emerald-50/50 h-11 rounded-lg font-medium text-gray-700"
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

          {/* Sign In Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Sign in
            </Link>
          </div>
        </Form>
      </motion.div>
    </div>
  );
}