/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAcceptRideRequestMutation, useRejectRideRequestMutation, useGetAvailableRidesQuery } from "@/redux/features/ride/ride.api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, Clock, DollarSign, Phone, Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
export default function ManageRides() {
  const hasSessionHint = useSelector((state: any) => state.authSession.hasSession);
  const [selectedRideRequest, setSelectedRideRequest] = useState<any>(null);
  const { data, isLoading, refetch } = useGetAvailableRidesQuery({}, { skip: !hasSessionHint });
  const [acceptRide, { isLoading: acceptLoading }] = useAcceptRideRequestMutation();
  const [rejectRide, { isLoading: rejectLoading }] = useRejectRideRequestMutation();

  const rideRequests = Array.isArray(data?.data)
    ? data.data
    : data?.data?.rides || [];

  console.log(data, 'requestsData');

  const handleAcceptRide = async (rideId: string) => {
    try {
      await acceptRide({ id: rideId }).unwrap();
      toast.success("Ride accepted successfully!");
      refetch();
      setSelectedRideRequest(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to accept ride");
    }
  };

  const handleRejectRide = async (rideId: string) => {
    try {
      await rejectRide({ id: rideId }).unwrap();
      toast.success("Ride rejected successfully!");
      refetch();
      setSelectedRideRequest(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reject ride");
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
        <h1 className="text-3xl font-bold">Manage Ride Requests</h1>
        <p className="text-muted-foreground mt-2">
          View and respond to incoming ride requests
        </p>
      </div>

      {rideRequests?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No pending ride requests</p>
            <p className="text-sm text-muted-foreground">
              You'll see incoming ride requests here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rideRequests?.map((request: any) => (
            <Card key={request._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {request.rider?.name || "Unknown Rider"}
                    </CardTitle>
                    <CardDescription>
                      {request.rider?.phone || "No phone"}
                    </CardDescription>
                  </div>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pickup Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pickup</p>
                    <p className="font-medium">
                      {request.pickupLocation?.address || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Dropoff Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Dropoff</p>
                    <p className="font-medium">
                      {request.dropoffLocation?.address || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Fare */}
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Fare</p>
                    <p className="font-medium">${request.fare || request.price || "N/A"}</p>
                  </div>
                </div>

                {/* Requested At */}
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Requested</p>
                    <p className="font-medium">
                      {new Date(request.requestedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {/* Rider Phone */}
                {request.rider?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Contact</p>
                      <p className="font-medium">{request.rider.phone}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setSelectedRideRequest(request)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={acceptLoading}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Ride Acceptance</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to accept this ride from{" "}
                          {request.rider?.name}?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                          <p>
                            <span className="text-muted-foreground">Pickup:</span>{" "}
                            {request.pickupLocation?.address}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Dropoff:</span>{" "}
                            {request.dropoffLocation?.address}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Fare:</span> $
                            {request.fare || request.price}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1">
                            Cancel
                          </Button>
                          <Button
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleAcceptRide(request._id)}
                            disabled={acceptLoading}
                          >
                            {acceptLoading ? "Accepting..." : "Confirm Accept"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleRejectRide(request._id)}
                    disabled={rejectLoading}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
