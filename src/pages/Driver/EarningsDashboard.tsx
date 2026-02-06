/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { TrendingUp, DollarSign, Clock, Car } from "lucide-react";
import { useGetEarningsDataQuery } from "@/redux/features/ride/ride.api";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function EarningsDashboard() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const { data: earningsData } = useGetEarningsDataQuery({ period });

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
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Rides Completed",
      value: earningsData?.data?.ridesCompleted || 45,
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Avg Per Ride",
      value: `$${earningsData?.data?.avgPerRide || 32}`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "Active Hours",
      value: earningsData?.data?.activeHours || 36,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const paymentMethods = [
    { name: "Card", value: earningsData?.data?.paymentMethods?.card || 600 },
    { name: "Cash", value: earningsData?.data?.paymentMethods?.cash || 400 },
    { name: "Wallet", value: earningsData?.data?.paymentMethods?.wallet || 300 },
    { name: "Other", value: earningsData?.data?.paymentMethods?.other || 150 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Earnings Dashboard</h1>
        <div className="flex gap-2">
          {["daily", "weekly", "monthly"].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p as "daily" | "weekly" | "monthly")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                period === p
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 font-medium text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Earnings Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="earnings" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">By Payment Method</h2>
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
                {paymentMethods.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Rides */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Rides</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Route</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Duration</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Fare</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Rating</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="py-4 px-4 text-gray-900">2024-01-{20 + i}</td>
                  <td className="py-4 px-4 text-gray-600">Downtown → Airport</td>
                  <td className="py-4 px-4 text-gray-600">35 min</td>
                  <td className="py-4 px-4 font-semibold text-gray-900">$45</td>
                  <td className="py-4 px-4">
                    <span className="text-yellow-400">★★★★★</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
