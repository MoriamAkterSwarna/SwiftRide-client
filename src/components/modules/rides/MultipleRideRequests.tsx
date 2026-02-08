/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, User, Phone, Car, CheckCircle, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";



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
  REQUESTED: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
  ACCEPTED: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
  PICKED_UP: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400",
  IN_TRANSIT: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400",
  COMPLETED: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
  CANCELLED: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
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
  const { data, isLoading, error } = useGetMyRideRequestsQuery();

  const rideRequests: RideRequest[] = data?.data || [];

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6 p-4 bg-white dark:bg-gray-950 min-h-screen">
        <Skeleton className="h-8 w-64 bg-gray-200 dark:bg-gray-800" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full bg-gray-200 dark:bg-gray-800" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 bg-white dark:bg-gray-950 min-h-screen">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <p className="text-red-600 dark:text-red-400 text-center">Failed to load ride requests</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (rideRequests.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 bg-white dark:bg-gray-950 min-h-screen">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardContent className="p-12 text-center">
            <Car className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No Active Rides</h3>
            <p className="text-gray-600 dark:text-gray-400">You don't have any ride requests yet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-4 bg-white dark:bg-gray-950 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Active Ride Requests</h2>
        <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
          {rideRequests.length} {rideRequests.length === 1 ? "Ride" : "Rides"}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rideRequests.map((ride) => (
          <Card 
            key={ride._id} 
            className={`cursor-pointer transition-all hover:shadow-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 ${
              selectedRide === ride._id ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""
            }`}
            onClick={() => setSelectedRide(ride._id)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-lg text-gray-900 dark:text-white">
                  {ride.vehicleType}
                </CardTitle>
                <Badge className={statusColors[ride.status as keyof typeof statusColors]}>
                  {statusIcons[ride.status as keyof typeof statusIcons]}
                  <span className="ml-1">{ride.status}</span>
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <Clock className="inline w-4 h-4 mr-1" />
                {new Date(ride.createdAt).toLocaleString()}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center mb-1">
                  <MapPin className="w-4 h-4 mr-1 text-green-600 dark:text-green-400" />
                  Pickup
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 pl-5">
                  {ride.pickupLocation.address}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center mb-1">
                  <MapPin className="w-4 h-4 mr-1 text-red-600 dark:text-red-400" />
                  Dropoff
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 pl-5">
                  {ride.dropoffLocation.address}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Fare</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">৳{ride.fare}</p>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  View Details
                </Button>
              </div>

              {ride.driver && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {ride.driver.picture ? (
                      <img src={ride.driver.picture} alt={ride.driver.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{ride.driver.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <Phone className="inline w-3 h-3 mr-1" />
                      {ride.driver.phone}
                    </p>
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