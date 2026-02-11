/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import {  useUpdateRideStatusMutation, useAssignDriverMutation, rideApi, useGetRidesQuery } from "@/redux/features/ride/ride.api";
import { useGetAllDriversQuery } from "@/redux/features/user/user.api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Eye, Loader2, MapPin, Clock, DollarSign, User, Car } from "lucide-react";

export default function RideManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const hasSessionHint = useSelector((state: any) => state.authSession.hasSession);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);





  const { data: ridesData, isLoading, refetch: refetchRides } = useGetRidesQuery({})

  console.log("📊 Rides data received:", ridesData);

  const { data: driversData, isLoading: driversLoading } = useGetAllDriversQuery(
    {
      page: 1,
      limit: 100,
      status: "approved", // Get all drivers instead of filtering by status
    },
    { skip: !hasSessionHint }
  );
  const [updateRideStatus, { isLoading: statusUpdating }] = useUpdateRideStatusMutation();
  const [assignDriver, { isLoading: driverAssigning }] = useAssignDriverMutation();

  const rides = ridesData?.data || [];
  const totalRides = rides.length;
  const totalPages = Math.ceil(totalRides / limit);
  
  // Handle different driver data structures from API
  const drivers = driversData?.data?.drivers || driversData?.data || [];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const openRideModal = (ride: any) => {
    setSelectedRide(ride);
    setSelectedStatus(ride.status?.toLowerCase() || "");
    
    // Extract driver ID with proper handling for different data structures
    let driverId = "";
    if (ride.driver) {
      if (typeof ride.driver === 'string') {
        driverId = ride.driver;
      } else if (ride.driver?._id) {
        driverId = ride.driver._id;
      } else if (ride.driver?.user?._id) {
        driverId = ride.driver.user._id;
      }
    }
    
    setSelectedDriver(driverId);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedRide?._id || !selectedStatus) {
      toast.error("Please select a status");
      return;
    }
    try {
      const result = await updateRideStatus({ id: selectedRide._id, status: selectedStatus }).unwrap();
      toast.success("Ride status updated successfully");
      
      // Update selectedRide with the full ride data from API response
      const updatedRide = result?.data || result;
      setSelectedRide(updatedRide);
      setSelectedStatus(updatedRide.status?.toLowerCase() || selectedStatus);
      
      // Update the rides table data in Redux cache
      const queryArgs = {
        page,
        limit,
        search: searchTerm || undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        date: dateFilter || undefined,
      };

      // Manually patch the getRideRequests cache with updated ride data
      dispatch(
        rideApi.util.updateQueryData("getRideRequests", queryArgs, (draft: any) => {
          if (draft && Array.isArray(draft.data)) {
            const rideIndex = draft.data.findIndex((r: any) => r._id === selectedRide._id);
            if (rideIndex !== -1) {
              draft.data[rideIndex] = updatedRide;
            }
          }
        })
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update ride status");
    }
  };

  const handleDriverAssignment = async () => {
    if (!selectedRide?._id || !selectedDriver) {
      toast.error("Please select a driver");
      return;
    }
    try {
      const result = await assignDriver({ rideId: selectedRide._id, driverId: selectedDriver }).unwrap();
      
      // Extract the updated ride from response
      let updatedRide = result?.data || result;
      
      // Find the full driver info from drivers list to enrich the ride data
      const selectedDriverObj = drivers.find((d: any) => d._id === selectedDriver || d.user?._id === selectedDriver);
      
      if (selectedDriverObj) {
        // If driver object in response is just an ID, replace with full driver info
        if (typeof updatedRide.driver === 'string' || !updatedRide.driver?.name) {
          updatedRide = {
            ...updatedRide,
            driver: selectedDriverObj
          };
        }
      }
      
      // Extract driver ID
      let assignedDriverId = selectedDriver;
      if (typeof updatedRide.driver === 'string') {
        assignedDriverId = updatedRide.driver;
      } else if (updatedRide.driver?._id) {
        assignedDriverId = updatedRide.driver._id;
      } else if (updatedRide.driver?.user?._id) {
        assignedDriverId = updatedRide.driver.user._id;
      }
      
      // Update local state immediately with enriched driver info
      setSelectedRide(updatedRide);
      setSelectedDriver(assignedDriverId);
      
      toast.success("Driver assigned successfully");
      
      // Invalidate the cache to force refetch
      dispatch(rideApi.util.invalidateTags(["RIDE"]));
      await refetchRides();
      
      // Close modal after successful update
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to assign driver");
    }
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_transit":
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "accepted":
        return "bg-purple-100 text-purple-800";
      case "picked_up":
        return "bg-indigo-100 text-indigo-800";
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
        <h1 className="text-3xl font-bold">Ride Management</h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage all rides on the platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find rides by location, date, or status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by rider or driver..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="requested">Requested</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="picked_up">Picked Up</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
                setDateFilter("");
                setPage(1);
              }}
            >
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rides List</CardTitle>
          <CardDescription>
            Showing {rides.length} of {totalRides} rides
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rider</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fare</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rides.length > 0 ? (
                  rides.map((ride: any) => (
                    <TableRow key={ride._id}>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          {ride.user?.name || "Unknown"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          // Check if driver exists and is not null/undefined
                          if (!ride.driver) return "Not Assigned";
                          
                          let driverName = null;
                          
                          // If driver is an object, try to get name
                          if (typeof ride.driver === 'object') {
                            driverName = ride.driver?.name || ride.driver?.user?.name;
                            // Only return if we actually found a name
                            if (driverName && driverName.trim() !== '') {
                              return driverName;
                            }
                          }
                          
                          // If driver is just an ID string, try to find in drivers list
                          if (typeof ride.driver === 'string' && ride.driver.trim() !== '') {
                            const driverInfo = drivers.find((d: any) => d._id === ride.driver || d.user?._id === ride.driver);
                            if (driverInfo) {
                              driverName = driverInfo?.name || driverInfo?.user?.name;
                              if (driverName && driverName.trim() !== '') {
                                return driverName;
                              }
                            }
                          }
                          
                          return "Not Assigned";
                        })()}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="truncate">
                            {ride?.pickUpLocation?.address ||
                              ride.from?.name ||
                              "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="truncate">
                            {ride?.dropOffLocation?.address ||
                              ride.to?.name ||
                              "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                            ride.status
                          )}`}
                        >
                          {ride.status?.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center font-semibold">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {ride.fare || ride.price || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground shrink-0" />
                          {new Date(ride.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openRideModal(ride)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No rides found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Page {page} of {totalPages} • {totalRides} total rides
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="rounded-xl border-slate-200 hover:bg-slate-50"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 border-slate-900"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Ride Details Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-sm md:max-w-2xl lg:max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border-slate-200 p-4 md:p-6">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b border-slate-100 mb-4">
            <DialogTitle className="text-lg md:text-2xl font-bold text-slate-800">Ride Details</DialogTitle>
            <DialogDescription className="text-xs md:text-sm text-slate-600">
              Complete information about the ride
            </DialogDescription>
          </DialogHeader>

          {selectedRide && (
            <div className="space-y-6 px-2">
              {/* Rider & Driver Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 md:p-5 border border-blue-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm md:text-base">Rider Info</h3>
                  </div>
                  <div className="space-y-2 text-xs md:text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Name:</span>
                      <span className="font-medium text-slate-800 text-right">{selectedRide.user?.name || selectedRide.rider?.name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Email:</span>
                      <span className="font-medium text-slate-800 text-right truncate">{selectedRide.user?.email || selectedRide.rider?.email || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Phone:</span>
                      <span className="font-medium text-slate-800">{selectedRide.user?.phone || selectedRide.rider?.phone || "N/A"}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-linear-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 md:p-5 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
                      <Car className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm md:text-base">Driver Info</h3>
                  </div>
                  <div className="space-y-2 text-xs md:text-sm">
                    {(() => {
                      // Check if driver exists and has valid data
                      if (!selectedRide.driver) {
                        return (
                          <>
                            <p>
                              <span className="text-muted-foreground">Name:</span>{" "}
                              <span className="font-medium text-slate-800">Not Assigned</span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">Email:</span>{" "}
                              <span className="font-medium text-slate-800">N/A</span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">Phone:</span>{" "}
                              <span className="font-medium text-slate-800">N/A</span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">Rating:</span>{" "}
                              <span className="font-medium text-slate-800">N/A</span>
                            </p>
                          </>
                        );
                      }
                      
                      // Get driver info
                      let driverInfo = null;
                      
                      // If driver is an object with data
                      if (typeof selectedRide.driver === 'object') {
                        driverInfo = selectedRide.driver;
                      }
                      
                      // If driver is just an ID string, find from drivers list
                      if (typeof selectedRide.driver === 'string' && selectedRide.driver.trim() !== '') {
                        driverInfo = drivers.find((d: any) => d._id === selectedRide.driver || d.user?._id === selectedRide.driver);
                      }
                      
                      // Check if we have valid driver info with name
                      const driverName = driverInfo?.name || driverInfo?.user?.name;
                      
                      // If no valid driver name found, show Not Assigned
                      if (!driverName || driverName.trim() === '') {
                        return (
                          <>
                            <p>
                              <span className="text-muted-foreground">Name:</span>{" "}
                              <span className="font-medium text-slate-800">Not Assigned</span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">Email:</span>{" "}
                              <span className="font-medium text-slate-800">N/A</span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">Phone:</span>{" "}
                              <span className="font-medium text-slate-800">N/A</span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">Rating:</span>{" "}
                              <span className="font-medium text-slate-800">N/A</span>
                            </p>
                          </>
                        );
                      }
                      
                      // Extract driver details
                      const driverEmail = driverInfo?.email || driverInfo?.user?.email;
                      const driverPhone = driverInfo?.phone || driverInfo?.user?.phone;
                      const driverRating = driverInfo?.rating;
                      
                      return (
                        <>
                          <p>
                            <span className="text-muted-foreground">Name:</span>{" "}
                            <span className="font-medium text-slate-800">
                              {driverName || "Not Assigned"}
                            </span>
                          </p>
                          <p>
                            <span className="text-muted-foreground">Email:</span>{" "}
                            <span className="font-medium text-slate-800 break-all">
                              {driverEmail || "N/A"}
                            </span>
                          </p>
                          <p>
                            <span className="text-muted-foreground">Phone:</span>{" "}
                            <span className="font-medium text-slate-800">
                              {driverPhone || "N/A"}
                            </span>
                          </p>
                          <p>
                            <span className="text-muted-foreground">Rating:</span>{" "}
                            <span className="font-medium text-slate-800">
                              {driverRating ? `${driverRating} ⭐` : "N/A"}
                            </span>
                          </p>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl p-4 md:p-5 border border-purple-100">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-purple-600 shrink-0" />
                  <h3 className="font-semibold text-slate-800 text-sm md:text-base">Route Information</h3>
                </div>
                <div className="space-y-3 text-xs md:text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0">A</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-600 mb-1">Pickup Location</p>
                      <p className="font-medium text-slate-800 wrap-break-word">
                        {selectedRide.pickUpLocation?.address || selectedRide.pickupLocation?.address || selectedRide.from?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">B</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-600 mb-1">Dropoff Location</p>
                      <p className="font-medium text-slate-800 wrap-break-word">
                        {selectedRide.dropOffLocation?.address || selectedRide.dropoffLocation?.address || selectedRide.to?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ride Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">Fare Amount</p>
                  <p className="text-xl md:text-2xl font-bold text-emerald-600">
                    ${selectedRide.fare || selectedRide.cost}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">Status</p>
                  <p className="text-base md:text-lg font-semibold text-slate-800 capitalize">
                    {selectedRide.status?.replace(/_/g, ' ')}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">Date</p>
                  <p className="text-base md:text-lg font-semibold text-slate-800">
                    {new Date(selectedRide.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Status Update Section */}
              <div className="space-y-4 border-t border-slate-200 pt-6">
                <h3 className="font-semibold text-slate-800 text-sm md:text-base">Manage Ride</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700">
                      Update Status
                    </label>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger className="rounded-xl border-slate-200">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="requested">Requested</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="picked_up">Picked Up</SelectItem>
                        <SelectItem value="in_transit">In Transit</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleStatusUpdate}
                      disabled={statusUpdating || selectedStatus?.toLowerCase() === selectedRide.status?.toLowerCase()}
                      className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      {statusUpdating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Status"
                      )}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700">
                      Assign Driver
                    </label>
                    <Select
                      value={selectedDriver}
                      onValueChange={setSelectedDriver}
                      disabled={driversLoading || !drivers.length}
                    >
                      <SelectTrigger className="rounded-xl border-slate-200">
                        <SelectValue placeholder={
                          driversLoading 
                            ? "Loading drivers..." 
                            : drivers.length === 0 
                              ? "No drivers available" 
                              : "Select driver"
                        }>
                          {selectedDriver && drivers.length > 0 ? (() => {
                            const driver = drivers.find((d: any) => d.user?._id === selectedDriver);
                            const driverName = driver?.name || driver?.user?.name || selectedRide?.driver?.name;
                            const driverEmail = driver?.email || driver?.user?.email || selectedRide?.driver?.email;
                            return driverName ? `${driverName}${driverEmail ? ` - ${driverEmail}` : ''}` : null;
                          })() : null}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.length > 0 ? (
                          drivers.map((driver: any) => {
                            const driverName = driver.name || driver.user?.name || 'Unknown Driver';
                            const driverEmail = driver.email || driver.user?.email || '';
                            const driverUserId = driver.user?._id || driver._id;
                            return (
                              <SelectItem key={driver._id} value={driverUserId}>
                                {driverName} {driverEmail && `- ${driverEmail}`}
                              </SelectItem>
                            );
                          })
                        ) : (
                          <div className="p-2 text-sm text-slate-500">
                            No drivers found
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleDriverAssignment}
                      disabled={driverAssigning || !selectedDriver || driversLoading}
                      className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                      size="sm"
                    >
                      {driverAssigning ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Assigning...
                        </>
                      ) : (
                        "Assign Driver"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
