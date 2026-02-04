import { Award, Users, Target, Globe } from "lucide-react";

export default function About() {
  const teamMembers = [
    {
      id: 1,
      name: "Ahmed Hassan",
      role: "Founder & CEO",
      image: "https://i.pravatar.cc/150?img=10",
      bio: "10+ years in transportation tech",
    },
    {
      id: 2,
      name: "Fatima Khan",
      role: "Chief Technology Officer",
      image: "https://i.pravatar.cc/150?img=11",
      bio: "Expert in scalable systems",
    },
    {
      id: 3,
      name: "Mohamed Ali",
      role: "Head of Operations",
      image: "https://i.pravatar.cc/150?img=12",
      bio: "15+ years in ride-sharing",
    },
    {
      id: 4,
      name: "Amira Patel",
      role: "Chief Safety Officer",
      image: "https://i.pravatar.cc/150?img=13",
      bio: "Former safety compliance director",
    },
  ];

  const values = [
    {
      icon: Target,
      title: "Safety First",
      description: "We prioritize the safety of every rider and driver on our platform",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Building a community of trust between riders and drivers",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to providing the highest quality service",
    },
    {
      icon: Globe,
      title: "Sustainability",
      description: "Supporting eco-friendly transportation solutions",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4 md:py-24">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About SwiftRide</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            Revolutionizing urban mobility with safe, affordable, and reliable ride sharing
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 text-lg mb-4">
                To provide safe, affordable, and accessible transportation to everyone,
                while creating economic opportunities for drivers and supporting sustainable
                urban mobility solutions.
              </p>
              <p className="text-gray-600 text-lg">
                We believe that transportation should be reliable, transparent, and
                tailored to the needs of our users. Every ride matters to us.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 text-lg mb-4">
                To become the most trusted and innovative ride-sharing platform in
                South Asia, setting the standard for safety, service quality, and
                environmental responsibility.
              </p>
              <p className="text-gray-600 text-lg">
                We aim to build a world where transportation is seamless, secure, and
                empowering for both riders and drivers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600">
              These principles guide every decision we make
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition flex gap-6"
              >
                <div className="flex-shrink-0">
                  <value.icon className="text-blue-600 mt-2" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="bg-blue-600 text-white py-16 px-4 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "500K+", label: "Active Users" },
              { number: "50K+", label: "Verified Drivers" },
              { number: "10M+", label: "Rides Completed" },
              { number: "50+", label: "Cities Covered" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <p className="text-blue-100 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-lg text-gray-600">
              Experienced professionals dedicated to transforming mobility
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium text-sm mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 px-4 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Our Journey
          </h2>

          <div className="space-y-8">
            {[
              {
                year: "2019",
                title: "Founded",
                description:
                  "SwiftRide was founded with a vision to revolutionize transportation in South Asia",
              },
              {
                year: "2020",
                title: "First 10 Cities",
                description: "Expanded operations to 10 major cities across the region",
              },
              {
                year: "2021",
                title: "1M Rides",
                description: "Celebrated the milestone of completing 1 million rides safely",
              },
              {
                year: "2022",
                title: "Safety Awards",
                description:
                  "Received multiple awards for transportation safety and innovation",
              },
              {
                year: "2023",
                title: "Expansion",
                description:
                  "Launched new features including driver earnings dashboard and SOS system",
              },
              {
                year: "2024",
                title: "Global Recognition",
                description:
                  "Recognized as a leader in ride-sharing innovation and customer satisfaction",
              },
            ].map((event, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {event.year.slice(-2)}
                  </div>
                  {idx < 5 && <div className="w-1 h-16 bg-blue-200 mt-2" />}
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
