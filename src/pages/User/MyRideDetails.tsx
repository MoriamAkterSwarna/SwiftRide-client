/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import { useGetUserRideQuery, useDeleteRideMutation } from "@/redux/features/ride/ride.api";
import { useInitPaymentMutation } from "@/redux/features/payment/payment.api";
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Car,
  Calendar,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Package,
  Edit,
  Trash2,
  CreditCard,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EditRideModal from "./EditRideModal";

const statusConfig = {
  ACTIVE: {
    color: "bg-green-100 dark:bg-green-900/30",
    textColor: "text-green-800 dark:text-green-400",
    label: "Active",
    icon: <CheckCircle className="w-5 h-5" />,
    badgeColor: "bg-green-500",
  },
  PENDING: {
    color: "bg-yellow-100 dark:bg-yellow-900/30",
    textColor: "text-yellow-800 dark:text-yellow-400",
    label: "Pending",
    icon: <Clock className="w-5 h-5" />,
    badgeColor: "bg-yellow-500",
  },
  COMPLETED: {
    color: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-800 dark:text-blue-400",
    label: "Completed",
    icon: <CheckCircle className="w-5 h-5" />,
    badgeColor: "bg-blue-500",
  },
  CANCELLED: {
    color: "bg-red-100 dark:bg-red-900/30",
    textColor: "text-red-800 dark:text-red-400",
    label: "Cancelled",
    icon: <AlertCircle className="w-5 h-5" />,
    badgeColor: "bg-red-500",
  },
};

