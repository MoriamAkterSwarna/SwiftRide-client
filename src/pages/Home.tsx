/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { ArrowRight, Check, MapPin, Phone, Mail, Zap, Heart, Shield, Users } from "lucide-react";
import { Link } from "react-router";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const testimonials = [
    {
      id: 1,
      name: "Sarah Ahmed",
      role: "Regular Rider",
      image: "https://i.pravatar.cc/100?img=1",
      text: "SwiftRide has made my daily commute so much easier. The drivers are professional and the app is incredibly user-friendly!",
      rating: 5,
    },
    {
      id: 2,
      name: "Mohamed Hassan",
      role: "Professional Driver",
      image: "https://i.pravatar.cc/100?img=2",
      text: "As a driver, I appreciate the transparent earnings and reliable ride acceptance system. Great support team!",
      rating: 5,
    },
    {
      id: 3,
      name: "Fatima Khan",
      role: "Frequent Traveler",
      image: "https://i.pravatar.cc/100?img=3",
      text: "The live tracking feature makes me feel safe. I always know where my driver is and when they'll arrive.",
      rating: 5,
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Ultra Fast Booking",
      description: "Book a ride in seconds with our streamlined interface",
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "Verified drivers, SOS button, and real-time tracking",
    },
    {
      icon: MapPin,
      title: "Live Tracking",
      description: "See your driver's location in real-time on the map",
    },
    {
      icon: Heart,
      title: "Affordable Fares",
      description: "Transparent pricing with no hidden charges",
    },
    {
      icon: Users,
      title: "Professional Drivers",
      description: "Trained and verified drivers for your safety",
    },
    {
      icon: Phone,
      title: "24/7 Support",
      description: "Round-the-clock customer support team",
    },
  ];

  const faqs = [
    {
      id: 1,
      question: "How do I book a ride?",
      answer:
        "Download the app, sign up, enter your pickup and destination, select a ride type, and confirm. A driver will be assigned within seconds.",
    },
    {
      id: 2,
      question: "Is SwiftRide safe?",
      answer:
        "Yes! We verify all drivers, provide real-time tracking, have an SOS button for emergencies, and maintain strict safety standards.",
    },
    {
      id: 3,
      question: "What payment methods are accepted?",
      answer:
        "We accept cash, credit/debit cards, mobile wallets, and online payment systems for your convenience.",
    },
    {
      id: 4,
      question: "Can I become a driver?",
      answer:
        "Yes! Visit our driver registration page, complete the verification process, and start earning with SwiftRide.",
    },
    {
      id: 5,
      question: "How are fares calculated?",
      answer:
        "Fares are based on distance, time, and demand. You'll see the estimated fare before confirming your ride.",
    },
    {
      id: 6,
      question: "What if I have an emergency during a ride?",
      answer:
        "Press the SOS button on the app to alert emergency services and your saved emergency contacts. The driver will be notified.",
    },
  ];

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white py-20 px-4 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Your Journey, Our Priority
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8">
                Experience safe, affordable, and reliable ride sharing with SwiftRide.
                Book a ride in seconds and reach your destination with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2"
                >
                  Get Started <ArrowRight size={20} />
                </Link>
                <Link
                  to="/about"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8">
                <img
                  src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=500&fit=crop"
                  alt="Ride App"
                  className="rounded-xl object-cover w-full h-96"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How SwiftRide Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple, fast, and secure. Get started in 4 easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Sign Up",
                description: "Create an account with your email or phone number",
              },
              {
                step: 2,
                title: "Enter Location",
                description: "Specify your pickup and destination points",
              },
              {
                step: 3,
                title: "Confirm Ride",
                description: "Review the fare estimate and confirm your booking",
              },
              {
                step: 4,
                title: "Ride & Pay",
                description: "Relax as your driver arrives. Pay safely at the end",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="text-blue-600" size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose SwiftRide?
            </h2>
            <p className="text-lg text-gray-600">
              Premium features designed for your safety and convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition"
              >
                <feature.icon className="text-blue-600 mb-4" size={32} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer Section */}
      <section className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-16 px-4 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Special Offer for New Users
          </h2>
          <p className="text-lg text-green-100 mb-6">
            Get 50% off on your first 5 rides. Use code: WELCOME50
          </p>
          <p className="text-green-100 mb-8">
            Valid for new users only. Limited time offer!
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Claim Your Offer
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of satisfied riders and drivers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 italic">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Find answers to common questions about SwiftRide
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 transition"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                  }
                  className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition"
                >
                  <h3 className="text-lg font-semibold text-gray-900 text-left">
                    {faq.question}
                  </h3>
                  <span
                    className={`text-blue-600 transition transform ${
                      expandedFaq === faq.id ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16 px-4 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Book Your Next Ride?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Download SwiftRide and start your journey today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
            >
              Sign Up Now
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition inline-block"
            >
              I Have an Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
