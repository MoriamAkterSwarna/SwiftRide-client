/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { User, Phone, Lock, Mail, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useGetUserProfileQuery, useUpdateUserProfileMutation, useChangePasswordMutation } from "@/redux/features/user/user.api";

export default function Profile() {
  const { data: profileData, isLoading } = useGetUserProfileQuery(undefined);
  const [updateProfile] = useUpdateUserProfileMutation();
  const [changePassword] = useChangePasswordMutation();

  const [activeTab, setActiveTab] = useState<"profile" | "password" | "emergency">("profile");
  const [formData, setFormData] = useState({
    name: profileData?.data?.name || "",
    email: profileData?.data?.email || "",
    phone: profileData?.data?.phone || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();
      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const user = profileData?.data;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            {/* Profile Avatar */}
            <div className="text-center mb-6">
              <img
                src={user?.avatar || "https://i.pravatar.cc/150?img=1"}
                alt={user?.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
              <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
            </div>

            {/* Tabs */}
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-4 py-3 rounded-lg transition font-medium flex items-center gap-3 ${
                  activeTab === "profile"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <User size={18} />
                Profile
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`w-full text-left px-4 py-3 rounded-lg transition font-medium flex items-center gap-3 ${
                  activeTab === "password"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Lock size={18} />
                Change Password
              </button>
              <button
                onClick={() => setActiveTab("emergency")}
                className={`w-full text-left px-4 py-3 rounded-lg transition font-medium flex items-center gap-3 ${
                  activeTab === "emergency"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <AlertCircle size={18} />
                Emergency Contacts
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Password Requirements:</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• At least 8 characters long</li>
                      <li>• Mix of uppercase and lowercase letters</li>
                      <li>• At least one number</li>
                      <li>• At least one special character</li>
                    </ul>
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {loading ? "Updating..." : "Change Password"}
                </button>
              </form>
            )}

            {/* Emergency Contacts Tab */}
            {activeTab === "emergency" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Emergency Contacts
                </h2>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    Add trusted contacts who will be notified in case of emergencies while riding.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Sample Emergency Contacts */}
                  <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">Mom</p>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                    <button className="text-red-600 hover:text-red-700 font-medium">
                      Remove
                    </button>
                  </div>

                  <button className="w-full border-2 border-dashed border-blue-300 rounded-lg py-4 text-blue-600 font-semibold hover:bg-blue-50 transition">
                    + Add Emergency Contact
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
