import { useTheme } from "@/hooks/useTheme";
import { Calendar, MapPin, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const SearchBooking = () => {
  const { theme } = useTheme();
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");

  return (
    <>
      {/* Search/Booking Section */}
      <section
        className={`relative -mt-20 ${theme === "dark" ? "bg-gray-950" : "bg-white"}`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`p-8 rounded-2xl shadow-2xl ${theme === "dark" ? "bg-linear-to-r from-gray-800 to-gray-900 border border-gray-700" : "bg-linear-to-r from-white to-gray-50 border border-gray-200"}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label
                  className={`text-sm font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                >
                  Pickup Location
                </label>

                <div
                  className={`relative h-14 rounded-lg border 
    ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}
                >
                  {/* Map Icon */}
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />

                  {/* Input */}
                  <Input
                    placeholder="Where from?"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className={`h-14 pl-12 border-0 bg-transparent outline-none w-full
      ${
        theme === "dark"
          ? "text-white placeholder:text-gray-400"
          : "text-gray-900 placeholder:text-gray-500"
      }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className={`text-sm font-semibold ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Dropoff Location
                </label>

                <div
                  className={`relative h-14 rounded-lg border
    ${
      theme === "dark"
        ? "bg-gray-700 border-gray-600"
        : "bg-gray-100 border-gray-300"
    }`}
                >
                  {/* Map Icon */}
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />

                  {/* Input */}
                  <Input
                    placeholder="Where to?"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    className={`h-14 pl-12 w-full border-0 bg-transparent outline-none
      ${
        theme === "dark"
          ? "text-white placeholder:text-gray-400"
          : "text-gray-900 placeholder:text-gray-500"
      }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className={`text-sm font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                >
                  When
                </label>
                <div
                  className={`flex items-center px-4 rounded-lg border h-14 ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}
                >
                  <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                  <input
                    type="date"
                    className={`h-full border-0 outline-none ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  />
                </div>
              </div>

              <div className="h-14 mt-6">
                <Button
                  className="h-14 w-full bg-linear-to-r from-blue-500 to-cyan-500 
    hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg 
    font-semibold group"
                >
                  <Search className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Find Rides
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default SearchBooking;
