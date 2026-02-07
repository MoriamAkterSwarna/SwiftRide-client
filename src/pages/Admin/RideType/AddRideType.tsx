/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Search, Car, Package, Loader2, Edit, MapPin, Users } from "lucide-react";

import {
  useDeleteRideTypeMutation,
  useGetRideTypesQuery,
  useUpdateRideTypeMutation,
} from "@/redux/features/ride/ride.api";
import { AddRideTypeModal } from "./AddRideTypeModal";
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { toast } from "sonner";

const AddRideType = () => {
  const hasSessionHint = useSelector((state: any) => state.authSession.hasSession);
  const { data, isLoading } = useGetRideTypesQuery(undefined, { skip: !hasSessionHint });
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedRideType, setSelectedRideType] = useState<any>(null);
  const [updateForm, setUpdateForm] = useState({
    rideVehicle: "",
    placeType: "",
    totalGuest: "",
  });

  const [deleteRideType, { isLoading: isDeleting }] = useDeleteRideTypeMutation();
  const [updateRideType, { isLoading: isUpdating }] = useUpdateRideTypeMutation();

  const rideTypes = data?.data || [];

  // Filter ride types based on search
  const filteredRideTypes = rideTypes.filter((rideType: any) =>
    rideType.rideVehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (rideType.placeType && rideType.placeType.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRemoveRideType = async (id: string) => {
    const toastId = toast.loading("Deleting Ride Type...");
    try {
      const res = await deleteRideType(id).unwrap();
      if (res?.success) {
        toast.success("Ride Type Deleted Successfully", { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete ride type", {
        id: toastId,
      });
    }
  };

  const openUpdateModal = (rideType: any) => {
    setSelectedRideType(rideType);
    setUpdateForm({
      rideVehicle: rideType.rideVehicle,
      placeType: rideType.placeType || "",
      totalGuest: rideType.totalGuest?.toString() || "",
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRideType) return;

    if (!updateForm.rideVehicle.trim()) {
      toast.error("Vehicle type name is required");
      return;
    }

    const toastId = toast.loading("Updating Ride Type...");
    try {
      const res = await updateRideType({
        id: selectedRideType._id,
        data: {
          rideVehicle: updateForm.rideVehicle.trim(),
          placeType: updateForm.placeType.trim(),
          totalGuest: updateForm.totalGuest ? parseInt(updateForm.totalGuest) : undefined,
        },
      }).unwrap();

      if (res?.success) {
        toast.success("Ride Type Updated Successfully", { id: toastId });
        setIsUpdateModalOpen(false);
        setSelectedRideType(null);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update ride type", {
        id: toastId,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  } 

  console.log("Ride Types:", filteredRideTypes);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ride Type Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage vehicle types and configurations for your ride service
        </p>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ride Types</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rideTypes.length}</div>
            <p className="text-xs text-muted-foreground">
              Active vehicle configurations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicle Categories</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rideTypes.length}</div>
            <p className="text-xs text-muted-foreground">
              Available for riders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rideTypes.reduce((sum: number, rt: any) => sum + (rt.totalGuest || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Combined guest capacity
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Add */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Actions</CardTitle>
          <CardDescription>Find ride types or create new ones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by vehicle type or place..."
                className="pl-10 rounded-xl border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <AddRideTypeModal />
          </div>
        </CardContent>
      </Card>

      {/* Ride Types Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ride Types</CardTitle>
          <CardDescription>
            Showing {filteredRideTypes.length} ride type{filteredRideTypes.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">#</TableHead>
                  <TableHead>Vehicle Type</TableHead>
                  <TableHead>Place Type</TableHead>
                  <TableHead>Total Guests</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRideTypes.length > 0 ? (
                  filteredRideTypes.map((item: any, index: number) => (
                    <TableRow key={item?._id}>
                      <TableCell className="font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="text-base">{item?.rideVehicle}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-green-600" />
                          <span>{item?.placeType || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-purple-600" />
                          <span>
      {item?.totalGuest !== undefined && item?.totalGuest !== null 
        ? item.totalGuest 
        : "N/A"}
    </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openUpdateModal(item)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <DeleteConfirmation
                            onConfirm={() => handleRemoveRideType(item?._id)}
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={isDeleting}
                              className="hover:bg-red-50 hover:text-red-600"
                            >
                              {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </DeleteConfirmation>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Car className="h-12 w-12 mb-2 opacity-20" />
                        <p>No ride types found</p>
                        {searchTerm && (
                          <p className="text-sm">
                            Try adjusting your search terms
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Update Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="max-w-md rounded-3xl border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800">
              Update Ride Type
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Modify the vehicle type details
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="update-rideVehicle" className="text-slate-700">
                Vehicle Type <span className="text-red-500">*</span>
              </Label>
              <Input
                id="update-rideVehicle"
                placeholder="e.g., SUV, Sedan, Hatchback"
                value={updateForm.rideVehicle}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, rideVehicle: e.target.value })
                }
                className="rounded-xl border-slate-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="update-placeType" className="text-slate-700">
                Place Type
              </Label>
              <Input
                id="update-placeType"
                placeholder="e.g., City, Airport, Intercity"
                value={updateForm.placeType}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, placeType: e.target.value })
                }
                className="rounded-xl border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="update-totalGuest" className="text-slate-700">
                Total Guests
              </Label>
              <Input
                id="update-totalGuest"
                type="number"
                placeholder="e.g., 4"
                value={updateForm.totalGuest}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, totalGuest: e.target.value })
                }
                className="rounded-xl border-slate-200"
                min="1"
              />
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsUpdateModalOpen(false);
                  setSelectedRideType(null);
                }}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Ride Type"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddRideType;