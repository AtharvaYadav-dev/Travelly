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
    { number: "150+", label: "Destinations" },
    { number: "50K+", label: "Happy Travelers" },
    { number: "4.9", label: "Average Rating" },
    { number: "24/7", label: "Support" }
  ];

  // Featured destinations with high-quality images
  const destinations = [
    {
      title: "Swiss Alps",
      subtitle: "Mountain Paradise",
      image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
      description: "Experience breathtaking peaks and pristine valleys",
      price: "From $2,499"
    },
    {
      title: "Santorini",
      subtitle: "Greek Islands",
      image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
      description: "Iconic white buildings and stunning sunsets",
      price: "From $1,899"
    },
    {
      title: "Bali",
      subtitle: "Tropical Paradise",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
      description: "Lush rice terraces and ancient temples",
      price: "From $1,599"
    },
    {
      title: "Iceland",
      subtitle: "Land of Fire & Ice",
      image: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=80",
      description: "Northern lights and geothermal wonders",
      price: "From $2,899"
    },
    {
      title: "Tokyo",
      subtitle: "Modern Metropolis",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
      description: "Blend of tradition and cutting-edge technology",
      price: "From $2,199"
    },
    {
      title: "Maldives",
      subtitle: "Island Luxury",
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
      description: "Crystal clear waters and overwater villas",
      price: "From $3,499"
    }
  ];

  // Travel experiences
  const experiences = [
    {
      icon: "🏔️",
      title: "Adventure Tours",
      description: "Thrilling experiences for adrenaline seekers"
    },
    {
      icon: "🏖️",
      title: "Beach Escapes",
      description: "Relax on pristine shores worldwide"
    },
    {
      icon: "🏛️",
      title: "Cultural Journeys",
      description: "Immerse in local traditions and history"
    },
    {
      icon: "🍷",
      title: "Culinary Tours",
      description: "Taste the world's finest cuisines"
    },
    {
      icon: "💎",
      title: "Luxury Travel",
      description: "Premium experiences and accommodations"
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Family Vacations",
      description: "Memorable trips for all ages"
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      text: "Absolutely incredible experience! The attention to detail and personalized itinerary made our Swiss Alps trip unforgettable.",
      image: "https://i.pravatar.cc/150?img=1"
    },
    {
      name: "Michael Chen",
      location: "Singapore",
      rating: 5,
      text: "Best travel planning service I've ever used. Everything was seamless from booking to the actual trip.",
      image: "https://i.pravatar.cc/150?img=13"
    },
    {
      name: "Emma Williams",
      location: "London, UK",
      rating: 5,
      text: "The AI-powered recommendations were spot-on! Discovered hidden gems I would have never found on my own.",
      image: "https://i.pravatar.cc/150?img=5"
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
              ✨ AI-Powered Travel Planning
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white leading-none tracking-tighter uppercase mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Explore The
            <br />
            <span className="gradient-text-sunset">World</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-xl lg:text-2xl text-white/80 font-medium max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Discover breathtaking destinations, create personalized itineraries, and embark on unforgettable journeys with our AI-powered travel companion.
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
                Start Planning
              </button>
            </Magnetic>
            <Magnetic>
              <button
                onClick={() => navigate('/discover')}
                className="px-10 py-5 rounded-full font-bold uppercase tracking-wider text-sm bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-500"
              >
                Explore Destinations
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
              Popular Destinations
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-6">
              Where Will You
              <br />
              <span className="gradient-text-secondary">Go Next?</span>
            </h2>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
              Handpicked destinations that offer unforgettable experiences
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
                View All Destinations
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
              Travel Experiences
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-6">
              Your Perfect
              <br />
              <span className="gradient-text-luxury">Adventure Awaits</span>
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
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-6">
              What Our Travelers
              <br />
              <span className="gradient-text-sunset">Say About Us</span>
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
