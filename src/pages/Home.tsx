/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  ChevronRight,
  MapPin,
  Calendar,
  Zap,
  Shield,
  Clock,
  Star,
  ArrowRight,
  Search,
  Car,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { motion } from "motion/react"


const Home = () => {
  const { theme } = useTheme();
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Business Traveler",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      text: "SwiftRide has completely changed how I commute. Fast, reliable, and incredibly affordable!",
      rating: 5,
    },
    {
      name: "Ahmed Hassan",
      role: "Student",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
      text: "The best ride-sharing app I've used. Great drivers and outstanding customer service.",
      rating: 5,
    },
    {
      name: "Maria Garcia",
      role: "Professional",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      text: "Safe, punctual, and convenient. SwiftRide is my go-to for all my travels.",
      rating: 5,
    },
  ];

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Get a ride in seconds with our optimized matching algorithm",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Safe & Secure",
      description: "Verified drivers and real-time GPS tracking for your peace of mind",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "24/7 Service",
      description: "Available round the clock whenever you need a ride",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Top Rated",
      description: "4.9+ stars with thousands of happy customers",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  const rideTypes = [
    {
      name: "Eco",
      price: "$4.50",
      image: "🚗",
      description: "Economy rides",
      info: "Perfect for budget-conscious travelers",
    },
    {
      name: "Comfort",
      price: "$7.20",
      image: "🚙",
      description: "Comfortable rides",
      info: "Extra space and comfort for your journey",
    },
    {
      name: "Premium",
      price: "$12.99",
      image: "🚕",
      description: "Luxury rides",
      info: "Premium vehicles with top-tier service",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8 },
    },
  };

  const slideInVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8 },
    },
  };

  const floatVariants = {
    hidden: { y: 0 },
    visible: {
      y: [-20, 20, -20],
      transition: { duration: 4, repeat: Infinity },
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-950 text-white" : "bg-white text-gray-900"}`}>
      {/* Hero Section */}
      <section className={`relative overflow-hidden ${theme === "dark" ? "bg-gradient-to-br from-gray-900 via-gray-950 to-black" : "bg-gradient-to-br from-blue-50 via-white to-cyan-50"}`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-20 left-10 w-96 h-96 ${theme === "dark" ? "bg-blue-500/10" : "bg-blue-200/30"} rounded-full blur-3xl`} />
          <div className={`absolute bottom-20 right-10 w-96 h-96 ${theme === "dark" ? "bg-cyan-500/10" : "bg-cyan-200/30"} rounded-full blur-3xl`} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="space-y-6">
                <div className={`inline-flex items-center px-4 py-2 rounded-full ${theme === "dark" ? "bg-blue-500/20 border border-blue-500/50" : "bg-blue-100 border border-blue-300"}`}>
                  <span className="text-sm font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    ✨ Welcome to SwiftRide
                  </span>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="block">Your Journey</span>
                  <span className="block bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 bg-clip-text text-transparent">
                    Starts Here
                  </span>
                </h1>

                <p className={`text-xl ${theme === "dark" ? "text-gray-400" : "text-gray-600"} leading-relaxed max-w-xl`}>
                  Experience the future of ride-sharing. Fast, safe, and affordable transportation at your fingertips.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-6 text-lg rounded-xl font-semibold group">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" className={`px-8 py-6 text-lg rounded-xl font-semibold ${theme === "dark" ? "border-gray-700 hover:bg-gray-800" : "border-gray-300 hover:bg-gray-100"}`}>
                  Watch Demo
                </Button>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center gap-8 pt-4">
                {[
                  { label: "50K+ Users", value: "Active Users" },
                  { label: "4.9⭐", value: "Rating" },
                  { label: "24/7", value: "Support" },
                ].map((stat, idx) => (
                  <div key={idx}>
                    <p className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                      {stat.label}
                    </p>
                    <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              variants={floatVariants}
              initial="hidden"
              animate="visible"
              className="hidden lg:block"
            >
              <div className={`relative w-96 h-96 rounded-3xl overflow-hidden ${theme === "dark" ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30" : "bg-gradient-to-br from-blue-200/50 to-cyan-200/50 border border-blue-200"}`}>
                <div className="flex items-center justify-center h-full">
                  <Car className="w-48 h-48 text-blue-500 opacity-20" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search/Booking Section */}
      <section className={`relative -mt-20 ${theme === "dark" ? "bg-gray-950" : "bg-white"}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`p-8 rounded-2xl shadow-2xl ${theme === "dark" ? "bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700" : "bg-gradient-to-r from-white to-gray-50 border border-gray-200"}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className={`text-sm font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Pickup Location
                </label>
                <div className={`flex items-center px-4 py-3 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}>
                  <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                  <Input
                    placeholder="Where from?"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className={`border-0 bg-transparent outline-none ${theme === "dark" ? "text-white placeholder:text-gray-400" : "text-gray-900 placeholder:text-gray-500"}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Dropoff Location
                </label>
                <div className={`flex items-center px-4 py-3 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}>
                  <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                  <Input
                    placeholder="Where to?"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    className={`border-0 bg-transparent outline-none ${theme === "dark" ? "text-white placeholder:text-gray-400" : "text-gray-900 placeholder:text-gray-500"}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  When
                </label>
                <div className={`flex items-center px-4 py-3 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}>
                  <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                  <input
                    type="date"
                    className={`border-0 bg-transparent outline-none ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  />
                </div>
              </div>

              <div className="flex items-end">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-semibold py-3 group">
                  <Search className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Find Rides
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-24 ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-bold mb-4">
              Why Choose <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">SwiftRide?</span>
            </motion.h2>
            <motion.p variants={itemVariants} className={`text-xl ${theme === "dark" ? "text-gray-400" : "text-gray-600"} max-w-2xl mx-auto`}>
              We're committed to providing the best ride-sharing experience
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className={`group p-8 rounded-2xl transition-all duration-300 ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700 border border-gray-700" : "bg-white hover:shadow-lg border border-gray-200"}`}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Ride Types Section */}
      <section className={`py-24 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-bold mb-4">
              Choose Your <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Perfect Ride</span>
            </motion.h2>
            <motion.p variants={itemVariants} className={`text-xl ${theme === "dark" ? "text-gray-400" : "text-gray-600"} max-w-2xl mx-auto`}>
              Select from our wide range of vehicles to suit your needs
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {rideTypes.map((ride, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className={`relative group overflow-hidden rounded-2xl ${theme === "dark" ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700" : "bg-gradient-to-br from-white to-gray-50 border border-gray-200"}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300" />
                <div className="relative p-8 space-y-6">
                  <div className="text-7xl">{ride.image}</div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{ride.name}</h3>
                    <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                      {ride.description}
                    </p>
                  </div>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                    {ride.info}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-blue-500">{ride.price}</span>
                    <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg group-hover:translate-x-1 transition-transform">
                      Book Now <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-24 ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-bold mb-4">
              What Our <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Users Say</span>
            </motion.h2>
            <motion.p variants={itemVariants} className={`text-xl ${theme === "dark" ? "text-gray-400" : "text-gray-600"} max-w-2xl mx-auto`}>
              Join thousands of satisfied customers
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`p-8 sm:p-12 rounded-3xl ${theme === "dark" ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700" : "bg-white border border-gray-200 shadow-lg"}`}
          >
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex gap-1">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className={`text-2xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                "{testimonials[activeTestimonial].text}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonials[activeTestimonial].image}
                  alt={testimonials[activeTestimonial].name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="font-bold text-lg">
                    {testimonials[activeTestimonial].name}
                  </p>
                  <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                    {testimonials[activeTestimonial].role}
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="flex gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === activeTestimonial
                      ? "bg-blue-500 w-8"
                      : `${theme === "dark" ? "bg-gray-600 w-2 hover:bg-gray-500" : "bg-gray-300 w-2 hover:bg-gray-400"}`
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-24 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={itemVariants} className="text-5xl sm:text-6xl font-bold mb-6">
              Ready to <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Take Off?</span>
            </motion.h2>
            <motion.p variants={itemVariants} className={`text-2xl ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-10`}>
              Download the app and get $5 off your first ride
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-6 text-lg rounded-xl font-semibold group">
                Download App
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className={`px-8 py-6 text-lg rounded-xl font-semibold ${theme === "dark" ? "border-gray-700 hover:bg-gray-800" : "border-gray-300 hover:bg-gray-100"}`}>
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${theme === "dark" ? "bg-gray-950 border-t border-gray-800" : "bg-gray-900 text-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
            <div>
              <h3 className="font-bold text-xl mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                SwiftRide
              </h3>
              <p className={theme === "dark" ? "text-gray-400" : "text-gray-400"}>
                Your trusted ride-sharing partner
              </p>
            </div>
            {[
              {
                title: "Company",
                links: ["About", "Contact", "Blog", "Careers"],
              },
              {
                title: "Service",
                links: ["Ride", "Pricing", "Safety", "FAQ"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Security", "Compliance"],
              },
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a href="#" className={`${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-white"} transition-colors`}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className={`border-t ${theme === "dark" ? "border-gray-800" : "border-gray-700"} pt-8 text-center ${theme === "dark" ? "text-gray-400" : "text-gray-400"}`}>
            <p>© 2024 SwiftRide. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;