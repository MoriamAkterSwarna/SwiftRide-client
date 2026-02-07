/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { User, Phone, Lock, Mail, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useGetUserProfileQuery, useChangePasswordMutation, useUpdateUserProfileMutation } from "@/redux/features/user/user.api";

interface RootState {
  authSession: {
    hasSession: boolean;
  };
}

export default function Profile() {
  const hasSessionHint = useSelector((state: RootState) => state.authSession.hasSession);
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "emergency">("profile");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", picture: "" });
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const { data: profileData } = useGetUserProfileQuery(undefined, { skip: !hasSessionHint });
  const [updateProfile] = useUpdateUserProfileMutation();
  const [changePassword] = useChangePasswordMutation();

  const user = profileData?.data?.data ?? profileData?.data ?? profileData;
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "-";
  const roleLabel = user?.role?.toString().replace(/_/g, " ") || "Member";
  const avatarSrc = avatarPreview || user?.picture || "https://i.pravatar.cc/160?img=1";

  useEffect(() => {
    if (!user) return;
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      picture: user?.picture || "",
    });
    setAvatarPreview(user?.picture || "");
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setAvatarPreview(result);
      setFormData((prev) => ({ ...prev, picture: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Don't send email - it can't be updated
      const { email, ...dataToUpdateWithoutEmail } = formData;
      const result = await updateProfile(dataToUpdateWithoutEmail).unwrap();
      console.log("Profile update response:", result);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      const errorMessage = (error as any)?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
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
    setLoading(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();
      toast.success("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-6 pt-10 font-body">
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/70 p-8 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.65)] backdrop-blur">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,200,160,0.9),rgba(255,200,160,0.1)_55%,transparent_70%)]" />
        <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(147,197,253,0.85),rgba(147,197,253,0.15)_55%,transparent_70%)]" />
        <div className="pointer-events-none absolute bottom-[-120px] right-12 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(52,211,153,0.6),rgba(52,211,153,0.15)_55%,transparent_70%)]" />

        <div className="relative z-10">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="w-full lg:w-[320px]">
              <div className="rounded-3xl border border-slate-200/60 bg-white/90 p-6 shadow-[0_15px_40px_-30px_rgba(15,23,42,0.7)]">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <img
                      src={avatarSrc}
                      alt={user?.name}
                      className="h-28 w-28 rounded-[28px] object-cover shadow-[0_10px_30px_-20px_rgba(15,23,42,0.9)]"
                    />
                    <span className="absolute -bottom-2 -right-2 rounded-full bg-emerald-400 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-950">
                      Active
                    </span>
                  </div>
                  <h2 className="mt-5 font-display text-2xl font-semibold text-slate-900">
                    {user?.name || "Unnamed Rider"}
                  </h2>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    {roleLabel}
                  </p>
                  <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600">
                    <span className="flex items-center justify-center gap-2">
                      <Mail size={16} />
                      {user?.email || "No email"}
                    </span>
                    <span className="flex items-center justify-center gap-2">
                      <Phone size={16} />
                      {user?.phone || "No phone"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-slate-200/60 bg-slate-50/80 p-4 text-center">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Rides</p>
                    <p className="font-display text-lg font-semibold text-slate-900">24</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Rating</p>
                    <p className="font-display text-lg font-semibold text-slate-900">4.8</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Since</p>
                    <p className="text-sm font-semibold text-slate-700">{joinedDate}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                      activeTab === "profile"
                        ? "bg-slate-900 text-white shadow-[0_12px_30px_-16px_rgba(15,23,42,0.9)]"
                        : "border border-slate-200/70 bg-white/90 text-slate-700 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-18px_rgba(15,23,42,0.5)]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <User size={16} />
                      Personal Details
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab("password")}
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                      activeTab === "password"
                        ? "bg-slate-900 text-white shadow-[0_12px_30px_-16px_rgba(15,23,42,0.9)]"
                        : "border border-slate-200/70 bg-white/90 text-slate-700 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-18px_rgba(15,23,42,0.5)]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Lock size={16} />
                      Security & Password
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab("emergency")}
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                      activeTab === "emergency"
                        ? "bg-slate-900 text-white shadow-[0_12px_30px_-16px_rgba(15,23,42,0.9)]"
                        : "border border-slate-200/70 bg-white/90 text-slate-700 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-18px_rgba(15,23,42,0.5)]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <AlertCircle size={16} />
                      Emergency Contacts
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.7)]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                      Profile Overview
                    </p>
                    <h1 className="font-display text-3xl font-semibold text-slate-900">
                      Profile & Settings
                    </h1>
                  </div>
                  <div className="flex items-center gap-3 rounded-full border border-slate-200/70 bg-white/80 px-4 py-2 text-sm text-slate-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                    Account healthy
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Preferred Payment</p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">Cash / Wallet</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Support Tier</p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">Priority</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Security</p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">2FA Ready</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.7)]">
                {activeTab === "profile" && (
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-display text-2xl font-semibold text-slate-900">Edit Profile</h2>
                        <p className="text-sm text-slate-500">
                          Keep your profile up to date for the best ride experience.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-5">
                      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                        <img
                          src={avatarSrc}
                          alt="Profile preview"
                          className="h-20 w-20 rounded-2xl object-cover shadow-[0_8px_24px_-16px_rgba(15,23,42,0.6)]"
                        />
                        <div className="flex-1">
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                            Profile Photo
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Upload a square image (JPG/PNG). Max 2MB.
                          </p>
                        </div>
                        <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-200/70 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-14px_rgba(15,23,42,0.5)]">
                          Change Photo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleProfileChange}
                          className="w-full rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleProfileChange}
                          className="w-full rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleProfileChange}
                        className="w-full rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </form>
                )}

                {activeTab === "password" && (
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <h2 className="font-display text-2xl font-semibold text-slate-900">Security Settings</h2>
                      <p className="text-sm text-slate-500">
                        Rotate your password regularly to keep your account safe.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-amber-200/70 bg-amber-50/70 p-4 text-sm text-amber-900">
                      <p className="font-semibold">Password tips</p>
                      <ul className="mt-2 space-y-1 text-xs text-amber-800">
                        <li>• Use at least 8 characters</li>
                        <li>• Mix numbers and symbols</li>
                        <li>• Avoid reused passwords</li>
                      </ul>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      {loading ? "Saving..." : "Update Password"}
                    </button>
                  </form>
                )}

                {activeTab === "emergency" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-2xl font-semibold text-slate-900">Emergency Contacts</h2>
                      <p className="text-sm text-slate-500">
                        Add trusted contacts for urgent situations.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-6 text-center">
                      <AlertCircle className="mx-auto mb-3 text-slate-500" size={28} />
                      <p className="text-sm text-slate-600">Emergency contacts feature coming soon.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
}
