import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase, isSupabaseConfigured } from './supabase';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import FAB from './FAB';
import Loader from './Loader';

const Result = () => {
  const [formattedResponse, setFormattedResponse] = useState([]);
  const [costSummary, setCostSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState('');
  const [savedData, setSavedData] = useState(null);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [showFab, setShowFab] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setShowFab(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCopyPlan = async () => {
    try {
      const text = aiResponse || (formattedResponse.length > 0
        ? formattedResponse.map(d => `--- ${d.title} ---\n${d.items.map(i => `• ${i}`).join('\n')}`).join('\n\n') + (costSummary.length ? `\n\n💰 Finance Summary:\n${costSummary.map(i => `• ${i}`).join('\n')}` : '')
        : '');
      if (!text) {
        setNotification({ type: 'error', message: 'Mission data not found.' });
        return;
      }
      await navigator.clipboard.writeText(text);
      setNotification({ type: 'success', message: 'Itinerary archived to clipboard!' });
    } catch (e) {
      setNotification({ type: 'error', message: 'Sync failed.' });
    }
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('currentItinerary'));
    if (saved) {
      setSavedData(saved);
      generateAI(saved);
    } else {
      setAiResponse('No transmission found.');
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
          return { title: `Day ${index + 1}`, items: blocks };
        });
        if (days.length > 0 && days.some(d => d.items.length > 0)) break;
      }
    }

    if (days.length === 0) {
      days = [{ title: 'Your Itinerary', items: [text.substring(0, 1000)] }];
    }

    const costLines = costText ? costText.split('\n').map((line) => line.replace(/^[-•🌟\*\#]+/, '').replace(/\*\*/g, '').trim()).filter((line) => line.length > 2) : [];
    return { days, costSummary: costLines };
  };

  const generateAI = async (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const totalDays = Math.min(7, Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1);

    const prompt = `You are a high-end travel architect. Create a detailed ${totalDays}-day luxury itinerary for ${data.participants} people in ${data.location}.
Title: ${data.title}
Budget: ₹${data.budget}
Type: ${data.type}
Range: ${data.range}

Structure each day with 4-5 items using: "- [Time] Activity: Detail. (Cost: ₹X)"
Stay within total ₹${data.budget}. Include secret local spots.
End with "Cost Summary:".`;

    try {
      setLoading(true);
      const key = import.meta.env.VITE_GEMINI_API_KEY;
      if (!key) throw new Error('API Key missing');

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
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

  const handleDownloadPDF = () => {
    import('jspdf').then(m => {
      const doc = new m.jsPDF();
      doc.setFontSize(24).text(savedData?.title || 'Trip Plan', 105, 20, { align: 'center' });
      let y = 35;
      formattedResponse.forEach(d => {
        doc.setFontSize(16).setTextColor(99, 102, 241).text(d.title, 14, y);
        y += 8;
        doc.setFontSize(10).setTextColor(50, 50, 50);
        d.items.forEach(i => {
          if (y > 270) { doc.addPage(); y = 15; }
          const lines = doc.splitTextToSize(`• ${i}`, 180);
          doc.text(lines, 18, y);
          y += lines.length * 5 + 2;
        });
        y += 8;
      });
      doc.save(`${savedData?.title}-Guide.pdf`);
    });
  };

  return (
    <div className="w-full">
      <Notification
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ type: '', message: '' })}
      />

      {/* --- MASTER HERO --- */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950" />
          <div className="mesh-bg !opacity-20" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 inline-block">
            <span className="px-5 py-1.5 rounded-full glass-ui border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em]">Intelligence Report</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-8 italic"
          >
            {savedData?.title || 'Mission Alpha'}
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap justify-center gap-8 text-white font-black uppercase tracking-widest text-xs">
            <div className="flex flex-col items-center gap-2">
              <span className="text-slate-500">Destination</span>
              <span>{savedData?.location || 'Unknown'}</span>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block" />
            <div className="flex flex-col items-center gap-2">
              <span className="text-slate-500">Inventory</span>
              <span>₹{savedData?.budget || '0'}</span>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block" />
            <div className="flex flex-col items-center gap-2">
              <span className="text-slate-500">Unit Size</span>
              <span>{savedData?.participants || '1'} PAX</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- TOOLBAR --- */}
      <div className="sticky top-20 z-40 w-full glass-ui py-4 border-b border-indigo-500/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-6">
          <button onClick={() => navigate('/planner')} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">
            <span className="text-xl">🛠️</span> Configure
          </button>
          <button onClick={handleDownloadPDF} className="btn-premium py-2.5 px-6 bg-slate-900 text-white text-xs tracking-widest uppercase font-black shadow-none ring-1 ring-white/10">
            Download Dossier
          </button>
          <button onClick={handleCopyPlan} className="btn-premium py-2.5 px-6 glass-ui text-xs tracking-widest uppercase font-black border-slate-200">
            Sync to Device
          </button>
          <button onClick={() => savedData && generateAI(savedData)} disabled={loading} className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 flex items-center gap-2 disabled:opacity-50">
            {loading ? 'Processing...' : 'Recalibrate'} <span className="text-xl">🔄</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24">
        {loading ? (
          <Loader message="Synthesizing Your Masterpiece..." />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
            {/* Timeline Left */}
            <div className="xl:col-span-8 space-y-24">
              <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.2 } } }}>
                {formattedResponse.map((day, i) => (
                  <motion.div
                    key={i}
                    variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
                    className="group"
                  >
                    <div className="flex items-start gap-8 mb-16">
                      <div className="hidden md:flex flex-col items-center">
                        <div className="w-16 h-16 rounded-[2rem] bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-indigo-500/30 group-hover:rotate-12 transition-transform">
                          {i + 1}
                        </div>
                        <div className="w-1 h-32 bg-gradient-to-b from-indigo-500/20 to-transparent mt-4" />
                      </div>

                      <div className="flex-1 glass-card p-10 hover:border-indigo-500/30">
                        <h3 className="text-4xl font-black mb-10 tracking-tighter flex items-center gap-4">
                          <span className="text-indigo-500 opacity-30 text-2xl">Day</span>
                          {day.title.replace(/Day\s*\d+/i, '').trim() || `Operational Phase ${i + 1}`}
                        </h3>

                        <div className="space-y-12">
                          {day.items.map((item, j) => {
                            const time = (item.match(/\[(.*?)\]/) || [])[1];
                            const content = item.replace(/\[.*?\]/, '').trim();
                            const [activity, ...details] = content.split(':');

                            return (
                              <div key={j} className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800">
                                <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-slate-300 group-hover:bg-indigo-500 transition-colors" />
                                <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
                                  <div className="sm:w-32 flex-shrink-0">
                                    <span className="text-xs font-black uppercase tracking-widest text-indigo-500">{time || '00:00'}</span>
                                  </div>
                                  <div>
                                    <h4 className="text-xl font-bold mb-2 tracking-tight">{activity}</h4>
                                    <p className="text-slate-500 text-lg leading-relaxed font-medium">{details.join(':')}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Sidebar Right */}
            <div className="xl:col-span-4 space-y-12">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 bg-slate-900 text-white shadow-3xl">
                <div className="flex items-center gap-4 mb-10">
                  <span className="text-4xl">💎</span>
                  <h3 className="text-2xl font-black tracking-tight">Financial Analysis</h3>
                </div>

                <div className="space-y-6">
                  {costSummary.map((item, idx) => {
                    const [label, val] = item.split(':');
                    return (
                      <div key={idx} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                        <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">{label}</span>
                        <span className="text-xl font-black text-white">{val || item}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-12 p-6 rounded-2xl bg-indigo-600/20 border border-indigo-500/30">
                  <p className="text-xs font-medium text-indigo-200 leading-relaxed italic">
                    Finalized based on current market trends and personalized style preferences.
                  </p>
                </div>
              </motion.div>

              <div className="p-8 glass-card border-slate-200/50">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Expert Verdict</h4>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-indigo-600">★</span>)}
                </div>
                <p className="text-slate-500 font-medium leading-relaxed">
                  "This route presents an optimal balance between cultural depth and luxury downtime.
                  Target achieved."
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Travelly AI Concierge</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <FAB show={showFab} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} label="Archived Top" />
    </div>
  );
};

export default Result;
