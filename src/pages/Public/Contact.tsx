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
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';

export default function Contact() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-950 text-white" : "bg-white text-gray-900"}`}>
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
              Contact SwiftRide
            </motion.h1>
            <motion.p variants={itemVariants} className={`text-xl md:text-2xl max-w-2xl mx-auto ${
    theme === 'dark' ? 'text-blue-50' : 'text-gray-700'
  }`}>
              We're here to help! Get in touch through any of the channels below.
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-4"
            >
              <Badge className="bg-white/20 text-white px-4 py-2 text-sm">
                <CheckCircle className="w-4 h-4 mr-2 inline" />
                24/7 Support
              </Badge>
              <Badge className="bg-white/20 text-white px-4 py-2 text-sm">
                <Clock className="w-4 h-4 mr-2 inline" />
                Fast Response
              </Badge>
              <Badge className="bg-white/20 text-white px-4 py-2 text-sm">
                <Shield className="w-4 h-4 mr-2 inline" />
                Secure & Private
              </Badge>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Options */}
      <section className={`py-24 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4">
              Get in <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Touch</span>
            </motion.h2>
            <motion.p variants={itemVariants} className={`text-xl ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Choose the most convenient way to reach us
            </motion.p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {contactOptions.map((option, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Card className={`text-center border-0 h-full transition-all duration-300 ${theme === "dark" ? "bg-gray-800 hover:shadow-lg" : "bg-white hover:shadow-xl"}`}>
                  <CardContent className="pt-8 pb-6">
                    <div className={`w-16 h-16 ${option.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                      <option.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                    <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"} >{option.description}</p>
                    <div className="space-y-2 mt-4">
                      <p className="font-medium text-blue-500">{option.contact}</p>
                      <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>{option.subtext}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className={`py-24 ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className={`border-0 h-full ${theme === "dark" ? "bg-gray-800" : "bg-white shadow-lg"}`}>
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl">Send us a <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Message</span></CardTitle>
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
                          className={theme === "dark" ? "bg-gray-700 border-gray-600" : ""}
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
                          className={theme === "dark" ? "bg-gray-700 border-gray-600" : ""}
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
                          className={theme === "dark" ? "bg-gray-700 border-gray-600" : ""}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                            theme === "dark"
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "border-gray-300 bg-white text-gray-900"
                          }`}
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
                        className={theme === "dark" ? "bg-gray-700 border-gray-600" : ""}
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
                        className={theme === "dark" ? "bg-gray-700 border-gray-600" : ""}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-2"
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
            </motion.div>

            {/* Office Info & Hours */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className={`border-0 ${theme === "dark" ? "bg-gray-800" : "bg-white shadow-lg"}`}>
                  <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl">Office <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Information</span></CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-4">
                      <MapPin className={`h-6 w-6 ${theme === "dark" ? "text-cyan-400" : "text-blue-500"} mt-1 flex-shrink-0`} />
                      <div>
                        <h4 className="font-semibold mb-1">Head Office</h4>
                        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                          123 Main Street, Suite 100<br />
                          City, State 12345<br />
                          United States
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Phone className={`h-6 w-6 ${theme === "dark" ? "text-cyan-400" : "text-blue-500"} mt-1 flex-shrink-0`} />
                      <div>
                        <h4 className="font-semibold mb-1">Phone Numbers</h4>
                        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                          Customer Support: 1-800-RIDENOW<br />
                          Business Inquiries: 1-800-BIZ-RIDE<br />
                          Emergency: 1-800-SOS-RIDE
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Mail className={`h-6 w-6 ${theme === "dark" ? "text-cyan-400" : "text-blue-500"} mt-1 flex-shrink-0`} />
                      <div>
                        <h4 className="font-semibold mb-1">Email Addresses</h4>
                        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                          Support: support@swiftride.com<br />
                          Business: business@swiftride.com<br />
                          Careers: careers@swiftride.com
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className={`border-0 ${theme === "dark" ? "bg-gray-800" : "bg-white shadow-lg"}`}>
                  <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl">Business <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Hours</span></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Monday - Friday</span>
                        <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>9:00 AM - 9:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Saturday</span>
                        <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>10:00 AM - 8:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Sunday</span>
                        <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>10:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-gray-300 dark:border-gray-700">
                        <span className="font-medium">24/7 Emergency Support</span>
                        <span className="text-green-500 font-semibold">Always Available</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-24 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <HelpCircle className={`h-16 w-16 ${theme === "dark" ? "text-cyan-400" : "text-blue-500"} mx-auto`} />
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Questions</span>
            </motion.h2>
            <motion.p variants={itemVariants} className={`text-xl ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Quick answers to common questions
            </motion.p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className={`border-0 transition-all duration-300 hover:shadow-lg ${theme === "dark" ? "bg-gray-800 hover:shadow-blue-500/20" : "bg-white hover:shadow-xl"}`}>
                  <CardContent className="pt-6 pb-6">
                    <div className="flex items-start gap-4">
                      <AlertCircle className={`h-6 w-6 ${theme === "dark" ? "text-cyan-400" : "text-blue-500"} mt-1 flex-shrink-0`} />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>{faq.answer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className={`py-24 ${theme === "dark" ? "bg-red-950/30" : "bg-red-50"}`}>
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <Shield className="h-16 w-16 text-red-600 mx-auto" />
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4">
              Emergency Support
            </motion.h2>
            <motion.p variants={itemVariants} className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-8`}>
              If you're experiencing an emergency during your ride, please contact us immediately
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className={`rounded-lg shadow-lg p-8 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Emergency Hotline</h3>
                  <p className="text-3xl font-bold text-red-600 mb-2">1-800-SOS-RIDE</p>
                  <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Available 24/7 for immediate assistance</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">In-App SOS Button</h3>
                  <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-4`}>
                    Use the SOS button in your active ride for immediate emergency response
                  </p>
                  <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950/50">
                    Learn More About Safety
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
