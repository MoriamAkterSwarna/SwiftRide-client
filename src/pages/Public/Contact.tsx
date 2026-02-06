import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  HelpCircle,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactOptions = [
    {
      icon: Phone,
      title: 'Call Us',
      description: '24/7 Customer Support',
      contact: '1-800-RIDENOW',
      subtext: 'Available round the clock',
      color: 'bg-green-500'
    },
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us a message',
      contact: 'support@swiftride.com',
      subtext: 'Response within 24 hours',
      color: 'bg-blue-500'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our team',
      contact: 'Start a conversation',
      subtext: 'Available 9 AM - 9 PM',
      color: 'bg-purple-500'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      description: 'Head Office',
      contact: '123 Main St, City',
      subtext: 'Mon-Fri, 9 AM - 6 PM',
      color: 'bg-orange-500'
    }
  ];

  const faqs = [
    {
      question: 'How do I book my first ride?',
      answer: 'Download the SwiftRide app, create an account, enter your pickup and drop-off locations, choose your ride type, and confirm your booking. It\'s that simple!'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept credit/debit cards, digital wallets (Apple Pay, Google Pay), cash, and corporate accounts. You can add multiple payment methods to your profile.'
    },
    {
      question: 'How are fares calculated?',
      answer: 'Fares are calculated based on distance, time, ride type, and current demand. You\'ll always see the estimated fare before booking with no hidden charges.'
    },
    {
      question: 'Is it safe to ride with SwiftRide?',
      answer: 'Absolutely! All drivers undergo thorough background checks, vehicles are regularly inspected, and we have 24/7 support with an in-app SOS button for emergencies.'
    },
    {
      question: 'How can I become a driver?',
      answer: 'Visit our "Become a Driver" page or download the driver app. You\'ll need to meet age requirements, have a valid license, pass a background check, and have a qualifying vehicle.'
    },
    {
      question: 'What if I left something in the car?',
      answer: 'Contact our support team immediately with your trip details. We\'ll help you connect with the driver to retrieve your lost item.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general'
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Contact SwiftRide
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8">
              We're here to help! Reach out to us through any of the channels below.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-white/20 text-white px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                24/7 Support Available
              </Badge>
              <Badge className="bg-white/20 text-white px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                Quick Response Time
              </Badge>
              <Badge className="bg-white/20 text-white px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Secure & Private
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">
              Choose the most convenient way to reach us
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactOptions.map((option, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className={`w-16 h-16 ${option.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <option.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <div className="space-y-2">
                    <p className="font-medium text-primary">{option.contact}</p>
                    <p className="text-sm text-gray-500">{option.subtext}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="billing">Billing Issue</option>
                        <option value="partnership">Partnership</option>
                        <option value="feedback">Feedback</option>
                        <option value="complaint">Complaint</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subject *</label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please provide as much detail as possible..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Office Info & Hours */}
            <div className="space-y-8">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Office Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Head Office</h4>
                      <p className="text-gray-600">
                        123 Main Street, Suite 100<br />
                        City, State 12345<br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Phone Numbers</h4>
                      <p className="text-gray-600">
                        Customer Support: 1-800-RIDENOW<br />
                        Business Inquiries: 1-800-BIZ-RIDE<br />
                        Emergency: 1-800-SOS-RIDE
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Email Addresses</h4>
                      <p className="text-gray-600">
                        Support: support@swiftride.com<br />
                        Business: business@swiftride.com<br />
                        Careers: careers@swiftride.com
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Business Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Monday - Friday</span>
                      <span className="text-gray-600">9:00 AM - 9:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Saturday</span>
                      <span className="text-gray-600">10:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Sunday</span>
                      <span className="text-gray-600">10:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">24/7 Emergency Support</span>
                      <span className="text-green-600">Always Available</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <HelpCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="pt-6 pb-6">
                    <div className="flex items-start gap-4">
                      <AlertCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-20 bg-red-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Emergency Support</h2>
            <p className="text-lg text-gray-700 mb-8">
              If you're experiencing an emergency during your ride, please contact us immediately
            </p>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Emergency Hotline</h3>
                  <p className="text-3xl font-bold text-red-600 mb-2">1-800-SOS-RIDE</p>
                  <p className="text-gray-600">Available 24/7 for immediate assistance</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">In-App SOS Button</h3>
                  <p className="text-gray-600 mb-4">
                    Use the SOS button in your active ride for immediate emergency response
                  </p>
                  <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                    Learn More About Safety
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
