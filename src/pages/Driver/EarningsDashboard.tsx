/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@/hooks/useTheme";
import { TrendingUp, DollarSign, Clock, Car } from "lucide-react";
import { useGetEarningsDataQuery } from "@/redux/features/ride/ride.api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function EarningsDashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const hasSessionHint = useSelector((state: { authSession: { hasSession: boolean } }) => state.authSession.hasSession);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const { data: earningsData } = useGetEarningsDataQuery({ period }, { skip: !hasSessionHint });

  const chartData = earningsData?.data?.chartData || [
    { name: "Mon", earnings: 120 },
    { name: "Tue", earnings: 150 },
    { name: "Wed", earnings: 180 },
    { name: "Thu", earnings: 140 },
    { name: "Fri", earnings: 220 },
    { name: "Sat", earnings: 250 },
    { name: "Sun", earnings: 190 },
  ];

  const stats = [
    {
      label: "Total Earnings",
      value: `$${earningsData?.data?.totalEarnings || 1450}`,
      icon: DollarSign,
      color: isDark ? "text-emerald-400" : "text-emerald-600",
      bgColor: isDark ? "bg-emerald-900/40" : "bg-emerald-100",
      lightColor: "emerald",
    },
    {
      label: "Rides Completed",
      value: earningsData?.data?.ridesCompleted || 45,
      icon: Car,
      color: isDark ? "text-blue-400" : "text-blue-600",
      bgColor: isDark ? "bg-blue-900/40" : "bg-blue-100",
      lightColor: "blue",
    },
    {
      label: "Avg Per Ride",
      value: `$${earningsData?.data?.avgPerRide || 32}`,
      icon: TrendingUp,
      color: isDark ? "text-purple-400" : "text-purple-600",
      bgColor: isDark ? "bg-purple-900/40" : "bg-purple-100",
      lightColor: "purple",
    },
    {
      label: "Active Hours",
      value: earningsData?.data?.activeHours || 36,
      icon: Clock,
      color: isDark ? "text-orange-400" : "text-orange-600",
      bgColor: isDark ? "bg-orange-900/40" : "bg-orange-100",
      lightColor: "orange",
    },
  ];

  const paymentMethods = [
    { name: "Card", value: earningsData?.data?.paymentMethods?.card || 600 },
    { name: "Cash", value: earningsData?.data?.paymentMethods?.cash || 400 },
    { name: "Wallet", value: earningsData?.data?.paymentMethods?.wallet || 300 },
    { name: "Other", value: earningsData?.data?.paymentMethods?.other || 150 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
  
  const chartColors = {
    line: isDark ? "#60a5fa" : "#3b82f6",
    grid: isDark ? "#334155" : "#e5e7eb",
    text: isDark ? "#cbd5e1" : "#374151",
    tooltip: isDark ? "#1e293b" : "#ffffff",
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-slate-950" : "bg-gray-50"}`}>
      <div className="w-full px-2 sm:px-4 lg:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
            <div>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                Earnings Dashboard
              </h1>
              <p className={`text-sm sm:text-base mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Track your earnings and performance
              </p>
            </div>

            {/* Period Selector */}
            <div className="flex gap-2 flex-wrap">
              {["daily", "weekly", "monthly"].map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p as "daily" | "weekly" | "monthly")}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 ${
                    period === p
                      ? isDark
                        ? "bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-900/50"
                        : "bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                      : isDark
                        ? "bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700"
                        : "bg-gray-200 text-gray-900 hover:bg-gray-300 border border-gray-300"
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  isDark
                    ? "border-slate-700 bg-slate-900 hover:shadow-blue-900/20"
                    : "border-gray-200 bg-white hover:shadow-blue-100"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <p className={`text-xs sm:text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {stat.label}
                    </p>
                    <p className={`text-xl sm:text-2xl lg:text-3xl font-bold mt-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-2 sm:p-3 rounded-lg border ${isDark ? "border-slate-700" : "border-gray-200"}`}>
                    <stat.icon className={`${stat.color} w-5 h-5 sm:w-6 sm:h-6`} />
                  </div>
                </div>
                <div className={`w-full ${isDark ? "bg-slate-800" : "bg-gray-200"} rounded-full h-2`}>
                  <div className={`h-2 rounded-full w-3/4 bg-linear-to-r ${
                    stat.lightColor === "emerald" ? "from-emerald-500 to-emerald-600" :
                    stat.lightColor === "blue" ? "from-blue-500 to-cyan-600" :
                    stat.lightColor === "purple" ? "from-purple-500 to-pink-600" :
                    "from-orange-500 to-red-600"
                  }`}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Line Chart */}
            <div className={`lg:col-span-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${
              isDark
                ? "border-slate-700 bg-slate-900"
                : "border-gray-200 bg-white"
            }`}>
              <h2 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
                Earnings Trend
              </h2>
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                    <XAxis dataKey="name" stroke={chartColors.text} />
                    <YAxis stroke={chartColors.text} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: chartColors.tooltip,
                        border: isDark ? "1px solid #475569" : "1px solid #e5e7eb",
                        borderRadius: "8px",
                        color: chartColors.text,
                      }}
                    />
                    <Legend wrapperStyle={{ color: chartColors.text }} />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke={chartColors.line}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Payment Methods Pie Chart */}
            <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${
              isDark
                ? "border-slate-700 bg-slate-900"
                : "border-gray-200 bg-white"
            }`}>
              <h2 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
                By Payment Method
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentMethods}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: $${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentMethods.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartColors.tooltip,
                      border: isDark ? "1px solid #475569" : "1px solid #e5e7eb",
                      borderRadius: "8px",
                      color: chartColors.text,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Rides Table */}
          <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border overflow-hidden ${
            isDark
              ? "border-slate-700 bg-slate-900"
              : "border-gray-200 bg-white"
          }`}>
            <h2 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
              Recent Rides
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead className={`border-b ${isDark ? "border-slate-700" : "border-gray-200"}`}>
                  <tr>
                    <th className={`text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}>Date</th>
                    <th className={`text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}>Route</th>
                    <th className={`text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}>Duration</th>
                    <th className={`text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}>Fare</th>
                    <th className={`text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map(i => (
                    <tr
                      key={i}
                      className={`border-b transition-colors ${
                        isDark
                          ? "border-slate-700 hover:bg-slate-800"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <td className={`py-2 sm:py-4 px-2 sm:px-4 ${isDark ? "text-gray-300" : "text-gray-900"}`}>
                        2024-01-{20 + i}
                      </td>
                      <td className={`py-2 sm:py-4 px-2 sm:px-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        Downtown → Airport
                      </td>
                      <td className={`py-2 sm:py-4 px-2 sm:px-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        35 min
                      </td>
                      <td className={`py-2 sm:py-4 px-2 sm:px-4 font-semibold ${
                        isDark ? "text-emerald-400" : "text-emerald-600"
                      }`}>
                        $45
                      </td>
                      <td className="py-2 sm:py-4 px-2 sm:px-4">
                        <span className="text-yellow-400">★★★★★</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
