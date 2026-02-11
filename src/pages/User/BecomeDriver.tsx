/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router";
import { useAppSelector } from "@/redux/hook";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useApplyAsDriverMutation } from "@/redux/features/user/user.api";
import { useGetUserProfileQuery } from "@/redux/features/user/user.api";
import { Car, FileText, AlertCircle, Loader2, CheckCircle, Shield, Star, User, Clock } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const driverApplicationSchema = z.object({
  vehicleType: z.enum(["Car", "Bike"]),
  vehicleModel: z
    .string()
    .min(1, "Vehicle model is required")
    .min(3, "Vehicle model must be at least 3 characters"),
  vehiclePlateNumber: z
    .string()
    .min(1, "Vehicle plate number is required")
    .regex(/^[A-Z]{2}-\d{2}-\d{4}$/, "Plate number format should be like DH-01-1234"),
  drivingLicense: z
    .string()
    .min(1, "Driving license is required")
    .min(5, "Driving license must be valid"),
});

type DriverApplicationFormValues = z.infer<typeof driverApplicationSchema>;

const BecomeDriver = () => {
  const navigate = useNavigate();
  const hasSessionHint = useAppSelector((state: any) => state.authSession.hasSession);

  // Query user profile - cookies will be sent automatically
  const { data: profileResponse, isLoading: isLoadingProfile, error: profileError } =
    useGetUserProfileQuery(undefined, { skip: !hasSessionHint });

  // Extract user data
  const userProfile = profileResponse?.data || profileResponse;

  console.log("BecomeDriver Debug:", {
    profileResponse,
    profileError,
    userProfile,
  });

  const [applyAsDriver, { isLoading }] = useApplyAsDriverMutation();

  const form = useForm<DriverApplicationFormValues>({
    resolver: zodResolver(driverApplicationSchema),
    defaultValues: {
      vehicleType: "Car",
      vehicleModel: "",
      vehiclePlateNumber: "",
      drivingLicense: "",
    },
  });

  const onSubmit = async (data: DriverApplicationFormValues) => {

    const userId = userProfile?.data?._id;
    console.log("Submitting driver application with data:", {
      userId,
      ...data,
    });

    if (!userId) {
      toast.error("Unable to determine user ID. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      const result = await applyAsDriver({
        user: userId,
        vehicleType: data.vehicleType,
        vehicleModel: data.vehicleModel,
        vehiclePlateNumber: data.vehiclePlateNumber,
        drivingLicense: data.drivingLicense,
      }).unwrap();

      if (result?.data || result?.success) {
        toast.success(
          "Application submitted successfully! Awaiting admin approval."
        );
        form.reset();
        setTimeout(() => navigate("/user/profile"), 2000);
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to submit driver application";
      toast.error(errorMessage);
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 rounded-3xl p-8 md:p-12 mb-12 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="shrink-0">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <Car size={48} className="text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-white to-blue-100">
                  Become a Driver
                </h1>
                <p className="text-xl text-blue-100 mb-6 max-w-2xl">
                  Join our community of drivers and start earning on your own schedule.
                  Provide safe rides and make a difference in your community.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                    <span className="text-sm font-medium">Earn Competitive Rates</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Flexible Hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get started on your journey to becoming a driver in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative group">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-4 w-fit mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Submit Application
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Fill out the application form with your vehicle details and driving license information
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-4 w-fit mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Verification Process
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Our admin team will review your documents and verify your driving credentials
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600">
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-xl p-4 w-fit mb-6 group-hover:scale-110 transition-transform">
                  <Car className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Start Earning
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Once approved, you can start accepting ride requests and earning money
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 md:p-12 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Driver Application Form
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Complete the form below to start your driver application
            </p>
          </div>

          {isLoadingProfile ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">Loading your profile...</p>
            </div>
          ) : profileError ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0 mt-1" />
                <div>
                  <p className="text-red-800 dark:text-red-300 font-medium mb-2">
                    Error loading profile
                  </p>
                  <p className="text-red-700 dark:text-red-400 text-sm mb-4">
                    We couldn't load your profile information. Please log in again.
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            </div>
          ) : !userProfile?.data?._id ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0 mt-1" />
                <div>
                  <p className="text-red-800 dark:text-red-300 font-medium mb-2">
                    Profile Not Available
                  </p>
                  <p className="text-red-700 dark:text-red-400 text-sm mb-4">
                    Unable to load your profile. Please try again.
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-800 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3">
                      <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Personal Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={userProfile?.data?.name || "Not loaded"}
                          disabled
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-75 disabled:cursor-not-allowed shadow-sm"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={userProfile?.data?.email || "Not loaded"}
                          disabled
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-75 disabled:cursor-not-allowed shadow-sm"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-2xl border border-green-200 dark:border-green-800 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-3">
                      <Car className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Vehicle Information
                    </h3>
                  </div>
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="vehicleType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Vehicle Type <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select vehicle type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Car">Car</SelectItem>
                              <SelectItem value="Bike">Bike</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vehicleModel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Vehicle Model <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Toyota Corolla 2020"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vehiclePlateNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Vehicle Plate Number <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., DH-01-1234"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Documentation */}
                <div className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-2xl border border-purple-200 dark:border-purple-800 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded-xl p-3">
                      <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Documentation
                    </h3>
                  </div>
                  <FormField
                    control={form.control}
                    name="drivingLicense"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Driving License Number <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your driving license number"
                            {...field}
                          />
                        </FormControl>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-800 dark:text-blue-300">
                            <strong>Important:</strong> Make sure your driving license is valid, active, and not expired.
                            We will verify this information during the approval process.
                          </p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Terms & Conditions */}
                <div className="bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-8">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        By submitting this application, you confirm that all information provided is accurate and truthful.
                        You agree to our{" "}
                        <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                          Privacy Policy
                        </a>.
                        False information may result in immediate rejection and potential account suspension.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12 rounded-xl border-2 font-semibold"
                    onClick={() => navigate("/user/profile")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-12 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                        Submitting Application...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>

        {/* Requirements Section */}
        <div className="bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Driver Requirements
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              To ensure safety and quality, all drivers must meet the following requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-2 shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Valid Driving License
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Must have a current, valid driving license with no major violations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-2 shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Vehicle Registration
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Vehicle must be properly registered and insured
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-2 shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Clean Driving Record
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  No DUIs, reckless driving, or major traffic violations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-2 shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Age Requirement
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Must be at least 18 years old with valid identification
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl px-6 py-3">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-800 dark:text-blue-300 font-medium">
                All applications are subject to background checks
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeDriver;