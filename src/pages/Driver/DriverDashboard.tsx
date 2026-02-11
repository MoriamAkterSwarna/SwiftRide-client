/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@/hooks/useTheme";
import { useGetDriverRideHistoryQuery } from "@/redux/features/ride/ride.api";
import { MapPin, DollarSign, Loader2, XCircle, Car, Check, X, Calendar, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type FilterStatus = "all" | "accepted" | "rejected" | "pending" | "completed" | "active";

export default function DriverDashboard() {
  const { theme } = useTheme();
  const hasSessionHint = useSelector((state: any) => state.authSession.hasSession);
  const [filterStatus] = useState<FilterStatus>("all");
  const { data: ridesData, isLoading } = useGetDriverRideHistoryQuery(
    { page: 1, limit: 50 },
    { skip: !hasSessionHint }
  );

  const isDark = theme === "dark";
  const rides = ridesData?.data || [];

  const normalizedStatus = (status?: string) => (status || "").toLowerCase();
  
  // Calculate all ride counts
  const totalRides = rides.length;
  const acceptedRides = rides.filter((ride: any) => normalizedStatus(ride.status) === "accepted").length;
  const rejectedRides = rides.filter((ride: any) => normalizedStatus(ride.status) === "rejected").length;
  const pendingRides = rides.filter((ride: any) => {
    const status = normalizedStatus(ride.status);
    return status === "active" || status === "requested" || status === "pending";
  }).length;
  const completedRides = rides.filter((ride: any) => normalizedStatus(ride.status) === "completed").length;
  const activeRides = rides.filter((ride: any) => {
    const status = normalizedStatus(ride.status);
    return status === "active" || status === "requested" || status === "accepted" || status === "in_transit";
  }).length;

  // Filter rides based on selected status
  const filteredRides = rides.filter((ride: any) => {
    const status = normalizedStatus(ride.status);
    if (filterStatus === "all") return true;
    if (filterStatus === "pending") return status === "active" || status === "requested" || status === "pending";
    if (filterStatus === "active") return status === "active" || status === "requested" || status === "accepted" || status === "in_transit";
    return status === filterStatus;
  }
  );

  const getRideStatusColor = (status: string) => {
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
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-slate-950" : "bg-gray-50"}`}>
      <div className="w-full px-2 sm:px-4 lg:px-6 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {/* Header */}
          <div>
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Driver Dashboard
            </h1>
            <p className={`text-sm sm:text-base mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Available rides waiting for you to accept or reject
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {[
              { label: "Total", value: totalRides, icon: "📊" },
              { label: "Accepted", value: acceptedRides, icon: "✅" },
              { label: "Rejected", value: rejectedRides, icon: "❌" },
              { label: "Pending", value: pendingRides, icon: "⏳" },
              { label: "Active", value: activeRides, icon: "🚀" },
              { label: "Completed", value: completedRides, icon: "🎯" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`rounded-lg sm:rounded-xl p-3 sm:p-4 border transition-all duration-300 hover:shadow-lg ${
                  isDark
                    ? "border-slate-700 bg-slate-900"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {stat.label}
                    </p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                      {stat.value}
                    </p>
                  </div>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

       

          {/* Rides List */}
          {rides.length === 0 ? (
            <div className={`rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center border transition-all duration-300 ${
              isDark
                ? "border-slate-700 bg-slate-900"
                : "border-gray-200 bg-white"
            }`}>
              <div className={`rounded-2xl p-3 sm:p-4 w-fit mx-auto ${isDark ? "bg-blue-900/40" : "bg-blue-50"} shadow-lg`}>
                <Car className={`h-10 w-10 sm:h-12 sm:w-12 mx-auto ${isDark ? "text-blue-400" : "text-blue-500"}`} />
              </div>
              <p className={`text-lg sm:text-xl font-semibold mt-4 ${isDark ? "text-white" : "text-gray-800"}`}>
                No rides available
              </p>
              <p className={`text-sm text-center max-w-md mt-2 mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Check back later for available rides or go online to start accepting requests.
              </p>
            </div>
          ) : filteredRides.length === 0 ? (
            <div className={`rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center border transition-all duration-300 ${
              isDark
                ? "border-slate-700 bg-slate-900"
                : "border-gray-200 bg-white"
            }`}>
              <div className={`rounded-2xl p-3 sm:p-4 w-fit mx-auto ${isDark ? "bg-blue-900/40" : "bg-blue-50"} shadow-lg`}>
                <XCircle className={`h-10 w-10 sm:h-12 sm:w-12 mx-auto ${isDark ? "text-blue-400" : "text-blue-500"}`} />
              </div>
              <p className={`text-lg sm:text-xl font-semibold mt-4 ${isDark ? "text-white" : "text-gray-800"}`}>
                No {filterStatus !== "all" ? filterStatus : ""} rides
              </p>
              <p className={`text-sm text-center max-w-md mt-2 mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                No rides found with the selected filter. Try changing your filter or check back later.
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredRides.map((ride: any) => {
                const status = normalizedStatus(ride.status);
                return (
                  <div
                    key={ride._id}
                    className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border-l-4 transition-all duration-300 hover:shadow-lg ${
                      status === "accepted"
                        ? isDark
                          ? "border-l-emerald-500 border-slate-700 bg-slate-900 hover:shadow-emerald-900/20"
                          : "border-l-emerald-500 border-gray-200 bg-white hover:shadow-emerald-100"
                        : status === "rejected"
                          ? isDark
                            ? "border-l-red-500 border-slate-700 bg-slate-900 hover:shadow-red-900/20"
                            : "border-l-red-500 border-gray-200 bg-white hover:shadow-red-100"
                          : isDark
                            ? "border-l-yellow-500 border-slate-700 bg-slate-900 hover:shadow-yellow-900/20"
                            : "border-l-yellow-500 border-gray-200 bg-white hover:shadow-yellow-100"
                    }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {/* Route Info */}
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <MapPin
                            className={`${isDark ? "text-emerald-400" : "text-emerald-600"} mt-0.5 shrink-0 w-4 h-4 sm:w-5 sm:h-5`}
                          />
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>From</p>
                            <p className={`font-semibold text-xs sm:text-sm truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                              {ride.pickUpLocation?.address || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 sm:gap-3">
                          <MapPin
                            className={`${isDark ? "text-red-400" : "text-red-600"} mt-0.5 shrink-0 w-4 h-4 sm:w-5 sm:h-5`}
                          />
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>To</p>
                            <p className={`font-semibold text-xs sm:text-sm truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                              {ride.dropOffLocation?.address || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Ride Details */}
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between items-center">
                          <div className={`flex items-center gap-2 text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            <DollarSign size={16} className="sm:w-5 sm:h-5" />
                            <span>Fare</span>
                          </div>
                          <span className={`font-bold text-sm sm:text-lg ${isDark ? "text-emerald-400" : "text-gray-900"}`}>
                            ${ride.cost ?? "N/A"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className={`flex items-center gap-2 text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            <Calendar size={16} className="sm:w-5 sm:h-5" />
                            <span>Date</span>
                          </div>
                          <span className={`font-semibold text-xs sm:text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                            {new Date(ride.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className={`text-xs sm:text-sm flex items-center gap-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            Status
                          </span>
                          <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getRideStatusColor(ride.status || "")}`}>
                            {ride.status || "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rider Info */}
                    <div className={`mt-4 sm:mt-6 pt-4 sm:pt-6 border-t transition-colors ${isDark ? "border-slate-700" : "border-gray-200"} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0`}>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <img
                          src={ride.user?.picture || "https://i.pravatar.cc/48"}
                          alt={ride.user?.name || "Rider"}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-300"
                        />
                        <div className="min-w-0">
                          <p className={`font-semibold text-xs sm:text-sm truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                            {ride.user?.name || "Rider"}
                          </p>
                          <p className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            {ride.user?.phone || "No phone"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-400 w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
                        <span className={`font-semibold text-xs sm:text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                          4.8
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                      {status !== "accepted" && status !== "rejected" && status !== "completed" ? (
                        <>
                          <Button
                            className={`flex-1 text-xs sm:text-sm h-8 sm:h-9 transition-all duration-300 ${
                              isDark
                                ? "bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-800"
                                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200"
                            }`}
                            onClick={() => toast.success("Accept ride functionality")}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            className={`flex-1 text-xs sm:text-sm h-8 sm:h-9 transition-all duration-300 ${
                              isDark
                                ? "bg-red-900/40 hover:bg-red-900/60 text-red-400 border border-red-800"
                                : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                            }`}
                            onClick={() => toast.success("Reject ride functionality")}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Button
                          disabled
                          className={`flex-1 text-xs sm:text-sm h-8 sm:h-9 ${
                            status === "accepted"
                              ? isDark
                                ? "bg-emerald-900/40 text-emerald-400"
                                : "bg-emerald-100 text-emerald-800"
                              : status === "rejected"
                                ? isDark
                                  ? "bg-red-900/40 text-red-400"
                                  : "bg-red-100 text-red-800"
                                : isDark
                                  ? "bg-blue-900/40 text-blue-400"
                                  : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {status === "accepted"
                            ? "✓ Accepted"
                            : status === "rejected"
                              ? "✗ Rejected"
                              : "✓ Completed"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
