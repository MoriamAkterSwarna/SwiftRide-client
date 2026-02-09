/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useGetAllPaymentsQuery } from "@/redux/features/payment/payment.api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Loader2, Search } from "lucide-react";

interface Payment {
  _id: string;
  transactionId: string;
  amount: number;
  status: string;
  createdAt: string;
  ride?: {
    _id: string;
    title?: string;
  };
  user?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  booking?: {
    user?: {
      name?: string;
      email?: string;
      phone?: string;
    };
  };
  rider?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

const statusClassMap: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  UNPAID: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  FAILED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  CANCELLED: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
  REFUNDED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const { data, isLoading } = useGetAllPaymentsQuery();

  const payments: Payment[] = useMemo(() => {
    if (!data) return [];

    const array = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

    return array
      .filter((item: any) => item && typeof item === "object")
      .map((item: any) => ({
        _id: item._id,
        transactionId: item.transactionId || "N/A",
        amount: Number(item.amount) || 0,
        status: (item.status || "UNPAID").toUpperCase(),
        createdAt: item.createdAt,
        ride: item.ride,
        user: item.user,
        booking: item.booking,
        rider: item.user || item.booking?.user || item.ride?.user || item.rider,
      }));
  }, [data]);

  const filteredPayments = useMemo(() => {
    let result = [...payments];

    if (statusFilter !== "ALL") {
      result = result.filter((payment) => payment.status === statusFilter);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter((payment) => {
        const rideTitle = payment.ride?.title?.toLowerCase() || "";
        const userName = payment.rider?.name?.toLowerCase() || payment.user?.name?.toLowerCase() || "";
        return (
          payment.transactionId.toLowerCase().includes(q) ||
          rideTitle.includes(q) ||
          userName.includes(q)
        );
      });
    }

    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }, [payments, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const totalTransactions = payments.length;
    const totalAmount = payments
      .filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + p.amount, 0);
    const paidCount = payments.filter((p) => p.status === "PAID").length;
    const unpaidCount = payments.filter((p) => p.status === "UNPAID").length;

    return { totalTransactions, totalAmount, paidCount, unpaidCount };
  }, [payments]);

  const formatCurrency = (amount: number) => `৳${amount.toFixed(2)}`;

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
        <h1 className="text-3xl font-bold">Payments & Transactions</h1>
        <p className="text-muted-foreground mt-2">
          Review all payment activity across the platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paidCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unpaid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unpaidCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find payments by transaction ID, ride, or user</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transaction, ride, or user..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="UNPAID">Unpaid</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
              }}
            >
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Showing {filteredPayments.length} of {payments.length} payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ride</TableHead>
                  <TableHead>Rider</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell className="font-medium">{payment.transactionId}</TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>
                        <Badge className={statusClassMap[payment.status] || "bg-slate-100 text-slate-800"}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.ride?.title || "N/A"}</TableCell>
                      <TableCell>{payment.rider?.name || payment.user?.name || "N/A"}</TableCell>
                      <TableCell>{payment.rider?.email || payment.user?.email || "N/A"}</TableCell>
                      <TableCell>{payment.rider?.phone || payment.user?.phone || "N/A"}</TableCell>
                      <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-6">
                      No payments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
