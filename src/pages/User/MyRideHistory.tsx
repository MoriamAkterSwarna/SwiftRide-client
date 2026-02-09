/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useGetUserRideQuery } from "@/redux/features/ride/ride.api";
import { DollarSign, Car, Search, Filter, ChevronDown, Clock, CheckCircle, AlertCircle, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";


interface RideLocation {
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface Ride {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  pickUpLocation: RideLocation;
  dropOffLocation: RideLocation;
  pickUpTime: string;
  dropOffTime: string;
  cost: number;
  availableSeats: number;
  maxGuests?: number;
  status: string;
  vehicle?: string;
  amenities?: string[];
  rideType?: string;
  images?: string[];
  createdAt: string;
  [key: string]: any; // Allow any extra properties
}

const statusConfig = {
  ACTIVE: {
    color: "bg-green-100 dark:bg-green-900/30",
    textColor: "text-green-800 dark:text-green-400",
    label: "Active",
    icon: <CheckCircle className="w-4 h-4" />,
    badgeColor: "bg-green-500 dark:bg-green-400"
  },
  PENDING: {
    color: "bg-yellow-100 dark:bg-yellow-900/30",
    textColor: "text-yellow-800 dark:text-yellow-400",
    label: "Pending",
    icon: <Clock className="w-4 h-4" />,
    badgeColor: "bg-yellow-500 dark:bg-yellow-400"
  },
  COMPLETED: {
    color: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-800 dark:text-blue-400",
    label: "Completed",
    icon: <CheckCircle className="w-4 h-4" />,
    badgeColor: "bg-blue-500 dark:bg-blue-400"
  },
  CANCELLED: {
    color: "bg-red-100 dark:bg-red-900/30",
    textColor: "text-red-800 dark:text-red-400",
    label: "Cancelled",
    icon: <AlertCircle className="w-4 h-4" />,
    badgeColor: "bg-red-500 dark:bg-red-400"
  },
};

export default function MyRidesHistory() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "price-high" | "price-low">("recent");

  const { data, isLoading, error } = useGetUserRideQuery({});

  console.log(data?.data, "My Rides API response"); // Debug log

  // Fix: Safely extract rides array and map API fields to interface
  const rides: Ride[] = useMemo(() => {
    if (!data) return [];

    try {
      let rideArray: any[] = [];

      // Handle different response structures
      if (Array.isArray(data)) {
        rideArray = data;
      } else if (data.data && Array.isArray(data.data)) {
        rideArray = data.data;
      }

      // Map API fields to interface and filter valid rides
      const mappedRides = rideArray
        .map((item: any) => {
          if (!item || typeof item !== 'object') return null;

          const vehicle = item.rideVehicle || item.vehicle;
          const rideType = item.placeType || item.rideType;

          return {
            _id: item._id,
            id: item.id,
            title: item.title || 'Untitled Ride',
            description: item.description,
            pickUpLocation: item.pickUpLocation,
            dropOffLocation: item.dropOffLocation,
            pickUpTime: item.pickUpTime,
            dropOffTime: item.dropOffTime,
            cost: Number(item.cost) || 0,
            availableSeats: Number(item.availableSeats) || 0,
            maxGuests: item.totalGuest || item.maxGuests,
            status: item.status || 'PENDING',
            vehicle: typeof vehicle === 'object' && vehicle !== null ? (vehicle.name || vehicle.type || 'N/A') : (vehicle || 'N/A'),
            rideType: typeof rideType === 'object' && rideType !== null ? (rideType.name || rideType.type || 'N/A') : (rideType || 'N/A'),
            amenities: item.amenities || [],
            images: item.images || [],
            createdAt: item.createdAt,
          };
        })
        .filter((item): item is NonNullable<typeof item> => {
          return item !== null &&
            !!item.title &&
            !!item.pickUpLocation &&
            !!item.dropOffLocation &&
            !!item.pickUpTime &&
            !!item.dropOffTime &&
            typeof item.cost === 'number' &&
            typeof item.availableSeats === 'number' &&
            !!item.status &&
            !!item.createdAt;
        }) as Ride[];

      return mappedRides;
    } catch (err) {
      console.error("Error extracting rides:", err);
      return [];
    }
  }, [data]);

  console.log("Rides data:", rides); // Debug log

  // Filter and sort rides
  const filteredRides = useMemo(() => {
    const filtered = rides.filter(ride => {
      const matchesSearch =
        ride.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.pickUpLocation?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.dropOffLocation?.address?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === "ALL" || ride.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });

    // Sort
    switch (sortBy) {
      case "oldest":
        return filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case "price-high":
        return filtered.sort((a, b) => b.cost - a.cost);
      case "price-low":
        return filtered.sort((a, b) => a.cost - b.cost);
      case "recent":
      default:
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [rides, searchTerm, selectedStatus, sortBy]);

  const stats = useMemo(() => ({
    totalRides: rides.length,
    activeRides: rides.filter(r => r.status === "ACTIVE").length,
    completedRides: rides.filter(r => r.status === "COMPLETED").length,
    totalEarnings: rides.reduce((acc, ride) => acc + (ride.cost * ride.availableSeats), 0),
  }), [rides]);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8 min-h-screen bg-white dark:bg-gray-950">
        <Skeleton className="h-12 w-64 mb-8 bg-gray-200 dark:bg-gray-800" />
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-40 w-full mb-4 bg-gray-200 dark:bg-gray-800" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8 min-h-screen bg-white dark:bg-gray-950">
        <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-600 dark:text-red-400" />
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Failed to Load Rides</h3>
          <p className="text-red-700 dark:text-red-300">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">My Rides History</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage and track all your rides</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Rides", value: stats.totalRides, icon: Car, color: "blue" },
          { label: "Active Rides", value: stats.activeRides, icon: CheckCircle, color: "green" },
          { label: "Completed", value: stats.completedRides, icon: CheckCircle, color: "purple" },
          { label: "Total Earnings", value: `৳${stats.totalEarnings}`, icon: DollarSign, color: "amber" },
        ].map((stat, idx) => {
          const colorMap = {
            blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
            green: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
            purple: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
            amber: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
          };
          const textColorMap = {
            blue: "text-blue-600 dark:text-blue-400",
            green: "text-green-600 dark:text-green-400",
            purple: "text-purple-600 dark:text-purple-400",
            amber: "text-amber-600 dark:text-amber-400",
          };
          const Icon = stat.icon;
          return (
            <div key={idx} className={`rounded-xl border p-6 ${colorMap[stat.color as keyof typeof colorMap]}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className={`text-3xl font-bold mt-2 ${textColorMap[stat.color as keyof typeof textColorMap]}`}>
                    {stat.value}
                  </p>
                </div>
                <Icon className={`w-8 h-8 ${textColorMap[stat.color as keyof typeof textColorMap]} opacity-50`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-600" />
            <input
              type="text"
              placeholder="Search by title, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-600 pointer-events-none" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-600 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Rides List */}
      {filteredRides.length === 0 ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-12 text-center">
          <Car className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Rides Found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRides.map((ride) => {
            const rideId = ride._id || ride.id;
            const status = statusConfig[ride.status as keyof typeof statusConfig] || statusConfig.PENDING;
            const pickupDate = new Date(ride.pickUpTime);

            return (
              <div
                key={rideId}
                className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/user/my-rides/${rideId}`)}
              >
                {/* Main Ride Card */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Left Section - Route Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4 gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{ride.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {pickupDate.toLocaleDateString()} at {pickupDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      {/* Route */}
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400" />
                            <div className="w-0.5 h-12 bg-gradient-to-b from-green-500 to-red-500 dark:from-green-400 dark:to-red-400" />
                            <div className="w-3 h-3 rounded-full bg-red-500 dark:bg-red-400" />
                          </div>
                          <div className="flex-1 space-y-6">
                            <div>
                              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Pickup</p>
                              <p className="text-sm text-gray-900 dark:text-white font-medium line-clamp-2">{ride.pickUpLocation?.address}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Dropoff</p>
                              <p className="text-sm text-gray-900 dark:text-white font-medium line-clamp-2">{ride.dropOffLocation?.address}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Stats */}
                    <div className="lg:w-64 grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Seats</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{ride.availableSeats}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Per Seat</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">৳{ride.cost}</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 text-center border border-blue-200 dark:border-blue-800">
                        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase mb-1">Total</p>
                        <p className="text-xl text-center font-bold text-blue-600 dark:text-blue-400">৳{ride.cost * ride.availableSeats}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge and View Button */}
                  <div className="flex items-center justify-between mt-4 gap-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.color} whitespace-nowrap shrink-0`}>
                      <div className={`w-2 h-2 rounded-full ${status.badgeColor} animate-pulse`} />
                      <span className={`text-sm font-semibold ${status.textColor}`}>{status.label}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Navigating to ride details for ID:", rideId);
                        navigate(`/user/my-rides/${rideId}`);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Results Info */}
      <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
        <p>Showing {filteredRides.length} of {rides.length} rides</p>
      </div>
    </div>
  );
}