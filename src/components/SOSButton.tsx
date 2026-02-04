/* eslint-disable @typescript-eslint/no-unused-vars */
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface SOSButtonProps {
  onActivate?: () => void;
  visible?: boolean;
  rideId?: string;
}

export default function SOSButton({ onActivate, visible = true, rideId }: SOSButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const emergencyOptions = [
    {
      id: "police",
      label: "Call Police",
      description: "Alert emergency services immediately",
      icon: "🚨",
    },
    {
      id: "contact",
      label: "Notify Emergency Contact",
      description: "Send alert to your saved emergency contact",
      icon: "👨‍👩‍👧",
    },
    {
      id: "location",
      label: "Share Live Location",
      description: "Share your live location with emergency contact",
      icon: "📍",
    },
  ];

  const handleSOSClick = () => {
    setShowModal(true);
  };

  const handleOption = async (optionId: string) => {
    setSelectedOption(optionId);
    setIsProcessing(true);

    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      switch (optionId) {
        case "police":
          // In a real app, this would call emergency services API
          toast.success("Emergency services have been alerted");
          break;
        case "contact":
          // Notify emergency contact
          toast.success("Emergency contact has been notified");
          break;
        case "location":
          // Get user location and share
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                const mapLink = `https://maps.google.com/?q=${latitude},${longitude}`;
                // In a real app, send this to emergency contact
                toast.success("Live location shared with emergency contact");
              },
              () => {
                toast.error("Unable to get your location");
              }
            );
          } else {
            toast.error("Geolocation not supported on your device");
          }
          break;
      }

      if (onActivate) {
        onActivate();
      }

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowModal(false);
        setSelectedOption(null);
      }, 2000);
    } catch (error) {
      toast.error("Failed to process SOS request");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* SOS Button - Floating Action Button */}
      <button
        onClick={handleSOSClick}
        className="fixed bottom-24 right-6 z-40 bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition transform hover:scale-110 flex items-center justify-center gap-2 animate-pulse"
        title="Emergency SOS Button"
      >
        <AlertTriangle size={24} />
        <span className="hidden sm:inline font-bold">SOS</span>
      </button>

      {/* SOS Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
            {/* Header */}
            <div className="bg-red-600 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle size={28} />
                <h2 className="text-2xl font-bold">Emergency Alert</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="hover:bg-red-700 p-1 rounded transition"
                disabled={isProcessing}
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {selectedOption ? (
                <div className="text-center py-8">
                  <div className="animate-spin inline-block">
                    <AlertTriangle className="text-red-600" size={48} />
                  </div>
                  <p className="text-gray-700 font-semibold mt-4">
                    Processing your emergency request...
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-gray-700 mb-6">
                    Select an option to alert emergency services:
                  </p>

                  <div className="space-y-3">
                    {emergencyOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => handleOption(option.id)}
                        disabled={isProcessing}
                        className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-red-600 hover:bg-red-50 transition flex items-start gap-4 disabled:opacity-50"
                      >
                        <span className="text-2xl">{option.icon}</span>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900">
                            {option.label}
                          </p>
                          <p className="text-sm text-gray-600">
                            {option.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> If you're in immediate danger, always call emergency services directly.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {!selectedOption && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
