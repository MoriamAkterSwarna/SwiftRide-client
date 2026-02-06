/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { MapPin, Calendar, DollarSign, Clock, Star } from "lucide-react";
import { useGetRideHistoryQuery } from "@/redux/features/ride/ride.api";

export default function RideHistory() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
  });

  const { data: ridesData, isLoading } = useGetRideHistoryQuery({
    page,
    limit: 10,
    status: filters.status || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
  });

  const rides = ridesData?.data || [];
  const totalPages = ridesData?.totalPages || 1;

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1);
  };

  const getRideStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Ride History</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Rides</option>
              <option value="completed">Completed</option>
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: "", startDate: "", endDate: "" })}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg font-medium transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Rides List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading rides...</p>
        </div>
      ) : rides.length > 0 ? (
        <div className="space-y-4 mb-8">
          {rides.map((ride: any) => (
            <div
              key={ride.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-blue-600"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Route Info */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-green-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">From</p>
                      <p className="font-semibold text-gray-900">{ride.pickupLocation}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="text-red-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">To</p>
                      <p className="font-semibold text-gray-900">{ride.destinationLocation}</p>
                    </div>
                  </div>
                </div>

                {/* Ride Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign size={18} />
                      <span>Fare</span>
                    </div>
                    <span className="font-bold text-lg text-gray-900">${ride.fare}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={18} />
                      <span>Duration</span>
                    </div>
                    <span className="font-semibold text-gray-900">{ride.duration} min</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      <Calendar className="inline mr-2" size={18} />
                      {new Date(ride.createdAt).toLocaleDateString()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRideStatusColor(ride.status)}`}>
                      {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Driver Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={ride.driver?.avatar || "https://i.pravatar.cc/48"}
                    alt={ride.driver?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{ride.driver?.name}</p>
                    <p className="text-sm text-gray-600">{ride.driver?.vehicleNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Star className="text-yellow-400" size={18} fill="currentColor" />
                  <span className="font-semibold">{ride.driver?.rating || 4.8}</span>
                </div>
              </div>

              {/* Action Button */}
              <button className="mt-4 w-full bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg font-medium transition">
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">No rides found</p>
          <a href="/user/add-ride" className="text-blue-600 hover:text-blue-700 font-medium">
            Book a new ride
          </a>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-2 rounded-lg transition ${
                page === p
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
