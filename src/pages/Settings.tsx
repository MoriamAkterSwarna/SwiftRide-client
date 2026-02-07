import { useState } from "react";
import { useSelector } from "react-redux";
import { Bell, Shield, Palette, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "@/hooks/useTheme";

interface RootState {
  authSession: {
    hasSession: boolean;
  };
}

interface SettingsState {
  notifications: {
    rideUpdates: boolean;
    promotions: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
  privacy: {
    profileVisibility: string;
    showLocation: boolean;
    allowMessages: boolean;
  };
  display: {
    darkMode: boolean;
    fontSize: string;
    compactView: boolean;
  };
}

export default function Settings() {
  const hasSessionHint = useSelector((state: RootState) => state.authSession.hasSession);
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      rideUpdates: true,
      promotions: true,
      emailNotifications: true,
      smsNotifications: false,
    },
    privacy: {
      profileVisibility: "public",
      showLocation: true,
      allowMessages: true,
    },
    display: {
      darkMode: theme === "dark",
      fontSize: "normal",
      compactView: false,
    },
  });

  if (!hasSessionHint) {
    return (
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 text-center">
        <p className="text-slate-600">Please log in to access settings.</p>
      </div>
    );
  }

  const handleToggle = (section: keyof SettingsState, key: string) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key as keyof (typeof prev)[keyof typeof prev]],
      },
    } as SettingsState));
    toast.success("Setting updated");
  };

  const handleSelectChange = (section: keyof SettingsState, key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    } as SettingsState));
  };

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme as "light" | "dark");
    setSettings((prev) => ({
      ...prev,
      display: {
        ...prev.display,
        darkMode: newTheme === "dark",
      },
    }));
    toast.success("Theme updated");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 font-body">
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/70 p-8 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.65)] backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/70">
        {/* Background Gradients */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,200,160,0.9),rgba(255,200,160,0.1)_55%,transparent_70%)]" />
        <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(147,197,253,0.85),rgba(147,197,253,0.15)_55%,transparent_70%)]" />
        <div className="pointer-events-none absolute bottom-[-120px] right-12 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(52,211,153,0.6),rgba(52,211,153,0.15)_55%,transparent_70%)]" />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              Preferences
            </p>
            <h1 className="font-display text-4xl font-semibold text-slate-900 dark:text-white">
              Settings & Preferences
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Customize your app experience, notifications, and privacy settings.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Notifications Section */}
            <div className="space-y-4 rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.7)] dark:border-slate-800/70 dark:bg-slate-900/50">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                <Bell className="h-6 w-6 text-orange-500" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Notifications
                </h2>
              </div>

              <div className="space-y-4">
                <ToggleItem
                  label="Ride Updates"
                  description="Get notified about ride status changes"
                  value={settings.notifications.rideUpdates}
                  onChange={() => handleToggle("notifications", "rideUpdates")}
                />
                <ToggleItem
                  label="Promotions & Offers"
                  description="Receive offers and promotions"
                  value={settings.notifications.promotions}
                  onChange={() => handleToggle("notifications", "promotions")}
                />
                <ToggleItem
                  label="Email Notifications"
                  description="Send notifications via email"
                  value={settings.notifications.emailNotifications}
                  onChange={() => handleToggle("notifications", "emailNotifications")}
                />
                <ToggleItem
                  label="SMS Notifications"
                  description="Send notifications via SMS"
                  value={settings.notifications.smsNotifications}
                  onChange={() => handleToggle("notifications", "smsNotifications")}
                />
              </div>
            </div>

            {/* Privacy Section */}
            <div className="space-y-4 rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.7)] dark:border-slate-800/70 dark:bg-slate-900/50">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                <Shield className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Privacy
                </h2>
              </div>

              <div className="space-y-4">
                <SelectItem
                  label="Profile Visibility"
                  description="Who can see your profile"
                  value={settings.privacy.profileVisibility}
                  options={[
                    { label: "Public", value: "public" },
                    { label: "Private", value: "private" },
                    { label: "Friends Only", value: "friends" },
                  ]}
                  onChange={(value) => handleSelectChange("privacy", "profileVisibility", value)}
                />
                <ToggleItem
                  label="Show Location"
                  description="Share your location with drivers"
                  value={settings.privacy.showLocation}
                  onChange={() => handleToggle("privacy", "showLocation")}
                />
                <ToggleItem
                  label="Allow Messages"
                  description="Let others message you"
                  value={settings.privacy.allowMessages}
                  onChange={() => handleToggle("privacy", "allowMessages")}
                />
              </div>
            </div>

            {/* Display Settings */}
            <div className="space-y-4 rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.7)] dark:border-slate-800/70 dark:bg-slate-900/50">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                <Palette className="h-6 w-6 text-purple-500" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Display
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-slate-50/80 p-4 dark:border-slate-800/60 dark:bg-slate-800/40">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">Dark Mode</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Switch theme appearance
                    </p>
                  </div>
                  <button
                    onClick={handleThemeToggle}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                      theme === "dark"
                        ? "bg-blue-500"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        theme === "dark" ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                <SelectItem
                  label="Font Size"
                  description="Adjust text size"
                  value={settings.display.fontSize}
                  options={[
                    { label: "Small", value: "small" },
                    { label: "Normal", value: "normal" },
                    { label: "Large", value: "large" },
                  ]}
                  onChange={(value) => handleSelectChange("display", "fontSize", value)}
                />

                <ToggleItem
                  label="Compact View"
                  description="Reduce spacing in lists"
                  value={settings.display.compactView}
                  onChange={() => handleToggle("display", "compactView")}
                />
              </div>
            </div>

            {/* Security Section */}
            <div className="space-y-4 rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.7)] dark:border-slate-800/70 dark:bg-slate-900/50">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                <Lock className="h-6 w-6 text-green-500" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Security
                </h2>
              </div>

              <div className="space-y-3">
                <button className="w-full rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-left font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 dark:border-slate-800/70 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700/50">
                  <div className="flex items-center justify-between">
                    <span>Change Password</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">→</span>
                  </div>
                </button>

                <button className="w-full rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-left font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 dark:border-slate-800/70 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700/50">
                  <div className="flex items-center justify-between">
                    <span>Two-Factor Authentication</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">→</span>
                  </div>
                </button>

                <button className="w-full rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-left font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 dark:border-slate-800/70 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700/50">
                  <div className="flex items-center justify-between">
                    <span>Active Sessions</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">→</span>
                  </div>
                </button>

                <button className="w-full rounded-2xl border border-red-200/50 bg-red-50/70 px-4 py-3 text-left font-medium text-red-700 transition-all duration-200 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-900/70">
                  <div className="flex items-center justify-between">
                    <span>Delete Account</span>
                    <span className="text-sm">→</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => toast.success("All settings saved successfully!")}
              className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl dark:from-blue-600 dark:to-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleItem({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-slate-50/80 p-4 dark:border-slate-800/60 dark:bg-slate-800/40">
      <div className="flex-1">
        <p className="font-medium text-slate-900 dark:text-white">{label}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
          value ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"
        }`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
            value ? "translate-x-6" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function SelectItem({
  label,
  description,
  value,
  options,
  onChange,
}: {
  label: string;
  description: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-slate-50/80 p-4 dark:border-slate-800/60 dark:bg-slate-800/40">
      <label className="block">
        <p className="mb-1 font-medium text-slate-900 dark:text-white">{label}</p>
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">{description}</p>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 transition-colors hover:border-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:border-slate-500"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
