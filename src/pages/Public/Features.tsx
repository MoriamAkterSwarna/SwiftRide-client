import { useState } from 'react';
import {
  User,
  Car,
  Shield,
  Users,
  Smartphone,
  MapPin,
  TrendingUp,
  DollarSign,
  Navigation,
  CreditCard,
  Star,
  Award,
  BarChart3,
  Settings,
  FileText,
  Lock,
  Zap,
  Globe,
  Heart,
  Target,
  CheckCircle,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Features() {
  const [activeTab, setActiveTab] = useState('riders');

  const riderFeatures = [
    {
      icon: Smartphone,
      title: 'Easy Booking',
      description: 'Book your ride in seconds with our intuitive mobile app',
      details: ['One-tap booking', 'Saved locations', 'Recent trips', 'Favorite drivers'],
      color: 'bg-blue-500'
    },
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

  const allFeatures = [
    ...riderFeatures.map(f => ({ ...f, category: 'riders' })),
    ...driverFeatures.map(f => ({ ...f, category: 'drivers' })),
    ...adminFeatures.map(f => ({ ...f, category: 'admins' }))
  ];

  const getFeaturesByCategory = (category: string) => {
    return allFeatures.filter(f => f.category === category);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              SwiftRide Features
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8">
              Discover powerful features designed for riders, drivers, and administrators
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                <a href="#riders">
                  Explore Features
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <a href="#demo">
                  Request Demo
                  <Zap className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Tabs */}
      <section className="py-20" id="riders">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Features by Role</h2>
            <p className="text-xl text-gray-600">
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
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Everything you need for a seamless riding experience from booking to destination
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {riderFeatures.map((feature, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <CardContent className="pt-8 pb-6">
                      <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold mb-3 text-center">{feature.title}</h4>
                      <p className="text-gray-600 text-center mb-6">{feature.description}</p>
                      <ul className="space-y-2">
                        {feature.details.map((detail, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
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
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Powerful tools to help you earn more, drive smarter, and grow your business
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {driverFeatures.map((feature, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <CardContent className="pt-8 pb-6">
                      <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold mb-3 text-center">{feature.title}</h4>
                      <p className="text-gray-600 text-center mb-6">{feature.description}</p>
                      <ul className="space-y-2">
                        {feature.details.map((detail, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
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
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Comprehensive administrative tools to manage and scale your ride operations
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {adminFeatures.map((feature, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <CardContent className="pt-8 pb-6">
                      <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold mb-3 text-center">{feature.title}</h4>
                      <p className="text-gray-600 text-center mb-6">{feature.description}</p>
                      <ul className="space-y-2">
                        {feature.details.map((detail, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
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

      {/* Technical Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Technical Excellence</h2>
            <p className="text-xl text-gray-600">
              Built with cutting-edge technology for reliability and performance
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-8 pb-6">
                <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
                <p className="text-gray-600 text-sm">Sub-second response times for optimal user experience</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-8 pb-6">
                <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Secure & Reliable</h3>
                <p className="text-gray-600 text-sm">Enterprise-grade security with 99.9% uptime guarantee</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-8 pb-6">
                <Globe className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Global Scale</h3>
                <p className="text-gray-600 text-sm">Built to handle millions of users worldwide</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-8 pb-6">
                <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">User-Centric</h3>
                <p className="text-gray-600 text-sm">Designed with user experience and accessibility in mind</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Seamless Integrations</h2>
            <p className="text-xl text-gray-600 mb-12">
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
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Settings className="h-8 w-8 text-gray-600" />
                  </div>
                  <p className="text-sm font-medium">{integration}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white" id="demo">
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
          <div className="mt-12 flex justify-center gap-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Full feature access</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
