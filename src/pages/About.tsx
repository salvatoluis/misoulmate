import React from "react";
import {
  ArrowLeft,
  Heart,
  Users,
  Shield,
  Zap,
  Globe,
  Award,
  Star,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import FinalCTA from "../components/FinalCTA";

const About: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { number: "2M+", label: "Happy Users", icon: <Users size={24} /> },
    { number: "500K+", label: "Successful Matches", icon: <Heart size={24} /> },
    { number: "150+", label: "Countries", icon: <Globe size={24} /> },
    { number: "99.9%", label: "Uptime", icon: <Shield size={24} /> },
  ];

  const values = [
    {
      icon: <Heart size={24} className="text-[#FF6B81]" />,
      title: "Authentic Connections",
      description:
        "We believe in fostering genuine relationships built on compatibility and shared values, not just superficial attraction.",
    },
    {
      icon: <Shield size={24} className="text-[#FF6B81]" />,
      title: "Safety First",
      description:
        "Your safety and privacy are our top priorities. We use advanced verification and moderation to create a secure environment.",
    },
    {
      icon: <Zap size={24} className="text-[#FF6B81]" />,
      title: "Innovation",
      description:
        "We continuously evolve our platform with cutting-edge technology like AI matching and real-time translation.",
    },
    {
      icon: <Users size={24} className="text-[#FF6B81]" />,
      title: "Inclusive Community",
      description:
        "We welcome everyone regardless of background, orientation, or beliefs. Love knows no boundaries.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "Former tech executive with 15 years in relationship psychology and product development.",
      image: "SJ",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "AI expert and software architect who built our advanced matching algorithms.",
      image: "MC",
    },
    {
      name: "Emma Rodriguez",
      role: "Head of Safety",
      bio: "Former law enforcement with expertise in online safety and user protection.",
      image: "ER",
    },
    {
      name: "David Kim",
      role: "Lead UX Designer",
      bio: "Award-winning designer focused on creating intuitive and accessible user experiences.",
      image: "DK",
    },
  ];

  const milestones = [
    {
      year: "2020",
      event: "Company founded with a vision to revolutionize online dating",
    },
    { year: "2021", event: "Launched beta version with 10,000 early adopters" },
    {
      year: "2022",
      event: "Reached 500K users and introduced AI-powered matching",
    },
    { year: "2023", event: "Expanded globally to 50+ countries" },
    {
      year: "2024",
      event: "Hit 2M users and launched advanced compatibility features",
    },
  ];

  return (
    <div className="bg-[#FFF9F0] min-h-screen pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">About Us</h1>
        </div>
      </header>

      {/* Why Choose Us Section */}
      <Features />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Call to Action Section */}
      <FinalCTA />

      <div className="container mx-auto px-4 py-6 bg-gray-50">
        <div className="text-center mb-12">
          <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-[#FF6B81]/10 mb-6">
            <Heart size={36} className="text-[#FF6B81]" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Connecting Hearts, Building Futures
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We're on a mission to help people find meaningful relationships
            through innovative technology, genuine community, and a deep
            understanding of what makes connections last.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mx-auto mb-3">
                {React.cloneElement(stat.icon, { className: "text-[#FF6B81]" })}
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Our Story</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4 leading-relaxed">
              It all started in 2020 when our founder, Sarah Johnson,
              experienced the frustration of modern dating apps firsthand. After
              countless meaningless swipes and superficial connections, she
              realized there had to be a better way to help people find genuine,
              lasting relationships.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Sarah assembled a team of relationship psychologists, AI experts,
              and user experience designers to create something different.
              Instead of focusing solely on photos and brief bios, we built a
              platform that prioritizes compatibility, shared values, and
              meaningful conversation.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, we're proud to have helped over 500,000 people find their
              perfect match. Our advanced algorithms, combined with human
              insight and community support, continue to set new standards for
              what online dating can achieve.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">
            What We Stand For
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FF6B81]/10 flex items-center justify-center flex-shrink-0">
                    {value.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      {value.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Our Journey
          </h3>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-[#FF6B81]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#FF6B81] font-bold text-sm">
                    {milestone.year}
                  </span>
                </div>
                <div className="pt-3">
                  <p className="text-gray-700 leading-relaxed">
                    {milestone.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">
            Meet Our Team
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B81] to-[#D86D72] flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">
                    {member.image}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-1">
                  {member.name}
                </h4>
                <p className="text-[#FF6B81] text-sm font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#FF6B81]/10 to-[#D86D72]/10 rounded-xl p-8 mb-8 border border-[#FF6B81]/20">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Recognition & Awards
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                <Award size={28} className="text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Best Dating App 2024
              </h4>
              <p className="text-sm text-gray-600">
                TechCrunch Innovation Awards
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Star size={28} className="text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">
                4.8/5 App Store Rating
              </h4>
              <p className="text-sm text-gray-600">Based on 250K+ reviews</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Shield size={28} className="text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Privacy Certified
              </h4>
              <p className="text-sm text-gray-600">
                ISO 27001 & GDPR Compliant
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Love Stories
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-l-4 border-[#FF6B81] pl-6">
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-[#FFE066] fill-[#FFE066] mr-0.5"
                  />
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">
                "We matched on this app 18 months ago and got married last
                month! The compatibility test really helped us understand each
                other better from the start."
              </p>
              <div className="text-sm font-medium text-gray-800">
                Jessica & Ryan • Married in 2024
              </div>
            </div>
            <div className="border-l-4 border-[#FF6B81] pl-6">
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-[#FFE066] fill-[#FFE066] mr-0.5"
                  />
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">
                "After years of disappointing dates, this app finally helped me
                find someone who truly gets me. The AI chat assist was a
                game-changer for my conversation skills!"
              </p>
              <div className="text-sm font-medium text-gray-800">
                Marcus • Found love in 3 months
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Get In Touch
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mx-auto mb-3">
                <Mail size={20} className="text-[#FF6B81]" />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">Email Us</h4>
              <p className="text-gray-600 text-sm">hello@yourapp.com</p>
              <p className="text-gray-600 text-sm">support@yourapp.com</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mx-auto mb-3">
                <Phone size={20} className="text-[#FF6B81]" />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">Call Us</h4>
              <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
              <p className="text-gray-600 text-sm">24/7 Support Available</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mx-auto mb-3">
                <MapPin size={20} className="text-[#FF6B81]" />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">Visit Us</h4>
              <p className="text-gray-600 text-sm">123 Love Street</p>
              <p className="text-gray-600 text-sm">San Francisco, CA 94105</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
