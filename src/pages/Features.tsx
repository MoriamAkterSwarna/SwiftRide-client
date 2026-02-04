import { Zap, Shield, MapPin, Heart, Users, CreditCard, TrendingUp, AlertCircle } from "lucide-react";

export default function Features() {
  const riderFeatures = [
    {
      icon: Zap,
      title: "Quick Booking",
      description: "Book a ride in just 2 clicks. Get matched with a driver instantly."
    },
    {
      icon: MapPin,
      title: "Live Tracking",
      description: "See your driver's real-time location and estimated arrival time."
    },
    {
      icon: CreditCard,
      title: "Multiple Payment Options",
      description: "Pay with cash, card, mobile wallet, or digital payment systems."
    },
    {
      icon: AlertCircle,
      title: "Emergency SOS Button",
      description: "Press the SOS button to alert emergency contacts and authorities instantly."
    },
    {
      icon: Heart,
      title: "Affordable Fares",
      description: "Transparent pricing with no hidden charges. Get fare estimate upfront."
    },
    {
      icon: Users,
      title: "Rate & Review",
      description: "Share your experience and rate drivers to maintain service quality."
    }
  ];

  const driverFeatures = [
    {
      icon: Zap,
      title: "Instant Ride Requests",
      description: "Receive ride requests in real-time and accept with one tap."
    },
    {
      icon: TrendingUp,
      title: "Earnings Dashboard",
      description: "View detailed earnings reports with daily, weekly, and monthly breakdowns."
    },
    {
      icon: MapPin,
      title: "Route Optimization",
      description: "Get optimized routes to your destination with real-time navigation."
    },
    {
      icon: Users,
      title: "Driver Support",
      description: "Access 24/7 customer support team for any issues or questions."
    },
    {
      icon: Heart,
      title: "Safety Features",
      description: "Verified riders, emergency button, and real-time ride tracking."
    },
    {
      icon: CreditCard,
      title: "Flexible Earning",
      description: "Work on your own schedule. Choose when and where to drive."
    }
  ];

  const adminFeatures = [
    {
      icon: Users,
      title: "User Management",
      description: "Manage riders and drivers with comprehensive user administration tools."
    },
    {
      icon: MapPin,
      title: "Ride Monitoring",
      description: "Monitor all active and completed rides with detailed tracking."
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "View real-time analytics on rides, revenue, and user activity."
    },
    {
      icon: Shield,
      title: "Safety Management",
      description: "Monitor safety metrics and manage emergency incidents."
    },
    {
      icon: CreditCard,
      title: "Financial Reports",
      description: "Generate comprehensive financial and transaction reports."
    },
    {
      icon: Zap,
      title: "System Administration",
      description: "Configure rates, ride types, and platform settings."
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4 md:py-24">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features for Everyone
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            Whether you're a rider, driver, or admin, SwiftRide has features designed for you
          </p>
        </div>
      </section>

      {/* Rider Features */}
      <section className="py-16 px-4 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              For Riders
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need for a comfortable and safe ride
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {riderFeatures.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition"
              >
                <feature.icon className="text-blue-600 mb-4" size={32} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
            <h3 className="font-semibold text-gray-900 mb-2">Rider Benefits:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-blue-600">✓</span> No surge pricing during emergencies
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">✓</span> Loyalty rewards program
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">✓</span> Ride history and receipts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">✓</span> Saved favorite locations
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Driver Features */}
      <section className="py-16 px-4 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              For Drivers
            </h2>
            <p className="text-lg text-gray-600">
              Tools and support to maximize your earnings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {driverFeatures.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition"
              >
                <feature.icon className="text-green-600 mb-4" size={32} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded">
            <h3 className="font-semibold text-gray-900 mb-2">Driver Benefits:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Flexible working hours
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Weekly payouts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Driver insurance coverage
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Dedicated support team
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Admin Features */}
      <section className="py-16 px-4 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              For Admins
            </h2>
            <p className="text-lg text-gray-600">
              Complete platform management and analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {adminFeatures.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition"
              >
                <feature.icon className="text-purple-600 mb-4" size={32} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded">
            <h3 className="font-semibold text-gray-900 mb-2">Admin Capabilities:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-purple-600">✓</span> Real-time system monitoring
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-600">✓</span> User fraud detection
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-600">✓</span> Customizable fare structure
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-600">✓</span> Promotional campaign management
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 px-4 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Feature Comparison
          </h2>

          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-6 py-4 text-left">Feature</th>
                  <th className="px-6 py-4 text-center">Rider</th>
                  <th className="px-6 py-4 text-center">Driver</th>
                  <th className="px-6 py-4 text-center">Admin</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Book Rides", rider: true, driver: false, admin: false },
                  { feature: "Live Tracking", rider: true, driver: true, admin: true },
                  { feature: "Earnings Dashboard", rider: false, driver: true, admin: true },
                  { feature: "User Management", rider: false, driver: false, admin: true },
                  { feature: "SOS Button", rider: true, driver: true, admin: false },
                  { feature: "Analytics", rider: false, driver: true, admin: true },
                  { feature: "Payment Processing", rider: true, driver: true, admin: true },
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.rider ? (
                        <span className="text-green-600 font-semibold">✓</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.driver ? (
                        <span className="text-green-600 font-semibold">✓</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.admin ? (
                        <span className="text-green-600 font-semibold">✓</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
