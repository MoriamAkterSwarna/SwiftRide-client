/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { useCreateRideTypeMutation } from "@/redux/features/ride/ride.api";
import { toast } from "sonner";

const VEHICLE_TYPES = [
"Bike",
"Car",
];

const PLACE_TYPES = [
  "Private Place",
  "Public Place",
  "Inside City",
  "Outside City",
  "Airport",

];

export function AddRideTypeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    rideVehicle: "",
    placeType: "",
    totalGuest: "",
  });

  const [createRideType, { isLoading }] = useCreateRideTypeMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.rideVehicle.trim()) {
      toast.error("Vehicle type is required");
      return;
    }

    const toastId = toast.loading("Creating Ride Type...");
    
    try {
      // Prepare payload - only include fields that have values
      const payload: any = {
        rideVehicle: formData.rideVehicle.trim(),
      };

      if (formData.placeType.trim()) {
        payload.placeType = formData.placeType.trim();
      }

       if (formData.totalGuest) {
        const guestCount = parseInt(formData.totalGuest, 10);
        if (!isNaN(guestCount) && guestCount > 0) {
          payload.totalGuest = guestCount;
        }
      }
      
      console.log("Submitting payload:", payload);

      const res = await createRideType(payload).unwrap();
      
      console.log("Create response:", res);
      if (res?.success) {
        toast.success("Ride Type Created Successfully", { id: toastId });
        setIsOpen(false);
        setFormData({
          rideVehicle: "",
          placeType: "",
          totalGuest: "",
        });
      }
    } catch (error: any) {
      console.error("Create error:", error);
      toast.error(error?.data?.message || "Failed to create ride type", {
        id: toastId,
      });
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setFormData({
      rideVehicle: "",
      placeType: "",
      totalGuest: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Ride Type
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-3xl border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800">
            Add New Ride Type
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Create a new vehicle type for your ride service
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rideVehicle" className="text-slate-700">
              Vehicle Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.rideVehicle}
              onValueChange={(value) =>
                setFormData({ ...formData, rideVehicle: value })
              }
            >
              <SelectTrigger className="rounded-xl border-slate-200 w-full">
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_TYPES.map((vehicle) => (
                  <SelectItem key={vehicle} value={vehicle}>
                    {vehicle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="placeType" className="text-slate-700">
              Place Type
            </Label>
            <Select
              value={formData.placeType}
              onValueChange={(value) =>
                setFormData({ ...formData, placeType: value })
              }
            >
              <SelectTrigger className="rounded-xl border-slate-200 w-full">
                <SelectValue placeholder="Select place type" />
              </SelectTrigger>
              <SelectContent>
                {PLACE_TYPES.map((place) => (
                  <SelectItem key={place} value={place}>
                    {place}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalGuest" className="text-slate-700">
              Total Guests
            </Label>
            <Input
              id="totalGuest"
              type="number"
              placeholder="e.g., 4"
              value={formData.totalGuest}
              onChange={(e) =>
                setFormData({ ...formData, totalGuest: e.target.value })
              }
              className="rounded-xl border-slate-200"
              min="1"
              max="20"
            />
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Ride Type"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}