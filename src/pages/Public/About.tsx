import { Link } from 'react-router';
import {
  Car,
  Users,
  Globe,
  Award,
  Target,
  Heart,
  Shield,
  TrendingUp,
  MapPin,
  Mail,
  Phone,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  const milestones = [
    {
      year: '2019',
      title: 'SwiftRide Founded',
      description: 'Started with a mission to revolutionize urban transportation',
      icon: Target
    },
    {
      year: '2020',
      title: 'First 100K Rides',
      description: 'Expanded to 5 major cities with growing rider base',
      icon: TrendingUp
    },
    {
      year: '2021',
      title: 'Driver Network Growth',
      description: 'Onboarded 10,000+ professional drivers across the country',
      icon: Users
    },
    {
      year: '2022',
      title: 'Technology Innovation',
      description: 'Launched AI-powered route optimization and safety features',
      icon: Shield
    },
    {
      year: '2023',
      title: 'International Expansion',
      description: 'Expanded operations to 3 new countries with 50+ cities',
      icon: Globe
    },
    {
      year: '2024',
      title: '2 Million Riders',
      description: 'Serving millions of happy customers with 4.8+ star rating',
      icon: Award
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Every decision we make is centered around providing the best experience for our riders and drivers.'
    },
    {
      icon: Shield,
      title: 'Safety Always',
      description: 'We prioritize safety above everything else with rigorous driver screening and 24/7 support.'
    },
    {
      icon: TrendingUp,
      title: 'Continuous Innovation',
      description: 'We constantly improve our technology and services to meet evolving customer needs.'
    },
    {
      icon: Users,
      title: 'Community Focused',
      description: 'We build strong relationships with local communities and contribute to sustainable transportation.'
    },
    {
      icon: Globe,
      title: 'Environmental Responsibility',
      description: 'Committed to reducing carbon footprint through efficient routing and eco-friendly initiatives.'
    },
    {
      icon: Award,
      title: 'Excellence in Service',
      description: 'We maintain the highest standards of quality and reliability in everything we do.'
    }
  ];

  const leadership = [
    {
      name: 'Alex Thompson',
      role: 'CEO & Founder',
      bio: 'Visionary leader with 15+ years in transportation technology',
      image: 'AT'
    },
    {
      name: 'Sarah Martinez',
      role: 'COO',
      bio: 'Operations expert focused on scaling and efficiency',
      image: 'SM'
    },
    {
      name: 'David Chen',
      role: 'CTO',
      bio: 'Tech innovator driving our digital transformation',
      image: 'DC'
    },
    {
      name: 'Emily Johnson',
      role: 'Head of Customer Experience',
      bio: 'Customer advocate ensuring exceptional service delivery',
      image: 'EJ'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              About SwiftRide
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8">
              We're on a mission to make urban transportation safer, more reliable,
              and accessible to everyone, everywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                <Link to="/register">
                  Join Our Journey
                  <Car className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Contact Us
                <Mail className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                To revolutionize urban mobility by providing safe, reliable, and affordable
                transportation solutions that connect communities and improve lives.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                We believe that everyone deserves access to quality transportation that's not
                just a means to get from point A to point B, but an experience that's safe,
                comfortable, and enjoyable.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="font-medium">2M+ Happy Riders</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="font-medium">50K+ Professional Drivers</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="font-medium">100+ Cities Covered</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="font-medium">4.8/5 Customer Rating</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="aspect-square bg-white rounded-xl shadow-lg flex items-center justify-center">
                <Globe className="h-32 w-32 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">
              From a startup idea to a transportation revolution
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-300"></div>
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center mb-8 ${index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <Card className="border-0 shadow-lg">
                      <CardContent className="pt-6 pb-4">
                        <div className="flex items-center gap-3 mb-3 justify-end">
                          <span className="text-sm font-bold text-primary">{milestone.year}</span>
                          <milestone.icon className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{milestone.title}</h3>
                        <p className="text-gray-600 text-sm">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600">
              Meet the people driving our vision forward
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((leader, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {leader.image}
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{leader.name}</h3>
                  <p className="text-primary font-medium mb-3">{leader.role}</p>
                  <p className="text-gray-600 text-sm">{leader.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-12">SwiftRide by Numbers</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <div className="text-5xl font-bold mb-2">2M+</div>
                <div className="text-blue-100">Active Riders</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">50K+</div>
                <div className="text-blue-100">Professional Drivers</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">100+</div>
                <div className="text-blue-100">Cities Worldwide</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">4.8/5</div>
                <div className="text-blue-100">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">
              Have questions? We'd love to hear from you
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-8 pb-6">
                <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                <p className="text-gray-600">1-800-RIDENOW</p>
                <p className="text-gray-500 text-sm">24/7 Support</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-8 pb-6">
                <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                <p className="text-gray-600">support@swiftride.com</p>
                <p className="text-gray-500 text-sm">Response within 24hrs</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-8 pb-6">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
                <p className="text-gray-600">123 Main St, City</p>
                <p className="text-gray-500 text-sm">Mon-Fri, 9AM-6PM</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
