/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useGetUserActiveRideRequestsQuery, useCancelRideMutation } from "@/redux/features/ride/ride.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  MapPin,
  Clock,
  DollarSign,
  User,
  X,
  CheckCircle,
  Car,
  Phone,
} from "lucide-react";

interface RideRequest {
  _id: string;
  pickupLocation: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  dropoffLocation: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  vehicleType: string;
  fare: number;
  status: string;
  createdAt: string;
  driver?: {
    name: string;
    phone: string;
    picture?: string;
  };
  rider?: {
    name: string;
    phone: string;
    picture?: string;
  };
}

const statusColors = {
  REQUESTED: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  PICKED_UP: "bg-purple-100 text-purple-800",
  IN_TRANSIT: "bg-indigo-100 text-indigo-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const statusIcons = {
  REQUESTED: <Clock className="w-4 h-4" />,
  ACCEPTED: <CheckCircle className="w-4 h-4" />,
  PICKED_UP: <Car className="w-4 h-4" />,
  IN_TRANSIT: <Car className="w-4 h-4" />,
  COMPLETED: <CheckCircle className="w-4 h-4" />,
  CANCELLED: <X className="w-4 h-4" />,
};

export default function MultipleRideRequests() {
  const [selectedRide, setSelectedRide] = useState<string | null>(null);
  
  const { data: activeRides, isLoading, refetch } = useGetUserActiveRideRequestsQuery({});
  const [cancelRide, { isLoading: isCancelling }] = useCancelRideMutation();

  const handleCancelRide = async (rideId: string) => {
    try {
      await cancelRide({ 
        id: rideId, 
        reason: "Cancelled by user" 
      }).unwrap();
      toast.success("Ride cancelled successfully");
      refetch();
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to cancel ride";
      toast.error(errorMessage);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType.toLowerCase()) {
      case "car":
        return <Car className="w-5 h-5" />;
      case "bike":
        return <Car className="w-5 h-5" />;
      default:
        return <Car className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const rides = activeRides?.data || [];

  if (rides.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">
            <Car className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">No Active Ride Requests</h3>
            <p>You don't have any active ride requests at the moment.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Active Ride Requests</h2>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {rides.length} Active
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rides.map((ride: RideRequest) => (
          <Card 
            key={ride._id} 
            className={`relative transition-all duration-200 hover:shadow-lg ${
              selectedRide === ride._id ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getVehicleIcon(ride.vehicleType)}
                  <CardTitle className="text-lg">
                    {ride.vehicleType} Ride
                  </CardTitle>
                </div>
                <Badge className={`${statusColors[ride.status as keyof typeof statusColors]} flex items-center gap-1`}>
                  {statusIcons[ride.status as keyof typeof statusIcons]}
                  {ride.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                {formatTime(ride.createdAt)}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Pickup Location */}
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Pickup</p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {ride.pickupLocation.address}
                  </p>
                </div>
              </div>

              {/* Dropoff Location */}
              <div className="flex items-start gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <MapPin className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Dropoff</p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {ride.dropoffLocation.address}
                  </p>
                </div>
              </div>

              {/* Fare */}
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Fare</p>
                  <p className="text-lg font-bold text-blue-600">
                    ${ride.fare?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>

              {/* Driver Info (if assigned) */}
              {ride.driver && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Driver</p>
                    <p className="text-sm text-gray-600">{ride.driver.name}</p>
                    {ride.driver.phone && (
                      <div className="flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3 text-gray-500" />
                        <p className="text-xs text-gray-500">{ride.driver.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                {ride.status === 'REQUESTED' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelRide(ride._id)}
                    disabled={isCancelling}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRide(
                    selectedRide === ride._id ? null : ride._id
                  )}
                  className="flex-1"
                >
                  {selectedRide === ride._id ? 'Hide' : 'Details'}
                </Button>
              </div>

              {/* Expanded Details */}
              {selectedRide === ride._id && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg space-y-2">
                  <h4 className="font-medium text-gray-900">Ride Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Ride ID:</strong> {ride._id}</p>
                    {ride.pickupLocation.coordinates && (
                      <p>
                        <strong>Pickup Coordinates:</strong> {ride.pickupLocation.coordinates.latitude}, {ride.pickupLocation.coordinates.longitude}
                      </p>
                    )}
                    {ride.dropoffLocation.coordinates && (
                      <p>
                        <strong>Dropoff Coordinates:</strong> {ride.dropoffLocation.coordinates.latitude}, {ride.dropoffLocation.coordinates.longitude}
                      </p>
                    )}
                    {ride.rider && (
                      <p><strong>Rider:</strong> {ride.rider.name}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
