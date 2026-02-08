/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { MapPin, Clock, CreditCard, Upload, Users, Calendar, DollarSign, Car } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateRideMutation, useEstimateFareMutation, useGetRideTypesQuery } from "@/redux/features/ride/ride.api";
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

export default function AddRide() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pickUpLocation: {
      address: "",
      coordinates: { latitude: 0, longitude: 0 }
    },
    dropOffLocation: {
      address: "",
      coordinates: { latitude: 0, longitude: 0 }
    },
    pickUpTime: "",
    dropOffTime: "",
    cost: "",
    amenities: [] as string[],
    maxGuests: "",
    minAge: "",
    division: "",
    district: "",
    rideType: "",
    availableSeats: "",
    vehicle: "",
    images: [] as string[],
  });

  const [showEstimate, setShowEstimate] = useState(false);
  const [estimateData, setEstimateData] = useState<any>(null);
  const [showActiveRides, setShowActiveRides] = useState(false);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [createRide, { isLoading }] = useCreateRideMutation();
  const [estimateFare, { isLoading: isEstimating }] = useEstimateFareMutation();

  // Fetch data
  const { data: divisionsData } = useGetDivisionsQuery();
  const { data: districtsData } = useGetDistrictsQuery();
  const { data: rideTypesData } = useGetRideTypesQuery();
  const hasSessionHint = useAppSelector((state) => state.authSession.hasSession);
  const { data: userData } = useUserInfoQuery(undefined, { skip: !hasSessionHint });
  
  const dispatch = useAppDispatch();
  const { pickup, dropoff, activeTarget } = useAppSelector((state) => state.location);

  const availableAmenities = [
    "WiFi", "AC", "Music", "Water", "Snacks", "Phone Charger", "Pet Friendly", "Luggage Space"
  ];

  const vehicleTypes = ["Car", "Bike", "SUV", "Van", "Luxury"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "division" ? { district: "" } : {}),
    }));
  };

  const handleLocationSelect = (location: LocationPoint) => {
    if (activeTarget === "pickup") {
      dispatch(setPickup(location));
      setFormData(prev => ({
        ...prev,
        pickUpLocation: {
          address: location.address,
          coordinates: {
            latitude: location.latitude,
            longitude: location.longitude,
          }
        }
      }));
    } else {
      dispatch(setDropoff(location));
      setFormData(prev => ({
        ...prev,
        dropOffLocation: {
          address: location.address,
          coordinates: {
            latitude: location.latitude,
            longitude: location.longitude,
          }
        }
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const readers: Promise<string>[] = [];

    fileArray.forEach(file => {
      const reader = new FileReader();
      readers.push(
        new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
      );
    });

    Promise.all(readers).then(results => {
      setImagePreview(prev => [...prev, ...results]);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...results]
      }));
    });
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => {
      const updated = prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity];
      
      setFormData(prevForm => ({
        ...prevForm,
        amenities: updated
      }));
      
      return updated;
    });
  };

  const handleGetEstimate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.rideType || !pickup || !dropoff) {
      toast.error("Please select pickup, dropoff, and ride type");
      return;
    }

    const selectedRideType = rideTypes.find((type: any) => type._id === formData.rideType);
    const vehicleType = selectedRideType?.rideVehicle;

    if (!vehicleType) {
      toast.error("Unable to determine vehicle type");
      return;
    }

    if (vehicleType !== "Car" && vehicleType !== "Bike") {
      toast.error(`Fare estimation is only available for Car or Bike. You selected ${vehicleType}.`);
      return;
    }

    try {
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

      const result = await estimateFare(fareData).unwrap();
      setEstimateData(result);
      setShowEstimate(true);
      toast.success("Fare estimated successfully!");
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to estimate fare";
      toast.error(errorMessage);
    }
  };

  const handleSubmitRide = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userId = userData?.data?._id || userData?.data?.data?._id || userData?._id;

      if (!userId) {
        toast.error("Please login to create a ride");
        return;
      }

      // Validation
      if (!formData.title || !formData.rideType || !formData.division || !formData.district || !pickup || !dropoff) {
        toast.error("Please fill in all required fields");
        return;
      }

      const ridePayload = {
        user: userId,
        title: formData.title,
        description: formData.description,
        pickUpLocation: {
          address: pickup.address,
          coordinates: {
            latitude: Number(pickup.latitude),
            longitude: Number(pickup.longitude),
          }
        },
        dropOffLocation: {
          address: dropoff.address,
          coordinates: {
            latitude: Number(dropoff.latitude),
            longitude: Number(dropoff.longitude),
          }
        },
        pickUpTime: formData.pickUpTime ? new Date(formData.pickUpTime).toISOString() : undefined,
        dropOffTime: formData.dropOffTime ? new Date(formData.dropOffTime).toISOString() : undefined,
        cost: Number(formData.cost || estimateData?.data?.totalFare || 0),
        amenities: formData.amenities,
        maxGuests: formData.maxGuests ? Number(formData.maxGuests) : undefined,
        minAge: formData.minAge ? Number(formData.minAge) : undefined,
        division: formData.division,
        district: formData.district,
        rideType: formData.rideType,
        availableSeats: formData.availableSeats ? Number(formData.availableSeats) : undefined,
        vehicle: formData.vehicle,
        images: formData.images,
      };

      const result = await createRide(ridePayload as any).unwrap();
      toast.success("Ride created successfully!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        pickUpLocation: { address: "", coordinates: { latitude: 0, longitude: 0 } },
        dropOffLocation: { address: "", coordinates: { latitude: 0, longitude: 0 } },
        pickUpTime: "",
        dropOffTime: "",
        cost: "",
        amenities: [],
        maxGuests: "",
        minAge: "",
        division: "",
        district: "",
        rideType: "",
        availableSeats: "",
        vehicle: "",
        images: [],
      });
      setSelectedAmenities([]);
      setImagePreview([]);
      dispatch(clearLocations());
      setShowEstimate(false);
      setEstimateData(null);
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || "Failed to create ride";
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

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 min-h-screen bg-white dark:bg-gray-950">
      {/* Toggle Buttons */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <div className="flex gap-4 items-center justify-between flex-wrap">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ride Management</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowActiveRides(false)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                !showActiveRides
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              <Car className="inline mr-2" size={18} />
              Create Ride
            </button>
            <button
              onClick={() => setShowActiveRides(true)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                showActiveRides
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              <Clock className="inline mr-2" size={18} />
              My Rides
            </button>
          </div>
        </div>
      </div>

      {/* Show Active Rides or Create Form */}
      {showActiveRides ? (
        <MultipleRideRequests />
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Ride</h2>

          <form onSubmit={handleSubmitRide} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Ride Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Dhaka to Chittagong Express"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Add details about your ride..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Location Details</h3>

              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Select Locations</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Click on map or search to set pickup and dropoff points</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => dispatch(setActiveTarget("pickup"))}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                        activeTarget === "pickup"
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 ring-1 ring-gray-300 dark:ring-gray-600 hover:ring-blue-400"
                      }`}
                    >
                      <MapPin className="inline mr-1" size={16} />
                      Pickup
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch(setActiveTarget("dropoff"))}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                        activeTarget === "dropoff"
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 ring-1 ring-gray-300 dark:ring-gray-600 hover:ring-blue-400"
                      }`}
                    >
                      <MapPin className="inline mr-1" size={16} />
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

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-lg bg-white dark:bg-gray-700 p-4 shadow-sm border border-gray-200 dark:border-gray-600">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">📍 Pickup Location</p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">{pickup?.address || "Not selected"}</p>
                    {pickup && (
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                        {pickup.latitude.toFixed(4)}, {pickup.longitude.toFixed(4)}
                      </p>
                    )}
                  </div>
                  <div className="rounded-lg bg-white dark:bg-gray-700 p-4 shadow-sm border border-gray-200 dark:border-gray-600">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">🎯 Dropoff Location</p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">{dropoff?.address || "Not selected"}</p>
                    {dropoff && (
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                        {dropoff.latitude.toFixed(4)}, {dropoff.longitude.toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule & Pricing */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Schedule & Pricing</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    <Calendar className="inline mr-2" size={18} />
                    Pickup Time
                  </label>
                  <input
                    type="datetime-local"
                    name="pickUpTime"
                    value={formData.pickUpTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    <Calendar className="inline mr-2" size={18} />
                    Dropoff Time (Estimated)
                  </label>
                  <input
                    type="datetime-local"
                    name="dropOffTime"
                    value={formData.dropOffTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    <DollarSign className="inline mr-2" size={18} />
                    Cost per Seat (BDT)
                  </label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    placeholder="Enter cost or use estimate"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                  {estimateData && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, cost: estimateData?.data?.totalFare?.toString() || "" }))}
                      className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Use estimated fare: BDT {estimateData?.data?.totalFare}
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    <Users className="inline mr-2" size={18} />
                    Available Seats
                  </label>
                  <input
                    type="number"
                    name="availableSeats"
                    value={formData.availableSeats}
                    onChange={handleChange}
                    placeholder="e.g., 3"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Max Guests
                  </label>
                  <input
                    type="number"
                    name="maxGuests"
                    value={formData.maxGuests}
                    onChange={handleChange}
                    placeholder="e.g., 4"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Minimum Age
                  </label>
                  <input
                    type="number"
                    name="minAge"
                    value={formData.minAge}
                    onChange={handleChange}
                    placeholder="e.g., 18"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Ride Configuration */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Ride Configuration</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Ride Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="rideType"
                    value={formData.rideType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select ride type</option>
                    {rideTypes.map((type: any) => (
                      <option key={type._id} value={type._id}>
                        {type.placeType} - {type.rideVehicle}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Vehicle Type
                  </label>
                  <select
                    name="vehicle"
                    value={formData.vehicle}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select vehicle</option>
                    {vehicleTypes.map(vehicle => (
                      <option key={vehicle} value={vehicle}>
                        {vehicle}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Division <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="division"
                    value={formData.division}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select division</option>
                    {divisions.map((division: any) => (
                      <option key={division._id} value={division._id}>
                        {division.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    disabled={!formData.division}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">
                      {formData.division ? "Select district" : "Select division first"}
                    </option>
                    {filteredDistricts.map((district: any) => (
                      <option key={district._id} value={district._id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {availableAmenities.map(amenity => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      selectedAmenities.includes(amenity)
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Images</h3>
              <div>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition bg-white dark:bg-gray-800">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload images</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {imagePreview.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {imagePreview.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(prev => prev.filter((_, i) => i !== idx));
                          setFormData(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== idx)
                          }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleGetEstimate}
                disabled={isEstimating}
                className="flex-1 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 py-3 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition disabled:opacity-50"
              >
                {isEstimating ? "Calculating..." : "Get Fare Estimate"}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 shadow-md"
              >
                {isLoading ? "Creating..." : "Create Ride"}
              </button>
            </div>
          </form>

          {/* Fare Estimate Display */}
          {showEstimate && estimateData && (
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">💰 Fare Estimate</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Base Fare</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">৳{estimateData?.data?.baseFare || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Distance</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{estimateData?.data?.estimatedDistanceKm || 0} km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{estimateData?.data?.estimatedDurationMinutes || 0} min</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Fare</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">৳{estimateData?.data?.totalFare || 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}