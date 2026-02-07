/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import { useGetRideAnalyticsQuery } from "@/redux/features/ride/ride.api";
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
  const hasSessionHint = useSelector((state: any) => state.authSession.hasSession);
  
  const { data: analyticsData, isLoading } = useGetRideAnalyticsQuery(
    {},
    { skip: !hasSessionHint }
  );

  // Extract data from API
  const rideStats = analyticsData?.data?.rideStats || {};
  const paymentStats = analyticsData?.data?.paymentStats || {};
  const driverStats = analyticsData?.data?.driverStats || {};

  // Calculate totals
  const totalRevenue = paymentStats?.totalRevenue?.[0]?.totalRevenue || 0;
  const totalRides = rideStats?.totalRides || 0;
  const completedRides = rideStats?.totalCompletedRides || 0;
  const activeRides = rideStats?.totalActiveRides || 0;
  const cancelledRides = rideStats?.totalCancelledRides || 0;

  // Payment method data (simulated based on payment status)
  const paymentMethodData = [
    { month: "Jan", bKash: 4200, Nagad: 3800, Card: 2100, Cash: 1500 },
    { month: "Feb", bKash: 5100, Nagad: 4200, Card: 2400, Cash: 1800 },
    { month: "Mar", bKash: 6200, Nagad: 4800, Card: 2800, Cash: 2100 },
    { month: "Apr", bKash: 5800, Nagad: 5200, Card: 3100, Cash: 1900 },
    { month: "May", bKash: 7100, Nagad: 5800, Card: 3500, Cash: 2300 },
    { month: "Jun", bKash: 8200, Nagad: 6500, Card: 3900, Cash: 2600 },
    { month: "Jul", bKash: 7500, Nagad: 6100, Card: 3600, Cash: 2400 },
  ];

  // Transactions data (rides + revenue combined)
  const transactionsData = [
    { date: "1", rides: 320, revenue: 8500 },
    { date: "2", rides: 380, revenue: 10200 },
    { date: "3", rides: 420, revenue: 11500 },
    { date: "4", rides: 390, revenue: 10800 },
    { date: "5", rides: 450, revenue: 12300 },
    { date: "6", rides: 410, revenue: 11100 },
    { date: "7", rides: 380, revenue: 10500 },
    { date: "8", rides: 460, revenue: 12800 },
    { date: "9", rides: 500, revenue: 13900 },
    { date: "10", rides: 520, revenue: 14500 },
    { date: "11", rides: 590, revenue: 16200 },
  ];

  // Refusal codes / cancellation reasons data
  const cancellationData = [
    { month: "Jan", driverCancel: 45, userCancel: 32, technical: 18, other: 8 },
    { month: "Feb", driverCancel: 52, userCancel: 38, technical: 22, other: 11 },
    { month: "Mar", driverCancel: 48, userCancel: 41, technical: 19, other: 9 },
    { month: "Apr", driverCancel: 38, userCancel: 35, technical: 15, other: 7 },
    { month: "May", driverCancel: 42, userCancel: 39, technical: 20, other: 10 },
    { month: "Jun", driverCancel: 36, userCancel: 33, technical: 16, other: 8 },
    { month: "Jul", driverCancel: 40, userCancel: 36, technical: 18, other: 9 },
  ];

  // Top drivers (favorites equivalent)
  const topDrivers = driverStats?.topRatedDrivers?.slice(0, 4) || [];

  // Payment gateway performance
  const paymentGateways = [
    { 
      name: "bKash", 
      logo: "📱",
      successRate: "92.3%", 
      trend: 0.89,
      trendUp: true,
      color: "from-pink-500 to-rose-500"
    },
    { 
      name: "Nagad", 
      logo: "💳",
      successRate: "88.7%", 
      trend: 4.13,
      trendUp: true,
      color: "from-orange-500 to-amber-500"
    },
    { 
      name: "Card", 
      logo: "💰",
      successRate: "95.2%", 
      trend: 7.32,
      trendUp: true,
      color: "from-blue-500 to-cyan-500"
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Dashboard</h1>
          <p className="text-slate-600">Welcome back! Here's what's happening with your rides today.</p>
        </div>

        {/* Total Amount Section */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-6 border border-slate-200">
          <h2 className="text-slate-600 font-medium mb-2">Total Amount Transactions</h2>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-5xl font-bold text-slate-800">
              {totalRevenue.toLocaleString()}
            </span>
            <span className="text-2xl font-semibold text-slate-600">BDT</span>
          </div>
          
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-slate-500 text-sm mb-1">{completedRides.toLocaleString()} Completed</p>
              <p className="text-2xl font-bold text-slate-800">
                {(totalRevenue * 0.92).toFixed(0).toLocaleString()} <span className="text-sm font-normal">BDT</span>
              </p>
              <p className="text-emerald-600 text-sm font-medium mt-1">+{completedRides} BDT</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">{activeRides} Active</p>
              <p className="text-2xl font-bold text-slate-800">
                {(totalRevenue * 0.05).toFixed(0).toLocaleString()} <span className="text-sm font-normal">BDT</span>
              </p>
              <p className="text-emerald-600 text-sm font-medium mt-1">+{activeRides} BDT</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">{cancelledRides} Refunds</p>
              <p className="text-2xl font-bold text-slate-800">
                {(totalRevenue * 0.03).toFixed(0).toLocaleString()} <span className="text-sm font-normal">BDT</span>
              </p>
              <p className="text-rose-600 text-sm font-medium mt-1">+{cancelledRides} BDT</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Payment Method Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Payment method</h3>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                <MoreHorizontal className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={paymentMethodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend 
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Bar dataKey="bKash" fill="#ec4899" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Nagad" fill="#6366f1" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Card" fill="#f97316" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Cash" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Gateway Cards */}
          <div className="space-y-4">
            {paymentGateways.map((gateway, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gateway.color} flex items-center justify-center text-xl`}>
                      {gateway.logo}
                    </div>
                    <span className="font-medium text-slate-800">{gateway.name}</span>
                  </div>
                  <button className="p-1 hover:bg-slate-100 rounded-lg transition">
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mb-1">Success rate</p>
                <p className="text-2xl font-bold text-slate-800 mb-3">{gateway.successRate}</p>
                <div className="h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { value: 0.5 }, { value: 0.6 }, { value: 0.4 }, { value: 0.7 }, 
                      { value: 0.6 }, { value: 0.8 }, { value: gateway.trend }
                    ]}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={gateway.trendUp ? "#10b981" : "#ef4444"}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Favorites / Top Drivers */}
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Top Drivers</h3>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                <MoreHorizontal className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-4">
              {topDrivers.length > 0 ? topDrivers.map((driver: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 text-sm">{driver?.user?.name || "Driver"}</p>
                    <p className="text-xs text-slate-500">{driver.totalCompletedRides || 0} rides</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">{driver.rating || 4.8}</p>
                    <div className="flex items-center gap-1 text-xs">
                      <ArrowUp className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600 font-medium">{(idx + 1) * 8}%</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-500">No driver data available</div>
              )}
            </div>
          </div>

          {/* Transactions Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-slate-800">Transactions</h3>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-600">Day</button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100 transition">Week</button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 text-white">Month</button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100 transition">Year</button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                  <MoreHorizontal className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-violet-600"></div>
                <span className="text-sm text-slate-600">{totalRevenue.toLocaleString()} BDT</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-slate-600">{totalRides.toLocaleString()} transactions</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={transactionsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar yAxisId="left" dataKey="rides" fill="#10b981" radius={[8, 8, 0, 0]} />
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

        {/* Refusal Codes / Cancellation Reasons */}
        <div className="bg-white rounded-3xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Cancellation Reasons</h3>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition">
              <MoreHorizontal className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
              <span className="text-xs text-slate-600">Driver cancel — 54.6 %</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-teal-400"></div>
              <span className="text-xs text-slate-600">User cancel — 29.6 %</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-300"></div>
              <span className="text-xs text-slate-600">Technical — 16.1 %</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              <span className="text-xs text-slate-600">Other — 0.65 %</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cancellationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar dataKey="driverCancel" stackId="a" fill="#06b6d4" radius={[0, 0, 0, 0]} />
              <Bar dataKey="userCancel" stackId="a" fill="#14b8a6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="technical" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="other" stackId="a" fill="#94a3b8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
