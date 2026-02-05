/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useGetRidesQuery } from "@/redux/features/ride/ride.api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Eye, Loader2, MapPin, Clock, DollarSign, User } from "lucide-react";

export default function RideManagement() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [selectedRide, setSelectedRide] = useState<any>(null);

  const { data: ridesData, isLoading } = useGetRidesQuery({
    page,
    limit,
    search: searchTerm || undefined,
    status: statusFilter === "ALL" ? undefined : statusFilter,
    date: dateFilter || undefined,
  });

  const rides = ridesData?.data || [];
  const totalRides = rides.length;
  const totalPages = Math.ceil(totalRides / limit);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "ONGOING":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
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
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="ONGOING">Ongoing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
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
                          {ride.rider?.name || "Unknown"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {ride.driver?.name || "Not Assigned"}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="truncate">
                            {ride.pickupLocation?.address ||
                              ride.from?.name ||
                              "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="truncate">
                            {ride.dropoffLocation?.address ||
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
                          {ride.status}
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedRide(ride)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Ride Details</DialogTitle>
                              <DialogDescription>
                                Complete information about the ride
                              </DialogDescription>
                            </DialogHeader>

                            {selectedRide && (
                              <div className="space-y-6">
                                {/* Rider & Driver Info */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h3 className="font-semibold mb-2">
                                      Rider Information
                                    </h3>
                                    <div className="space-y-1 text-sm">
                                      <p>
                                        <span className="text-muted-foreground">
                                          Name:
                                        </span>{" "}
                                        {selectedRide.rider?.name || "N/A"}
                                      </p>
                                      <p>
                                        <span className="text-muted-foreground">
                                          Email:
                                        </span>{" "}
                                        {selectedRide.rider?.email || "N/A"}
                                      </p>
                                      <p>
                                        <span className="text-muted-foreground">
                                          Phone:
                                        </span>{" "}
                                        {selectedRide.rider?.phone || "N/A"}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="font-semibold mb-2">
                                      Driver Information
                                    </h3>
                                    <div className="space-y-1 text-sm">
                                      <p>
                                        <span className="text-muted-foreground">
                                          Name:
                                        </span>{" "}
                                        {selectedRide.driver?.name || "N/A"}
                                      </p>
                                      <p>
                                        <span className="text-muted-foreground">
                                          Email:
                                        </span>{" "}
                                        {selectedRide.driver?.email || "N/A"}
                                      </p>
                                      <p>
                                        <span className="text-muted-foreground">
                                          Rating:
                                        </span>{" "}
                                        {selectedRide.driver?.rating || "N/A"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Location Info */}
                                <div>
                                  <h3 className="font-semibold mb-2">
                                    Route Information
                                  </h3>
                                  <div className="space-y-2 text-sm">
                                    <p>
                                      <span className="text-muted-foreground">
                                        Pickup:
                                      </span>{" "}
                                      {selectedRide.pickupLocation?.address ||
                                        selectedRide.from?.name ||
                                        "N/A"}
                                    </p>
                                    <p>
                                      <span className="text-muted-foreground">
                                        Dropoff:
                                      </span>{" "}
                                      {selectedRide.dropoffLocation?.address ||
                                        selectedRide.to?.name ||
                                        "N/A"}
                                    </p>
                                  </div>
                                </div>

                                {/* Ride Details */}
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      Fare
                                    </p>
                                    <p className="text-lg font-semibold">
                                      ${selectedRide.fare || selectedRide.price}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      Status
                                    </p>
                                    <p className="text-lg font-semibold">
                                      {selectedRide.status}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      Date
                                    </p>
                                    <p className="text-lg font-semibold">
                                      {new Date(
                                        selectedRide.createdAt
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
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
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
