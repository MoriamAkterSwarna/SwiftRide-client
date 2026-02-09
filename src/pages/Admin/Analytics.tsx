/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import { useTheme } from "@/hooks/useTheme";
import {
  useGetDriverStatsQuery,
  useGetPaymentStatsQuery,
  useGetRevenueAnalyticsQuery,
  useGetRideRequestStatsQuery,
  useGetRideStatsQuery,
} from "@/redux/features/ride/ride.api";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ComposedChart
} from "recharts";
import { 
  ArrowUp,
  MoreHorizontal
} from "lucide-react";


const Analytics = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const hasSessionHint = useSelector((state: any) => state.authSession.hasSession);
  
  const { data: rideStatsData, isLoading: rideLoading } = useGetRideStatsQuery(
    undefined,
    { skip: !hasSessionHint }
  );
  const { data: paymentStatsData, isLoading: paymentLoading } = useGetPaymentStatsQuery(
    undefined,
    { skip: !hasSessionHint }
  );
  const { data: driverStatsData, isLoading: driverLoading } = useGetDriverStatsQuery(
    undefined,
    { skip: !hasSessionHint }
  );
  const { data: rideRequestStatsData, isLoading: requestLoading } = useGetRideRequestStatsQuery(
    undefined,
    { skip: !hasSessionHint }
  );
  const { data: revenueData, isLoading: revenueLoading } = useGetRevenueAnalyticsQuery(
    { period: "daily" },
    { skip: !hasSessionHint }
  );

  const isLoading =
    rideLoading ||
    paymentLoading ||
    driverLoading ||
    requestLoading ||
    revenueLoading;

  const rideStats = rideStatsData?.data || {};
  const paymentStats = paymentStatsData?.data || {};
  const driverStats = driverStatsData?.data || {};
  const rideRequestStats = rideRequestStatsData?.data || {};

  // Calculate totals
  const totalRevenue = paymentStats?.totalRevenue?.[0]?.totalRevenue || 0;
  const totalRides = rideStats?.totalRides || 0;
  const completedRides = rideStats?.totalCompletedRides || 0;
  const activeRides = rideStats?.totalActiveRides || 0;
  const cancelledRides = rideStats?.totalCancelledRides || 0;

  const rawPaymentMethodData = (paymentStats?.paymentGatewayData || []).map((item: any) => ({
    method: item?._id || "UNKNOWN",
    count: item?.count || 0,
  }));
  const paymentMethodData = rawPaymentMethodData.length > 0
    ? rawPaymentMethodData
    : [{ method: "UNKNOWN", count: 0 }];

  const transactionsData = (revenueData?.data || []).map((item: any) => ({
    date: item?._id,
    transactions: item?.transactions || 0,
    revenue: item?.revenue || 0,
  }));

  const cancellationData = (rideRequestStats?.cancellationReasons || []).map((item: any) => ({
    reason: item?._id || "UNKNOWN",
    count: item?.count || 0,
  }));

  // Top drivers (favorites equivalent)
  const topDrivers = driverStats?.topRatedDrivers?.slice(0, 4) || [];

  const totalPayments = Number(paymentStats?.totalPayment || 0);
  const gatewayPalette = [
    "from-pink-500 to-rose-500",
    "from-orange-500 to-amber-500",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
  ];
  const paymentGateways = (paymentStats?.paymentGatewayData || []).map((item: any, idx: number) => {
    const count = Number(item?.count || 0);
    const share = totalPayments > 0 ? (count / totalPayments) * 100 : 0;
    return {
      name: item?._id || "UNKNOWN",
      logo: "💳",
      count,
      share,
      color: gatewayPalette[idx % gatewayPalette.length],
    };
  });

  const cardClass = isDark
    ? "bg-slate-900/70 border border-slate-800/70 shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
    : "bg-white border border-slate-200 shadow-sm";
  const subCardClass = isDark
    ? "bg-slate-900/60 border border-slate-800/60"
    : "bg-white border border-slate-200";
  const tooltipStyle = isDark
    ? {
        backgroundColor: "#0f172a",
        border: "1px solid #1f2937",
        borderRadius: "12px",
        color: "#e2e8f0",
        boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.35)",
      }
    : {
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDark ? "border-cyan-400" : "border-cyan-600"}`}></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${
      isDark
        ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100"
        : "bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 text-slate-900"
    }`}>
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-800"}`}>Dashboard</h1>
          <p className={isDark ? "text-slate-300" : "text-slate-600"}>
            Welcome back! Here's what's happening with your rides today.
          </p>
        </div>

        {/* Total Amount Section */}
        <div className={`rounded-3xl p-8 mb-6 ${cardClass}`}>
          <h2 className={`font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Total Amount Transactions
          </h2>
          <div className="flex items-baseline gap-3 mb-6">
            <span className={`text-5xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
              {totalRevenue.toLocaleString()}
            </span>
            <span className={`text-2xl font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>BDT</span>
          </div>
          
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className={`text-sm mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {completedRides.toLocaleString()} Completed
              </p>
              <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                {(totalRevenue * 0.92).toFixed(0).toLocaleString()} <span className="text-sm font-normal">BDT</span>
              </p>
              <p className={`text-sm font-medium mt-1 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                +{completedRides} BDT
              </p>
            </div>
            <div>
              <p className={`text-sm mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {activeRides} Active
              </p>
              <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                {(totalRevenue * 0.05).toFixed(0).toLocaleString()} <span className="text-sm font-normal">BDT</span>
              </p>
              <p className={`text-sm font-medium mt-1 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                +{activeRides} BDT
              </p>
            </div>
            <div>
              <p className={`text-sm mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {cancelledRides} Refunds
              </p>
              <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                {(totalRevenue * 0.03).toFixed(0).toLocaleString()} <span className="text-sm font-normal">BDT</span>
              </p>
              <p className={`text-sm font-medium mt-1 ${isDark ? "text-rose-400" : "text-rose-600"}`}>
                +{cancelledRides} BDT
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Payment Method Chart */}
          <div className={`lg:col-span-2 rounded-3xl p-6 ${cardClass}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>Payment method</h3>
              <button className={`p-2 rounded-lg transition ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>
                <MoreHorizontal className={`w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-400"}`} />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={paymentMethodData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1f2937" : "#f1f5f9"} vertical={false} />
                <XAxis 
                  dataKey="method" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? "#94a3b8" : "#94a3b8", fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? "#94a3b8" : "#94a3b8", fontSize: 12 }}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
                <Bar dataKey="count" name="Transactions" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Gateway Status */}
          <div className="space-y-4">
            {paymentGateways.map((gateway, idx) => (
              <div key={idx} className={`rounded-2xl p-5 transition ${subCardClass} ${isDark ? "hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]" : "hover:shadow-md"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gateway.color} flex items-center justify-center text-xl`}>
                      {gateway.logo}
                    </div>
                    <span className={`font-medium ${isDark ? "text-slate-100" : "text-slate-800"}`}>{gateway.name}</span>
                  </div>
                  <button className={`p-1 rounded-lg transition ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                <p className={`text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Share of total</p>
                <p className={`text-2xl font-bold mb-1 ${isDark ? "text-white" : "text-slate-800"}`}>
                  {gateway.share.toFixed(1)}%
                </p>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {gateway.count.toLocaleString()} transactions
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Favorites / Top Drivers */}
          <div className={`rounded-3xl p-6 ${cardClass}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>Top Drivers</h3>
              <button className={`p-2 rounded-lg transition ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>
                <MoreHorizontal className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-4">
              {topDrivers.length > 0 ? topDrivers.map((driver: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                      {driver?.user?.name || "Driver"}
                    </p>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      {driver.totalCompletedRides || 0} rides
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${isDark ? "text-white" : "text-slate-800"}`}>{driver.rating || 4.8}</p>
                    <div className="flex items-center gap-1 text-xs">
                      <ArrowUp className={`w-3 h-3 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                      <span className={`font-medium ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                        {(idx + 1) * 8}%
                      </span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className={`text-center py-8 ${isDark ? "text-slate-400" : "text-slate-500"}`}>No driver data available</div>
              )}
            </div>
          </div>

          {/* Transactions Chart */}
          <div className={`lg:col-span-2 rounded-3xl p-6 ${cardClass}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>Transactions</h3>
              <div className="flex items-center gap-2">
                <button className={`px-3 py-1.5 text-xs font-medium rounded-lg ${isDark ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-600"}`}>Day</button>
                <button className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${isDark ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`}>Week</button>
                <button className={`px-3 py-1.5 text-xs font-medium rounded-lg ${isDark ? "bg-slate-100 text-slate-900" : "bg-slate-900 text-white"}`}>Month</button>
                <button className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${isDark ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`}>Year</button>
                <button className={`p-2 rounded-lg transition ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>
                  <MoreHorizontal className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-violet-600"></div>
                <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  {totalRevenue.toLocaleString()} BDT
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  {totalRides.toLocaleString()} transactions
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={transactionsData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1f2937" : "#f1f5f9"} vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? "#94a3b8" : "#94a3b8", fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? "#94a3b8" : "#94a3b8", fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? "#94a3b8" : "#94a3b8", fontSize: 12 }}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar yAxisId="left" dataKey="transactions" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cancellation Reasons */}
        <div className={`rounded-3xl p-6 ${cardClass}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>Cancellation Reasons</h3>
            <button className={`p-2 rounded-lg transition ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>
              <MoreHorizontal className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cancellationData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1f2937" : "#f1f5f9"} vertical={false} />
              <XAxis 
                dataKey="reason" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? "#94a3b8" : "#94a3b8", fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? "#94a3b8" : "#94a3b8", fontSize: 12 }}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
