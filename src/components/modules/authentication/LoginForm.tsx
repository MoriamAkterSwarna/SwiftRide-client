/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import { setSession } from "@/redux/features/auth/authSessionSlice";
import { useAppDispatch } from "@/redux/hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Password from "@/components/ui/Password";
import config from "@/config";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData: z.infer<typeof loginSchema>) => {
    try {
      const result = await login(formData).unwrap();
      console.log("Login response:", result);

      if (!result?.data?.user) {
        throw new Error("Invalid response structure - missing user data");
      }

      if (result.data.user?.isVerified) {
        toast.success("Login successful!");
        localStorage.setItem("sr_has_session", "1");
        dispatch(setSession());
        
        // Redirect based on user role
        const userRole = result.data.user?.role?.toUpperCase();
        if (userRole === "SUPER_ADMIN" || userRole === "ADMIN") {
          navigate("/admin/analytics");
        } else if (userRole === "USER") {
          navigate("/");
        } else if (userRole === "DRIVER" || userRole === "RIDER") {
          navigate("/driver/manage-rides");
        } else {
          navigate("/");
        }
      } else {
        toast.error(
          "Your account is not verified. Please verify your account.",
        );
        navigate("/verify", { state: { email: formData.email } });
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      const errorMessage =
        error?.data?.message || error?.message || "Login failed. Please try again.";

      if (
        errorMessage ===
        "Your account is not verified. Please verify your account."
      ) {
        toast.error(errorMessage);
        navigate("/verify", { state: { email: formData.email } });
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleGoogleLogin = () => {
    // Backend will set HTTP-only cookies and redirect
    window.location.href = `${config.baseUrl}/auth/google`;
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john.doe@example.com"
                        {...field}
                        type="email"
                      />
                    </FormControl>
                    <FormDescription className="sr-only">
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Password {...field} />
                    </FormControl>
                    <FormDescription className="sr-only">
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>
          <div className="relative my-4 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>

          <Button
            onClick={handleGoogleLogin}
            type="button"
            variant="outline"
            className="w-full cursor-pointer"
            disabled={isLoading}
          >
            Login with Google
          </Button>

          <button className="w-full text-left">
            Don't have an account?
            <Link
              className="ml-2 inline-block text-sm text-primary hover:underline"
              to="/register"
            >
              {" "}
              Sign Up
            </Link>
          </button>
        </CardContent>
      </Card>
    </div>
  );
}