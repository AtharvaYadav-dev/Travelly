import React, { useState } from 'react';
import Notification from './Notification';
import { motion } from 'framer-motion';

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
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Notification
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ type: '', message: '' })}
      />

      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl md:text-6xl font-black mb-6 tracking-tight"
        >
          Need <span className="navbar-logo-gradient animate-gradient-text">Assistance?</span>
        </motion.h2>
        <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">
          Our specialized support team is here to help you navigate your journey.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 md:p-12 border border-white/50 shadow-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Your Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="premium-input"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Inquiry Type</label>
              <select className="premium-input">
                <option>General Support</option>
                <option>Technical Issue</option>
                <option>Partnership</option>
                <option>Feedback</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Your Message</label>
            <textarea
              rows="6"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="premium-input resize-none"
              placeholder="Describe how we can help..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Send Dispatch 🚀</>
            )}
          </button>
        </form>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6">
          <div className="text-3xl mb-4">📧</div>
          <h4 className="font-bold mb-1">Email Us</h4>
          <p className="text-sm text-slate-500">support@travelly.ai</p>
        </div>
        <div className="p-6">
          <div className="text-3xl mb-4">💬</div>
          <h4 className="font-bold mb-1">Live Chat</h4>
          <p className="text-sm text-slate-500">Available 24/7</p>
        </div>
        <div className="p-6">
          <div className="text-3xl mb-4">📍</div>
          <h4 className="font-bold mb-1">Headquarters</h4>
          <p className="text-sm text-slate-500">Cloud City, Digital World</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
