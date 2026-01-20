import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Magnetic from "./Magnetic";

const HeroNew = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const containerRef = useRef(null);

  // Parallax effects
  const yParallax = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);
  const scaleHero = useTransform(scrollY, [0, 600], [1, 1.2]);

  // Statistics
  const stats = [
    { number: "150+", label: "Desi Destinations" },
    { number: "50K+", label: "Happy Ghumakkads" },
    { number: "4.9", label: "Average Rating" },
    { number: "24/7", label: "Support Bhai" }
  ];

  // Featured destinations with Indian context
  const destinations = [
    {
      title: "Manali-Leh",
      subtitle: "Mountain Vibe",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
      description: "Bike trip vibes with snow-capped peaks & maggi points",
      price: "From ₹19,999"
    },
    {
      title: "Goa",
      subtitle: "Beach Party",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      description: "Freak out on beaches with cheap beer & seafood",
      price: "From ₹12,999"
    },
    {
      title: "Rajasthan",
      subtitle: "Royal Swag",
      image: "https://images.unsplash.com/photo-1524492442961-5688c919d4a8?w=800&q=80",
      description: "Palaces, forts & desi ghee ka khana",
      price: "From ₹15,999"
    },
    {
      title: "Kerala",
      subtitle: "God's Own Country",
      image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80",
      description: "Backwaters, coconut water & peaceful vibes",
      price: "From ₹18,999"
    },
    {
      title: "Rishikesh",
      subtitle: "Spiritual Trip",
      image: "https://images.unsplash.com/photo-1594701040374-9929cdaf453c?w=800&q=80",
      description: "Ganga arti, camping & adventure sports",
      price: "From ₹8,999"
    },
    {
      title: "Andaman",
      subtitle: "Island Goals",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      description: "Scuba diving & pristine beaches",
      price: "From ₹25,999"
    }
  ];

  // Travel experiences with Indian context
  const experiences = [
    {
      icon: "🏔️",
      title: "Adventure Trips",
      description: "Thrilling experiences for daredevils"
    },
    {
      icon: "🏖️",
      title: "Beach Chills",
      description: "Relax on beaches with chai & pakoda"
    },
    {
      icon: "🏛️",
      title: "Cultural Vibes",
      description: "Explore desi traditions & history"
    },
    {
      icon: "🍷",
      title: "Food Tours",
      description: "Taste the best desi street food"
    },
    {
      icon: "💎",
      title: "Luxury Trips",
      description: "Premium experiences for ballers"
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Family Trips",
      description: "Memorable trips for the whole fam"
    }
  ];

  // Testimonials with Indian names
  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai, Maharashtra",
      rating: 5,
      text: "Bhai maza aa gaya! Manali trip was lit AF. The AI planner nailed everything - from maggi points to hidden cafes. Highly recommend!",
      image: "https://i.pravatar.cc/150?img=26"
    },
    {
      name: "Rahul Verma",
      location: "Delhi NCR",
      rating: 5,
      text: "Goa trip was next level! Everything was planned perfectly. Best part? Didn't have to worry about anything. Just vibes & chill!",
      image: "https://i.pravatar.cc/150?img=3"
    },
    {
      name: "Anjali Patel",
      location: "Ahmedabad, Gujarat",
      rating: 5,
      text: "Rajasthan royal trip was amazing! Palaces, forts, and the food... waah! AI suggestions were spot on. Made memories for life!",
      image: "https://i.pravatar.cc/150?img=9"
    }
  ];

  return (
    <div className="w-full bg-[var(--bg-primary)] overflow-x-hidden" ref={containerRef}>

      {/* 🎬 HERO SECTION WITH VIDEO BACKGROUND */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Video Background */}
        <motion.div
          style={{ y: yParallax, opacity: opacityHero, scale: scaleHero }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[var(--bg-primary)] z-10" />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="https://cdn.coverr.co/videos/coverr-aerial-view-of-beautiful-resort-island-in-the-maldives-4507/1080p.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 md:px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <span className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-bold uppercase tracking-wider">
              ✨ AI Se Trip Planning - Desi Style!
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white leading-none tracking-tighter uppercase mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Ghumne Chale?
            <br />
            <span className="gradient-text-sunset">Bhai!</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-xl lg:text-2xl text-white/80 font-medium max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Desi destinations, personalized itineraries, and unforgettable trips with our AI travel companion. Ab pakad lo backpack!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Magnetic>
              <button
                onClick={() => navigate('/planner')}
                className="btn-premium px-10 py-5 text-base"
              >
                Trip Planning Start Karo!
              </button>
            </Magnetic>
            <Magnetic>
              <button
                onClick={() => navigate('/discover')}
                className="px-10 py-5 rounded-full font-bold uppercase tracking-wider text-sm bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-500"
              >
                Destinations Dekho
              </button>
            </Magnetic>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 z-20"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/60 to-transparent" />
        </motion.div>
      </section>

      {/* 📊 STATISTICS SECTION */}
      <section className="py-20 md:py-32 px-4 md:px-6 bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, y: 0 }}
                whileInView={{ opacity: 1, y: 0, scale: [1, 1.05, 1] }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-black gradient-text-primary mb-3">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-[var(--text-secondary)] font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🌍 FEATURED DESTINATIONS */}
      <section className="py-20 md:py-32 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0, scale: [1, 1.02, 1] }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-6 py-2 bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-full text-[#FF6B35] text-sm font-bold uppercase tracking-wider mb-6">
              Trending Destinations
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-6">
              Kahan Jaoge?
              <br />
              <span className="gradient-text-secondary">Bhai!</span>
            </h2>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
              Handpicked destinations jo hain bilkul lit AF!
            </p>
          </motion.div>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="overflow-x-auto md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-4 md:pb-0">
              {destinations.map((dest, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, x: 0 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: [0, 5, 0] }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="group card-premium cursor-pointer flex-shrink-0 w-[85vw] md:w-auto"
                >
                  <div className="relative h-64 md:h-80 overflow-hidden rounded-xl mb-6">
                    <img
                      src={dest.image}
                      alt={dest.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="text-[#FF6B35] text-xs font-bold uppercase tracking-wider block mb-2">
                        {dest.subtitle}
                      </span>
                      <h3 className="text-white text-3xl font-black uppercase tracking-tighter">
                        {dest.title}
                      </h3>
                    </div>
                    <div className="absolute top-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full">
                      <span className="text-sm font-bold text-black">{dest.price}</span>
                    </div>
                  </div>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {dest.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0, scale: [1, 1.05, 1] }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-12"
          >
            <Magnetic>
              <button
                onClick={() => navigate('/discover')}
                className="btn-premium"
              >
                Saare Destinations Dekho
              </button>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      {/* 🎯 EXPERIENCES SECTION */}
      <section className="py-20 md:py-32 px-4 md:px-6 bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0, scale: [1, 1.02, 1] }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-6 py-2 bg-[#4ECDC4]/10 border border-[#4ECDC4]/20 rounded-full text-[#4ECDC4] text-sm font-bold uppercase tracking-wider mb-6">
              Trip Types
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-6">
              Perfect Trip
              <br />
              <span className="gradient-text-luxury">Awaits You!</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 1 }}
                whileInView={{ opacity: 1, scale: [1, 1.08, 1.05] }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="premium-glass p-8 rounded-2xl text-center group hover:scale-105 transition-transform duration-500"
              >
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                  {exp.icon}
                </div>
                <h3 className="text-xl font-black text-[var(--text-primary)] mb-3 uppercase tracking-tight">
                  {exp.title}
                </h3>
                <p className="text-[var(--text-secondary)]">
                  {exp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 💬 TESTIMONIALS */}
      <section className="py-20 md:py-32 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0, scale: [1, 1.02, 1] }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-6 py-2 bg-[#FFE66D]/10 border border-[#FFE66D]/20 rounded-full text-[#FFE66D] text-sm font-bold uppercase tracking-wider mb-6">
              User Reviews
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-6">
              Log Kya Bolte?
              <br />
              <span className="gradient-text-sunset">Hamare Bare Mein!</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, rotateX: 0 }}
                whileInView={{ opacity: 1, rotateX: [0, 5, 0] }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="card-premium p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#FF6B35]"
                  />
                  <div>
                    <h4 className="font-bold text-[var(--text-primary)]">{testimonial.name}</h4>
                    <p className="text-sm text-[var(--text-secondary)]">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-[#FFE66D] text-xl">★</span>
                  ))}
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroNew;
