/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@/hooks/useTheme";
import { useGetRidesQuery, useCancelRideMutation } from "@/redux/features/ride/ride.api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, Clock, DollarSign, Loader2, XCircle, Car } from "lucide-react";
import { toast } from "sonner";

export default function DriverDashboard() {
  const { theme } = useTheme();
  const hasSessionHint = useSelector((state: any) => state.authSession.hasSession);
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const { data: ridesData, isLoading, refetch } = useGetRidesQuery({}, { skip: !hasSessionHint });
  const [cancelRide, { isLoading: cancelLoading }] = useCancelRideMutation();

  const isDark = theme === "dark";
  const rides = ridesData?.data || [];

  const normalizedStatus = (status?: string) => (status || "").toLowerCase();
  const totalRides = rides.length;
  const activeRides = rides.filter((ride: any) => {
    const status = normalizedStatus(ride.status);
    return status === "active" || status === "requested" || status === "accepted" || status === "in_transit";
  }).length;
  const completedRides = rides.filter((ride: any) => normalizedStatus(ride.status) === "completed").length;
  const cancelledRides = rides.filter((ride: any) => normalizedStatus(ride.status) === "cancelled").length;

  const handleCancelRide = async (rideId: string) => {
    try {
      await cancelRide({ id: rideId }).unwrap();
      toast.success("Ride cancelled successfully!");
      refetch();
      setSelectedRide(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to cancel ride");
    }
  };

  const getStatusColor = (status: string, isDark: boolean) => {
    const normalized = normalizedStatus(status);
    if (isDark) {
      switch (normalized) {
        case "active":
        case "requested":
        case "accepted":
        case "in_transit":
          return "bg-emerald-900/40 text-emerald-400 border border-emerald-800";
        case "completed":
          return "bg-blue-900/40 text-blue-400 border border-blue-800";
        case "cancelled":
          return "bg-red-900/40 text-red-400 border border-red-800";
        default:
          return "bg-yellow-900/40 text-yellow-400 border border-yellow-800";
      }
    } else {
      switch (normalized) {
        case "active":
        case "requested":
        case "accepted":
        case "in_transit":
          return "bg-emerald-100 text-emerald-800";
        case "completed":
          return "bg-blue-100 text-blue-800";
        case "cancelled":
          return "bg-red-100 text-red-800";
        default:
          return "bg-yellow-100 text-yellow-800";
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 px-2 sm:px-0">
      {/* Hero Section with Stats */}
      <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border transition-all duration-300 ${
        isDark 
          ? "border-blue-900/30 bg-linear-to-r from-blue-950 via-blue-900 to-cyan-900 shadow-2xl shadow-blue-900/20" 
          : "border-blue-100 bg-linear-to-r from-blue-600 via-blue-500 to-cyan-500 shadow-lg"
      } p-4 sm:p-6 lg:p-8 text-white`}>
        {/* Animated Background Blobs */}
        <div className={`absolute -top-16 -right-16 h-40 sm:h-56 w-40 sm:w-56 rounded-full blur-3xl ${
          isDark ? "bg-blue-500/5" : "bg-white/10"
        }`} />
        <div className={`absolute -bottom-20 -left-10 h-40 sm:h-56 w-40 sm:w-56 rounded-full blur-3xl ${
          isDark ? "bg-cyan-500/5" : "bg-cyan-300/20"
        }`} />

        <div className="relative">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className={`rounded-xl sm:rounded-2xl p-2 sm:p-3 ${isDark ? "bg-blue-900/40" : "bg-white/10"}`}>
              <Car className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Driver Hub</h1>
              <p className={`text-xs sm:text-sm ${isDark ? "text-blue-200/70" : "text-white/80"}`}>
                Track rides, accept requests, and manage your earnings
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            {[
              { label: "Total Rides", value: totalRides, icon: "📊" },
              { label: "Active", value: activeRides, icon: "🚀" },
              { label: "Completed", value: completedRides, icon: "✅" },
              { label: "Cancelled", value: cancelledRides, icon: "❌" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`rounded-lg sm:rounded-2xl p-3 sm:p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                  isDark ? "bg-white/5 border border-white/10" : "bg-white/10 border border-white/20"
                }`}
              >
                <p className={`text-xs uppercase font-semibold ${isDark ? "text-blue-200/60" : "text-white/70"}`}>
                  {stat.label}
                </p>
                <p className="text-xl sm:text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {rides.length === 0 ? (
        <Card className={`border-2 border-dashed transition-all duration-300 ${
          isDark 
            ? "border-blue-900/50 bg-gradient-to-br from-blue-950/30 via-slate-900/30 to-cyan-950/30" 
            : "border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50"
        }`}>
          <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 lg:py-16">
            <div className={`rounded-2xl p-3 sm:p-4 ${isDark ? "bg-blue-900/40" : "bg-white"} shadow-lg`}>
              <Car className={`h-10 w-10 sm:h-12 sm:w-12 ${isDark ? "text-blue-400" : "text-blue-500"}`} />
            </div>
            <p className={`mt-4 text-lg sm:text-xl font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
              No rides yet
            </p>
            <p className={`text-sm text-center max-w-md mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Once riders request trips, they will show up here for you to manage and accept.
            </p>
            <Button
              className={`mt-5 transition-all duration-300 ${
                isDark
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              }`}
              onClick={() => window.location.href = "/driver/manage-rides"}
            >
              Accept a Ride
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {rides.map((ride: any) => (
            <Card 
              key={ride._id} 
              className={`group overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                isDark
                  ? "border-slate-700 bg-slate-900 hover:shadow-blue-900/30"
                  : "border-gray-200 bg-white hover:shadow-blue-100"
              }`}
            >
              {/* Gradient Overlay on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                isDark ? "via-cyan-500/3" : ""
              }`} />

              <CardHeader className="relative pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className={`text-base sm:text-lg truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                      {ride.title}
                    </CardTitle>
                    <CardDescription className={`text-xs sm:text-sm line-clamp-2 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {ride.description || "No description"}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(ride.status || "Active", isDark)}>
                    <span className="text-xs sm:text-sm">{ride.status || "Active"}</span>
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="relative space-y-3 sm:space-y-4">
                {/* Pickup Location */}
                <div className="flex items-start gap-2 sm:gap-3">
                  <MapPin className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs sm:text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Pickup
                    </p>
                    <p className={`text-xs sm:text-sm font-medium truncate ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}>
                      {ride.pickUpLocation?.address || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Dropoff Location */}
                <div className="flex items-start gap-2 sm:gap-3">
                  <MapPin className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5 ${
                    isDark ? "text-red-400" : "text-red-600"
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs sm:text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Dropoff
                    </p>
                    <p className={`text-xs sm:text-sm font-medium truncate ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}>
                      {ride.dropOffLocation?.address || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Vehicle Type */}
                <div className="flex items-start gap-2 sm:gap-3">
                  <Car className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5 ${
                    isDark ? "text-green-400" : "text-green-600"
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs sm:text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Vehicle
                    </p>
                    <p className={`text-xs sm:text-sm font-medium truncate ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}>
                      {ride.rideType?.rideVehicle || ride.vehicle || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Cost */}
                {ride.cost && (
                  <div className="flex items-start gap-2 sm:gap-3">
                    <DollarSign className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5 ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`} />
                    <div>
                      <p className={`text-xs sm:text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        Cost
                      </p>
                      <p className={`text-sm sm:text-base font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                        ${ride.cost}
                      </p>
                    </div>
                  </div>
                )}

                {/* Requested At */}
                <div className="flex items-start gap-2 sm:gap-3">
                  <Clock className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5 ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`} />
                  <div>
                    <p className={`text-xs sm:text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Requested
                    </p>
                    <p className={`text-xs sm:text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                      {new Date(ride.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 sm:pt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedRide(ride)}
                        className={`flex-1 text-xs sm:text-sm h-8 sm:h-9 transition-all duration-300 ${
                          isDark
                            ? "border-slate-700 text-blue-400 hover:bg-slate-800"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className={`max-w-2xl ${isDark ? "border-slate-700 bg-slate-900" : ""}`}>
                      <DialogHeader>
                        <DialogTitle className={isDark ? "text-white" : ""}>
                          {ride.title}
                        </DialogTitle>
                        <DialogDescription className={isDark ? "text-gray-400" : ""}>
                          {ride.description || "No description provided"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className={`p-4 rounded-lg space-y-2 ${
                            isDark 
                              ? "bg-slate-800 border border-slate-700" 
                              : "bg-gray-50 border border-gray-200"
                          }`}>
                            <h4 className={`font-semibold text-sm sm:text-base ${isDark ? "text-white" : ""}`}>
                              Trip Details
                            </h4>
                            <div className="space-y-1 text-xs sm:text-sm">
                              <p>
                                <span className={isDark ? "text-gray-400" : "text-gray-600"}>Pickup:</span> 
                                <span className={`ml-2 ${isDark ? "text-white" : ""}`}>
                                  {ride.pickUpLocation?.address}
                                </span>
                              </p>
                              <p>
                                <span className={isDark ? "text-gray-400" : "text-gray-600"}>Dropoff:</span> 
                                <span className={`ml-2 ${isDark ? "text-white" : ""}`}>
                                  {ride.dropOffLocation?.address}
                                </span>
                              </p>
                              <p>
                                <span className={isDark ? "text-gray-400" : "text-gray-600"}>Vehicle:</span> 
                                <span className={`ml-2 ${isDark ? "text-white" : ""}`}>
                                  {ride.rideType?.rideVehicle || ride.vehicle}
                                </span>
                              </p>
                              {ride.cost && (
                                <p>
                                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>Cost:</span> 
                                  <span className={`ml-2 ${isDark ? "text-white" : ""}`}>
                                    ${ride.cost}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>
                          <div className={`p-4 rounded-lg space-y-2 ${
                            isDark 
                              ? "bg-slate-800 border border-slate-700" 
                              : "bg-gray-50 border border-gray-200"
                          }`}>
                            <h4 className={`font-semibold text-sm sm:text-base ${isDark ? "text-white" : ""}`}>
                              Status
                            </h4>
                            <Badge className={getStatusColor(ride.status || "Active", isDark)}>
                              {ride.status || "Active"}
                            </Badge>
                            <p className={`text-xs sm:text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                              Requested on {new Date(ride.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {(ride.status === "Active" || !ride.status) && (
                          <div className="flex gap-2">
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                className={`flex-1 text-xs sm:text-sm ${
                                  isDark
                                    ? "border-slate-700 text-gray-300 hover:bg-slate-800"
                                    : ""
                                }`}
                              >
                                Close
                              </Button>
                            </DialogTrigger>
                            <Button
                              variant="destructive"
                              className="flex-1 text-xs sm:text-sm"
                              onClick={() => handleCancelRide(ride._id)}
                              disabled={cancelLoading}
                            >
                              {cancelLoading ? "Cancelling..." : "Cancel Ride"}
                            </Button>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
