import React from 'react';

export const metadata = {
    title: "Terms & Conditions | 41 Sounds Concert Tickets",
    description: "Read our terms and conditions for purchasing tickets to 41 Sounds concerts. Important information about ticket usage, intellectual property, and user agreements.",
    robots: "index, follow",
};

const TermsPage = () => (
  <main className="max-w-3xl mx-auto px-4 py-12 bg-white rounded-lg shadow-md mt-12 mb-24">
    <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-2 text-center">Terms & Conditions</h1>
    <p className="text-gray-500 text-center mb-8">Last updated: March 28, 2026</p>
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Acceptance of Terms</h2>
        <p className="text-gray-700">By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">2. Use of the Site</h2>
        <p className="text-gray-700">You agree to use the site only for lawful purposes and in a way that does not infringe the rights of others.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Intellectual Property</h2>
        <p className="text-gray-700">All content on this site is the property of the site owner and may not be used without permission.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Changes to Terms</h2>
        <p className="text-gray-700">We reserve the right to modify these terms at any time. Changes will be posted on this page.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Contact Us</h2>
        <p className="text-gray-700">If you have any questions about these Terms, please contact us.</p>
      </section>
    </div>
  </main>
);

export default TermsPage;
