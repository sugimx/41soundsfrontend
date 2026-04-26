import React from 'react';
import Link from 'next/link';
import { InstagramIcon, MailIcon, PhoneIcon, ArrowLeft } from 'lucide-react';

export const metadata = {
    title: "Contact Us | 41 Sounds Concert Tickets",
    description: "Get in touch with 41 Sounds. Contact us for ticket inquiries, event information, or any other questions. Available via phone, email, and social media.",
    robots: "index, follow",
};

const ContactPage = () => (
  <main className="relative min-h-screen bg-black px-4 py-12 overflow-hidden">
    {/* Gradient blur background */}
    <div className="absolute top-0 -z-10 left-1/3 w-96 h-96 bg-pink-600 blur-[300px] opacity-30"></div>
    <div className="absolute bottom-0 -z-10 right-1/4 w-96 h-96 bg-pink-500 blur-[300px] opacity-20"></div>

    <div className="max-w-3xl mx-auto">
      <Link href="/" className="inline-flex items-center text-pink-600 hover:text-pink-500 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get in Touch</h1>
      <p className="text-gray-400 mb-12 text-lg">Have questions about our concerts or tickets? We'd love to hear from you. Contact us through any of the channels below.</p>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {/* Phone */}
        <a 
          href="tel:+919345510582"
          className="p-8 rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-pink-600 hover:bg-gray-900/70 transition-all"
        >
          <div className="inline-block p-3 rounded-full bg-pink-600/20 mb-4">
            <PhoneIcon className="w-6 h-6 text-pink-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Phone</h3>
          <p className="text-gray-400 mb-4">Call us directly</p>
          <p className="text-pink-600 font-semibold">+91 93455 10582</p>
        </a>

        {/* Email */}
        <a 
          href="mailto:connect@41sounds.com"
          className="p-8 rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-pink-600 hover:bg-gray-900/70 transition-all"
        >
          <div className="inline-block p-3 rounded-full bg-pink-600/20 mb-4">
            <MailIcon className="w-6 h-6 text-pink-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Email</h3>
          <p className="text-gray-400 mb-4">Send us a message</p>
          <p className="text-pink-600 font-semibold">connect@41sounds.com</p>
        </a>

        {/* Instagram */}
        <a 
          href="https://www.instagram.com/41__sounds/"
          target="_blank"
          rel="noreferrer"
          className="p-8 rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-pink-600 hover:bg-gray-900/70 transition-all"
        >
          <div className="inline-block p-3 rounded-full bg-pink-600/20 mb-4">
            <InstagramIcon className="w-6 h-6 text-pink-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Instagram</h3>
          <p className="text-gray-400 mb-4">Follow us on social</p>
          <p className="text-pink-600 font-semibold">@41__sounds</p>
        </a>
      </div>

      {/* Additional Information */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">What are your ticket prices?</h3>
            <p className="text-gray-400">We offer various ticket tiers ranging from ₹500 to ₹2000 (Rocker, Gold, Platinum, and VIP). Each tier includes different benefits and access levels. Visit our Pricing section for detailed information.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Can I refund my tickets?</h3>
            <p className="text-gray-400">All ticket sales are final. Refunds will only be issued in the event of event cancellation or as required by law. For more details, please check our <Link href="/refunds" className="text-pink-600 hover:text-pink-500">Refund Policy</Link>.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">What are your terms and conditions?</h3>
            <p className="text-gray-400">Please review our <Link href="/terms" className="text-pink-600 hover:text-pink-500">Terms & Conditions</Link> for complete information about our policies, ticket usage, and your rights as a customer.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">How is my personal information protected?</h3>
            <p className="text-gray-400">We take data security seriously. Please see our <Link href="/privacy" className="text-pink-600 hover:text-pink-500">Privacy Policy</Link> for details on how we collect, use, and protect your information.</p>
          </div>
        </div>
      </div>

      <div className="mt-12 p-8 bg-pink-600/10 border border-pink-600/30 rounded-lg">
        <p className="text-gray-300 text-center">
          For concert-related inquiries, please allow 24-48 hours for a response. We're usually available during business hours (10 AM - 6 PM IST).
        </p>
      </div>
    </div>
  </main>
);

export default ContactPage;
