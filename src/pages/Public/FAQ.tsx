import { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  User,
  Car,
  Shield,
  CreditCard,
  MapPin,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  MessageSquare,
  Smartphone,
  TrendingUp
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqData = [
    {
      id: '1',
      category: 'getting-started',
      question: 'How do I create a SwiftRide account?',
      answer: 'Creating an account is easy! Download the SwiftRide app from your app store, click "Sign Up", enter your name, email, phone number, and create a password. You\'ll receive a verification code to confirm your number, and then you\'re ready to ride!',
      icon: User
    },
    {
      id: '2',
      category: 'getting-started',
      question: 'What information do I need to sign up?',
      answer: 'You\'ll need to provide your full name, email address, phone number, and create a secure password. We may also require age verification to ensure you meet our minimum age requirements (18+ for riders, 21+ for drivers).',
      icon: User
    },
    {
      id: '3',
      category: 'getting-started',
      question: 'Can I use SwiftRide without the app?',
      answer: 'While the mobile app provides the best experience with GPS tracking and real-time updates, you can also book rides through our website. However, some features like live tracking and driver communication are optimized for the mobile app.',
      icon: Smartphone
    },
    {
      id: '4',
      category: 'booking',
      question: 'How do I book a ride?',
      answer: 'Enter your pickup location and destination in the app, select your preferred ride type (Economy, Comfort, XL, or Luxury), review the estimated fare and ETA, then confirm your booking. You\'ll be matched with a nearby driver and can track their arrival in real-time.',
      icon: MapPin
    },
    {
      id: '5',
      category: 'booking',
      question: 'Can I schedule a ride in advance?',
      answer: 'Yes! You can schedule rides up to 30 days in advance. Select "Schedule" instead of "Ride Now", choose your date and time, and we\'ll send you a confirmation when your driver is on the way.',
      icon: Clock
    },
    {
      id: '6',
      category: 'booking',
      question: 'How do I cancel a ride?',
      answer: 'You can cancel a ride before the driver arrives through the app. Go to your active ride, tap "Cancel Ride", and select a reason. Note that cancellation fees may apply if you cancel after the driver has accepted and is en route.',
      icon: Car
    },
    {
      id: '7',
      category: 'booking',
      question: 'What if no drivers are available?',
      answer: 'If no drivers are available in your area, you\'ll see an option to "Try Again Later" or "Schedule for Later". We recommend trying again in a few minutes or scheduling your ride for when demand is typically lower.',
      icon: AlertCircle
    },
    {
      id: '8',
      category: 'payment',
      question: 'What payment methods are accepted?',
      answer: 'We accept credit/debit cards (Visa, Mastercard, American Express), digital wallets (Apple Pay, Google Pay, PayPal), cash (in select cities), and SwiftRide gift cards. You can add multiple payment methods in the app settings.',
      icon: CreditCard
    },
    {
      id: '9',
      category: 'payment',
      question: 'How are fares calculated?',
      answer: 'Fares are calculated based on base fare + (distance × rate) + (time × rate) + any applicable tolls or surge pricing. You\'ll always see the estimated fare before booking, and the final fare is charged after your trip completes.',
      icon: CreditCard
    },
    {
      id: '10',
      category: 'payment',
      question: 'Can I get a receipt for my ride?',
      answer: 'Yes! Receipts are automatically sent to your email after each ride. You can also access all your ride receipts in the app under "Ride History" or on our website under your account settings.',
      icon: CreditCard
    },
    {
      id: '11',
      category: 'payment',
      question: 'What is surge pricing?',
      answer: 'Surge pricing may apply during periods of high demand when there are more riders than available drivers. This helps encourage more drivers to get on the road. You\'ll always see the surge multiplier and final price before booking.',
      icon: TrendingUp
    },
    {
      id: '12',
      category: 'safety',
      question: 'Is SwiftRide safe to use?',
      answer: 'Absolutely! Safety is our top priority. All drivers undergo comprehensive background checks, vehicle inspections, and safety training. Our app includes safety features like GPS tracking, trip recording, emergency SOS button, and 24/7 customer support.',
      icon: Shield
    },
    {
      id: '13',
      category: 'safety',
      question: 'What should I do if I feel unsafe during a ride?',
      answer: 'If you ever feel unsafe, use the in-app SOS button to immediately connect with emergency services and our safety team. You can also share your trip status with trusted contacts, and our support team is available 24/7 at 1-800-SOS-RIDE.',
      icon: Shield
    },
    {
      id: '14',
      category: 'safety',
      question: 'How are drivers vetted?',
      answer: 'All drivers must pass a multi-step screening process including criminal background checks, driving record reviews, vehicle inspections, and in-person orientation. We also continuously monitor driver performance and customer feedback.',
      icon: Shield
    },
    {
      id: '15',
      category: 'safety',
      question: 'What happens if I leave something in the car?',
      answer: 'Contact our support team immediately with your trip details. We\'ll help you connect with the driver to arrange the return of your item. There may be a return fee depending on the distance and time required.',
      icon: Car
    },
    {
      id: '16',
      category: 'driver',
      question: 'How do I become a SwiftRide driver?',
      answer: 'Visit our "Become a Driver" page or download the SwiftRide Driver app. You\'ll need to meet age requirements (21+), have a valid driver\'s license, vehicle insurance, pass a background check, and have a qualifying vehicle that meets our safety standards.',
      icon: Car
    },
    {
      id: '17',
      category: 'driver',
      question: 'What are the requirements to become a driver?',
      answer: 'Requirements include: 21+ years old, valid driver\'s license, at least 1 year of driving experience, vehicle registration and insurance, passing background check, and a smartphone compatible with our driver app. Vehicle requirements vary by city but generally include 4-door vehicles in good condition.',
      icon: Car
    },
    {
      id: '18',
      category: 'driver',
      question: 'How and when do drivers get paid?',
      answer: 'Drivers are paid weekly via direct deposit to their bank account. You can track your earnings in real-time through the driver app, including detailed breakdowns of fares, tips, bonuses, and deductions. Instant payout options may be available in some areas.',
      icon: CreditCard
    },
    {
      id: '19',
      category: 'driver',
      question: 'Can drivers choose their own hours?',
      answer: 'Yes! One of the benefits of driving with SwiftRide is complete flexibility. You can drive whenever you want, for as long as you want. There are no minimum hours or schedules required.',
      icon: Clock
    },
    {
      id: '20',
      category: 'technical',
      question: 'Why isn\'t the app working properly?',
      answer: 'First, try restarting the app and ensuring you have a stable internet connection. Make sure your app is updated to the latest version. If issues persist, check our status page for any ongoing outages or contact our technical support team.',
      icon: AlertCircle
    },
    {
      id: '21',
      category: 'technical',
      question: 'How do I report a technical issue?',
      answer: 'You can report technical issues through the app\'s "Help" section, via email at techsupport@swiftride.com, or through our 24/7 live chat. Please include details about your device, app version, and steps to reproduce the issue.',
      icon: MessageSquare
    },
    {
      id: '22',
      category: 'technical',
      question: 'Is my location data secure?',
      answer: 'Yes, we take data privacy very seriously. Your location data is encrypted and only used for ride matching, safety, and service improvement. We never sell your personal data to third parties, and you can review our privacy policy for more details.',
      icon: Shield
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: HelpCircle },
    { id: 'getting-started', name: 'Getting Started', icon: User },
    { id: 'booking', name: 'Booking Rides', icon: MapPin },
    { id: 'payment', name: 'Payment & Pricing', icon: CreditCard },
    { id: 'safety', name: 'Safety', icon: Shield },
    { id: 'driver', name: 'Driver Information', icon: Car },
    { id: 'technical', name: 'Technical Support', icon: AlertCircle }
  ];

  const filteredFAQs = useMemo(() => {
    return faqData.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const expandAll = () => {
    setExpandedItems(new Set(filteredFAQs.map(faq => faq.id)));
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <HelpCircle className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8">
              Find answers to common questions about SwiftRide
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-blue-200"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <category.icon className="h-4 w-4" />
                {category.name}
              </Button>
            ))}
          </div>
          {filteredFAQs.length > 0 && (
            <div className="flex justify-center gap-4 mt-6">
              <Button variant="ghost" size="sm" onClick={expandAll}>
                Expand All
              </Button>
              <Button variant="ghost" size="sm" onClick={collapseAll}>
                Collapse All
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or browse a different category.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <Card key={faq.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleExpanded(faq.id)}
                        className="w-full text-left p-6 focus:outline-none focus:bg-gray-50"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <faq.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                              {expandedItems.has(faq.id) && (
                                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {expandedItems.has(faq.id) ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Did You Know?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <p className="text-gray-600">Customer Support Available</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">&lt;2 min</div>
                <p className="text-gray-600">Average Response Time</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">98%</div>
                <p className="text-gray-600">Customer Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-12 text-center">
                <HelpCircle className="h-16 w-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Can't find what you're looking for? Our support team is here to help!
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Call Us</h3>
                    <p className="text-gray-600 mb-3">1-800-RIDENOW</p>
                    <p className="text-sm text-gray-500">24/7 Support</p>
                  </div>
                  <div className="text-center">
                    <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Email Us</h3>
                    <p className="text-gray-600 mb-3">support@swiftride.com</p>
                    <p className="text-sm text-gray-500">Response within 24hrs</p>
                  </div>
                  <div className="text-center">
                    <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Live Chat</h3>
                    <p className="text-gray-600 mb-3">Available in app</p>
                    <p className="text-sm text-gray-500">9 AM - 9 PM Daily</p>
                  </div>
                </div>
                <div className="mt-8">
                  <Button size="lg" className="bg-primary hover:bg-primary/600">
                    Contact Support Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Popular Topics</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'How to cancel a ride',
                'Payment methods',
                'Safety features',
                'Lost items',
                'Driver requirements',
                'Fare calculation',
                'Schedule a ride',
                'Account issues'
              ].map((topic, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto p-4"
                  onClick={() => setSearchTerm(topic)}
                >
                  <Search className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span className="text-left">{topic}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
