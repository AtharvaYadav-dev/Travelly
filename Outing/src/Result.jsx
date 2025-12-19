import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from './supabase';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import Loader from './Loader';
import Magnetic from './Magnetic';

const Result = () => {
  const [formattedResponse, setFormattedResponse] = useState([]);
  const [costSummary, setCostSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState('');
  const [savedData, setSavedData] = useState(null);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const handleCopyPlan = async () => {
    try {
      const text = aiResponse || (formattedResponse.length > 0
        ? formattedResponse.map(d => `--- ${d.title} ---\n${d.items.map(i => `• ${i}`).join('\n')}`).join('\n\n') + (costSummary.length ? `\n\n💰 Finance Summary:\n${costSummary.map(i => `• ${i}`).join('\n')}` : '')
        : '');
      if (!text) {
        setNotification({ type: 'error', message: 'Plan data not found.' });
        return;
      }
      await navigator.clipboard.writeText(text);
      setNotification({ type: 'success', message: 'Plan copied to clipboard.' });
    } catch (e) {
      setNotification({ type: 'error', message: 'Copy failed.' });
    }
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('currentItinerary'));
    if (saved) {
      setSavedData(saved);
      generateAI(saved);
    } else {
      setAiResponse('No plan found.');
      setLoading(false);
    }
  }, []);

  const formatAIResponse = (text) => {
    if (!text) return { days: [], costSummary: [] };
    const cleanText = text.replace(/<[^>]*>/g, '');
    const [mainText, costText] = cleanText.split(/Cost Summary:/i);

    const dayPatterns = [/Day\s*\d+/gi, /\*\*Day\s*\d+\*\*/gi, /##\s*Day\s*\d+/gi, /Day\s+\d+:/gi];
    let days = [];

    for (const pattern of dayPatterns) {
      const splits = mainText.split(pattern).filter(Boolean);
      if (splits.length >= 1) {
        days = splits.map((day, index) => {
          const blocks = day.split('\n')
            .map((line) => line.replace(/^[\*\#\-•🌟]+/, '').replace(/\*\*/g, '').trim())
            .filter((line) => line.length > 2);
          return {
            title: `Day ${index + 1}`,
            items: blocks,
            image: `https://images.unsplash.com/photo-${1517048676732 + index}-d65bc937f952?q=80&w=1200`
          };
        });
        if (days.length > 0 && days.some(d => d.items.length > 0)) break;
      }
    }

    if (days.length === 0) {
      days = [{
        title: 'Swiss Journey',
        items: [text.substring(0, 1000)],
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200"
      }];
    }

    const costLines = costText ? costText.split('\n').map((line) => line.replace(/^[-•🌟\*\#]+/, '').replace(/\*\*/g, '').trim()).filter((line) => line.length > 2) : [];
    return { days, costSummary: costLines };
  };

  const generateAI = async (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const totalDays = Math.min(7, Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1);

    const prompt = `You are a world-class Swiss travel planner. Create a detailed ${totalDays}-day itinerary for ${data.participants} people in ${data.location}.
Title: ${data.title}
Budget: $${data.budget}
Theme: ${data.type}

Structure each day with 4-5 items using: "- [Time] Activity: Detail. (Est: $X)"
Ensure the total expenditure is within $${data.budget}. 
End with a section called "Cost Summary:".`;

    try {
      setLoading(true);
      const key = import.meta.env.VITE_GEMINI_API_KEY;
      if (!key) throw new Error('API Key missing');

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });

      const result = await response.json();
      if (result.error) throw new Error(result.error.message);

      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('No response from AI brain.');

      setAiResponse(text);
      const { days, costSummary } = formatAIResponse(text);
      setFormattedResponse(days);
      setCostSummary(costSummary);

      if (data.id && isSupabaseConfigured) {
        await supabase.from('itineraries').update({ ai_plan: text }).eq('id', data.id);
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-950 min-h-screen text-white pb-48">
      <Notification
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ type: '', message: '' })}
      />

      {/* --- CINEMATIC HEADER --- */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2600" className="w-full h-full object-cover" alt="Swiss Alps" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950 to-slate-950" />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-[1400px]">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <span className="text-primary font-black uppercase tracking-[1em] text-[10px] mb-8 block">AI GENERATED ITINERARY</span>
            <h1 className="text-7xl md:text-[10rem] font-black uppercase italic tracking-tighter leading-none mb-12">
              {savedData?.title || 'Your Trip'}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-16 md:gap-32 text-white/50 font-bold uppercase tracking-[0.3em] text-[11px]"
          >
            {[
              { label: 'Region', val: savedData?.location || 'Alps' },
              { label: 'Allocated', val: `$${savedData?.budget || '0'}` },
              { label: 'Travelers', val: `${savedData?.participants || '1'} People` }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <span className="text-primary/60">{item.label}</span>
                <span className="text-3xl text-white font-black italic tracking-tighter transition-all hover:text-primary">{item.val}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- INTERACTIVE ACTION BAR --- */}
      <div className="sticky top-20 z-50 w-full backdrop-blur-3xl bg-slate-950/20 py-8 border-y border-white/5">
        <div className="max-w-[1600px] mx-auto px-10 flex flex-wrap justify-between items-center gap-8">
          <button onClick={() => navigate('/planner')} className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-all flex items-center gap-4 group">
            <span className="text-xl group-hover:-translate-x-2 transition-transform">←</span> Back to Planner
          </button>
          <div className="flex gap-6">
            <Magnetic>
              <button onClick={handleCopyPlan} className="btn-expensive bg-primary border-none shadow-primary-glow px-12">
                Copy Plan
              </button>
            </Magnetic>
            <Magnetic>
              <button onClick={() => savedData && generateAI(savedData)} disabled={loading} className="btn-expensive bg-white/5 px-12">
                {loading ? 'Regenerating...' : 'Regenerate'}
              </button>
            </Magnetic>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-10 py-32">
        {loading ? (
          <Loader message="Creating your itinerary..." />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-32">

            {/* --- TIMELINE FLUX --- */}
            <div className="xl:col-span-8 space-y-48">
              {formattedResponse.map((day, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="flex flex-col lg:flex-row gap-20">
                    <div className="lg:w-24 flex flex-col items-center gap-6">
                      <span className="text-5xl font-black text-primary/20 group-hover:text-primary transition-all duration-700 italic">0{i + 1}</span>
                      <div className="w-px flex-1 bg-white/5 group-hover:bg-primary/20 transition-all duration-700" />
                    </div>

                    <div className="flex-1 space-y-16">
                      <div className="flex items-center gap-6">
                        <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-none">{day.title}</h3>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                      </div>

                      <div className="relative rounded-[2.5rem] overflow-hidden aspect-video border border-white/5 group-hover:border-primary/20 shadow-2xl transition-all duration-1000">
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          src={day.image}
                          className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-[2000ms]"
                          alt={day.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute top-10 right-10 flex gap-2">
                          {['TOPOGRAPHY', 'ACTIVE', 'PRIVATE'].map(tag => (
                            <span key={tag} className="px-5 py-2 bg-white/10 backdrop-blur-md border border-white/10 text-[8px] font-black uppercase tracking-widest text-white/50 rounded-full">{tag}</span>
                          ))}
                        </div>
                        <div className="absolute bottom-12 left-12">
                          <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-4">Day Plan</p>
                          <h4 className="text-3xl font-black uppercase italic text-white tracking-tighter max-w-lg">Swiss Adventure</h4>
                        </div>
                      </div>

                      <div className="space-y-12 pl-4">
                        {day.items.map((item, j) => (
                          <motion.div
                            key={j}
                            className="relative flex gap-10 group/item py-2"
                            whileHover={{ x: 10 }}
                            transition={{ duration: 0.4 }}
                          >
                            <div className="w-2 h-2 rounded-full bg-primary mt-3 shadow-primary-glow group-hover/item:scale-150 transition-all" />
                            <div className="flex-1 space-y-2">
                              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] group-hover/item:text-primary transition-all">
                                {item.split(']')[0].replace('[', '') || 'Time'}
                              </span>
                              <p className="text-xl italic font-medium text-white/70 group-hover/item:text-white transition-all leading-relaxed">
                                {item.split(']')[1] || item}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* --- SIDEBAR INTELLIGENCE --- */}
            <aside className="xl:col-span-4">
              <div className="sticky top-48 space-y-16">

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="premium-glass p-12 md:p-16 rounded-[2.5rem] relative overflow-hidden"
                >
                  <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
                  <h3 className="text-xl font-black uppercase italic tracking-widest text-white mb-12 flex items-center gap-4">
                    <span className="w-10 h-1px bg-primary" /> Budget Breakdown
                  </h3>
                  <div className="space-y-8">
                    {costSummary.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-5 border-b border-white/5 last:border-0 group/cost">
                        <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] group-hover/cost:text-white/50 transition-all">{item.split(':')[0]}</span>
                        <span className="text-2xl font-black text-primary italic tracking-tighter">{item.split(':')[1] || item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-16 bg-white/5 p-8 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] leading-relaxed italic text-center">
                      "Cost estimates based on current Swiss tourism rates and accommodation prices."
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="premium-glass p-12 rounded-[2rem] border-primary/10"
                >
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8">AI RECOMMENDATION</h4>
                  <p className="text-white/50 italic text-lg leading-relaxed mb-10">
                    "This itinerary balances adventure activities with relaxation time for an optimal travel experience."
                  </p>
                  <div className="flex items-center gap-6 pt-10 border-t border-white/5">
                    <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center p-1">
                      <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center italic font-black text-primary">T</div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Travelly AI Assistant</span>
                  </div>
                </motion.div>

              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;
