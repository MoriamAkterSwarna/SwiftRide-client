/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { MapPin, Calendar, DollarSign, Clock, Star, User } from "lucide-react";
import { useGetUserRideQuery } from "@/redux/features/ride/ride.api";

export default function MyRideHistory() {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        status: "",
        startDate: "",
        endDate: "",
    });

    const { data: ridesData, isLoading, error, isError } = useGetUserRideQuery(
        {
            page,
            limit: 10,
            status: filters.status || undefined,
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
        }
    );

    console.log("Rides query state:", { isLoading, isError, error });
    console.log("Rides data response:", ridesData);
    const rides = ridesData?.data || [];
    const totalPages = ridesData?.meta?.total || 1;

    console.log("Final rides array:", rides);
    console.log("Total pages:", totalPages);

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
            case "searching":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Ride History</h1>

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
                            <option value="searching">Searching</option>
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
            {isError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-600 text-lg mb-2">Error loading rides</p>
                    <p className="text-red-500 text-sm">{(error as any)?.data?.message || (error as any)?.error || "Something went wrong"}</p>
                </div>
            ) : isLoading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 mt-4">Loading your rides...</p>
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
                                        <MapPin className="text-green-600 mt-1 shrink-0" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-600">Pickup</p>
                                            <p className="font-semibold text-gray-900">{ride.pickUpLocation?.address || ride.pickupLocation}</p>
                                            <p className="text-sm text-gray-500">{ride.pickUpLocation?.address}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="text-red-600 mt-1 shrink-0" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-600">Destination</p>
                                            <p className="font-semibold text-gray-900">{ride.dropOffLocation?.address || ride.destinationLocation}</p>
                                            <p className="text-sm text-gray-500">{ride.dropOffLocation?.address}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Ride Details */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <DollarSign size={18} />
                                            <span>Estimated Fare</span>
                                        </div>
                                        <span className="font-bold text-lg text-gray-900">${ride.cost || ride.estimatedFare || ride.fare}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock size={18} />
                                            <span>Duration</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">{ride.duration || ride.estimatedDuration} min</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar size={18} />
                                            <span>Date</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">
                                            {new Date(ride.createdAt || ride.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Status</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRideStatusColor(ride.status)}`}>
                                            {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Driver Info (only show if ride is accepted/active/completed) */}
                            {ride.driver && (
                                <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={ride.driver.avatar || "https://i.pravatar.cc/48"}
                                            alt={ride.driver.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-900">{ride.driver.name}</p>
                                            <p className="text-sm text-gray-600">{ride.driver.vehicleNumber} • {ride.driver.vehicleModel}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Star className="text-yellow-400" size={18} fill="currentColor" />
                                        <span className="font-semibold">{ride.driver.rating || 4.8}</span>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-6 flex gap-3">
                                <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg font-medium transition">
                                    View Details
                                </button>

                                {ride.status === 'completed' && !ride.isRated && (
                                    <button className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 py-2 rounded-lg font-medium transition">
                                        Rate Driver
                                    </button>
                                )}

                                {ride.status === 'active' && (
                                    <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-medium transition">
                                        Cancel Ride
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <User className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-gray-600 text-lg mb-4">No rides found</p>
                    <p className="text-gray-500 mb-6">You haven't booked any rides yet</p>
                    <a href="/user/add-ride" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition">
                        Book Your First Ride
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
                            className={`px-3 py-2 rounded-lg transition ${page === p
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