import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-12 pb-24 px-4 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-pink-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center max-w-5xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-8 backdrop-blur-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
            AI-Powered Travel Planning
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-tight mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Craft Your Next <br />
            <span className="navbar-logo-gradient animate-gradient-text">Masterpiece Trip</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-12 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Leave the logistics to us. Out world-class AI engine generates hyper-personalized,
            realistic itineraries that transform your weekends into unforgettable stories.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <button
              onClick={() => navigate('/planner')}
              className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-xl shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 group"
            >
              Start Planning Now
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="px-8 py-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xl hover:bg-white/80 transition-all"
            >
              See How It Works
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 px-4 sm:px-12 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">The Future of Travel</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              We combined cutting-edge artificial intelligence with premium design to give you
              the ultimate outing experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Gen-AI Engine",
                desc: "Powered by Gemini 2.5 Flash for hyper-realistic and fact-checked travel suggestions.",
                icon: "⚡",
                color: "bg-blue-500"
              },
              {
                title: "Premium Prints",
                desc: "Export your masterpiece plans into beautifully formatted PDF guides in one click.",
                icon: "📄",
                color: "bg-pink-500"
              },
              {
                title: "Total Control",
                desc: "Adjust group sizes, budget ranges, and time windows for a plan that truly fits you.",
                icon: "🎛️",
                color: "bg-amber-500"
              }
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-10 group"
              >
                <div className={`w-14 h-14 rounded-2xl ${feat.color} bg-opacity-10 text-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {feat.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feat.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STEPS SECTION --- */}
      <section className="py-24 bg-indigo-600/5 dark:bg-indigo-500/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                From Idea to Itinerary <br />
                <span className="text-indigo-600">In Seconds</span>
              </h2>
              <div className="space-y-12">
                {[
                  { step: "01", title: "Share Your Vision", text: "Tell us where you want to go and what you love." },
                  { step: "02", title: "AI Magic Happens", text: "Our engine crafts a localized, balanced, and smart plan." },
                  { step: "03", title: "Live the Story", text: "Save it, share it, or hit the road immediately." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <span className="text-3xl font-black text-indigo-200 dark:text-indigo-900/40 tabular-nums">
                      {item.step}
                    </span>
                    <div>
                      <h4 className="text-2xl font-bold mb-2">{item.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <motion.div
                initial={{ rotate: -5, opacity: 0, x: 50 }}
                whileInView={{ rotate: 0, opacity: 1, x: 0 }}
                className="glass-card p-4 md:p-8 bg-white dark:bg-slate-800 shadow-3xl"
              >
                <div className="space-y-4">
                  <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-700 rounded animate-shimmer" />
                  <div className="h-12 w-full bg-slate-50 dark:bg-slate-700/50 rounded-xl" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl" />
                    <div className="h-20 bg-pink-50 dark:bg-pink-500/10 rounded-xl" />
                  </div>
                  <div className="h-40 bg-slate-50 dark:bg-slate-700/50 rounded-xl" />
                </div>
              </motion.div>
              {/* Decorative blobs */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-400/20 rounded-full blur-[60px] -z-10" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-[60px] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="py-32 px-4">
        <motion.div
          whileHover={{ y: -5 }}
          className="max-w-4xl mx-auto rounded-[3rem] bg-gradient-to-tr from-indigo-600 to-fuchsia-600 p-12 md:p-20 text-center text-white shadow-2xl shadow-indigo-500/40 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
            </svg>
          </div>

          <h2 className="text-4xl md:text-6xl font-black mb-8">Ready for Adventure?</h2>
          <p className="text-indigo-100 text-xl md:text-2xl mb-12 max-w-2xl mx-auto opacity-90">
            Join thousands of travelers who have already upgraded their weekend game.
          </p>
          <button
            onClick={() => navigate('/planner')}
            className="px-10 py-5 rounded-2xl bg-white text-indigo-600 font-black text-2xl hover:bg-opacity-90 hover:scale-[1.05] transition-all shadow-xl"
          >
            Create My Plan
          </button>
        </motion.div>
      </section>
    </div>
  );
}

export default Hero;
