/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Search } from "lucide-react";

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const faqs = [
    // General Questions
    {
      category: "General",
      id: 1,
      question: "What is SwiftRide?",
      answer:
        "SwiftRide is a modern ride-sharing platform that connects riders with professional drivers. We offer safe, affordable, and reliable transportation services across major cities.",
    },
    {
      category: "General",
      id: 2,
      question: "In which cities is SwiftRide available?",
      answer:
        "SwiftRide operates in 50+ cities across South Asia. You can check availability in your area by entering your location in the app.",
    },
    {
      category: "General",
      id: 3,
      question: "What are the service hours?",
      answer:
        "SwiftRide is available 24/7 in most cities. Service availability may vary by location. Check the app for specific hours in your area.",
    },

    // Account & Registration
    {
      category: "Account & Registration",
      id: 4,
      question: "How do I create an account?",
      answer:
        "Download the SwiftRide app, tap 'Sign Up', enter your phone number or email, verify your identity, and create a password. You can also sign up using your social media accounts.",
    },
    {
      category: "Account & Registration",
      id: 5,
      question: "Is my personal information secure?",
      answer:
        "Yes, we use industry-standard encryption and security protocols. Your data is never shared with third parties without your consent.",
    },
    {
      category: "Account & Registration",
      id: 6,
      question: "How do I reset my password?",
      answer:
        "Tap 'Forgot Password' on the login screen, enter your email, and follow the verification link sent to your email.",
    },

    // Booking & Payments
    {
      category: "Booking & Payments",
      id: 7,
      question: "How do I book a ride?",
      answer:
        "Open the app, enter your pickup location, select your destination, choose a ride type, and tap 'Book Ride'. A driver will be assigned within seconds.",
    },
    {
      category: "Booking & Payments",
      id: 8,
      question: "What payment methods are accepted?",
      answer:
        "We accept cash, credit/debit cards, mobile wallets (Apple Pay, Google Pay), and various digital payment systems.",
    },
    {
      category: "Booking & Payments",
      id: 9,
      question: "Why was I charged a cancellation fee?",
      answer:
        "Cancellation fees apply if you cancel after a driver has been assigned. You can cancel free of charge within 2 minutes of booking.",
    },
    {
      category: "Booking & Payments",
      id: 10,
      question: "Is there a peak hour surcharge?",
      answer:
        "During high-demand periods, a dynamic pricing model may apply. You'll see the estimated fare before confirming your ride.",
    },

    // Rides & Safety
    {
      category: "Rides & Safety",
      id: 11,
      question: "How do I track my ride in real-time?",
      answer:
        "After booking, you'll see your driver's location, vehicle details, and estimated arrival time on the map. Updates happen in real-time.",
    },
    {
      category: "Rides & Safety",
      id: 12,
      question: "What should I do if I feel unsafe during a ride?",
      answer:
        "Press the SOS button in your ride screen. This will alert emergency services and your saved emergency contacts. You can also call emergency services directly at 911.",
    },
    {
      category: "Rides & Safety",
      id: 13,
      question: "Can I share my ride location with someone?",
      answer:
        "Yes, you can share your live location with friends and family using the share feature in the app.",
    },
    {
      category: "Rides & Safety",
      id: 14,
      question: "What happens if I forget something in the car?",
      answer:
        "Contact us immediately through the app. We'll help you get in touch with the driver to recover your lost item.",
    },

    // Driver Related
    {
      category: "Driver Related",
      id: 15,
      question: "How do I become a driver?",
      answer:
        "Visit the 'Become a Driver' page, complete the registration form, upload required documents, pass a background check, and you're ready to drive.",
    },
    {
      category: "Driver Related",
      id: 16,
      question: "What documents do I need to become a driver?",
      answer:
        "You'll need a valid driver's license, vehicle registration, insurance certificate, and proof of address. All documents must be current and valid.",
    },
    {
      category: "Driver Related",
      id: 17,
      question: "How much can I earn as a driver?",
      answer:
        "Earnings depend on the number of rides, distance traveled, and time worked. Most drivers earn between $15-25 per hour. Check your earnings dashboard for detailed insights.",
    },
    {
      category: "Driver Related",
      id: 18,
      question: "Can I drive anytime I want?",
      answer:
        "Yes, you're in complete control. Go online whenever you want and accept rides on your schedule. No minimum hours required.",
    },

    // Support & Issues
    {
      category: "Support & Issues",
      id: 19,
      question: "How can I contact customer support?",
      answer:
        "Use the in-app chat, call our support line at +1 (555) 123-4567, or email support@swiftride.com. We're available 24/7.",
    },
    {
      category: "Support & Issues",
      id: 20,
      question: "How do I report a safety incident?",
      answer:
        "You can report safety incidents through the app immediately after your ride. Tap 'Report Issue' and provide details. Our safety team will investigate promptly.",
    },
    {
      category: "Support & Issues",
      id: 21,
      question: "What should I do if I have a dispute with a driver?",
      answer:
        "Contact our support team with details about the incident. We'll investigate and resolve the matter fairly within 48 hours.",
    },
    {
      category: "Support & Issues",
      id: 22,
      question: "Is there a refund policy?",
      answer:
        "Yes, we offer refunds for completed rides if the service was unsatisfactory. Contact support with proof, and we'll process your refund within 5 business days.",
    },
  ];

  const categories = ["All", ...new Set(faqs.map(faq => faq.category))];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const groupedFaqs = filteredFaqs.reduce((acc, faq) => {
    const category = faq.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, typeof faqs>);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4 md:py-24">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8">
            Find answers to common questions about SwiftRide
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 px-4 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {Object.entries(groupedFaqs).length > 0 ? (
            <>
              {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
                <div key={category} className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="h-1 w-8 bg-blue-600 rounded"></div>
                    {category}
                  </h2>

                  <div className="space-y-4">
                    {categoryFaqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-blue-500 hover:shadow-md transition"
                      >
                        <button
                          onClick={() =>
                            setExpandedId(expandedId === faq.id ? null : faq.id)
                          }
                          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition text-left"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 flex-1">
                            {faq.question}
                          </h3>
                          <span
                            className={`text-blue-600 transition transform flex-shrink-0 ml-4 ${
                              expandedId === faq.id ? "rotate-180" : ""
                            }`}
                          >
                            ▼
                          </span>
                        </button>

                        {expandedId === faq.id && (
                          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <p className="text-gray-700 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                No FAQs found matching your search
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 md:py-24">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-12 text-center border border-blue-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Didn't find your answer?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Our support team is here to help. Reach out anytime!
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
