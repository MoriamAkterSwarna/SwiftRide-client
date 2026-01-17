

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import Logo from "@/assets/icons/Logo"
import { zodResolver } from "@hookform/resolvers/zod"
import  z from "zod"

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});



export function OTPForm({ className, ...props }: React.ComponentProps<"div">) {

    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        pin: "",
      },
    });

     const onSubmit = async (data: z.infer<typeof FormSchema>) => {
       console.log("OTP submitted:", data);
      }

  return (
    <Form {...form}>
      <div className={cn("flex flex-col gap-6 max-w-96", className)} {...props}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <a
                href="#"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="flex size-8 items-center justify-center rounded-md">
                 
                  <Logo />
                </div>
                <span className="sr-only">SwiftRide</span>
              </a>
              <h1 className="text-xl font-bold">Enter verification code</h1>
              <FieldDescription>
                We sent a 6-digit code to your email address
              </FieldDescription>
            </div>
            <FieldGroup>
              
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FieldLabel htmlFor="otp" className="sr-only">
                      Verification code
                    </FieldLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        id="otp"
                        required
                        containerClassName="gap-4"
                        {...field}
                      >
                        <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FieldDescription className="text-center">
                      Didn&apos;t receive the code? <a href="#">Resend</a>
                    </FieldDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FieldGroup>
            <Field>
              <Button type="submit">Verify</Button>
            </Field>
          </FieldGroup>
        </form>
        <FieldDescription className="px-6 text-center">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </FieldDescription>
      </div>
    </Form>
  );
}
