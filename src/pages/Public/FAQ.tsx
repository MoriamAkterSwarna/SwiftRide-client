import { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, AlertCircle, BookOpen} from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

interface FAQItem {
  category: string;
  questions: {
    question: string;
    answer: string;
  }[];
}

export default function FAQ() {
  const { theme } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  const faqData: FAQItem[] = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'How do I download and setup SwiftRide?',
          answer: 'Download the SwiftRide app from the App Store or Google Play. Create an account with your email, phone number, and payment method. Complete identity verification and you\'re ready to book your first ride!'
        },
        {
          question: 'What are the minimum requirements to use SwiftRide?',
          answer: 'You must be at least 18 years old with a valid email address and phone number. For payment, you\'ll need a credit/debit card or registered digital wallet.'
        },
        {
          question: 'Can I use SwiftRide without a smartphone?',
          answer: 'While our mobile app is the primary way to book rides, you can call our customer support team to book remotely. However, we recommend using the app for the best experience.'
        }
      ]
    },
    {
      category: 'Booking & Rides',
      questions: [
        {
          question: 'How long does it typically take to get a ride?',
          answer: 'Average wait time is 3-5 minutes during normal hours. Peak hours may take 7-10 minutes. You\'ll receive real-time updates on driver location and estimated arrival.'
        },
        {
          question: 'Can I schedule a ride in advance?',
          answer: 'Yes! Use the "Schedule Ride" feature in the app to book a ride up to 30 days in advance. You can schedule rides for specific times that work best for you.'
        },
        {
          question: 'What if I need to cancel my ride?',
          answer: 'You can cancel for free if the driver hasn\'t started moving. After the driver picks up, cancellation fees may apply based on your location\'s pricing.'
        },
        {
          question: 'Can I share a ride with someone else?',
          answer: 'Yes! Our Pool rides feature allows you to share your ride with other passengers going in the same direction, saving up to 50% on fares.'
        }
      ]
    },
    {
      category: 'Payment & Pricing',
      questions: [
        {
          question: 'How are fares calculated?',
          answer: 'Fares are based on distance traveled, time taken, ride type selected, and current demand. You\'ll always see the estimated fare before confirming your booking.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept credit/debit cards, digital wallets (Apple Pay, Google Pay), cash payments, and corporate accounts. You can add multiple payment methods to your profile.'
        },
        {
          question: 'Are there any hidden charges?',
          answer: 'No! We believe in transparent pricing. The quoted price is the final price you pay. Any applicable taxes or tolls are included in the estimate.'
        },
        {
          question: 'Do you offer discounts or promo codes?',
          answer: 'Yes! New users get $5 off their first ride. We regularly offer promo codes for loyal customers. Check the app\'s Promotions section for current offers.'
        }
      ]
    },
    {
      category: 'Safety & Support',
      questions: [
        {
          question: 'How does SwiftRide ensure my safety?',
          answer: 'All drivers undergo thorough background checks and vehicle inspections. We have 24/7 support, in-app SOS button, GPS tracking, and automated safety features to protect you.'
        },
        {
          question: 'What should I do if I feel unsafe during a ride?',
          answer: 'Press the SOS button in your active ride immediately. This alerts our safety team and local authorities. You can also exit the ride and contact us at 1-800-SOS-RIDE.'
        },
        {
          question: 'Can I share my ride details with someone?',
          answer: 'Yes! Use the "Share Your Trip" feature to send real-time ride details to friends or family. They can track your location and arrival time.'
        },
        {
          question: 'What if I left something in the car?',
          answer: 'Contact our support team immediately with your trip details. We\'ll help you connect with the driver to retrieve your lost item. Most items are recovered within 24 hours.'
        }
      ]
    },
    {
      category: 'Driver Questions',
      questions: [
        {
          question: 'How can I become a SwiftRide driver?',
          answer: 'Visit our "Become a Driver" page or download the driver app. You\'ll need to be 21+, have a valid license, pass a background check, and own a qualifying vehicle.'
        },
        {
          question: 'What are the vehicle requirements?',
          answer: 'Your vehicle should be a 2010 model or newer, have valid registration and insurance, pass a safety inspection, and seat at least 4 passengers.'
        },
        {
          question: 'How much can I earn as a driver?',
          answer: 'Earnings vary based on location, time, and demand. On average, drivers earn $15-25/hour. Peak hours and surge pricing can increase earnings significantly.'
        },
        {
          question: 'What happens if there\'s an accident?',
          answer: 'SwiftRide provides insurance coverage for accidents during active rides. Report the incident immediately in the app, and our support team will guide you through the claims process.'
        }
      ]
    },
    {
      category: 'Account & Profile',
      questions: [
        {
          question: 'How do I update my profile information?',
          answer: 'Go to Settings > Profile and update your name, email, phone number, or payment methods. Changes take effect immediately.'
        },
        {
          question: 'Can I have multiple accounts?',
          answer: 'No, you can only have one active account per email address. Having multiple accounts violates our terms of service.'
        },
        {
          question: 'What if I forgot my password?',
          answer: 'Click "Forgot Password" on the login screen. We\'ll send a reset link to your registered email. Follow the link to create a new password.'
        },
        {
          question: 'How do I delete my account?',
          answer: 'Go to Settings > Account > Delete Account. You\'ll need to confirm this action. Your data will be securely deleted within 30 days.'
        }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  const toggleAccordion = (id: string) => {
    setExpandedIndex(expandedIndex === id ? null : id);
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
            <motion.div variants={itemVariants} className="mb-6">
              <HelpCircle className="h-16 w-16 mx-auto" />
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold mb-6">
              Frequently Asked Questions
            </motion.h1>
            <motion.p variants={itemVariants} className={`text-xl md:text-2xl max-w-2xl mx-auto ${
    theme === 'dark' ? 'text-blue-50' : 'text-gray-700'
  }`}>
              Find answers to common questions about SwiftRide
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className={`py-24 ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-12"
          >
            {faqData.map((category, categoryIdx) => (
              <motion.div key={categoryIdx} variants={itemVariants}>
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-8">
                    {category.category}
                  </h2>

                  <div className="space-y-4">
                    {category.questions.map((item, itemIdx) => {
                      const itemId = `${categoryIdx}-${itemIdx}`;
                      const isExpanded = expandedIndex === itemId;

                      return (
                        <motion.div
                          key={itemIdx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: itemIdx * 0.1 }}
                        >
                          <Card
                            className={`border-0 cursor-pointer transition-all duration-300 overflow-hidden ${
                              theme === 'dark'
                                ? 'bg-gray-800 hover:shadow-lg hover:shadow-blue-500/20'
                                : 'bg-gray-50 hover:shadow-lg'
                            }`}
                            onClick={() => toggleAccordion(itemId)}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
                                </div>
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="shrink-0 mt-1"
                                >
                                  <ChevronDown className="h-5 w-5 text-blue-500" />
                                </motion.div>
                              </div>

                              <motion.div
                                initial={false}
                                animate={{
                                  height: isExpanded ? 'auto' : 0,
                                  opacity: isExpanded ? 1 : 0,
                                  marginTop: isExpanded ? 16 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className={`pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                    {item.answer}
                                  </p>
                                </div>
                              </motion.div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className={`py-24 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <MessageCircle className={`h-16 w-16 mx-auto ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-500'}`} />
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-6">
              Still Have <span className="bg-linear-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Questions?</span>
            </motion.h2>
            <motion.p variants={itemVariants} className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-10 max-w-2xl mx-auto`}>
              Our support team is ready to help. Reach out to us through any of the following methods.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="grid md:grid-cols-3 gap-6 mt-12"
            >
              <Card className={`border-0 h-full transition-all duration-300 hover:shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg'
              }`}>
                <CardContent className="p-8 text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
                  }`}>
                    <MessageCircle className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} >
                    Chat with our support team in real-time
                  </p>
                  <Button className="mt-4 w-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    Start Chat
                  </Button>
                </CardContent>
              </Card>

              <Card className={`border-0 h-full transition-all duration-300 hover:shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg'
              }`}>
                <CardContent className="p-8 text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'
                  }`}>
                    <AlertCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    24/7 customer support available
                  </p>
                  <Button className="mt-4 w-full bg-green-500 hover:bg-green-600">
                    1-800-RIDENOW
                  </Button>
                </CardContent>
              </Card>

              <Card className={`border-0 h-full transition-all duration-300 hover:shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg'
              }`}>
                <CardContent className="p-8 text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
                  }`}>
                    <BookOpen className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    support@swiftride.com
                  </p>
                  <Button className="mt-4 w-full bg-purple-500 hover:bg-purple-600">
                    Send Email
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
