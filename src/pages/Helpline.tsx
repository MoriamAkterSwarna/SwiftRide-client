import { useState } from "react";
import { useSelector } from "react-redux";
import {
  MessageCircle,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  Search,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

interface RootState {
  authSession: {
    hasSession: boolean;
  };
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: 1,
    question: "How do I book a ride?",
    answer:
      "Simply open the app, select your pickup and dropoff locations, choose your preferred ride type, and tap 'Book'. Your nearest driver will accept the request.",
  },
  {
    id: 2,
    question: "What payment methods do you accept?",
    answer:
      "We accept cash, credit/debit cards, mobile wallets, and our in-app wallet. You can add payment methods in your profile settings.",
  },
  {
    id: 3,
    question: "How can I become a driver?",
    answer:
      "Go to 'Become a Driver' section in your profile, submit required documents, and wait for verification. Once approved, you can start accepting rides.",
  },
  {
    id: 4,
    question: "What if I need to cancel my ride?",
    answer:
      "You can cancel up to 2 minutes before the driver arrives without any charge. After that, a small cancellation fee applies. Cancel from the active ride screen.",
  },
  {
    id: 5,
    question: "How do I report a safety issue?",
    answer:
      "Use the SOS button in the app during your ride or contact our safety team immediately. You can also file a report through the Help & Support section.",
  },
  {
    id: 6,
    question: "How are fares calculated?",
    answer:
      "Fares are based on distance, time, and current demand. Base fare + (distance × rate) + (time × rate) = total fare. Peak hours may have surge pricing.",
  },
];

