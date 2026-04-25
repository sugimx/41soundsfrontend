import React from 'react';

export const metadata = {
    title: "Refunds & Cancellations Policy | 41 Sounds Concerts",
    description: "Learn about our refund, cancellation, and event change policies for 41 Sounds concert tickets. All ticket sales terms and conditions explained.",
    robots: "index, follow",
};

const RefundsPage = () => (
  <main className="max-w-3xl mx-auto px-4 py-12 bg-white rounded-lg shadow-md mt-12 mb-24">
    <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-2 text-center">Refunds & Cancellations</h1>
    <p className="text-gray-500 text-center mb-8">Last updated: March 28, 2026</p>
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Refund Policy</h2>
        <p className="text-gray-700">All ticket sales are final. Refunds will only be issued in the event of event cancellation or as required by law.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">2. Cancellation Policy</h2>
        <p className="text-gray-700">Tickets cannot be cancelled once purchased. Please review your order carefully before confirming your purchase.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Event Changes</h2>
        <p className="text-gray-700">If the event is rescheduled, your ticket will be valid for the new date. If you cannot attend the rescheduled event, please contact us for assistance.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Contact Us</h2>
        <p className="text-gray-700">If you have questions about our refund or cancellation policy, please contact us.</p>
      </section>
    </div>
  </main>
);

export default RefundsPage;
