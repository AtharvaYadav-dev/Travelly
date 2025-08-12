import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Example floating SVG shape
const FloatingCloud = ({ className, style }) => (
  <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <ellipse cx="60" cy="30" rx="60" ry="30" fill="url(#paint0_radial)" fillOpacity="0.5" />
    <defs>
      <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(60 30) scale(60 30)" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a5b4fc" />
        <stop offset="1" stopColor="#f472b6" />
      </radialGradient>
    </defs>
  </svg>
);

const heroVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
};

const Hero = () => {
  const navigate = useNavigate();
  return (
    <>
    <section className="relative flex flex-col items-center justify-center text-center py-20 sm:py-32 overflow-hidden">
      {/* Floating shapes */}
      <motion.div
        className="absolute left-8 top-8 z-0"
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      >
        <FloatingCloud className="w-32 opacity-60" />
      </motion.div>
      <motion.div
        className="absolute right-8 bottom-12 z-0"
        animate={{ y: [0, -18, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      >
        <FloatingCloud className="w-24 opacity-40" style={{ transform: "scaleX(-1)" }} />
      </motion.div>
      {/* Hero Text */}
      <motion.h1
        className="relative z-10 text-4xl sm:text-6xl font-extrabold navbar-logo-gradient drop-shadow mb-4"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        Plan Outings That Win Hearts
      </motion.h1>
      <motion.p
        className="relative z-10 text-lg sm:text-2xl text-indigo-900/80 dark:text-slate-200 max-w-2xl mx-auto mb-8"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        Instantly create beautiful, smart, and share-worthy itineraries with AI magic, glassmorphism, and motion.
      </motion.p>
      {/* Call to Action */}
      <motion.button
        type="button"
        onClick={() => navigate('/planner')}
        className="relative z-10 inline-block px-8 py-3 rounded-xl bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-pink-400 text-white font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all"
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.97 }}
      >
        Start Planning
      </motion.button>
      {/* Optional: add tsParticles, Lottie, or video background here later */}
    </section>

    {/* Features Section */}
    <section className="relative bg-white/60 backdrop-blur-md py-16 px-4 sm:px-12 flex flex-col items-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 navbar-logo-gradient">Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {[{
          icon: (
            <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="bg-indigo-100 p-4 rounded-full">
              <svg width="32" height="32" fill="none"><circle cx="16" cy="16" r="16" fill="#6366f1" opacity="0.2"/><path d="M10 16h12M16 10v12" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/></svg>
            </motion.div>
          ),
          title: "AI-Powered Planning",
          desc: "Generate smart, optimized itineraries instantly with advanced AI."
        }, {
          icon: (
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3 }} className="bg-pink-100 p-4 rounded-full">
              <svg width="32" height="32" fill="none"><circle cx="16" cy="16" r="16" fill="#f472b6" opacity="0.2"/><path d="M16 10l6 12H10l6-12z" stroke="#f472b6" strokeWidth="2" strokeLinejoin="round"/></svg>
            </motion.div>
          ),
          title: "Beautiful UI",
          desc: "Enjoy a stunning, glassmorphic interface with smooth animations."
        }, {
          icon: (
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="bg-green-100 p-4 rounded-full">
              <svg width="32" height="32" fill="none"><circle cx="16" cy="16" r="16" fill="#34d399" opacity="0.2"/><path d="M10 18l6-6 6 6" stroke="#34d399" strokeWidth="2" strokeLinecap="round"/></svg>
            </motion.div>
          ),
          title: "Share & Collaborate",
          desc: "Invite friends and share plans easily with a single click."
        }].map(({icon, title, desc}, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white/70 backdrop-blur rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
            {icon}
            <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">{title}</h3>
            <p className="text-gray-500">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* How It Works Section */}
    <section className="relative bg-gradient-to-br from-indigo-50 to-pink-50 py-20 px-4 sm:px-12 flex flex-col items-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 navbar-logo-gradient">How It Works</h2>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center items-stretch">
        {[{
          step: 1, title: "Describe Your Outing", desc: "Tell us your destination, group size, and interests.", color: "from-indigo-400 to-blue-400"
        }, {
          step: 2, title: "Get Your Itinerary", desc: "AI generates a beautiful, optimized plan for you.", color: "from-fuchsia-400 to-pink-400"
        }, {
          step: 3, title: "Share & Enjoy!", desc: "Invite friends, export as PDF, or start your adventure.", color: "from-green-400 to-emerald-400"
        }].map(({step, title, desc, color}, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className={`flex-1 min-w-[220px] bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg p-8 mx-2 mb-6 md:mb-0 glass-card border-l-8 bg-gradient-to-br ${color}`} style={{ borderImage: `linear-gradient(to bottom right, var(--tw-gradient-stops)) 1` }}>
            <div className="text-4xl font-bold mb-2 text-indigo-600 dark:text-indigo-400">{step}</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
            <p className="text-gray-500">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Testimonials Section */}
    <section className="relative bg-white/70 backdrop-blur-lg py-16 px-4 sm:px-12 flex flex-col items-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 navbar-logo-gradient">What Users Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {[{
          name: "Aarav P.", quote: "This app made planning our Goa trip effortless and fun! The AI suggestions were spot on.", img: "https://randomuser.me/api/portraits/men/4.jpg"
        }, {
          name: "Priya S.", quote: "Loved the beautiful itinerary and easy sharing. My friends were impressed!", img: "https://randomuser.me/api/portraits/women/8.jpg"
        }, {
          name: "Devansh R.", quote: "The UI is gorgeous and the features are super smart. Highly recommended!", img: "https://randomuser.me/api/portraits/men/65.jpg"
        }].map(({name, quote, img}, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white/80 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center">
            <img src={img} alt={name} className="w-16 h-16 rounded-full mb-4 shadow-lg border-2 border-fuchsia-300" />
            <p className="text-gray-700 italic mb-3">“{quote}”</p>
            <div className="text-fuchsia-600 font-bold">{name}</div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Footer Section
    <footer className="relative bg-gradient-to-tr from-indigo-600 via-fuchsia-500 to-pink-400 text-white py-8 flex flex-col items-center">
      <div className="mb-2 font-bold text-lg">Travelly &copy; 2025</div>
      <div className="flex gap-4">
        <a href="#" className="hover:text-indigo-100 transition">Instagram</a>
        <a href="#" className="hover:text-indigo-100 transition">Twitter</a>
        <a href="#" className="hover:text-indigo-100 transition">Contact</a>
      </div>
    </footer> */}
    </>
  );
}

export default Hero;
