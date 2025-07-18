import React from 'react';

const Contact = () => {
  return (
    <section className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Contact & Help</h2>
      <form className="bg-gray-100 p-6 rounded shadow space-y-4">
        <label>Your Email:
          <input type="email" className="w-full mt-1 p-2 border border-gray-300 rounded" />
        </label>

        <label>Your Message:
          <textarea rows="5" className="w-full mt-1 p-2 border border-gray-300 rounded"></textarea>
        </label>

        <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Submit</button>
      </form>

      <p className="mt-4 text-gray-600">Or email us directly at <strong>support@travelly.in</strong></p>
    </section>
  );
};

export default Contact;
