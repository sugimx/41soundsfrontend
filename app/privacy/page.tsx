import React from 'react';

export const metadata = {
    title: "Privacy Policy | 41 Sounds Concert Tickets",
    description: "Our privacy policy explains how we collect, use, and protect your personal information when you purchase concert tickets and use our services.",
    robots: "index, follow",
};

const PrivacyPage = () => (
  <main className="max-w-3xl mx-auto px-4 py-12 bg-white rounded-lg shadow-md mt-12 mb-24">
    <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-2 text-center">Privacy Policy</h1>
    <p className="text-gray-500 text-center mb-8">Last updated: March 28, 2026</p>
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Information We Collect</h2>
        <p className="text-gray-700">We may collect personal information such as your name, email address, and payment details when you use our services or contact us.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">2. How We Use Information</h2>
        <p className="text-gray-700">Your information is used to provide and improve our services, process transactions, and communicate with you.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Data Security</h2>
        <p className="text-gray-700">We implement reasonable security measures to protect your personal information from unauthorized access or disclosure.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Third-Party Services</h2>
        <p className="text-gray-700">We may use third-party services for payment processing and analytics. These services have their own privacy policies.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Changes to This Policy</h2>
        <p className="text-gray-700">We may update this Privacy Policy from time to time. Changes will be posted on this page.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">6. Contact Us</h2>
        <p className="text-gray-700">If you have any questions about this Privacy Policy, please contact us.</p>
      </section>
    </div>
  </main>
);

export default PrivacyPage;
