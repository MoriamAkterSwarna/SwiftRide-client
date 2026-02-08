import { Award, Users, Target, Globe, Shield, Star, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";

const teamMembers = [
  {
    id: 1,
    name: "Ahmed Hassan",
    role: "Founder & CEO",
    image: "https://i.pravatar.cc/300?img=10",
    bio: "10+ years in transportation tech",
  },
  {
    id: 2,
    name: "Fatima Khan",
    role: "Chief Technology Officer",
    image: "https://i.pravatar.cc/300?img=11",
    bio: "Expert in scalable systems",
  },
  {
    id: 3,
    name: "Mohamed Ali",
    role: "Head of Operations",
    image: "https://i.pravatar.cc/300?img=12",
    bio: "15+ years in ride-sharing",
  },
  {
    id: 4,
    name: "Amira Patel",
    role: "Chief Safety Officer",
    image: "https://i.pravatar.cc/300?img=13",
    bio: "Former safety compliance director",
  },
];

const values = [
  {
    icon: <Target className="h-8 w-8" />,
    title: "Safety First",
    description: "We prioritize the safety of every rider and driver on our platform",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Community Driven",
    description: "Building a community of trust between riders and drivers",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: "Excellence",
    description: "Committed to providing the highest quality service",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: "Sustainability",
    description: "Supporting eco-friendly transportation solutions",
    color: "from-yellow-500 to-orange-500",
  },
];

const stats = [
  { label: "Active Users", value: "500K+", icon: <Users className="h-6 w-6" /> },
  { label: "Verified Drivers", value: "50K+", icon: <Shield className="h-6 w-6" /> },
  { label: "Rides Completed", value: "10M+", icon: <Star className="h-6 w-6" /> },
  { label: "Cities Covered", value: "50+", icon: <Globe className="h-6 w-6" /> },
];

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

export default function About() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-950 text-white" : "bg-white text-gray-900"}`}>
      {/* Hero */}
      <section className={`relative py-32 overflow-hidden ${theme === "dark" ? "bg-linear-to-br from-gray-950 via-blue-950 to-gray-950" : "bg-linear-to-br from-blue-50 via-white to-cyan-50"}`}>
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className={`absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 ${theme === "dark" ? "bg-blue-500" : "bg-blue-400"} blur-3xl`}></div>
          <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-20 ${theme === "dark" ? "bg-cyan-500" : "bg-cyan-400"} blur-3xl`}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              About <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent animate-pulse">SwiftRide</span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className={`text-2xl font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} max-w-4xl mx-auto mb-12 leading-relaxed`}
            >
              Revolutionizing urban mobility with cutting-edge technology, unmatched safety, and seamless ride-sharing experiences across the globe.
            </motion.p>

            {/* Stats with enhanced design */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16"
            >
              {stats.map((s, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -10, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className={`relative group p-8 rounded-3xl backdrop-blur-xl border-2 ${theme === "dark"
                    ? "bg-gray-800/50 border-blue-500/30 hover:bg-gray-700/50 hover:border-blue-400/50"
                    : "bg-white/70 border-blue-200 hover:bg-white/90 hover:border-blue-400"
                    } shadow-2xl`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 rounded-3xl transition-all duration-300"></div>
                  <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {s.icon}
                  </div>
                  <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{s.value}</div>
                  <p className={`text-lg font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={`relative py-32 ${theme === "dark" ? "bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900" : "bg-gradient-to-br from-white via-blue-50 to-white"}`}>
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className={`absolute top-1/2 left-1/4 w-64 h-64 rounded-full opacity-10 ${theme === "dark" ? "bg-cyan-500" : "bg-blue-500"} blur-2xl`}></div>
          <div className={`absolute bottom-1/2 right-1/4 w-80 h-80 rounded-full opacity-10 ${theme === "dark" ? "bg-blue-500" : "bg-cyan-500"} blur-2xl`}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
              className={`relative group p-10 rounded-3xl backdrop-blur-2xl border-2 ${theme === "dark"
                ? "bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/20 hover:border-blue-400/40"
                : "bg-gradient-to-br from-blue-50/80 to-white/80 border-blue-200 hover:border-blue-400"
                } shadow-2xl`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 rounded-3xl transition-all duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-4 mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Target className="text-white" />
                </div>
                <h2 className="text-3xl font-black mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Our Mission</h2>
                <p className={`text-lg leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Provide safe, affordable, and accessible transportation to everyone, while
                  creating economic opportunities for drivers and supporting sustainable urban mobility.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
              className={`relative group p-10 rounded-3xl backdrop-blur-2xl border-2 ${theme === "dark"
                ? "bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-500/20 hover:border-cyan-400/40"
                : "bg-gradient-to-br from-cyan-50/80 to-white/80 border-cyan-200 hover:border-cyan-400"
                } shadow-2xl`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 rounded-3xl transition-all duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 p-4 mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Globe className="text-white" />
                </div>
                <h2 className="text-3xl font-black mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Our Vision</h2>
                <p className={`text-lg leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Become the most trusted and innovative ride-sharing platform in South Asia,
                  setting the standard for safety, service quality, and environmental responsibility.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
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
              Our <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Core Values</span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className={`text-xl ${theme === "dark" ? "text-gray-400" : "text-gray-600"} max-w-2xl mx-auto`}
            >
              These principles guide every decision we make
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((v, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className={`group p-8 rounded-2xl transition-all duration-300 ${theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 border border-gray-700"
                  : "bg-white hover:shadow-lg border border-gray-200"
                  }`}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${v.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">{v.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-2">{v.title}</h3>
                <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>{v.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
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
              Meet Our <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Leadership</span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className={`text-xl ${theme === "dark" ? "text-gray-400" : "text-gray-600"} max-w-2xl mx-auto`}
            >
              Experienced professionals dedicated to transforming mobility
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamMembers.map((m) => (
              <motion.div
                key={m.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className={`overflow-hidden rounded-2xl ${theme === "dark"
                  ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
                  : "bg-white border border-gray-200"
                  }`}
              >
                <img src={m.image} alt={m.name} className="w-full h-44 object-cover" />
                <div className="p-6">
                  <h3 className="text-lg font-bold">{m.name}</h3>
                  <p className="text-blue-500 font-medium text-sm mb-2">{m.role}</p>
                  <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>{m.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className={`py-24 ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-bold mb-6">
              Build the future of <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Mobility</span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className={`text-xl ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-10`}
            >
              Join millions of riders and drivers on the platform built for trust and speed.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 text-lg rounded-xl font-semibold group">
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className={`px-8 py-4 text-lg rounded-xl font-semibold ${theme === "dark" ? "border-gray-700 hover:bg-gray-800" : "border-gray-300 hover:bg-gray-100"}`}>
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
