
import { useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@/hooks/useTheme";
import { MapPin, Calendar, DollarSign, Clock, Star, X } from "lucide-react";
import { useGetDriverRideHistoryQuery } from "@/redux/features/ride/ride.api";

interface RootState {
  authSession: {
    hasSession: boolean;
  };
}

interface Ride {
  _id: string;
  pickUpLocation?: { address?: string };
  dropOffLocation?: { address?: string };
  cost?: number;
  createdAt: string;
  status?: string;
  user?: {
    name?: string;
    picture?: string;
    phone?: string;
  };
}

export default function RideHistory() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const hasSessionHint = useSelector((state: RootState) => state.authSession.hasSession);
  const [page, setPage] = useState(1);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
  });

  const { data: ridesData, isLoading } = useGetDriverRideHistoryQuery({
    page,
    limit: 10,
    status: filters.status || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
  }, { skip: !hasSessionHint });

  const rides = ridesData?.data || [];
  const totalPages = ridesData?.meta?.totalPage || 1;

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1);
  };

  const getRideStatusColor = (status: string) => {
    const normalized = status.toLowerCase();
    if (isDark) {
      switch (normalized) {
        case "completed":
          return "bg-emerald-900/40 text-emerald-400 border border-emerald-800";
        case "cancelled":
          return "bg-red-900/40 text-red-400 border border-red-800";
        case "active":
        case "accepted":
          return "bg-blue-900/40 text-blue-400 border border-blue-800";
        case "pending":
          return "bg-yellow-900/40 text-yellow-400 border border-yellow-800";
        default:
          return "bg-gray-800 text-gray-300 border border-gray-700";
      }
    } else {
      switch (normalized) {
        case "completed":
          return "bg-emerald-100 text-emerald-800";
        case "cancelled":
          return "bg-red-100 text-red-800";
        case "active":
        case "accepted":
          return "bg-blue-100 text-blue-800";
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-slate-950" : "bg-gray-50"}`}>
      <div className="w-full px-2 sm:px-4 lg:px-6 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {/* Header */}
          <div>
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Ride History
            </h1>
            <p className={`text-sm sm:text-base mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              View your completed, active, and past rides
            </p>
          </div>

          {/* Filters */}
          <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border transition-all duration-300 ${
            isDark
              ? "border-slate-700 bg-slate-900"
              : "border-gray-200 bg-white"
          }`}>
            <h3 className={`text-base sm:text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              Filter Rides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className={`w-full px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm border transition-all focus:ring-2 focus:ring-blue-500 outline-none ${
                    isDark
                      ? "border-slate-700 bg-slate-800 text-white placeholder-gray-500"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                >
                  <option value="">All Rides</option>
                  <option value="Completed">Completed</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Active">Active</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className={`w-full px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm border transition-all focus:ring-2 focus:ring-blue-500 outline-none ${
                    isDark
                      ? "border-slate-700 bg-slate-800 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className={`w-full px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm border transition-all focus:ring-2 focus:ring-blue-500 outline-none ${
                    isDark
                      ? "border-slate-700 bg-slate-800 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setFilters({ status: "", startDate: "", endDate: "" })}
                  className={`w-full px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 text-white bg-linear-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800`}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Rides List */}
          {isLoading ? (
            <div className="text-center py-12 sm:py-16">
              <div className={`inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 ${
                isDark ? "border-blue-400" : "border-blue-600"
              }`}></div>
              <p className={`${isDark ? "text-gray-400" : "text-gray-600"} mt-4 text-sm sm:text-base`}>
                Loading rides...
              </p>
            </div>
          ) : rides.length > 0 ? (
            <div className="space-y-3 sm:space-y-4 mb-8">
              {rides.map((ride: Ride) => (
                <div
                  key={ride._id}
                  className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border-l-4 transition-all duration-300 hover:shadow-lg ${
                    isDark
                      ? "border-blue-700 bg-slate-900 hover:shadow-blue-900/20"
                      : "border-blue-600 bg-white hover:shadow-blue-100"
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Route Info */}
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <MapPin className={`${isDark ? "text-emerald-400" : "text-emerald-600"} mt-0.5 shrink-0 w-4 h-4 sm:w-5 sm:h-5`} />
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            From
                          </p>
                          <p className={`font-semibold text-xs sm:text-sm truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                            {ride.pickUpLocation?.address || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 sm:gap-3">
                        <MapPin className={`${isDark ? "text-red-400" : "text-red-600"} mt-0.5 shrink-0 w-4 h-4 sm:w-5 sm:h-5`} />
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            To
                          </p>
                          <p className={`font-semibold text-xs sm:text-sm truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                            {ride.dropOffLocation?.address || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Ride Details */}
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-center">
                        <div className={`flex items-center gap-2 text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          <DollarSign size={16} className="sm:w-5 sm:h-5" />
                          <span>Fare</span>
                        </div>
                        <span className={`font-bold text-sm sm:text-lg ${isDark ? "text-emerald-400" : "text-gray-900"}`}>
                          ${ride.cost ?? "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className={`flex items-center gap-2 text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          <Clock size={16} className="sm:w-5 sm:h-5" />
                          <span>Duration</span>
                        </div>
                        <span className={`font-semibold text-xs sm:text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                          N/A
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className={`text-xs sm:text-sm flex items-center gap-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                          {new Date(ride.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getRideStatusColor(ride.status || "")}`}>
                          {ride.status || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Driver Info */}
                  <div className={`mt-4 sm:mt-6 pt-4 sm:pt-6 border-t transition-colors ${isDark ? "border-slate-700" : "border-gray-200"} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0`}>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <img
                        src={ride.user?.picture || "https://i.pravatar.cc/48"}
                        alt={ride.user?.name || "Rider"}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-200"
                      />
                      <div className="min-w-0">
                        <p className={`font-semibold text-xs sm:text-sm truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                          {ride.user?.name || "Rider"}
                        </p>
                        <p className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          {ride.user?.phone || "No phone"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-400 w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
                      <span className={`font-semibold text-xs sm:text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                        4.8
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setSelectedRide(ride)}
                    className={`mt-4 w-full py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-300 ${
                      isDark
                        ? "bg-blue-900/40 hover:bg-blue-900/60 text-blue-400 border border-blue-800"
                        : "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100"
                    }`}>
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={`rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center border transition-all duration-300 ${
              isDark
                ? "border-slate-700 bg-slate-900"
                : "border-gray-200 bg-white"
            }`}>
              <p className={`text-base sm:text-lg mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                No rides found
              </p>
              <a
                href="/driver/manage-rides"
                className={`text-xs sm:text-sm font-medium transition-colors ${
                  isDark
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                Accept a new ride
              </a>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mt-6 sm:mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 border disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark
                    ? "border-slate-700 text-gray-300 hover:bg-slate-800"
                    : "border-gray-300 text-gray-900 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                    page === p
                      ? isDark
                        ? "bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                        : "bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                      : isDark
                        ? "border border-slate-700 text-gray-300 hover:bg-slate-800"
                        : "border border-gray-300 text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 border disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark
                    ? "border-slate-700 text-gray-300 hover:bg-slate-800"
                    : "border-gray-300 text-gray-900 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Ride Details Modal */}
        {selectedRide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className={`rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ${
              isDark
                ? "bg-slate-900 border border-slate-700"
                : "bg-white border border-gray-200"
            }`}>
              {/* Modal Header */}
              <div className={`sticky top-0 flex items-center justify-between p-4 sm:p-6 border-b transition-all duration-300 ${
                isDark
                  ? "border-slate-700 bg-slate-900"
                  : "border-gray-200 bg-white"
              }`}>
                <h2 className={`text-lg sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  Ride Details
                </h2>
                <button
                  onClick={() => setSelectedRide(null)}
                  className={`p-1 rounded-lg transition-colors ${
                    isDark
                      ? "hover:bg-slate-800 text-gray-400"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Route Information */}
                <div>
                  <h3 className={`text-sm font-semibold mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Route Information
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className={`${isDark ? "text-emerald-400" : "text-emerald-600"} mt-1 shrink-0 w-4 h-4 sm:w-5 sm:h-5`} />
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Pickup Location</p>
                        <p className={`font-semibold text-sm sm:text-base ${isDark ? "text-white" : "text-gray-900"}`}>
                          {selectedRide.pickUpLocation?.address || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className={`${isDark ? "text-red-400" : "text-red-600"} mt-1 shrink-0 w-4 h-4 sm:w-5 sm:h-5`} />
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Dropoff Location</p>
                        <p className={`font-semibold text-sm sm:text-base ${isDark ? "text-white" : "text-gray-900"}`}>
                          {selectedRide.dropOffLocation?.address || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ride Information */}
                <div>
                  <h3 className={`text-sm font-semibold mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Ride Information
                  </h3>
                  <div className={`grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border transition-all duration-300 ${
                    isDark
                      ? "border-slate-700 bg-slate-800"
                      : "border-gray-200 bg-gray-50"
                  }`}>
                    <div>
                      <p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Fare</p>
                      <p className={`font-bold text-sm sm:text-lg mt-1 ${isDark ? "text-emerald-400" : "text-gray-900"}`}>
                        ${selectedRide.cost ?? "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Status</p>
                      <p className={`font-bold text-xs sm:text-sm mt-1 px-2 py-1 rounded-full inline-block ${getRideStatusColor(selectedRide.status || "")}`}>
                        {selectedRide.status || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Date</p>
                      <p className={`font-semibold text-xs sm:text-sm mt-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                        {new Date(selectedRide.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Time</p>
                      <p className={`font-semibold text-xs sm:text-sm mt-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                        {new Date(selectedRide.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Passenger Information */}
                <div>
                  <h3 className={`text-sm font-semibold mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Passenger Information
                  </h3>
                  <div className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border transition-all duration-300 ${
                    isDark
                      ? "border-slate-700 bg-slate-800"
                      : "border-gray-200 bg-gray-50"
                  }`}>
                    <img
                      src={selectedRide.user?.picture || "https://i.pravatar.cc/128"}
                      alt={selectedRide.user?.name || "Passenger"}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      <p className={`font-bold text-sm sm:text-base ${isDark ? "text-white" : "text-gray-900"}`}>
                        {selectedRide.user?.name || "Passenger"}
                      </p>
                      <p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        {selectedRide.user?.phone || "No phone"}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="text-yellow-400 w-4 h-4" fill="currentColor" />
                        <span className={`text-xs sm:text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                          4.8
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`flex gap-2 sm:gap-3 p-4 sm:p-6 border-t transition-all duration-300 ${
                isDark
                  ? "border-slate-700 bg-slate-900"
                  : "border-gray-200 bg-white"
              }`}>
                <button
                  onClick={() => setSelectedRide(null)}
                  className={`flex-1 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    isDark
                      ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200"
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
