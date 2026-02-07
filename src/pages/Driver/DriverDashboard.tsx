/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useSelector } from "react-redux";
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
  const hasSessionHint = useSelector((state: any) => state.authSession.hasSession);
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const { data: ridesData, isLoading, refetch } = useGetRidesQuery({}, { skip: !hasSessionHint });
  const [cancelRide, { isLoading: cancelLoading }] = useCancelRideMutation();

  const rides = ridesData?.data || [];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Rides</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your ride requests
        </p>
      </div>

      {rides.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Car className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg text-muted-foreground mb-4">No rides found</p>
            <p className="text-sm text-muted-foreground text-center">
              You haven't requested any rides yet. Create your first ride request!
            </p>
            <Button
              className="mt-4"
              onClick={() => window.location.href = "/request-ride"}
            >
              Request a Ride
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rides.map((ride: any) => (
            <Card key={ride._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{ride.title}</CardTitle>
                    <CardDescription>
                      {ride.description || "No description"}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(ride.status || "Active")}>
                    {ride.status || "Active"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pickup Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pickup</p>
                    <p className="font-medium text-sm">
                      {ride.pickUpLocation?.address || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Dropoff Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Dropoff</p>
                    <p className="font-medium text-sm">
                      {ride.dropOffLocation?.address || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Vehicle Type */}
                <div className="flex items-start gap-3">
                  <Car className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Vehicle</p>
                    <p className="font-medium text-sm">
                      {ride.rideType?.rideVehicle || ride.vehicle || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Cost */}
                {ride.cost && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Cost</p>
                      <p className="font-medium">${ride.cost}</p>
                    </div>
                  </div>
                )}

                {/* Requested At */}
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Requested</p>
                    <p className="font-medium text-sm">
                      {new Date(ride.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedRide(ride)}
                        className="flex-1"
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{ride.title}</DialogTitle>
                        <DialogDescription>
                          {ride.description || "No description provided"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                            <h4 className="font-semibold">Trip Details</h4>
                            <p><span className="text-muted-foreground">Pickup:</span> {ride.pickUpLocation?.address}</p>
                            <p><span className="text-muted-foreground">Dropoff:</span> {ride.dropOffLocation?.address}</p>
                            <p><span className="text-muted-foreground">Vehicle:</span> {ride.rideType?.rideVehicle || ride.vehicle}</p>
                            {ride.cost && <p><span className="text-muted-foreground">Cost:</span> ${ride.cost}</p>}
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                            <h4 className="font-semibold">Status</h4>
                            <Badge className={getStatusColor(ride.status || "Active")}>
                              {ride.status || "Active"}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-2">
                              Requested on {new Date(ride.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {(ride.status === "Active" || !ride.status) && (
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                              Close
                            </Button>
                            <Button
                              variant="destructive"
                              className="flex-1"
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
