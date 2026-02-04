/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useApplyAsDriverMutation } from "@/redux/features/user/user.api";
import { useGetUserProfileQuery } from "@/redux/features/user/user.api";
import { Car, FileText, AlertCircle } from "lucide-react";

const BecomeDriver = () => {
  const navigate = useNavigate();
  const { data: userProfile } = useGetUserProfileQuery({});
  const [applyAsDriver, { isLoading }] = useApplyAsDriverMutation();

  const [formData, setFormData] = useState({
    vehicleType: "Car",
    vehicleModel: "",
    vehiclePlateNumber: "",
    drivingLicense: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.vehicleModel ||
      !formData.vehiclePlateNumber ||
      !formData.drivingLicense
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await applyAsDriver({
        user: userProfile?.data?._id,
        vehicleType: formData.vehicleType,
        vehicleModel: formData.vehicleModel,
        vehiclePlateNumber: formData.vehiclePlateNumber,
        drivingLicense: formData.drivingLicense,
      }).unwrap();

      toast.success(
        "Application submitted successfully! Awaiting admin approval."
      );
      setFormData({
        vehicleType: "Car",
        vehicleModel: "",
        vehiclePlateNumber: "",
        drivingLicense: "",
      });
      setTimeout(() => navigate("/user/profile"), 2000);
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to submit driver application"
      );
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 mb-8 text-white">
        <div className="flex items-center gap-4">
          <Car size={40} />
          <div>
            <h1 className="text-3xl font-bold">Become a Driver</h1>
            <p className="text-blue-100 mt-2">
              Join our community and start earning by providing rides
            </p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-blue-600 mb-4">
            <FileText size={32} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Submit Documents
          </h3>
          <p className="text-gray-600 text-sm">
            Provide your driving license and vehicle details
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-green-600 mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Admin Review</h3>
          <p className="text-gray-600 text-sm">
            Our admin team will verify your documents
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-purple-600 mb-4">
            <Car size={32} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Start Earning</h3>
          <p className="text-gray-600 text-sm">
            Once approved, you can start accepting ride requests
          </p>
        </div>
      </div>

      {/* Application Form */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Driver Application Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information (Read-only) */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userProfile?.data?.name || ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={userProfile?.data?.email || ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={userProfile?.data?.phone || ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">
              Vehicle Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="Car">Car</option>
                  <option value="Bike">Bike</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  placeholder="e.g., Toyota Corolla 2020"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Plate Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="vehiclePlateNumber"
                  value={formData.vehiclePlateNumber}
                  onChange={handleChange}
                  placeholder="e.g., DH-01-1234"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Documentation */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Documentation</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Driving License Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="drivingLicense"
                value={formData.drivingLicense}
                onChange={handleChange}
                placeholder="Enter your driving license number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Make sure your driving license is valid and active
              </p>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              By submitting this application, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Terms of Service
              </a>{" "}
              and confirm that all information provided is accurate and truthful.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/user/profile")}
              className="flex-1 border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:border-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>

      {/* Requirements */}
      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <h3 className="font-semibold text-gray-900 mb-4">Requirements</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-center gap-2">
            <span className="text-blue-600">✓</span>
            Valid driving license
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-600">✓</span>
            Vehicle registration documents
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-600">✓</span>
            Clean driving record
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-600">✓</span>
            18+ years old
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BecomeDriver;
