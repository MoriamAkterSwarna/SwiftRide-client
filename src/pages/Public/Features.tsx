import {
  Zap,
  Shield,
  Clock,
  MapPin,
  Users,
  TrendingUp,
  Smartphone,
  CreditCard,
  Headphones,
  CheckCircle,
  User,
  Car,
  DollarSign,
  Star,
  Navigation,
  Award,
  Settings,
  BarChart3,
  FileText,
  Target,
  Lock,
  Globe,
  Heart,
  Calendar,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';

export default function Features() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('riders');

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Lightning Fast',
      description: 'Get a ride in seconds with our optimized matching algorithm',
      color: 'from-blue-500 to-cyan-500',
      benefits: ['Smart matching', '3-5 min wait', 'Real-time tracking']
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Safe & Secure',
      description: 'Verified drivers and real-time GPS tracking for your peace of mind',
      color: 'from-green-500 to-emerald-500',
      benefits: ['Background checks', 'SOS button', 'Trip sharing']
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: '24/7 Service',
      description: 'Available round the clock whenever you need a ride',
      color: 'from-purple-500 to-pink-500',
      benefits: ['Always available', '24/7 support', 'Scheduled rides']
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Top Rated',
      description: '4.9+ stars with thousands of happy customers',
      color: 'from-yellow-500 to-orange-500',
      benefits: ['98% satisfaction', 'Verified reviews', 'Trusted platform']
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Easy Navigation',
      description: 'Intuitive interface to book rides in just a few taps',
      color: 'from-indigo-500 to-blue-500',
      benefits: ['Simple booking', 'Map preview', 'Auto-saved locations']
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Community Driven',
      description: 'Join thousands of riders and drivers in our growing community',
      color: 'from-pink-500 to-rose-500',
      benefits: ['Group discounts', 'Referral rewards', 'Community events']
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: 'Smart Features',
      description: 'Advanced technology for better ride experience',
      color: 'from-cyan-500 to-blue-500',
      benefits: ['Favorites', 'Ride history', 'Payment auto-fill']
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: 'Flexible Payment',
      description: 'Multiple payment options to suit your preference',
      color: 'from-green-500 to-teal-500',
      benefits: ['Credit cards', 'Digital wallets', 'Cash payment']
    },
  ];

  const premiumFeatures = [
    {
      title: 'Scheduled Rides',
      description: 'Book rides up to 30 days in advance',
      icon: <Clock className="h-6 w-6" />
    },
    {
      title: 'Favorite Routes',
      description: 'Save your frequently used routes',
      icon: <MapPin className="h-6 w-6" />
    },
    {
      title: 'Ride Pooling',
      description: 'Share rides and save up to 50%',
      icon: <Users className="h-6 w-6" />
    },
    {
      title: 'Priority Support',
      description: '24/7 dedicated customer support',
      icon: <Headphones className="h-6 w-6" />
    },
    {
      title: 'Premium Rides',
      description: 'Access to luxury and premium vehicles',
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      title: 'Cashback Rewards',
      description: 'Earn points on every ride',
      icon: <CreditCard className="h-6 w-6" />
    },
  ];

  const riderFeatures = [
    {
      icon: MapPin,
      title: 'Live Tracking',
      description: 'Track your driver in real-time from pickup to destination',
      details: ['Real-time GPS tracking', 'Accurate ETA updates', 'Share trip status', 'Route visualization'],
      color: 'bg-green-500'
    },
    {
      icon: DollarSign,
      title: 'Fair Pricing',
      description: 'Transparent pricing with no hidden fees or surge charges',
      details: ['Upfront pricing', 'Multiple payment options', 'Fare estimates', 'Detailed receipts'],
      color: 'bg-purple-500'
    },
    {
      icon: Shield,
      title: 'Safety Features',
      description: 'Your safety is our priority with comprehensive security measures',
      details: ['Emergency SOS button', 'Trip recording', 'Driver verification', '24/7 support'],
      color: 'bg-red-500'
    },
    {
      icon: Star,
      title: 'Ride Options',
      description: 'Choose from multiple vehicle types to suit your needs',
      details: ['Economy rides', 'Premium sedans', 'XL vehicles', 'Luxury options'],
      color: 'bg-yellow-500'
    },
    {
      icon: CreditCard,
      title: 'Multiple Payments',
      description: 'Pay your way with various secure payment methods',
      details: ['Credit/Debit cards', 'Digital wallets', 'Cash payments', 'Corporate accounts'],
      color: 'bg-indigo-500'
    }
  ];

  const driverFeatures = [
    {
      icon: TrendingUp,
      title: 'Flexible Earnings',
      description: 'Earn on your schedule with competitive rates and bonuses',
      details: ['Set your own hours', 'Peak hour bonuses', 'Referral rewards', 'Performance incentives'],
      color: 'bg-green-500'
    },
    {
      icon: Navigation,
      title: 'Smart Navigation',
      description: 'AI-powered route optimization for efficient trips',
      details: ['Real-time traffic updates', 'Optimal route suggestions', 'Fuel-efficient paths', 'Avoid tolls option'],
      color: 'bg-blue-500'
    },
    {
      icon: DollarSign,
      title: 'Instant Payments',
      description: 'Get paid quickly with secure and reliable payment system',
      details: ['Daily payouts', 'Weekly summaries', 'Tax documents', 'Earnings analytics'],
      color: 'bg-purple-500'
    },
    {
      icon: Users,
      title: 'Driver Support',
      description: '24/7 dedicated support for all driver needs',
      details: ['Roadside assistance', 'Legal support', 'Insurance coverage', 'Community forums'],
      color: 'bg-orange-500'
    },
    {
      icon: Award,
      title: 'Recognition Program',
      description: 'Get rewarded for excellent service and reliability',
      details: ['Driver ratings', 'Achievement badges', 'Top driver bonuses', 'Exclusive perks'],
      color: 'bg-yellow-500'
    },
    {
      icon: Settings,
      title: 'Driver Tools',
      description: 'Comprehensive tools to manage your driving business',
      details: ['Earnings dashboard', 'Trip history', 'Performance metrics', 'Schedule management'],
      color: 'bg-gray-500'
    }
  ];

  const adminFeatures = [
    {
      icon: Users,
      title: 'User Management',
      description: 'Comprehensive tools to manage riders and drivers',
      details: ['User profiles', 'Role management', 'Account verification', 'Support tickets'],
      color: 'bg-blue-500'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Real-time insights and detailed analytics',
      details: ['Revenue tracking', 'User analytics', 'Performance metrics', 'Custom reports'],
      color: 'bg-green-500'
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Advanced security features and regulatory compliance',
      details: ['Access control', 'Audit logs', 'Data encryption', 'Compliance reporting'],
      color: 'bg-red-500'
    },
    {
      icon: FileText,
      title: 'Ride Management',
      description: 'Complete oversight of all ride operations',
      details: ['Live ride tracking', 'Dispute resolution', 'Fare adjustments', 'Quality control'],
      color: 'bg-purple-500'
    },
    {
      icon: Target,
      title: 'Marketing Tools',
      description: 'Powerful marketing and promotional features',
      details: ['Campaign management', 'Promo codes', 'User segmentation', 'A/B testing'],
      color: 'bg-orange-500'
    },
    {
      icon: Lock,
      title: 'System Administration',
      description: 'Full control over system configuration and settings',
      details: ['System settings', 'API management', 'Database administration', 'Backup & recovery'],
      color: 'bg-gray-500'
    }
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

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      {/* Hero Section */}
      <section className={`relative py-32 overflow-hidden ${theme === "dark" ? "bg-linear-to-br from-gray-950 via-blue-950 to-gray-950" : "bg-linear-to-br from-blue-50 via-white to-cyan-50"}`}>
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className={`absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 ${theme === "dark" ? "bg-blue-600" : "bg-blue-500"} blur-3xl`}></div>
          <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-20 ${theme === "dark" ? "bg-cyan-600" : "bg-cyan-500"} blur-3xl`}></div>
        </div>
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold mb-6">
              Powerful Features
            </motion.h1>
            <motion.p variants={itemVariants} className={`text-xl md:text-2xl max-w-2xl mx-auto ${
    theme === 'dark' ? 'text-blue-50' : 'text-gray-700'
  }`}>
              Discover everything that makes SwiftRide the best ride-sharing app
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className={`py-24 ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Card className={`border-0 h-full transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:shadow-lg hover:shadow-blue-500/20'
                    : 'bg-gray-50 hover:shadow-lg'
                }`}>
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-xl bg-linear-to-br ${feature.color} p-3 mb-6 flex items-center justify-center`}>
                      <div className="text-white">{feature.icon}</div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {feature.description}
                    </p>
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, bidx) => (
                        <div key={bidx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500 shrink-0" />
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className={`py-24 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-7xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Premium <span className="bg-linear-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Features</span>
              </h2>
              <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Unlock exclusive features for an enhanced experience
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {premiumFeatures.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    theme === 'dark'
                      ? 'border-gray-700 hover:border-blue-500/50'
                      : 'border-gray-200 hover:border-blue-500'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 p-3 mb-4 flex items-center justify-center text-white`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Tabs */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`} id="riders">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Features by Role</h2>
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Tailored functionality for every user type
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-12">
              <TabsTrigger value="riders" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                For Riders
              </TabsTrigger>
              <TabsTrigger value="drivers" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                For Drivers
              </TabsTrigger>
              <TabsTrigger value="admins" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                For Admins
              </TabsTrigger>
            </TabsList>

            <TabsContent value="riders" className="space-y-8">
              <div className="text-center mb-12">
                <User className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold mb-4">Rider Features</h3>
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
                  Everything you need for a seamless riding experience from booking to destination
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {riderFeatures.map((feature, index) => (
                  <Card key={index} className={`border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}>
                    <CardContent className="pt-8 pb-6">
                      <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold mb-3 text-center">{feature.title}</h4>
                      <p className={`text-center mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{feature.description}</p>
                      <ul className="space-y-2">
                        {feature.details.map((detail, i) => (
                          <li key={i} className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="drivers" className="space-y-8">
              <div className="text-center mb-12">
                <Car className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold mb-4">Driver Features</h3>
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
                  Powerful tools to help you earn more, drive smarter, and grow your business
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {driverFeatures.map((feature, index) => (
                  <Card key={index} className={`border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}>
                    <CardContent className="pt-8 pb-6">
                      <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold mb-3 text-center">{feature.title}</h4>
                      <p className={`text-center mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{feature.description}</p>
                      <ul className="space-y-2">
                        {feature.details.map((detail, i) => (
                          <li key={i} className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="admins" className="space-y-8">
              <div className="text-center mb-12">
                <Shield className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold mb-4">Admin Features</h3>
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
                  Comprehensive administrative tools to manage and scale your ride operations
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {adminFeatures.map((feature, index) => (
                  <Card key={index} className={`border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}>
                    <CardContent className="pt-8 pb-6">
                      <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold mb-3 text-center">{feature.title}</h4>
                      <p className={`text-center mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{feature.description}</p>
                      <ul className="space-y-2">
                        {feature.details.map((detail, i) => (
                          <li key={i} className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Safety Features Section */}
      <section className={`py-24 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Safety <span className="bg-linear-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">First</span>
              </h2>
              <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Your safety is our top priority
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                variants={itemVariants}
                className={`p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="space-y-6">
                  {[
                    {
                      title: 'Verified Drivers',
                      desc: 'All drivers undergo thorough background checks and vehicle inspections'
                    },
                    {
                      title: 'GPS Tracking',
                      desc: 'Real-time location tracking for your complete journey'
                    },
                    {
                      title: 'SOS Button',
                      desc: 'One-touch access to emergency services and support'
                    },
                    {
                      title: 'Trip Sharing',
                      desc: 'Share your ride details with trusted contacts'
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <Shield className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold mb-1">{item.title}</h3>
                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className={`p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="space-y-6">
                  {[
                    {
                      title: 'Driver Ratings',
                      desc: 'See verified ratings from other passengers'
                    },
                    {
                      title: '24/7 Support',
                      desc: 'Dedicated support team available round the clock'
                    },
                    {
                      title: 'Insurance Coverage',
                      desc: 'Comprehensive coverage during your rides'
                    },
                    {
                      title: 'Report Issues',
                      desc: 'Easy reporting system for any concerns'
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <CheckCircle className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold mb-1">{item.title}</h3>
                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className={`py-24 ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Why Choose <span className="bg-linear-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">SwiftRide?</span>
              </h2>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className={`rounded-2xl overflow-hidden border ${
                theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}>
                      <th className="px-6 py-4 text-left font-bold">Feature</th>
                      <th className="px-6 py-4 text-center font-bold text-blue-500">SwiftRide</th>
                      <th className="px-6 py-4 text-center font-bold">Competitor A</th>
                      <th className="px-6 py-4 text-center font-bold">Competitor B</th>
                    </tr>
                  </thead>
                  <tbody className={theme === 'dark' ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}>
                    {[
                      { feature: '24/7 Support', swiftride: true, a: true, b: false },
                      { feature: 'GPS Tracking', swiftride: true, a: true, b: true },
                      { feature: 'Scheduled Rides', swiftride: true, a: false, b: true },
                      { feature: 'Ride Pooling', swiftride: true, a: true, b: false },
                      { feature: 'Multiple Payments', swiftride: true, a: true, b: true },
                      { feature: 'SOS Button', swiftride: true, a: false, b: false },
                      { feature: 'Loyalty Program', swiftride: true, a: true, b: false },
                    ].map((row, idx) => (
                      <tr key={idx} className={theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                        <td className="px-6 py-4 font-medium">{row.feature}</td>
                        <td className="px-6 py-4 text-center">
                          {row.swiftride ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <div className="h-5 w-5 mx-auto" />
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {row.a ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <div className="h-5 w-5 mx-auto" />
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {row.b ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <div className="h-5 w-5 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Technical Features */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Technical Excellence</h2>
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Built with cutting-edge technology for reliability and performance
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className={`text-center border-0 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <CardContent className="pt-8 pb-6">
                <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Sub-second response times for optimal user experience</p>
              </CardContent>
            </Card>
            <Card className={`text-center border-0 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <CardContent className="pt-8 pb-6">
                <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Secure & Reliable</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Enterprise-grade security with 99.9% uptime guarantee</p>
              </CardContent>
            </Card>
            <Card className={`text-center border-0 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <CardContent className="pt-8 pb-6">
                <Globe className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Global Scale</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Built to handle millions of users worldwide</p>
              </CardContent>
            </Card>
            <Card className={`text-center border-0 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <CardContent className="pt-8 pb-6">
                <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">User-Centric</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Designed with user experience and accessibility in mind</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Seamless Integrations</h2>
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-12`}>
              Connect SwiftRide with your favorite tools and services
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                'Payment Gateways',
                'Navigation APIs',
                'Analytics Tools',
                'Communication Platforms',
                'CRM Systems',
                'Accounting Software',
                'Marketing Automation',
                'Business Intelligence'
              ].map((integration, index) => (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <Settings className={`h-8 w-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                  </div>
                  <p className="text-sm font-medium">{integration}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`relative py-32 overflow-hidden ${theme === "dark" ? "bg-linear-to-br from-gray-950 via-blue-950 to-gray-950" : "bg-linear-to-br from-blue-50 via-white to-cyan-50"}`} id="demo">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className={`absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 ${theme === "dark" ? "bg-blue-500" : "bg-blue-400"} blur-3xl`}></div>
          <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-20 ${theme === "dark" ? "bg-cyan-500" : "bg-cyan-400"} blur-3xl`}></div>
        </div>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Experience SwiftRide?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            See our features in action and discover how SwiftRide can transform your transportation business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Schedule Demo
              <Calendar className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Start Free Trial
              <Zap className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-8">
            <div className="flex items-center gap-2 justify-center">
              <CheckCircle className="h-5 w-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <CheckCircle className="h-5 w-5" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <CheckCircle className="h-5 w-5" />
              <span>Full feature access</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}