export default function MyRideDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useGetUserRideQuery({});
  const [deleteRide, { isLoading: isDeleting }] = useDeleteRideMutation();
  const [initPayment] = useInitPaymentMutation();

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const ride = useMemo(() => {
    if (!data) return null;

    let rideArray: any[] = [];
    if (Array.isArray(data)) {
      rideArray = data;
    } else if (data.data && Array.isArray(data.data)) {
      rideArray = data.data;
    }

    const foundRide = rideArray.find(
      (item: any) => item._id === id || item.id === id
    );

    if (!foundRide) return null;

    const vehicle = foundRide.rideVehicle || foundRide.vehicle;
    const rideType = foundRide?.rideType?.placeType

    return {
      _id: foundRide._id,
      id: foundRide.id,
      title: foundRide.title || "Untitled Ride",
      description: foundRide.description,
      pickUpLocation: foundRide.pickUpLocation,
      dropOffLocation: foundRide.dropOffLocation,
      pickUpTime: foundRide.pickUpTime,
      dropOffTime: foundRide.dropOffTime,
      cost: Number(foundRide.cost) || 0,
      availableSeats: Number(foundRide.availableSeats) || 0,
      maxGuests: foundRide.totalGuest || foundRide.maxGuests,
      status: foundRide.status || "PENDING",
      vehicle: typeof vehicle === 'object' && vehicle !== null ? (vehicle.name || vehicle.type || 'N/A') : (vehicle || 'N/A'),
      rideType: typeof rideType === 'object' && rideType !== null ? (rideType.name || rideType.type || 'N/A') : (rideType || 'N/A'),
      amenities: foundRide.amenities || [],
      images: foundRide.images || [],
      user: foundRide.user || foundRide.userId || "",
      createdAt: foundRide.createdAt,
      updatedAt: foundRide.updatedAt,
    };
  }, [data, id]);

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-8 min-h-screen bg-white dark:bg-gray-950">
        <Skeleton className="h-10 w-32 mb-6 bg-gray-200 dark:bg-gray-800" />
        <Skeleton className="h-64 w-full mb-6 bg-gray-200 dark:bg-gray-800" />
        <Skeleton className="h-40 w-full bg-gray-200 dark:bg-gray-800" />
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-8 min-h-screen bg-white dark:bg-gray-950">
        <button
          onClick={() => navigate("/user/my-rides")}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Rides
        </button>
        <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-600 dark:text-red-400" />
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
            Ride Not Found
          </h3>
          <p className="text-red-700 dark:text-red-300">
            The ride you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const status =
    statusConfig[ride.status as keyof typeof statusConfig] ||
    statusConfig.PENDING;
  const pickupDate = new Date(ride.pickUpTime);
  const dropoffDate = new Date(ride.dropOffTime);
  const createdDate = new Date(ride.createdAt);

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      await deleteRide(ride._id || ride.id || "").unwrap();
      setIsDeleteModalOpen(false);
      toast.success("Ride deleted successfully!");
      navigate("/user/my-rides");
    } catch (error: any) {
      console.error("Failed to delete ride:", error);
      const errorMessage = error?.data?.message || error?.message || "Failed to delete ride. Please try again.";
      toast.error(errorMessage);
    }
  };

  // Handle edit success
  const handleEditSuccess = () => {
    refetch(); // Refresh the ride data
  };

  // Handle payment
  const handlePayment = async () => {
    try {
      console.log("🚀 Starting payment process for ride:", ride);
      console.log("🔍 Full ride object:", JSON.stringify(ride, null, 2));

      // Extract ride ID - try multiple sources
      let rideId = ride._id || ride.id || id;
      
      // Convert to string if it's an object
      if (typeof rideId === 'object' && rideId !== null) {
        rideId = rideId.toString();
      }
      
      // Validate ride ID
      if (!rideId || rideId === 'undefined' || rideId === 'null') {
        console.error("❌ Invalid ride ID detected");
        toast.error("Invalid ride ID. Please go back and try again.");
        return;
      }

      // Validate MongoDB ObjectId format (24 hex characters)
      const objectIdPattern = /^[0-9a-fA-F]{24}$/;
      if (!objectIdPattern.test(rideId)) {
        console.error("❌ Ride ID is not a valid MongoDB ObjectId:", rideId);
        toast.error("Invalid ride ID format. Please refresh and try again.");
        return;
      }

      console.log("📍 Using ride ID:", rideId);
      console.log("📍 Ride ID type:", typeof rideId);
      console.log("📍 Ride ID length:", rideId.length);
      console.log("✅ Ride ID is valid MongoDB ObjectId");

      // Show loading toast
      const loadingToast = toast.loading("Initializing payment...");

      try {
        console.log("📤 Calling initPayment API with rideId:", rideId);
        const response = await initPayment(rideId).unwrap();
        toast.dismiss(loadingToast);

        console.log("📦 Payment response received:", response);
        console.log("📦 Response type:", typeof response);
        console.log("📦 Response keys:", Object.keys(response || {}));

        // Comprehensive URL extraction
        const possibleUrls = [
          response?.data?.paymentUrl,
          response?.paymentUrl,
          response?.data?.data?.paymentUrl,
          response?.data?.GatewayPageURL,
          response?.GatewayPageURL,
          response?.data?.url,
          response?.url,
          response?.data?.redirectUrl,
          response?.redirectUrl,
          response?.data?.payment_gateway_url,
          response?.payment_gateway_url,
        ];

        console.log("🔍 Checking possible URLs:", possibleUrls);

        const paymentUrl = possibleUrls.find(url => url && typeof url === 'string' && url.trim() !== '');

        if (paymentUrl) {
          console.log("✅ Payment URL found:", paymentUrl);

          // Validate and redirect
          if (paymentUrl.startsWith('http://') || paymentUrl.startsWith('https://')) {
            toast.success("Redirecting to payment gateway...");

            setTimeout(() => {
              try {
                window.location.href = paymentUrl;
              } catch (redirectError) {
                console.error("❌ Redirect failed, trying window.open:", redirectError);
                window.open(paymentUrl, '_blank');
              }
            }, 1000);
          } else {
            console.error("❌ Invalid URL format:", paymentUrl);
            toast.error("Invalid payment URL format");
          }
        } else {
          console.error("❌ No payment URL found in response");
          console.log("📄 Full response structure:", JSON.stringify(response, null, 2));

          // Try to extract any URL from response
          const responseStr = JSON.stringify(response);
          const urlMatch = responseStr.match(/https?:\/\/[^\s"']+/);

          if (urlMatch) {
            console.log("🔍 Found URL in response string:", urlMatch[0]);
            toast.success("Redirecting to payment gateway...");
            setTimeout(() => {
              window.location.href = urlMatch[0];
            }, 1000);
          } else {
            toast.error("Payment URL not found. Please try again or contact support.");
          }
        }
      } catch (apiError: any) {
        toast.dismiss(loadingToast);
        console.error("❌ API call failed:", apiError);
        console.error("❌ Full error object:", JSON.stringify(apiError, null, 2));
        console.error("❌ Error data:", apiError?.data);
        console.error("❌ Error response:", apiError?.response);

        // Extract all possible error messages
        const status = apiError?.status || apiError?.originalStatus || apiError?.response?.status;
        const errorData = apiError?.data || apiError?.response?.data || {};
        
        const errorMessage = 
          errorData?.message || 
          errorData?.error ||
          errorData?.errorSources?.[0]?.message ||
          apiError?.message ||
          apiError?.error;

        console.log("📊 Extracted error details:", { 
          status, 
          errorMessage, 
          errorData,
          allKeys: Object.keys(apiError || {})
        });

        // Show detailed error in console for debugging
        if (errorData?.errorSources && Array.isArray(errorData.errorSources)) {
          console.error("📋 Error sources:", errorData.errorSources);
        }

        // Handle specific status codes with better messages
        if (status === 400) {
          const detailedMessage = errorMessage || "Invalid request. Please check your ride details.";
          toast.error(detailedMessage);
          console.error("💡 Suggestion: Check if ride exists, has valid user, and all required fields are present");
        } else if (status === 401) {
          toast.error("Authentication required. Please login again.");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else if (status === 404) {
          toast.error(errorMessage || "Ride not found. Please go back and try again.");
        } else if (status === 406) {
          toast.error(errorMessage || "Payment request not acceptable. Please verify your ride information.");
        } else if (status === 500) {
          toast.error(errorMessage || "Server error. Please try again later.");
          console.error("💡 This is a backend error. Check server logs.");
        } else if (errorMessage) {
          toast.error(errorMessage);
        } else {
          toast.error("Payment initialization failed. Please check console for details.");
        }
      }
    } catch (error: any) {
      console.error("❌ Unexpected error:", error);
      console.error("❌ Error stack:", error?.stack);
      toast.error("An unexpected error occurred. Please check console and try again.");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 min-h-screen bg-white dark:bg-gray-950">
      {/* Back Button */}
      <button
        onClick={() => navigate("/user/my-rides")}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to My Rides
      </button>

      {/* Header Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {ride.title}
            </h1>
            {ride.description && (
              <p className="text-gray-600 dark:text-gray-400">
                {ride.description}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.color} whitespace-nowrap`}
            >
              {status.icon}
              <span className={`font-semibold ${status.textColor}`}>
                {status.label}
              </span>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditModalOpen(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button
                onClick={handlePayment}
                size="sm"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <CreditCard className="w-4 h-4" />
                Pay Now
              </Button>
              <Button
                onClick={() => setIsDeleteModalOpen(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
            <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase mb-1">
              Per Seat
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ৳{ride.cost}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase mb-1">
              Seats
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {ride.availableSeats}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
            <Car className="w-6 h-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase mb-1">
              Vehicle
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {ride.vehicle || "N/A"}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 text-center border border-green-200 dark:border-green-800">
            <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
            <p className="text-xs text-green-600 dark:text-green-400 uppercase mb-1">
              Total
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ৳{ride.cost * ride.availableSeats}
            </p>
          </div>
        </div>
      </div>

      {/* Route Details */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 mb-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Route Information
        </h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex flex-col items-center pt-1">
              <div className="w-4 h-4 rounded-full bg-green-500" />
              <div className="w-0.5 h-full min-h-15 bg-linear-to-b from-green-500 to-red-500" />
              <div className="w-4 h-4 rounded-full bg-red-500" />
            </div>
            <div className="flex-1 space-y-8">
              {/* Pickup */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Pickup Location
                  </p>
                </div>
                <p className="text-lg text-gray-900 dark:text-white font-medium mb-2">
                  {ride.pickUpLocation?.address}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>
                    {pickupDate.toLocaleDateString()} at{" "}
                    {pickupDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {/* Dropoff */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Dropoff Location
                  </p>
                </div>
                <p className="text-lg text-gray-900 dark:text-white font-medium mb-2">
                  {ride.dropOffLocation?.address}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>
                    {dropoffDate.toLocaleDateString()} at{" "}
                    {dropoffDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Payment Status */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Payment Status
              </h3>
            </div>
            <Button
              onClick={() => navigate("/user/payment-history")}
              variant="outline"
              size="sm"
              className="text-xs border-gray-300 dark:border-gray-700"
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="font-semibold text-yellow-900 dark:text-yellow-300">
                  Pending
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Payment not completed yet
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Total Amount: <span className="font-bold text-gray-900 dark:text-white">৳{ride.cost * ride.availableSeats}</span></p>
              <p className="mt-2">Click "Pay Now" to complete payment</p>
              <p className="mt-1 text-xs text-gray-500">If payment fails, use the retry options below</p>
            </div>

            {/* Retry Payment Section */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Payment Issues?</p>
              <div className="flex gap-2">
                <Button
                  onClick={handlePayment}
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs border-green-300 text-green-600 hover:bg-green-50"
                >
                  <CreditCard className="w-3 h-3 mr-1" />
                  Retry Payment
                </Button>
                <Button
                  onClick={() => {
                    console.log("🔄 Refreshing ride data...");
                    refetch();
                    toast.success("Ride data refreshed");
                  }}
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  Refresh Status
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Ride Type */}
        {ride.rideType && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Ride Type
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-base">
              {ride.rideType}
            </p>
            {ride.maxGuests && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Maximum {ride.maxGuests} guests
              </p>
            )}
          </div>
        )}
      </div>

      {/* Amenities Section */}
      {ride.amenities && ride.amenities.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Amenities
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {ride.amenities.map((amenity: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-800"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Images */}
      {ride.images && ride.images.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Ride Images
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ride.images.map((image: string, index: number) => (
              <img
                key={index}
                src={image}
                alt={`Ride ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              />
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Ride Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Created
              </p>
              <p className="text-gray-900 dark:text-white font-medium">
                {createdDate.toLocaleDateString()} at{" "}
                {createdDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          {ride.updatedAt && (
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last Updated
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {new Date(ride.updatedAt).toLocaleDateString()} at{" "}
                  {new Date(ride.updatedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <EditRideModal
        key={ride._id || ride.id}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        ride={ride}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              Delete Ride?
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 pt-2">
              Are you sure you want to delete this ride? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4">
            <p className="text-sm text-red-800 dark:text-red-300 font-medium">
              {ride.title}
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {ride.pickUpLocation?.address} → {ride.dropOffLocation?.address}
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
              className="border-gray-300 dark:border-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete Ride"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
