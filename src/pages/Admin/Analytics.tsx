/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useGetRideAnalyticsQuery } from "@/redux/features/ride/ride.api";
import { useGetAllUsersQuery } from "@/redux/features/user/user.api";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Car, DollarSign, TrendingUp } from "lucide-react";

const Analytics = () => {
  const [userPage, setUserPage] = useState(1);
  const [userLimit] = useState(10);
  
  const { data: analyticsData, isLoading } = useGetRideAnalyticsQuery({});
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery({ page: userPage, limit: userLimit });

  // Transform backend data into chart format for Revenue Trend
  const chartData = analyticsData?.data?.revenueByMonth || [
    { month: "Jan", rides: 400, revenue: 2400 },
    { month: "Feb", rides: 520, revenue: 2800 },
    { month: "Mar", rides: 680, revenue: 3200 },
    { month: "Apr", rides: 750, revenue: 3500 },
    { month: "May", rides: 890, revenue: 4200 },
    { month: "Jun", rides: 950, revenue: 4800 },
  ];

  const stats = [
    {
      label: "Total Users",
      value: analyticsData?.data?.userStats?.totalUsers || 12450,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Total Drivers",
      value: analyticsData?.data?.driverStats?.totalDrivers || 3280,
      icon: Car,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Total Revenue",
      value: `$${analyticsData?.data?.paymentStats?.totalRevenue?.[0]?.totalRevenue || 125480}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "Total Rides",
      value: analyticsData?.data?.rideStats?.totalRides || 2850,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  // Use actual ride status data from backend
  const rideStatusData = [
    { name: "Completed", value: analyticsData?.data?.rideStats?.totalCompletedRides || 8500 },
    { name: "Active", value: analyticsData?.data?.rideStats?.totalActiveRides || 1200 },
    { name: "Cancelled", value: analyticsData?.data?.rideStats?.totalCancelledRides || 500 },
  ];

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 font-medium text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Line Chart - Revenue Trend */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Ride Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Ride Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={rideStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {rideStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart - Rides per Month */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Rides per Month</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="rides" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Drivers */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Top Performing Drivers</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Driver</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Rides</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Rating</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Earnings</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData?.data?.driverStats?.topRatedDrivers?.length ? (
                analyticsData.data.driverStats.topRatedDrivers.map((driver: any, idx: number) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="py-4 px-4 font-medium text-gray-900">{driver?.user?.name || "Unknown"}</td>
                    <td className="py-4 px-4 text-gray-600">{driver.totalCompletedRides || 0}</td>
                    <td className="py-4 px-4 text-yellow-400">★ {driver.rating || 0}</td>
                    <td className="py-4 px-4 font-semibold text-gray-900">${driver.earnings || 0}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        driver.isOnline === true
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {driver.isOnline ? "Online" : "Offline"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 px-4 text-center text-gray-600">
                    No drivers data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Users List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">All Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Phone</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Join Date</th>
              </tr>
            </thead>
            <tbody>
              {usersData?.data?.data?.length ? (
                usersData.data.data.map((user: any) => (
                  <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="py-4 px-4 font-medium text-gray-900">{user.name || "N/A"}</td>
                    <td className="py-4 px-4 text-gray-600">{user.email || "N/A"}</td>
                    <td className="py-4 px-4 text-gray-600">{user.phone || "N/A"}</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {user.role || "User"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.isActive === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {user.isActive || "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                  </tr>
                ))
              ) : usersLoading ? (
                <tr>
                  <td colSpan={6} className="py-4 px-4 text-center text-gray-600">
                    Loading users...
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 px-4 text-center text-gray-600">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {usersData?.data?.meta && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Page {usersData.data.meta.page} of {usersData.data.meta.totalPage} 
              ({usersData.data.meta.total} total users)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setUserPage(prev => Math.max(1, prev - 1))}
                disabled={userPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <button
                onClick={() => setUserPage(prev => prev + 1)}
                disabled={userPage >= (usersData.data.meta.totalPage || 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
