import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      value: "+1 (555) 123-4567",
      description: "Available 24/7",
    },
    {
      icon: Mail,
      title: "Email",
      value: "support@swiftride.com",
      description: "Response within 24 hours",
    },
    {
      icon: MapPin,
      title: "Address",
      value: "123 Tech Street, Tech City, TC 12345",
      description: "Corporate Headquarters",
    },
    {
      icon: Clock,
      title: "Hours",
      value: "24/7/365",
      description: "Always available",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4 md:py-24">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg md:text-xl text-blue-100">
            Have questions? We're here to help!
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition text-center"
              >
                <info.icon className="text-blue-600 mx-auto mb-4" size={32} />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {info.title}
                </h3>
                <p className="text-blue-600 font-medium mb-1">{info.value}</p>
                <p className="text-gray-600 text-sm">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 px-4 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-medium mb-2">Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Support Request</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                    <option value="complaint">Complaint</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-900 font-medium mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Map Section */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Visit Us</h2>
              <div className="bg-gray-200 rounded-lg overflow-hidden h-96 mb-6">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-300 to-gray-400">
                  <div className="text-center">
                    <MapPin className="text-gray-600 mx-auto mb-2" size={40} />
                    <p className="text-gray-600">Interactive Map Coming Soon</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Business Hours</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM
                  </li>
                  <li>
                    <strong>Saturday:</strong> 10:00 AM - 4:00 PM
                  </li>
                  <li>
                    <strong>Sunday:</strong> Closed
                  </li>
                  <li className="pt-2 text-sm text-gray-600">
                    *Customer support available 24/7 via chat and email
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 px-4 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Check our FAQ page for quick answers
          </p>
          <a
            href="/faq"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View FAQ
          </a>
        </div>
      </section>
    </div>
  );
}
