import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Magnetic from "./Magnetic";

const Hero = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);
  const scaleHero = useTransform(scrollY, [0, 800], [1, 1.2]);

  const socialLinks = [
    { name: 'Instagram', icon: '📸', url: '#' },
    { name: 'Facebook', icon: '📘', url: '#' },
    { name: 'Twitter', icon: '🐦', url: '#' },
    { name: 'LinkedIn', icon: '💼', url: '#' },
  ];

  const title = "SWITZERLAND";
  const subtitle = "For adventurers";

  return (
    <div className="w-full bg-slate-950 overflow-x-hidden selection:bg-primary/40">

      {/* 🏔️ FULLSCREEN CINEMATIC HERO */}
      <section className="relative h-[110vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Parallax Background */}
        <motion.div
          style={{ y: yParallax, opacity: opacityHero, scale: scaleHero }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2600&auto=format&fit=crop"
            alt="Switzerland"
            className="w-full h-full object-cover opacity-40 brightness-75 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/40 to-slate-950" />
        </motion.div>

        {/* Social Bar (More Subtle) */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-10 z-20 items-center">
          <div className="w-[1px] h-12 bg-white/5" />
          {socialLinks.map((s, i) => (
            <Magnetic key={i}>
              <a
                href={s.url}
                className="text-[8px] font-black uppercase tracking-[0.4em] text-white/10 hover:text-primary transition-all vertical-text whitespace-nowrap"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                {s.name}
              </a>
            </Magnetic>
          ))}
          <div className="w-[1px] h-12 bg-white/5" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-7xl px-4 mt-[-5vh]">
          <div className="mb-4 overflow-hidden">
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[9px] font-black uppercase tracking-[0.8em] text-primary/80 block"
            >
              Your Swiss Travel Guide
            </motion.span>
          </div>

          <h1 className="text-7xl md:text-[11rem] font-black text-white leading-none tracking-tighter uppercase italic mb-8 flex flex-wrap justify-center overflow-hidden">
            {title.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ y: "110%", rotate: 5 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 + i * 0.04 }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </h1>

          <div className="overflow-hidden mb-12">
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="text-lg md:text-xl text-white/40 font-medium tracking-[0.4em] uppercase italic"
            >
              {subtitle}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <Magnetic>
              <button
                onClick={() => navigate('/planner')}
                className="btn-expensive bg-primary/90 border-none px-14 py-4"
              >
                Start Journey
              </button>
            </Magnetic>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-10 flex flex-col items-center gap-3"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary/60 to-transparent" />
        </motion.div>
      </section>

      {/* 🔍 COMPACT SEARCH */}
      <section className="relative z-20 -mt-24 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="premium-glass p-10 md:p-12 rounded-3xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: 'Destination', type: 'select', options: ['Zermatt', 'Interlaken', 'Lucerne', 'St. Moritz'] },
              { label: 'Group Size', type: 'select', options: ['1-2 People', '3-5 People', 'Large Group'] },
              { label: 'Travel Dates', type: 'date' }
            ].map((field, i) => (
              <div key={i} className="space-y-3">
                <label className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">{field.label}</label>
                {field.type === 'select' ? (
                  <select className="premium-input py-4 text-xs font-bold bg-slate-900/60">
                    {field.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type="date" className="premium-input py-4 text-xs bg-slate-900/60" />
                )}
              </div>
            ))}
            <div className="flex items-end">
              <Magnetic>
                <button
                  onClick={() => navigate('/discover')}
                  className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 hover:scale-105 transition-all"
                >
                  Search Trips
                </button>
              </Magnetic>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 🏞️ PLACES SECTION (CLEANER) */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-black uppercase tracking-[0.5em] text-[10px] mb-4 block underline decoration-primary/30 underline-offset-8">Featured</span>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight italic text-white">
              Top <br /> <span className="text-white/20">Places</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/30 text-lg font-medium leading-relaxed italic border-l border-white/5 pl-10"
          >
            Recommended by local guides and travel experts. We've selected the best places to visit in Switzerland.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            { title: "Mürren", subtitle: "Automobile-Free Village", img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800", h: "h-[500px]" },
            { title: "Zermatt", subtitle: "The Matterhorn Base", img: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?q=80&w=800", h: "h-[600px] mt-[-30px]" },
            { title: "Luzern", subtitle: "Ancient Waterfront", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800", h: "h-[500px]" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className={`group relative overflow-hidden rounded-[2rem] bg-slate-900 border border-white/5 ${item.h}`}
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[1.5s]"
              />
              <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent">
                <span className="text-primary text-[8px] font-black uppercase tracking-widest mb-1 block">{item.subtitle}</span>
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-10 flex flex-col items-center">
          <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-6">Travelly<span className="text-primary">.</span></h3>
          <div className="flex gap-8 mb-10 text-white/20">
            {['IG', 'FB', 'TW', 'LI'].map(s => (
              <a key={s} href="#" className="text-[10px] font-black transition-all hover:text-white">{s}</a>
            ))}
          </div>
          <p className="text-white/5 text-[8px] font-bold uppercase tracking-[0.3em]">© 2024 Travelly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Hero;
