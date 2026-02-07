/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import { useGetPendingDriverRequestsQuery, useApproveDriverMutation, useRejectDriverMutation } from "@/redux/features/user/user.api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, CheckCircle, XCircle, Loader2 } from "lucide-react";


export default function DriverRequests() {
  const hasSessionHint = useSelector((state: any) => state.authSession.hasSession);
  const { data, isLoading, refetch } = useGetPendingDriverRequestsQuery({}, { skip: !hasSessionHint });
  const [approveDriver, { isLoading: isApproving }] = useApproveDriverMutation();
  const [rejectDriver, { isLoading: isRejecting }] = useRejectDriverMutation();

  console.log(data, "Pending driver requests data");
  
  const handleApprove = async (id: string) => {
    try {
      await approveDriver(id).unwrap();
      toast.success("Driver approved successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to approve driver");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectDriver(id).unwrap();
      toast.success("Driver rejected successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reject driver");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const driverRequests = data?.data || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-6 w-6" />
            Pending Driver Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {driverRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending driver requests
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vehicle Type</TableHead>
                  <TableHead>Vehicle Model</TableHead>
                  <TableHead>Plate Number</TableHead>
                  <TableHead>License</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {driverRequests.map((driver: any) => (
                  <TableRow key={driver._id}>
                    <TableCell className="font-medium">
                      {driver.user?.name || "N/A"}
                    </TableCell>
                    <TableCell>{driver.user?.email || "N/A"}</TableCell>
                    <TableCell>{driver.vehicleType}</TableCell>
                    <TableCell>{driver.vehicleModel}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {driver.vehiclePlateNumber}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {driver.drivingLicense}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleApprove(driver._id)}
                          disabled={isApproving || isRejecting}
                          size="sm"
                          className="gap-1"
                        >
                          {isApproving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          Approve
                        </Button>
                        <Button 
                          onClick={() => handleReject(driver._id)} 
                          variant="destructive"
                          disabled={isApproving || isRejecting}
                          size="sm"
                          className="gap-1"
                        >
                          {isRejecting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}