import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Magnetic from "./Magnetic";

const HeroJapan = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const containerRef = useRef(null);
  const galleryRef = useRef(null);

  // Parallax effects
  const yParallax = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);
  const scaleHero = useTransform(scrollY, [0, 600], [1, 1.15]);

  // Gallery items - like the Japan tour cards
  const tourHighlights = [
    {
      title: "5 cities in Japan",
      img: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=600",
      label: "Tokyo"
    },
    {
      title: "10 days",
      img: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=600",
      label: "Duration"
    },
    {
      title: "sightseeing of photos",
      img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600",
      label: "Kyoto"
    },
    {
      title: "eat ramen",
      img: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?q=80&w=600",
      label: "Cuisine"
    },
    {
      title: "enjoy the vibe",
      img: "https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=600",
      label: "Culture"
    },
  ];

  // Tour itinerary - Days section
  const tourDays = [
    {
      day: "Days 1-3",
      city: "Osaka",
      images: [
        "https://images.unsplash.com/photo-1590559899731-a382839e5549?q=80&w=400",
        "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=400"
      ]
    },
    {
      day: "Days 4-6",
      city: "Kyoto",
      images: [
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400"
      ]
    },
    {
      day: "Days 7-10",
      city: "Tokyo",
      images: [
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=400",
        "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=400"
      ]
    }
  ];

  // What's included
  const included = [
    { icon: "🗺️", title: "Guides", desc: "Expert guides who know everything about Japan" },
    { icon: "✈️", title: "Flights", desc: "Moscow → Osaka\nTokyo → Moscow" },
    { icon: "🚗", title: "Transfers", desc: "From the airport to the hotels" },
    { icon: "🏨", title: "Hotels", desc: "Premium accommodation\n3 hotels per person\nbreakfasts included!" }
  ];

  return (
    <div className="w-full bg-[#e8dcc4] overflow-x-hidden" ref={containerRef}>

      {/* 🏔️ HERO SECTION - Japan Style */}
      <section className="relative h-[100vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div
          style={{ y: yParallax, opacity: opacityHero, scale: scaleHero }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2600&auto=format&fit=crop"
            alt="Japan"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-[#e8dcc4]" />
        </motion.div>

        {/* Top Navigation */}
        <div className="absolute top-8 left-0 right-0 z-20 px-8 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-white text-sm font-bold">🌸 JAPAN TOURS</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-8 text-white text-xs font-medium"
          >
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#included" className="hover:text-primary transition-colors">Included</a>
            <a href="#contacts" className="hover:text-primary transition-colors">Contacts</a>
          </motion.div>

          <Magnetic>
            <button className="px-6 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold rounded-full hover:bg-white/30 transition-all">
              Book
            </button>
          </Magnetic>
        </div>

        {/* Hero Title */}
        <div className="relative z-10 text-center px-6 max-w-6xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-black text-white leading-none tracking-tighter uppercase"
            style={{ fontFamily: 'Outfit, sans-serif', textShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
          >
            JAPAN
          </motion.h1>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 z-10"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/60 to-transparent" />
        </motion.div>
      </section>

      {/* 🎴 HORIZONTAL SCROLL GALLERY */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="px-8">
          <div
            ref={galleryRef}
            className="horizontal-scroll-container"
            style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
          >
            {tourHighlights.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="horizontal-scroll-item w-[280px] md:w-[320px] image-zoom-hover"
              >
                <div className="relative h-[400px] rounded-2xl overflow-hidden bg-slate-900 shadow-lg">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-primary text-xs font-bold uppercase tracking-wider block mb-1">
                      {item.label}
                    </span>
                    <h3 className="text-white text-2xl font-bold leading-tight">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 📖 ABOUT THE TOUR */}
      <section id="about" className="py-32 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <div className="h-px w-32 bg-primary mx-auto mb-8" />
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-[#2c2c2c]">
              ABOUT THE TOUR
            </h2>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-lg leading-relaxed text-[#2c2c2c]/70 decorative-line">
              We've planned a simple and convenient 10-day itinerary for you.
              You'll visit the best places in Japan - Osaka, Kyoto, and Tokyo.
            </p>
            <p className="text-lg leading-relaxed text-[#2c2c2c]/70 decorative-line">
              You'll see everything you need to see, and when you want, you can
              simply enjoy the journey.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-lg leading-relaxed text-[#2c2c2c]/70 decorative-line">
              No need to worry about routes, schedules, or finding places —
              everything is already planned. All you need to do is see what to
              see and when to eat, and you can simply enjoy the journey.
            </p>
          </motion.div>
        </div>

        {/* Tour Days */}
        <div className="mt-32 space-y-12">
          {tourDays.map((day, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col md:flex-row gap-8 items-center"
            >
              <div className="md:w-1/3">
                <span className="text-sm text-primary font-bold uppercase tracking-wider block mb-2">
                  {day.day}
                </span>
                <h3 className="text-5xl font-black uppercase tracking-tighter text-[#2c2c2c]">
                  {day.city}
                </h3>
              </div>

              <div className="md:w-2/3 flex gap-4">
                {day.images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`image-zoom-hover rounded-2xl overflow-hidden shadow-lg ${day.images.length === 1 ? 'w-full h-[300px]' : 'flex-1 h-[250px]'
                      }`}
                  >
                    <img
                      src={img}
                      alt={`${day.city} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🎁 WHAT'S INCLUDED */}
      <section id="included" className="py-32 bg-[#2c2c2c] text-white">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="h-px w-32 bg-primary mx-auto mb-8" />
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">
              WHAT'S INCLUDED
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {included.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-glass p-8 rounded-2xl bg-white/5 border-white/10"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-primary">{item.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed whitespace-pre-line">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 📧 CONTACT FORM */}
      <section id="contacts" className="py-32 px-8 bg-white/30 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-[#2c2c2c] mb-4">
              Want to join us
            </h2>
            <p className="text-xl text-[#2c2c2c]/60">
              but still have questions?
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-bold text-[#2c2c2c]/60 mb-2">
                Leave a request
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-6 py-4 bg-white/80 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-6 py-4 bg-white/80 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>

            <div>
              <input
                type="tel"
                placeholder="Phone number"
                className="w-full px-6 py-4 bg-white/80 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>

            <Magnetic>
              <button
                type="submit"
                className="w-full py-5 bg-[#2c2c2c] text-white font-bold uppercase tracking-wider rounded-xl hover:bg-primary transition-all shadow-lg"
              >
                Send
              </button>
            </Magnetic>
          </motion.form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 bg-[#2c2c2c] text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black">🌸 JAPAN TOURS</span>
          </div>

          <div className="flex gap-8 text-sm">
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#included" className="hover:text-primary transition-colors">Included</a>
            <a href="#contacts" className="hover:text-primary transition-colors">Contacts</a>
          </div>

          <div className="flex gap-4">
            {['📸', '📘', '🐦'].map((icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-primary/20 transition-all"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        <div className="text-center mt-12 text-white/20 text-xs">
          © 2024 JAPAN TOURS. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HeroJapan;
