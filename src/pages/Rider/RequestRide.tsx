/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { MapPin, Clock, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateRideMutation, useGetRidesQuery } from "@/redux/features/ride/ride.api";

export default function RequestRide() {
  const [formData, setFormData] = useState({
    pickup: "",
    destination: "",
    rideType: "economy",
    paymentMethod: "card",
  });

  const [showEstimate, setShowEstimate] = useState(false);
  const [createRide, { isLoading }] = useCreateRideMutation();

  const { data: estimateData } = useGetRidesQuery(
    { pickup: formData.pickup, destination: formData.destination },
    { skip: !showEstimate }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGetEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pickup || !formData.destination) {
      toast.error("Please enter both pickup and destination");
      return;
    }
    setShowEstimate(true);
  };

  const handleConfirmRide = async () => {
    try {
      await createRide(formData).unwrap();
      toast.success("Ride requested successfully!");
      setFormData({
        pickup: "",
        destination: "",
        rideType: "economy",
        paymentMethod: "card",
      });
      setShowEstimate(false);
    } catch (error) {
      toast.error("Failed to request ride");
    }
  };

  const rideTypes = [
    { id: "economy", name: "Economy", price: "$5-10", icon: "🚗" },
    { id: "comfort", name: "Comfort", price: "$8-15", icon: "🚙" },
    { id: "premium", name: "Premium", price: "$12-25", icon: "🚕" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Request a Ride</h1>

        <form onSubmit={handleGetEstimate} className="space-y-6">
          {/* Pickup Location */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <MapPin className="inline mr-2" size={18} />
              Pickup Location
            </label>
            <input
              type="text"
              name="pickup"
              value={formData.pickup}
              onChange={handleChange}
              placeholder="Enter pickup location"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Destination Location */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <MapPin className="inline mr-2" size={18} />
              Destination
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Enter destination"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Ride Type Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-3">
              Select Ride Type
            </label>
            <div className="grid grid-cols-3 gap-4">
              {rideTypes.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rideType: type.id }))}
                  className={`p-4 rounded-lg border-2 transition ${
                    formData.rideType === type.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="font-semibold text-gray-900">{type.name}</div>
                  <div className="text-sm text-gray-600">{type.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <CreditCard className="inline mr-2" size={18} />
              Payment Method
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="card">Credit/Debit Card</option>
              <option value="wallet">Digital Wallet</option>
              <option value="cash">Cash</option>
              <option value="mobile">Mobile Payment</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            Get Fare Estimate
          </button>
        </form>
      </div>

      {/* Fare Estimate */}
      {showEstimate && estimateData && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Fare Estimate</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-gray-600">Base Fare</span>
              <span className="font-semibold">${5}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-gray-600">Distance</span>
              <span className="font-semibold">${3}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-gray-600">
                <Clock className="inline mr-2" size={16} />
                Time
              </span>
              <span className="font-semibold">${2}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Fare</span>
              <span className="text-blue-600">${estimateData.data?.[0]?.price || 10}</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> This is an estimated fare. Actual fare may vary based on traffic and route.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowEstimate(false)}
              className="flex-1 border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:border-gray-400 transition"
            >
              Back
            </button>
            <button
              onClick={handleConfirmRide}
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {isLoading ? "Confirming..." : "Confirm Ride"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
