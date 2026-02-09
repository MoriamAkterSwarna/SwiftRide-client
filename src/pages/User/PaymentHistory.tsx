/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { useGetPaymentHistoryQuery } from "@/redux/features/payment/payment.api";
import {
  DollarSign,
  Search,
  Filter,
  ChevronDown,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText,
  Calendar,
  CreditCard,
  Download,
  TrendingUp,
  Receipt,
  Wallet,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

interface Payment {
  _id: string;
  transactionId: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  ride?: {
    _id: string;
    title: string;
    cost: number;
    availableSeats: number;
  };
  booking?: any;
  invoiceUrl?: string;
}

const statusConfig = {
  PAID: {
    color: "bg-green-100 dark:bg-green-900/30",
    textColor: "text-green-800 dark:text-green-400",
    label: "Paid",
    icon: <CheckCircle className="w-4 h-4" />,
    badgeColor: "bg-green-500 dark:bg-green-400",
  },
  UNPAID: {
    color: "bg-yellow-100 dark:bg-yellow-900/30",
    textColor: "text-yellow-800 dark:text-yellow-400",
    label: "Unpaid",
    icon: <Clock className="w-4 h-4" />,
    badgeColor: "bg-yellow-500 dark:bg-yellow-400",
  },
  FAILED: {
    color: "bg-red-100 dark:bg-red-900/30",
    textColor: "text-red-800 dark:text-red-400",
    label: "Failed",
    icon: <AlertCircle className="w-4 h-4" />,
    badgeColor: "bg-red-500 dark:bg-red-400",
  },
  CANCELLED: {
    color: "bg-gray-100 dark:bg-gray-900/30",
    textColor: "text-gray-800 dark:text-gray-400",
    label: "Cancelled",
    icon: <XCircle className="w-4 h-4" />,
    badgeColor: "bg-gray-500 dark:bg-gray-400",
  },
  REFUNDED: {
    color: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-800 dark:text-blue-400",
    label: "Refunded",
    icon: <AlertCircle className="w-4 h-4" />,
    badgeColor: "bg-blue-500 dark:bg-blue-400",
  },
};

export default function PaymentHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "amount-high" | "amount-low">("recent");

  const { data, isLoading, error } = useGetPaymentHistoryQuery();

  console.log(data, "Payment History API response");

  // Process payments data
  const payments: Payment[] = useMemo(() => {
    if (!data) return [];

    try {
      let paymentArray: any[] = [];

      // Handle different response structures
      if (Array.isArray(data)) {
        paymentArray = data;
      } else if (data.data && Array.isArray(data.data)) {
        paymentArray = data.data;
      }

      return paymentArray
        .filter((item: any) => item && typeof item === "object")
        .map((item: any) => ({
          _id: item._id,
          transactionId: item.transactionId || "N/A",
          amount: Number(item.amount) || 0,
          status: item.status || "UNPAID",
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          ride: item.ride,
          booking: item.booking,
          invoiceUrl: item.invoiceUrl,
        }));
    } catch (err) {
      console.error("Error processing payment data:", err);
      return [];
    }
  }, [data]);

  // Filter and sort payments
  const processedPayments = useMemo(() => {
    let filtered = [...payments];

    // Apply status filter
    if (selectedStatus !== "ALL") {
      filtered = filtered.filter((payment) => payment.status === selectedStatus);
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (payment) =>
          payment.transactionId.toLowerCase().includes(search) ||
          payment.ride?.title.toLowerCase().includes(search)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "amount-high":
          return b.amount - a.amount;
        case "amount-low":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [payments, selectedStatus, searchTerm, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalTransactions = payments.length;
    const totalAmount = payments
      .filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + p.amount, 0);
    const successfulPayments = payments.filter((p) => p.status === "PAID").length;
    const pendingPayments = payments.filter((p) => p.status === "UNPAID").length;

    return {
      totalTransactions,
      totalAmount,
      successfulPayments,
      pendingPayments,
    };
  }, [payments]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-8 max-w-7xl">
        <div className="space-y-2">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
            <CardContent className="pt-12 pb-12">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30">
                  <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                    Unable to Load Payment History
                  </h3>
                  <p className="text-red-600 dark:text-red-400">
                    Please try again later or contact support if the problem persists.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto p-6 space-y-8 max-w-7xl">
        {/* Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                Payment History
              </h1>
              <p className="text-muted-foreground mt-1">
                Track and manage all your transactions in one place
              </p>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards with Enhanced Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-white/90">
                  Total Transactions
                </CardTitle>
                <div className="p-2 rounded-lg bg-white/20">
                  <Receipt className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalTransactions}</div>
                <p className="text-xs text-white/80 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  All time records
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-white/90">
                  Total Spent
                </CardTitle>
                <div className="p-2 rounded-lg bg-white/20">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(stats.totalAmount)}</div>
                <p className="text-xs text-white/80 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Successful payments
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-white/90">
                  Successful
                </CardTitle>
                <div className="p-2 rounded-lg bg-white/20">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.successfulPayments}</div>
                <p className="text-xs text-white/80 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Completed payments
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-white/90">
                  Pending
                </CardTitle>
                <div className="p-2 rounded-lg bg-white/20">
                  <Clock className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.pendingPayments}</div>
                <p className="text-xs text-white/80 mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Awaiting payment
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-xl">Transaction History</CardTitle>
                  <CardDescription className="mt-1">
                    Filter and search through your payment records
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="w-fit">
                  {processedPayments.length} Results
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-blue-500 transition-colors" />
                  <Input
                    type="text"
                    placeholder="Search by transaction ID or ride title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 border-2 focus:border-blue-500 transition-all rounded-xl"
                  />
                </div>

                {/* Status Filter */}
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full lg:w-48 h-12 border-2 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <SelectValue placeholder="Filter by status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="PAID">✓ Paid</SelectItem>
                    <SelectItem value="UNPAID">⏱ Unpaid</SelectItem>
                    <SelectItem value="FAILED">✗ Failed</SelectItem>
                    <SelectItem value="CANCELLED">⊗ Cancelled</SelectItem>
                    <SelectItem value="REFUNDED">↩ Refunded</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-full lg:w-52 h-12 border-2 rounded-xl">
                    <div className="flex items-center gap-2">
                      <ChevronDown className="w-4 h-4" />
                      <SelectValue placeholder="Sort by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">📅 Most Recent</SelectItem>
                    <SelectItem value="oldest">📅 Oldest First</SelectItem>
                    <SelectItem value="amount-high">💰 Amount: High to Low</SelectItem>
                    <SelectItem value="amount-low">💰 Amount: Low to High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="mb-6" />

              {/* Transactions List */}
              {processedPayments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="inline-flex p-6 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
                    <FileText className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">No Transactions Found</h3>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    {searchTerm || selectedStatus !== "ALL"
                      ? "Try adjusting your filters to see more results"
                      : "You haven't made any transactions yet. Start booking rides to see your payment history here."}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {processedPayments.map((payment, index) => {
                    const statusInfo = statusConfig[payment.status as keyof typeof statusConfig] || statusConfig.UNPAID;
                    
                    return (
                      <motion.div
                        key={payment._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800 overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600" />
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                              {/* Left Section - Main Info */}
                              <div className="flex-1 space-y-4">
                                <div className="flex items-start justify-between flex-wrap gap-3">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-800">
                                        <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                      </div>
                                      <span className="font-mono text-base font-bold tracking-tight">
                                        {payment.transactionId}
                                      </span>
                                    </div>
                                    {payment.ride && (
                                      <div className="flex items-center gap-2 ml-1">
                                        <div className="w-1 h-1 rounded-full bg-gray-400" />
                                        <p className="text-sm text-muted-foreground font-medium">
                                          {payment.ride.title}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                  <Badge
                                    className={`${statusInfo.color} ${statusInfo.textColor} border-0 px-4 py-1.5 text-sm font-semibold shadow-md`}
                                  >
                                    <span className="flex items-center gap-2">
                                      {statusInfo.icon}
                                      {statusInfo.label}
                                    </span>
                                  </Badge>
                                </div>

                                <div className="flex flex-wrap gap-6 text-sm">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800">
                                      <Calendar className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">{formatDate(payment.createdAt)}</span>
                                  </div>
                                  {payment.ride && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800">
                                        <FileText className="w-4 h-4" />
                                      </div>
                                      <span className="font-medium">
                                        {payment.ride.availableSeats} {payment.ride.availableSeats === 1 ? 'Seat' : 'Seats'}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Right Section - Amount & Actions */}
                              <div className="flex flex-col items-end gap-4 lg:min-w-[200px]">
                                <div className="text-right space-y-1">
                                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {formatCurrency(payment.amount)}
                                  </p>
                                  {payment.ride && (
                                    <p className="text-xs text-muted-foreground font-medium">
                                      ৳{payment.ride.cost} × {payment.ride.availableSeats} seat{payment.ride.availableSeats !== 1 ? 's' : ''}
                                    </p>
                                  )}
                                </div>

                                {payment.status === "PAID" && payment.invoiceUrl && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(payment.invoiceUrl, "_blank")}
                                    className="group/btn hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300 font-semibold"
                                  >
                                    <Download className="w-4 h-4 mr-2 group-hover/btn:animate-bounce" />
                                    Download Invoice
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>

  );
}
