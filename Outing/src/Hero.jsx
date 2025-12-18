import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="w-full">
      {/* 🚀 IMMERSIVE HERO SECTION */}
      <section className="relative min-h-[95vh] flex items-center justify-center px-4 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.png"
            alt="Hero Background"
            className="w-full h-full object-cover scale-105 animate-zoom-slow"
          />
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center max-w-6xl"
        >
          <motion.div variants={itemVariants} className="mb-8 inline-block">
            <span className="px-6 py-2 rounded-full glass-ui border-white/20 text-white text-sm font-black tracking-widest uppercase">
              ✨ The Future of Travel is Here
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-6xl sm:text-8xl md:text-9xl font-black text-white leading-[0.9] tracking-tighter mb-8"
          >
            Escape the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-400 animate-gradient-text">
              Ordinary
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed mb-12 font-medium opacity-90"
          >
            Unleash the power of elite AI to architect journeys that resonate with your soul.
            Hyper-personalized, high-performance planning for the modern explorer.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => navigate('/planner')}
              className="btn-premium btn-premium-primary text-xl px-12"
            >
              Start Planning
              <span className="text-2xl">✨</span>
            </button>
            <button
              onClick={() => document.getElementById('discover').scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 rounded-2xl border-2 border-white/30 text-white font-bold text-xl hover:bg-white/10 transition-all backdrop-blur-md"
            >
              Explore Library
            </button>
          </motion.div>
        </motion.div>

        {/* Floating Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
          onClick={() => document.getElementById('stats').scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-white text-[10px] font-black uppercase tracking-widest">Scroll to Discover</span>
          <div className="w-1 h-12 rounded-full bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </section>

      {/* 📊 LIVE STATISTICS SECTION */}
      <section id="stats" className="section-padding relative bg-slate-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: "Successful Trips", value: "12,400+", icon: "🚀" },
              { label: "Unique Routes", value: "8,500+", icon: "🧭" },
              { label: "Happy Travelers", value: "45k+", icon: "👥" },
              { label: "AI Iterations", value: "1.2M", icon: "🧠" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-500">{stat.icon}</div>
                <h4 className="text-5xl font-black text-white mb-2 leading-none">{stat.value}</h4>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏝️ CURATED DESTINATIONS */}
      <section id="discover" className="section-padding bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-indigo-600 font-black uppercase tracking-widest text-sm mb-4 block">Curated Collections</span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Your Next Masterpiece <br /> <span className="text-slate-400">Awaits Discovery</span></h2>
            </div>
            <p className="text-slate-500 text-lg font-medium max-w-xs">
              Hand-picked by our AI from over 10,000 global destinations for their unique soul and atmosphere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Destination 1 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative h-[600px] rounded-[3rem] overflow-hidden cursor-pointer shadow-2xl hover:shadow-indigo-500/20 transition-all duration-700"
            >
              <img src="/dest-santorini.png" alt="Santorini" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 p-12 w-full">
                <span className="px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-tighter mb-4 inline-block">Trending #1</span>
                <h3 className="text-5xl font-black text-white mb-4">Ethereal Santorini</h3>
                <p className="text-slate-200 text-lg font-medium max-w-sm mb-8">Architected for romance and historical discovery on the edge of the Aegean.</p>
                <div className="flex items-center gap-6 text-white font-bold">
                  <span className="flex items-center gap-2">📍 Greece</span>
                  <span className="flex items-center gap-2">⏱️ 5-7 Days</span>
                </div>
              </div>
            </motion.div>

            {/* Destination 2 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative h-[600px] rounded-[3rem] overflow-hidden cursor-pointer shadow-2xl hover:shadow-fuchsia-500/20 transition-all duration-700"
            >
              <img src="/dest-alps.png" alt="Alps" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 p-12 w-full">
                <span className="px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-tighter mb-4 inline-block">Exotic Pick</span>
                <h3 className="text-5xl font-black text-white mb-4">Alpine Sanctuary</h3>
                <p className="text-slate-200 text-lg font-medium max-w-sm mb-8">High-performance relaxation in the heart of the Swiss mountains.</p>
                <div className="flex items-center gap-6 text-white font-bold">
                  <span className="flex items-center gap-2">📍 Switzerland</span>
                  <span className="flex items-center gap-2">⏱️ 3-5 Days</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🧠 FEATURES SHOWCASE */}
      <section className="section-padding relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20 lg:mb-32">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 italic outline-text">The Architecture of Adventure</h2>
            <div className="w-24 h-2 bg-indigo-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {[
              { title: "Precision AI", desc: "Our engine analyzes over 500 signals to verify safety, distance, and local authenticity.", icon: "⚡" },
              { title: "Dynamic Logic", desc: "Itineraries that breathe. We balance intensity with moments of silent discovery.", icon: "🏮" },
              { title: "Global Sync", desc: "Instantly share, download, or sync your masterpiece across any digital device.", icon: "🌐" }
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="relative group p-1 w-full"
              >
                <div className="relative z-10 glass-card p-12 h-full border-slate-200/50 flex flex-col items-center text-center">
                  <div className="text-6xl mb-8 transform group-hover:rotate-12 transition-transform duration-500">{f.icon}</div>
                  <h3 className="text-3xl font-black mb-4 tracking-tight">{f.title}</h3>
                  <p className="text-slate-500 text-lg leading-relaxed font-medium">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 💬 TESTIMONIALS (WORLD-CLASS) */}
      <section className="section-padding bg-slate-950 text-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-6xl font-black leading-[0.9] mb-8 tracking-tighter">Trusted by Over <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">45,000 Travelers</span> Worldwide</h2>
              <div className="flex items-center gap-12 text-slate-400 font-bold">
                <div className="flex flex-col">
                  <span className="text-3xl text-white font-black">4.9/5</span>
                  <span className="text-xs uppercase tracking-widest">Global Rating</span>
                </div>
                <div className="w-px h-12 bg-slate-800" />
                <div className="flex flex-col">
                  <span className="text-3xl text-white font-black">200+</span>
                  <span className="text-xs uppercase tracking-widest">Cities Covered</span>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <motion.div
                animate={{ x: [0, -20, 0] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="glass-card bg-white/5 border-white/10 p-12 relative"
              >
                <div className="text-6xl absolute -top-8 -left-8 text-indigo-500 opacity-50">"</div>
                <p className="text-2xl font-medium leading-relaxed italic mb-8">
                  "Travelly completely redefined how I view weekend trips. The AI-generated
                  details for my Bali escape were more accurate than most human guides I've hired."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800" />
                  <div>
                    <h4 className="font-black">Magnus Carlsen</h4>
                    <p className="text-slate-500 text-sm">Professional Explorer</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏁 FINAL CTA */}
      <section className="section-padding relative">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto glass-card bg-indigo-600 p-16 md:p-24 text-center text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(79,70,229,0.4)]"
        >
          {/* Animated Glow */}
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/10 blur-[120px] rounded-full animate-float" />

          <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-none">Ready to Begin <br /> Your Story?</h2>
          <p className="text-indigo-100 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium opacity-90">
            Join the elite circle of travelers who never settle for generic plans.
          </p>
          <button
            onClick={() => navigate('/planner')}
            className="px-12 py-5 rounded-2xl bg-white text-indigo-600 font-black text-2xl hover:scale-110 active:scale-95 transition-all shadow-2xl"
          >
            Create My Masterpiece 🚀
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default Hero;
