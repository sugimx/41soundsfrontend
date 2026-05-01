import React from 'react';

const DataDeletionPage = () => (
  <main className="max-w-3xl mx-auto px-4 py-12 bg-white rounded-lg shadow-md mt-12 mb-24">
    <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-2 text-center">Data Deletion Request</h1>
    <p className="text-gray-500 text-center mb-8">Last updated: May 1, 2026</p>
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Right to Data Deletion</h2>
        <p className="text-gray-700">At 41Sounds, we respect your privacy and are committed to protecting your personal data. In accordance with the General Data Protection Regulation (GDPR) and Meta’s requirements, you have the right to request the deletion of your personal information from our systems at any time.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">What Data Can Be Deleted?</h2>
        <p className="text-gray-700">You may request the deletion of any personal data we hold about you, including your name, email address, contact details, and any other information associated with your account or activity on our platform. Please note that certain data may be retained if required by law or for legitimate business purposes (such as fraud prevention or compliance).</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">How to Request Data Deletion</h2>
        <p className="text-gray-700">To initiate a data deletion request, please email us at <a href="mailto:connect@41sounds.com" className="text-pink-600 underline">connect@41sounds.com</a> from the email address associated with your account. In your request, please include your full name and any relevant details to help us identify your data. We will verify your identity and process your request as soon as possible, typically within 30 days.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">What Happens After Deletion?</h2>
        <p className="text-gray-700">Once your request is processed, your personal data will be permanently removed from our active systems. You will receive a confirmation email once the deletion is complete. Please be aware that some data may remain in backups for a limited period, but will not be used for any active processing.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Need Help?</h2>
        <p className="text-gray-700">If you have any questions about your data, your rights, or the deletion process, please contact our support team at <a href="mailto:connect@41sounds.com" className="text-pink-600 underline">connect@41sounds.com</a>. We are here to help you.</p>
      </section>
    </div>
  </main>
);

export default DataDeletionPage;
