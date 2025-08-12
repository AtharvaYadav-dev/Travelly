import React, { useState } from 'react';
import Notification from './Notification';

const Contact = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  const validate = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNotification({ type: 'error', message: 'Please enter a valid email.' });
      return false;
    }
    if (!message || message.trim().length < 10) {
      setNotification({ type: 'error', message: 'Message should be at least 10 characters.' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ type: '', message: '' });
    if (!validate()) return;
    try {
      setLoading(true);
      // Simulate async send
      await new Promise((res) => setTimeout(res, 900));
      setNotification({ type: 'success', message: 'Thanks! We will get back to you within 24 hours.' });
      setEmail('');
      setMessage('');
    } catch (err) {
      setNotification({ type: 'error', message: 'Something went wrong. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 py-10 sm:py-14 max-w-2xl mx-auto w-full">
      <Notification
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ type: '', message: '' })}
      />
      <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-tr from-indigo-600 via-fuchsia-500 to-pink-400 bg-clip-text text-transparent drop-shadow">Contact & Support</h2>
      <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 rounded-2xl shadow-xl border border-indigo-100 backdrop-blur-md bg-white/70 grid gap-5">
        <div className="relative">
          <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Your Email</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500">✉️</span>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-3 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm transition-all"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="message" className="block text-sm font-medium text-gray-600 mb-1">Your Message</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-indigo-500">💬</span>
            <textarea
              id="message"
              rows="6"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full pl-9 pr-3 py-3 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm transition-all"
              placeholder="How can we help?"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-pink-400 text-white font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60"
        >
          {loading && (
            <span className="w-6 h-6 border-2 border-white border-t-indigo-400 rounded-full animate-spin inline-block"></span>
          )}
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
      <p className="mt-5 text-center text-gray-600">Or email us directly at <strong>support@travelly.in</strong></p>
    </section>
  );
};

export default Contact;
