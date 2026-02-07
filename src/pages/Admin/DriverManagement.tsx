/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useAppSelector } from "@/redux/hook";
import { useGetAllDriversQuery, useApproveDriverMutation, useSuspendDriverMutation } from "@/redux/features/user/user.api";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, CheckCircle, XCircle, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function DriverManagement() {
  const hasSessionHint = useAppSelector((state) => state.authSession.hasSession);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const { data: driversData, isLoading, refetch } = useGetAllDriversQuery(
    {
      page,
      limit,
      search: searchTerm || undefined,
      status: statusFilter === "ALL" ? undefined : statusFilter,
    },
    { skip: !hasSessionHint }
  );

  console.log("Drivers Response:", driversData);
  console.log("Drivers Data:", driversData?.data[0]);

  const [approveDriver, { isLoading: approveLoading }] = useApproveDriverMutation();
  const [suspendDriver, { isLoading: suspendLoading }] = useSuspendDriverMutation();

  const drivers = driversData?.data|| [];
  const totalDrivers = driversData?.meta?.total || 0;
  const totalPages = Math.ceil(totalDrivers / limit);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleApproveDriver = async (driverId: string) => {
    try {
      await approveDriver(driverId).unwrap();
      toast.success("Driver approved successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to approve driver");
    }
  };

  const handleSuspendDriver = async (driverId: string) => {
    try {
      await suspendDriver(driverId).unwrap();
      toast.success("Driver suspended successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to suspend driver");
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
        <h1 className="text-3xl font-bold">Driver Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all drivers on the platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find drivers by name, email, or approval status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
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
          <CardTitle>Drivers List</CardTitle>
          <CardDescription>
            Showing {drivers.length} of {totalDrivers} drivers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.length > 0 ? (
                  drivers.map((driver: any) => (
                    <TableRow key={driver._id}>
                      <TableCell className="font-medium">{driver.user?.name || "N/A"}</TableCell>
                      <TableCell>{driver.user?.email || "N/A"}</TableCell>
                      <TableCell>
                        {driver.vehicleType} - {driver.vehicleModel} ({driver.vehiclePlateNumber})
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            driver.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : driver.status === "suspended"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {driver.status || "pending"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          {driver.rating ? driver.rating.toFixed(1) : "0.0"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(driver.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {driver.status === "pending" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="default"
                                  disabled={approveLoading}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogTitle>Approve Driver</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to approve {driver.user?.name} as a
                                  driver? They will be able to accept ride requests.
                                </AlertDialogDescription>
                                <div className="flex justify-end gap-4">
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleApproveDriver(driver._id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Approve Driver
                                  </AlertDialogAction>
                                </div>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}

                          {driver.status === "approved" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={suspendLoading}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Suspend
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogTitle>Suspend Driver</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to suspend {driver.user?.name}?
                                  They will not be able to accept new rides.
                                </AlertDialogDescription>
                                <div className="flex justify-end gap-4">
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleSuspendDriver(driver._id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Suspend Driver
                                  </AlertDialogAction>
                                </div>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No drivers found
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
