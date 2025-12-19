import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Discover', path: '/discover' },
      { name: 'AI Planner', path: '/planner' },
      { name: 'Saved Trips', path: '/saved' },
      { name: 'Profile', path: '/profile' },
    ],
    company: [
      { name: 'About Us', path: '#' },
      { name: 'Careers', path: '#' },
      { name: 'Press', path: '#' },
      { name: 'Blog', path: '#' },
    ],
    support: [
      { name: 'Help Center', path: '#' },
      { name: 'Contact Us', path: '#' },
      { name: 'Privacy Policy', path: '#' },
      { name: 'Terms of Service', path: '#' },
    ],
    resources: [
      { name: 'Travel Guides', path: '#' },
      { name: 'Destination Tips', path: '#' },
      { name: 'Travel Blog', path: '#' },
      { name: 'API Documentation', path: '#' },
    ],
    social: [
      { name: 'Twitter', icon: '𝕏', url: '#' },
      { name: 'Instagram', icon: '📷', url: '#' },
      { name: 'Facebook', icon: '👥', url: '#' },
      { name: 'LinkedIn', icon: '💼', url: '#' },
    ],
  };

  const stats = [
    { value: '50K+', label: 'Happy Travelers' },
    { value: '200+', label: 'Destinations' },
    { value: '100K+', label: 'Trips Planned' },
    { value: '4.9/5', label: 'User Rating' },
  ];

  const awards = [
    { icon: '🏆', text: 'Best Travel App 2024' },
    { icon: '⭐', text: 'Editor\'s Choice' },
    { icon: '🎯', text: 'Top AI Innovation' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <footer className="relative mt-20 bg-slate-950/95 border-t border-white/10 overflow-hidden z-50">
      {/* Enhanced Gradient Glow Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <div className="relative max-w-[1600px] mx-auto px-6 py-16">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 pb-16 border-b border-white/5"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-3xl md:text-4xl font-black font-heading accent-gradient mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-white/50 text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Main Footer Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-12"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Link to="/" className="inline-block group">
              <h2 className="text-4xl font-black font-heading mb-4 accent-gradient group-hover:scale-105 transition-transform duration-500">
                Travelly
              </h2>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-sm">
              Experience the future of travel planning with AI-powered itineraries.
              Create personalized journeys that match your style and budget.
            </p>

            {/* Awards */}
            <div className="space-y-2 mb-6">
              {awards.map((award, index) => (
                <div key={index} className="flex items-center gap-2 text-white/50 text-xs">
                  <span className="text-base">{award.icon}</span>
                  <span>{award.text}</span>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            <div className="relative group">
              <input
                type="email"
                placeholder="Enter your email for updates"
                className="w-full max-w-sm px-6 py-4 rounded-full bg-slate-900/50 border border-white/10 
                         focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none
                         text-white placeholder:text-white/30 text-sm transition-all duration-300
                         group-hover:border-white/20"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 rounded-full
                               bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold
                               hover:shadow-primary-glow transition-all duration-300 hover:scale-105">
                Subscribe
              </button>
            </div>
          </motion.div>

          {/* Product Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-white/50 hover:text-primary text-sm transition-colors duration-300
                             inline-block hover:translate-x-1 transform"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.path}
                    className="text-white/50 hover:text-primary text-sm transition-colors duration-300
                             inline-block hover:translate-x-1 transform"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.path}
                    className="text-white/50 hover:text-primary text-sm transition-colors duration-300
                             inline-block hover:translate-x-1 transform"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.path}
                    className="text-white/50 hover:text-primary text-sm transition-colors duration-300
                             inline-block hover:translate-x-1 transform"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-6 mb-12 pb-12 border-b border-white/5"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/30 border border-white/5">
            <span className="text-green-400">🔒</span>
            <span className="text-white/50 text-xs">Secure Payments</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/30 border border-white/5">
            <span className="text-blue-400">✓</span>
            <span className="text-white/50 text-xs">Verified Reviews</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/30 border border-white/5">
            <span className="text-purple-400">⚡</span>
            <span className="text-white/50 text-xs">Instant Booking</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/30 border border-white/5">
            <span className="text-yellow-400">🌟</span>
            <span className="text-white/50 text-xs">24/7 Support</span>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-white/40 text-sm">
            <p>
              © {currentYear} Travelly. All rights reserved. Made with{' '}
              <span className="text-primary animate-pulse">♥</span> for travelers.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">Cookies</a>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {footerLinks.social.map((social) => (
              <a
                key={social.name}
                href={social.url}
                aria-label={social.name}
                className="w-10 h-10 rounded-full bg-slate-900/50 border border-white/10
                         flex items-center justify-center text-white/50 hover:text-white
                         hover:border-primary/50 hover:bg-primary/10 transition-all duration-300
                         hover:scale-110 hover:shadow-primary-glow group"
              >
                <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                  {social.icon}
                </span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
