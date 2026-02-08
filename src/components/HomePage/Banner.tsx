
import { motion } from 'motion/react';
import { useTheme } from '@/hooks/useTheme';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import Lottie from "lottie-react";

import HeroLottie from "../../assets/Man_with_car.json"


const Banner = () => {

      const { theme } = useTheme();
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
     const floatVariants = {
    hidden: { y: 0 },
    visible: {
      y: [-20, 20, -20],
      transition: { duration: 4, repeat: Infinity },
    },
  };
    return (
        <>
                {/* Hero Section */}
      <section className={`relative overflow-hidden ${theme === "dark" ? "bg-linear-to-br from-gray-900 via-gray-950 to-black" : "bg-linear-to-br from-blue-50 via-white to-cyan-50"}`}>
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
                  <span className="text-sm font-semibold bg-linear-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    ✨ Welcome to SwiftRide
                  </span>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="block">Your Journey</span>
                  <span className="block bg-linear-to-r from-blue-500 via-cyan-500 to-green-500 bg-clip-text text-transparent">
                    Starts Here
                  </span>
                </h1>

                <p className={`text-xl ${theme === "dark" ? "text-gray-400" : "text-gray-600"} leading-relaxed max-w-xl`}>
                  Experience the future of ride-sharing. Fast, safe, and affordable transportation at your fingertips.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-6 text-lg rounded-xl font-semibold group">
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
                    <p className="font-bold text-2xl bg-linear-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
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
              <div className={`relative w-full h-96 rounded-3xl overflow-hidden ${theme === "dark" ? "bg-linear-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30" : "bg-linear-to-br from-blue-200/50 to-cyan-200/50 border border-blue-200"}`}>
                <div className="flex items-center justify-center h-full">
                 

                  <Lottie animationData={HeroLottie} loop={true} />;
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
        </>
    );
};

export default Banner;