/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useApplyAsDriverMutation } from "@/redux/features/user/user.api";
import { useGetUserProfileQuery } from "@/redux/features/user/user.api";
import { Car, FileText, AlertCircle, Loader2 } from "lucide-react";
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
  
  // Query user profile - cookies will be sent automatically
  const { data: profileResponse, isLoading: isLoadingProfile, error: profileError } =
    useGetUserProfileQuery(undefined);

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
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-linear-to-r from-blue-600 to-blue-800 rounded-lg p-8 mb-8 text-white">
        <div className="flex items-center gap-4">
          <Car size={40} />
          <div>
            <h1 className="text-3xl font-bold">Become a Driver</h1>
            <p className="text-blue-100 mt-2">
              Join our community and start earning by providing rides
            </p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-blue-600 mb-4">
            <FileText size={32} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Submit Documents
          </h3>
          <p className="text-gray-600 text-sm">
            Provide your driving license and vehicle details
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-green-600 mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Admin Review</h3>
          <p className="text-gray-600 text-sm">
            Our admin team will verify your documents
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-purple-600 mb-4">
            <Car size={32} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Start Earning</h3>
          <p className="text-gray-600 text-sm">
            Once approved, you can start accepting ride requests
          </p>
        </div>
      </div>

      {/* Application Form */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Driver Application Form
        </h2>

        {isLoadingProfile ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin mr-2" />
            <p>Loading your profile...</p>
          </div>
        ) : profileError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">
              Error loading profile. Please log in again.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Go to Login
            </button>
          </div>
        ) : !userProfile?.data?._id ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">
              Unable to load your profile. Please try again.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information (Read-only) */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={userProfile?.data?.name || "Not loaded"}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-900 disabled:opacity-75"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userProfile?.data?.email || "Not loaded"}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-900 disabled:opacity-75"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Vehicle Information
                </h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="vehicleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
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
                        <FormLabel>
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
                        <FormLabel>
                          Vehicle Plate Number{" "}
                          <span className="text-red-500">*</span>
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
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Documentation
                </h3>
                <FormField
                  control={form.control}
                  name="drivingLicense"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Driving License Number{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your driving license number"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-sm text-gray-500 mt-2">
                        Make sure your driving license is valid and active
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Terms & Conditions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  By submitting this application, you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:underline font-medium">
                    Terms of Service
                  </a>{" "}
                  and confirm that all information provided is accurate and
                  truthful.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/user/profile")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Submitting...
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

      {/* Requirements */}
      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <h3 className="font-semibold text-gray-900 mb-4">Requirements</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-center gap-2">
            <span className="text-blue-600">✓</span>
            Valid driving license
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-600">✓</span>
            Vehicle registration documents
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-600">✓</span>
            Clean driving record
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-600">✓</span>
            18+ years old
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BecomeDriver;