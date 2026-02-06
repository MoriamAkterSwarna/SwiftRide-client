/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { MapPin, Clock, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateRideMutation, useEstimateFareMutation, useGetRideTypesQuery, useRequestRideMutation } from "@/redux/features/ride/ride.api";
import { useGetDivisionsQuery } from "@/redux/features/division/division.api";
import { useGetDistrictsQuery } from "@/redux/features/district/district.api";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  clearLocations,
  setActiveTarget,
  setDropoff,
  setPickup,
  type LocationPoint,
} from "@/redux/features/location/locationSlice";
import LocationPickerMap from "@/components/modules/maps/LocationPickerMap";
import MultipleRideRequests from "@/components/modules/rides/MultipleRideRequests";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

export default function RequestRide() {
  const [formData, setFormData] = useState({
    title: "",
    pickup: "",
    destination: "",
    rideType: "",
    division: "",
    district: "",
    user: "",
    paymentMethod: "card",
  });

  const [showEstimate, setShowEstimate] = useState(false);
  const [estimateData, setEstimateData] = useState<any>(null);
  const [showActiveRides, setShowActiveRides] = useState(false);
  const [requestRide, { isLoading }] = useCreateRideMutation();
  const [estimateFare, { isLoading: isEstimating }] = useEstimateFareMutation();

  // Fetch data for dropdowns
  const { data: divisionsData } = useGetDivisionsQuery();
  const { data: districtsData } = useGetDistrictsQuery();
  const { data: rideTypesData } = useGetRideTypesQuery();
  const { data: userData } = useUserInfoQuery(undefined);
  const dispatch = useAppDispatch();
  const { pickup, dropoff, activeTarget } = useAppSelector((state) => state.location);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "division" ? { district: "" } : null),
    }));
  };

  const handleLocationSelect = (location: LocationPoint) => {
    if (activeTarget === "pickup") {
      dispatch(setPickup(location));
      setFormData(prev => ({
        ...prev,
        pickup: location.address,
      }));
    } else {
      dispatch(setDropoff(location));
      setFormData(prev => ({
        ...prev,
        destination: location.address,
      }));
    }
  };

  const handleGetEstimate = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("handleGetEstimate called");
    console.log("Form data:", formData);
    console.log("Pickup:", pickup);
    console.log("Dropoff:", dropoff);

    // Validate required fields
    if (!formData.rideType || !pickup || !dropoff) {
      toast.error("Please select pickup, dropoff, and ride type");
      return;
    }

    // Get vehicle type from selected ride type
    const selectedRideType = rideTypes.find((type: any) => type._id === formData.rideType);
    const vehicleType = selectedRideType?.rideVehicle;

    console.log("Selected ride type:", selectedRideType);
    console.log("Vehicle type:", vehicleType);

    // Validate vehicle type for fare estimation
    if (!vehicleType) {
      console.error("No vehicle type found!");
      toast.error("Unable to determine vehicle type");
      return;
    }

    if (vehicleType !== "Car" && vehicleType !== "Bike") {
      console.warn(`Vehicle type "${vehicleType}" is not supported for fare estimation`);
      toast.error(`Fare estimation is only available for Car or Bike. You selected ${vehicleType}.`);
      return;
    }

    console.log("✓ Validation passed! Calling fare estimate API...");

    try {
      // Call the fare estimate API
      const fareData = {
        pickupLocation: {
          latitude: pickup.latitude,
          longitude: pickup.longitude,
          address: pickup.address,
        },
        dropoffLocation: {
          latitude: dropoff.latitude,
          longitude: dropoff.longitude,
          address: dropoff.address,
        },
        vehicleType,
      };

      console.log("Calling fare estimate API with:", fareData);

      const result = await estimateFare(fareData).unwrap();
      setEstimateData(result);
      setShowEstimate(true);
      toast.success("Fare estimated successfully!");
    } catch (error: any) {
      console.error("Failed to estimate fare:", error);
      const errorMessage = error?.data?.message || "Failed to estimate fare";
      toast.error(errorMessage);
    }
  };

  const handleConfirmRide = async () => {
    try {
      console.log("=== Confirm Ride Started ===");
      console.log("Full user data structure:", JSON.stringify(userData, null, 2));

      // Get user ID from the user info query data
      const userId = userData?.data?._id || userData?.data?.data?._id || userData?._id;
      console.log("Extracted user ID:", userId);
      console.log("User data:", userData);

      if (!userId) {
        console.error("User not authenticated");
        toast.error("Please login to request a ride");
        return;
      }

      console.log("✓ User authenticated");
      console.log("Form data:", formData);
      // Validate required fields
      if (!formData.title || !formData.rideType || !formData.division || !formData.district || !pickup || !dropoff) {
        console.error("Validation failed:", {
          title: formData.title,
          rideType: formData.rideType,
          division: formData.division,
          district: formData.district,
          pickup,
          dropoff
        });
        toast.error("Please fill in all required fields");
        return;
      }

      console.log("✓ Validation passed");

      const selectedVehicleType = selectedRideType?.rideVehicle;
      if (!selectedVehicleType || (selectedVehicleType !== "Car" && selectedVehicleType !== "Bike")) {
        toast.error("Please select a valid ride type (Car or Bike)");
        return;
      }

      const fareValue = estimateData?.data?.totalFare ?? estimateData?.data?.fare;
      if (typeof fareValue !== "number") {
        toast.error("Please get a fare estimate before confirming");
        return;
      }

      const rideRequestPayload = {
        user: userId,
        title: `Ride from ${pickup?.address || formData.pickup} to ${dropoff?.address || formData.destination}`,
        pickUpLocation: {
          address: pickup?.address || formData.pickup || "Pickup Address",
          coordinates: pickup && pickup.latitude && pickup.longitude
            ? {
              latitude: Number(pickup.latitude),
              longitude: Number(pickup.longitude),
            }
            : undefined,
        },
        dropOffLocation: {
          address: dropoff?.address || formData.destination || "Dropoff Address",
          coordinates: dropoff && dropoff.latitude && dropoff.longitude
            ? {
              latitude: Number(dropoff.latitude),
              longitude: Number(dropoff.longitude),
            }
            : undefined,
        },
        rideType: formData.rideType,
        cost: Number(fareValue),
        division: formData.division,
        district: formData.district,
      };

      console.log("Final ride request payload:", JSON.stringify(rideRequestPayload, null, 2));
      console.log("Calling requestRide API...");

      const result = await requestRide(rideRequestPayload as any).unwrap();
      console.log("✓ Ride requested successfully:", result);
      toast.success("Ride requested successfully! You can create another ride or view your active rides.");

      // Reset form
      setFormData({
        title: "",
        pickup: "",
        destination: "",
        rideType: "",
        division: "",
        district: "",
        user: userId,
        paymentMethod: "card",
      });
      dispatch(clearLocations());
      setShowEstimate(false);
      setEstimateData(null);
    } catch (error: any) {
      console.error("=== Ride Creation Failed ===");
      console.error("Error message:", error?.data?.message || error?.message);

      const errorMessage = error?.data?.message || error?.message || "Failed to request ride";
      toast.error(errorMessage);
    }
  };

  const divisions = divisionsData?.data || [];
  const districts = districtsData?.data || [];
  const rideTypes = rideTypesData?.data || [];
  const filteredDistricts = formData.division
    ? districts.filter((district: any) => {
      const divisionValue = district.division;
      return typeof divisionValue === "string"
        ? divisionValue === formData.division
        : divisionValue?._id === formData.division;
    })
    : [];
  const selectedRideType = rideTypes.find((type: any) => type._id === formData.rideType);

  return (
    <div className="w-9/12 mx-auto">
      {/* Toggle Buttons */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex gap-4 items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Ride Management</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowActiveRides(false)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${!showActiveRides
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              <MapPin className="inline mr-2" size={18} />
              New Ride
            </button>
            <button
              onClick={() => setShowActiveRides(true)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${showActiveRides
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              <Clock className="inline mr-2" size={18} />
              Active Rides
            </button>
          </div>
        </div>
      </div>

      {/* Show Active Rides or Request Form */}
      {showActiveRides ? (
        <MultipleRideRequests />
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Request a New Ride</h2>

            <form onSubmit={handleGetEstimate} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Ride Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Daily commute to office"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

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
                  readOnly
                  placeholder="Select pickup on the map"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">Choose the pickup point on the map below.</p>
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
                  readOnly
                  placeholder="Select dropoff on the map"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">Choose the dropoff point on the map below.</p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Pick locations on the map</p>
                    <p className="text-xs text-gray-500">Search or click on the map to set pickup and dropoff.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => dispatch(setActiveTarget("pickup"))}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${activeTarget === "pickup"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 ring-1 ring-gray-200"
                        }`}
                    >
                      Pickup
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch(setActiveTarget("dropoff"))}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${activeTarget === "dropoff"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 ring-1 ring-gray-200"
                        }`}
                    >
                      Dropoff
                    </button>
                  </div>
                </div>

                <LocationPickerMap
                  pickup={pickup}
                  dropoff={dropoff}
                  activeTarget={activeTarget}
                  onSelect={handleLocationSelect}
                />

                <div className="mt-4 grid gap-3 text-xs text-gray-600 sm:grid-cols-2">
                  <div className="rounded-md bg-white p-3 shadow-sm">
                    <p className="font-semibold text-gray-900">Pickup Coordinates</p>
                    <p>{pickup ? `${pickup.latitude}, ${pickup.longitude}` : "Not selected"}</p>
                  </div>
                  <div className="rounded-md bg-white p-3 shadow-sm">
                    <p className="font-semibold text-gray-900">Dropoff Coordinates</p>
                    <p>{dropoff ? `${dropoff.latitude}, ${dropoff.longitude}` : "Not selected"}</p>
                  </div>
                </div>
              </div>

              {/* Ride Type Selection */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Select Ride Type
                </label>
                <select
                  name="rideType"
                  value={formData.rideType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select a ride type</option>
                  {rideTypes.map(type => (
                    <option key={type._id} value={type._id}>
                      {type.name} - {type.rideVehicle}
                    </option>
                  ))}
                </select>
              </div>

              {/* Division Selection */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Division
                </label>
                <select
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select a division</option>
                  {divisions.map((division: any) => (
                    <option key={division._id} value={division._id}>
                      {division.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Selection */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  District
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  disabled={!formData.division}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">{formData.division ? "Select a district" : "Select division first"}</option>
                  {filteredDistricts.map((district: any) => (
                    <option key={district._id} value={district._id}>
                      {district.name}
                    </option>
                  ))}
                </select>
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
                disabled={isEstimating}
                onClick={() => console.log("Button clicked!")}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {isEstimating ? "Calculating..." : "Get Fare Estimate"}
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
                  <span className="font-semibold">${estimateData?.data?.baseFare || 0}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Distance</span>
                  <span className="font-semibold">{estimateData?.data?.estimatedDistanceKm || 0} km</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">
                    <Clock className="inline mr-2" size={16} />
                    Time
                  </span>
                  <span className="font-semibold">{estimateData?.data?.estimatedDurationMinutes || 0} min</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Fare</span>
                  <span className="text-blue-600">${estimateData?.data?.totalFare || 0}</span>
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
        </>
      )}
    </div>
  );
}