export default function Helpline() {
  const hasSessionHint = useSelector((state: RootState) => state.authSession.hasSession);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    issue: "general",
    message: "",
  });

  if (!hasSessionHint) {
    return (
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 text-center">
        <p className="text-slate-600">Please log in to access help & support.</p>
      </div>
    );
  }

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Message sent! We'll get back to you soon.");
    setContactForm({ name: "", email: "", issue: "general", message: "" });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 font-body">
      {/* Header */}
      <div className="mb-12 space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Support Center
        </p>
        <h1 className="font-display text-4xl font-semibold text-slate-900 dark:text-white">
          Help & Support
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          We're here to help. Find answers, contact us, or reach our emergency support team.
        </p>
      </div>

      {/* Quick Contact Cards */}
      <div className="mb-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ContactCard
          icon={Phone}
          title="Call Us"
          content="+880 1234 567890"
          subtext="24/7 Available"
          color="blue"
        />
        <ContactCard
          icon={Mail}
          title="Email"
          content="support@swiftride.com"
          subtext="Response in 24h"
          color="green"
        />
        <ContactCard
          icon={MessageCircle}
          title="Live Chat"
          content="Available Now"
          subtext="Chat with agent"
          color="purple"
          action={() => toast.success("Opening chat...")}
        />
        <ContactCard
          icon={AlertCircle}
          title="SOS"
          content="Emergency Support"
          subtext="Urgent Issues"
          color="red"
          action={() => toast.success("Contacting emergency team...")}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* FAQ Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/70 p-8 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.65)] backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/70">
            {/* Background Gradients */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,200,160,0.9),rgba(255,200,160,0.1)_55%,transparent_70%)]" />
            <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(147,197,253,0.85),rgba(147,197,253,0.15)_55%,transparent_70%)]" />

            <div className="relative z-10">
              <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>

              {/* Search */}
              <div className="mb-6 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200/70 bg-white/70 py-2 pl-10 pr-4 text-slate-900 placeholder-slate-500 transition-all duration-200 focus:border-blue-500 focus:outline-none dark:border-slate-800/70 dark:bg-slate-900/50 dark:text-white dark:placeholder-slate-400"
                />
              </div>

              {/* FAQ Items */}
              <div className="space-y-3">
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((faq) => (
                    <FAQItem
                      key={faq.id}
                      faq={faq}
                      isExpanded={expandedFAQ === faq.id}
                      onToggle={() =>
                        setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                      }
                    />
                  ))
                ) : (
                  <p className="py-8 text-center text-slate-500 dark:text-slate-400">
                    No FAQs found for "{searchQuery}". Please try a different search.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form - Modern Card Design */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-500 to-blue-600 p-1 shadow-2xl dark:from-blue-600 dark:to-blue-700 lg:col-span-1">
          <div className="relative rounded-[30px] bg-white/95 backdrop-blur dark:bg-slate-900/95 overflow-hidden">
            {/* Decorative gradient shapes */}
            <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-gradient-to-br from-yellow-200/40 to-orange-200/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-gradient-to-tr from-blue-200/30 to-blue-100/20 blur-3xl" />

            <div className="relative z-10 p-8">
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
                  Get In Touch
                </p>
                <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white">
                  Contact Us
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  We'll respond within 24 hours
                </p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    placeholder="Your name"
                    className="w-full rounded-xl border border-slate-200/70 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700/70 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500 dark:focus:ring-blue-500/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    placeholder="your@email.com"
                    className="w-full rounded-xl border border-slate-200/70 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700/70 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500 dark:focus:ring-blue-500/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Issue Type
                  </label>
                  <select
                    value={contactForm.issue}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, issue: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200/70 bg-slate-50/50 px-4 py-3 text-slate-900 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700/70 dark:bg-slate-800/50 dark:text-white dark:focus:ring-blue-500/30"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing Issue</option>
                    <option value="safety">Safety Concern</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, message: e.target.value })
                    }
                    placeholder="Describe your issue in detail..."
                    rows={4}
                    className="w-full rounded-xl border border-slate-200/70 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700/70 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500 dark:focus:ring-blue-500/30 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 dark:from-blue-600 dark:via-blue-700 dark:to-blue-800"
                >
                  Send Message
                </button>
              </form>

              {/* Contact Info - Compact */}
              <div className="mt-6 space-y-3 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Call Us
                    </p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      +880 1234 567890
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Available
                    </p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      24/7 Support
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({
  faq,
  isExpanded,
  onToggle,
}: {
  faq: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full text-left rounded-2xl border border-slate-200/60 bg-slate-50/80 transition-all duration-200 hover:border-slate-300/60 hover:bg-slate-100/80 dark:border-slate-800/60 dark:bg-slate-800/40 dark:hover:border-slate-700/60 dark:hover:bg-slate-800/60"
    >
      <div className="flex items-center justify-between px-4 py-4">
        <p className="font-medium text-slate-900 dark:text-white text-left">
          {faq.question}
        </p>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-slate-500 transition-transform duration-200 dark:text-slate-400 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </div>
      {isExpanded && (
        <div className="border-t border-slate-200/50 px-4 py-4 text-sm text-slate-600 dark:border-slate-800/50 dark:text-slate-400">
          {faq.answer}
        </div>
      )}
    </button>
  );
}

function ContactCard({
  icon: Icon,
  title,
  content,
  subtext,
  color,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  content: string;
  subtext: string;
  color: string;
  action?: () => void;
}) {
  const colorClasses = {
    blue: "border-blue-200/50 bg-blue-50/80 dark:border-blue-900/50 dark:bg-blue-950/40",
    green:
      "border-green-200/50 bg-green-50/80 dark:border-green-900/50 dark:bg-green-950/40",
    purple:
      "border-purple-200/50 bg-purple-50/80 dark:border-purple-900/50 dark:bg-purple-950/40",
    red: "border-red-200/50 bg-red-50/80 dark:border-red-900/50 dark:bg-red-950/40",
  };

  const iconColors = {
    blue: "text-blue-500",
    green: "text-green-500",
    purple: "text-purple-500",
    red: "text-red-500",
  };

  return (
    <button
      onClick={action}
      className={`rounded-2xl border p-6 transition-all duration-200 hover:shadow-lg ${
        colorClasses[color as keyof typeof colorClasses]
      }`}
    >
      <Icon className={`h-8 w-8 mb-3 ${iconColors[color as keyof typeof iconColors]}`} />
      <h3 className="font-semibold text-slate-900 dark:text-white text-left mb-1">
        {title}
      </h3>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 text-left">
        {content}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 text-left mt-1">
        {subtext}
      </p>
    </button>
  );
}
