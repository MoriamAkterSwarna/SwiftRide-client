/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { useUpdateRideMutation } from "@/redux/features/ride/ride.api";
import LocationPickerMap from "@/components/modules/maps/LocationPickerMap";
import type { LocationPoint, LocationTarget } from "@/redux/features/location/locationSlice";

interface EditRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: {
    _id?: string;
    id?: string;
    title: string;
    description?: string;
    cost: number;
    availableSeats: number;
    pickUpTime: string;
    dropOffTime: string;
    pickUpLocation?: {
      address: string;
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    };
    dropOffLocation?: {
      address: string;
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    };
    user: string | any; // Can be string ID or populated user object
  };
  onSuccess?: () => void;
}

export default function EditRideModal({
  isOpen,
  onClose,
  ride,
  onSuccess,
}: EditRideModalProps) {
  const [updateRide, { isLoading: isUpdating }] = useUpdateRideMutation();

  // Initialize form state directly from ride prop
  const [editForm, setEditForm] = useState({
    title: ride.title,
    description: ride.description || "",
    cost: ride.cost,
    availableSeats: ride.availableSeats,
    pickUpTime: ride.pickUpTime,
    dropOffTime: ride.dropOffTime,
  });

  // Location state
  const [pickup, setPickup] = useState<LocationPoint | null>(
    ride.pickUpLocation
      ? {
          address: ride.pickUpLocation.address,
          latitude: ride.pickUpLocation.coordinates?.latitude || 0,
          longitude: ride.pickUpLocation.coordinates?.longitude || 0,
        }
      : null
  );
  const [dropoff, setDropoff] = useState<LocationPoint | null>(
    ride.dropOffLocation
      ? {
          address: ride.dropOffLocation.address,
          latitude: ride.dropOffLocation.coordinates?.latitude || 0,
          longitude: ride.dropOffLocation.coordinates?.longitude || 0,
        }
      : null
  );
  const [activeTarget, setActiveTarget] = useState<LocationTarget>("pickup");

  // Handle location selection from map
  const handleLocationSelect = (location: LocationPoint) => {
    if (activeTarget === "pickup") {
      setPickup(location);
    } else {
      setDropoff(location);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate locations
    if (!pickup || !dropoff) {
      toast.error("Please select both pickup and dropoff locations");
      return;
    }

    try {
      // Extract user ID if user is an object (populated)
      const userId = typeof ride.user === 'object' && ride.user !== null 
        ? (ride.user as any)._id || (ride.user as any).id 
        : ride.user;

      const updatePayload = {
        ...editForm,
        pickUpLocation: {
          address: pickup.address,
          coordinates: {
            latitude: pickup.latitude,
            longitude: pickup.longitude,
          },
        },
        dropOffLocation: {
          address: dropoff.address,
          coordinates: {
            latitude: dropoff.latitude,
            longitude: dropoff.longitude,
          },
        },
        user: userId,
      };

      await updateRide({
        id: ride._id || ride.id || "",
        data: updatePayload,
      }).unwrap();
      
      toast.success("Ride updated successfully!");
      onClose();
      onSuccess?.();
    } catch (error: any) {
      console.error("Failed to update ride:", error);
      const errorMessage = error?.data?.message || error?.message || "Failed to update ride. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Ride Details
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Update your ride information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <Input
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
              placeholder="Enter ride title"
              required
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <Textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              placeholder="Enter ride description"
              rows={3}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            />
          </div>

          {/* Location Selection */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Pickup & Dropoff Locations
            </label>
            
            {/* Location Toggle Buttons */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setActiveTarget("pickup")}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  activeTarget === "pickup"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <MapPin className="inline mr-2" size={16} />
                Pickup Location
              </button>
              <button
                type="button"
                onClick={() => setActiveTarget("dropoff")}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  activeTarget === "dropoff"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <MapPin className="inline mr-2" size={16} />
                Dropoff Location
              </button>
            </div>

            {/* Map Component */}
            <div className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
              <LocationPickerMap
                pickup={pickup}
                dropoff={dropoff}
                activeTarget={activeTarget}
                onSelect={handleLocationSelect}
              />
            </div>

            {/* Selected Locations Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-3 border border-green-200 dark:border-green-800">
                <p className="font-semibold text-green-900 dark:text-green-300 mb-1">📍 Pickup</p>
                <p className="text-green-700 dark:text-green-400 text-xs">
                  {pickup?.address || "Not selected"}
                </p>
                {pickup && (
                  <p className="text-green-600 dark:text-green-500 text-xs mt-1">
                    {pickup.latitude.toFixed(4)}, {pickup.longitude.toFixed(4)}
                  </p>
                )}
              </div>
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 border border-blue-200 dark:border-blue-800">
                <p className="font-semibold text-blue-900 dark:text-blue-300 mb-1">🎯 Dropoff</p>
                <p className="text-blue-700 dark:text-blue-400 text-xs">
                  {dropoff?.address || "Not selected"}
                </p>
                {dropoff && (
                  <p className="text-blue-600 dark:text-blue-500 text-xs mt-1">
                    {dropoff.latitude.toFixed(4)}, {dropoff.longitude.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Cost per Seat (৳)
              </label>
              <Input
                type="number"
                value={editForm.cost}
                onChange={(e) =>
                  setEditForm({ ...editForm, cost: Number(e.target.value) })
                }
                placeholder="0"
                min="0"
                required
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Available Seats
              </label>
              <Input
                type="number"
                value={editForm.availableSeats}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    availableSeats: Number(e.target.value),
                  })
                }
                placeholder="0"
                min="1"
                required
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Pickup Time
              </label>
              <Input
                type="datetime-local"
                value={
                  editForm.pickUpTime
                    ? new Date(editForm.pickUpTime)
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setEditForm({ ...editForm, pickUpTime: e.target.value })
                }
                required
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Dropoff Time
              </label>
              <Input
                type="datetime-local"
                value={
                  editForm.dropOffTime
                    ? new Date(editForm.dropOffTime)
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setEditForm({ ...editForm, dropOffTime: e.target.value })
                }
                required
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUpdating}
              className="border-gray-300 dark:border-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isUpdating ? "Updating..." : "Update Ride"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
