/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAcceptRideRequestMutation, useRejectRideRequestMutation, useGetAvailableRidesQuery } from "@/redux/features/ride/ride.api";
import { useGetDriverProfileQuery, useToggleDriverAvailabilityMutation } from "@/redux/features/user/user.api";
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
  const { data, isLoading } = useGetAvailableRidesQuery({}, { skip: !hasSessionHint });
  const [acceptRide, { isLoading: acceptLoading }] = useAcceptRideRequestMutation();
  const [rejectRide, { isLoading: rejectLoading }] = useRejectRideRequestMutation();
  const { data: driverProfileData } = useGetDriverProfileQuery(undefined, { skip: !hasSessionHint });
  const [toggleAvailability, { isLoading: toggleLoading }] = useToggleDriverAvailabilityMutation();

  const driverProfile = driverProfileData?.data;
  const isOnline = Boolean(driverProfile?.isOnline);

  const rideRequests = Array.isArray(data?.data)
    ? data.data
    : data?.data?.rides || [];

  console.log(data, 'requestsData');

  const handleAcceptRide = async (rideId: string) => {
    try {
      await acceptRide({ id: rideId }).unwrap();
      toast.success("Ride accepted successfully!");
      setSelectedRideRequest(null);
    } catch (error: any) {
      const message = error?.data?.message || "Failed to accept ride";
      toast.error(message);
    }
  };

  const handleRejectRide = async (rideId: string) => {
    try {
      await rejectRide({ id: rideId }).unwrap();
      toast.success("Ride rejected successfully!");
      setSelectedRideRequest(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reject ride");
    }
  };

  const handleToggleAvailability = async () => {
    try {
      await toggleAvailability().unwrap();
      toast.success(isOnline ? "You are now offline" : "You are now online");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update availability");
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Ride Requests</h1>
          <p className="text-muted-foreground mt-2">
            View and respond to incoming ride requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              isOnline ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </span>
          <Button
            onClick={handleToggleAvailability}
            disabled={toggleLoading}
            className={isOnline ? "bg-gray-900 hover:bg-gray-800" : "bg-green-600 hover:bg-green-700"}
          >
            {toggleLoading ? "Updating..." : isOnline ? "Go Offline" : "Go Online"}
          </Button>
        </div>
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
          {rideRequests?.map((request: any) => {
            const pickup = request.pickupLocation || request.pickUpLocation;
            const dropoff = request.dropoffLocation || request.dropOffLocation;
            const riderName = request.rider?.name || request.user?.name || "Unknown Rider";
            const riderPhone = request.rider?.phone || request.user?.phone || "No phone";
            const requestedAt = request.requestedAt || request.createdAt;
            const fareValue = request.fare || request.cost || request.price || "N/A";
            const statusValue = (request.status || "Active").toString();
            const normalizedStatus = statusValue.toLowerCase();
            const statusClasses =
              normalizedStatus === "accepted"
                ? "bg-green-100 text-green-800"
                : normalizedStatus === "cancelled"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800";

            return (
            <Card key={request._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {riderName}
                    </CardTitle>
                    <CardDescription>
                      {riderPhone}
                    </CardDescription>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses}`}>
                    {statusValue}
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
                      {pickup?.address || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Dropoff Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Dropoff</p>
                    <p className="font-medium">
                      {dropoff?.address || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Fare */}
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Fare</p>
                    <p className="font-medium">${fareValue}</p>
                  </div>
                </div>

                {/* Requested At */}
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Requested</p>
                    <p className="font-medium">
                      {requestedAt ? new Date(requestedAt).toLocaleTimeString() : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Rider Phone */}
                {riderPhone && riderPhone !== "No phone" && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Contact</p>
                      <p className="font-medium">{riderPhone}</p>
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
                    <DialogContent className="bg-white text-gray-900 dark:bg-slate-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700">
                      <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-slate-100">
                          Confirm Ride Acceptance
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-slate-300">
                          Are you sure you want to accept this ride from {riderName}?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="bg-gray-50 text-gray-800 dark:bg-slate-800 dark:text-slate-100 p-4 rounded-lg space-y-2 border border-gray-200 dark:border-slate-700">
                          <p>
                            <span className="text-gray-500 dark:text-slate-400">Pickup:</span>{" "}
                            {pickup?.address || "N/A"}
                          </p>
                          <p>
                            <span className="text-gray-500 dark:text-slate-400">Dropoff:</span>{" "}
                            {dropoff?.address || "N/A"}
                          </p>
                          <p>
                            <span className="text-gray-500 dark:text-slate-400">Fare:</span> ${fareValue}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                          >
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
          );
          })}
        </div>
      )}
    </div>
  );
}
