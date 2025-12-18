import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from './supabase';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import FAB from './FAB';
import Lottie from 'lottie-react';
import travelLoader from './lottie-travel-loader.json';

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
    const onScroll = () => setShowFab(window.scrollY > 200);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCopyPlan = async () => {
    try {
      const text = aiResponse || (formattedResponse.length > 0
        ? formattedResponse.map(d => `${d.title}\n${d.items.map(i => `- ${i}`).join('\n')}`).join('\n\n') + (costSummary.length ? `\n\nCost Summary:\n${costSummary.map(i => `- ${i}`).join('\n')}` : '')
        : '');
      if (!text) {
        setNotification({ type: 'error', message: 'Nothing to copy yet.' });
        return;
      }
      await navigator.clipboard.writeText(text);
      setNotification({ type: 'success', message: 'Plan copied to clipboard!' });
    } catch (e) {
      setNotification({ type: 'error', message: 'Failed to copy plan.' });
    }
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('currentItinerary'));
    if (saved) {
      setSavedData(saved);
      generateAI(saved);
    } else {
      setAiResponse('No itinerary found.');
      setLoading(false);
    }
  }, []);

  const formatAIResponse = (text) => {
    if (!text) return { days: [], costSummary: [] };
    console.log('📝 Formatting AI response, length:', text.length);

    const cleanText = text.replace(/<[^>]*>/g, '');
    const [mainText, costText] = cleanText.split(/Cost Summary:/i);

    const dayPatterns = [
      /Day\s*\d+/gi,
      /\*\*Day\s*\d+\*\*/gi,
      /##\s*Day\s*\d+/gi,
      /Day\s+\d+:/gi,
    ];

    let days = [];

    for (const pattern of dayPatterns) {
      const splits = mainText.split(pattern).filter(Boolean);
      if (splits.length >= 1) {
        days = splits.map((day, index) => {
          const blocks = day
            .split('\n')
            .map((line) =>
              line
                .replace(/^[\*\#\-•🌟]+/, '')
                .replace(/\*\*/g, '')
                .trim()
            )
            .filter((line) => line.length > 2);

          return {
            title: `Day ${index + 1}`,
            items: blocks.filter(item => item.length > 0),
          };
        });

        if (days.length > 0 && days.some(d => d.items.length > 0)) {
          break;
        }
      }
    }

    if (days.length === 0 || days.every(d => d.items.length === 0)) {
      const allLines = (mainText || text)
        .split('\n')
        .map(line => line.trim()
          .replace(/^[\*\#\-•🌟]+/, '')
          .replace(/\*\*/g, '')
          .trim()
        )
        .filter(line => line.length > 2);

      days = [{
        title: 'Your Itinerary',
        items: allLines.length > 0 ? allLines : [text.substring(0, 1000)]
      }];
    }

    const costLines = costText
      ? costText
        .split('\n')
        .map((line) => line.replace(/^[-•🌟\*\#]+/, '').replace(/\*\*/g, '').trim())
        .filter((line) => line.length > 2)
      : [];

    return { days, costSummary: costLines };
  };

  const generateAI = async (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const totalDays = diffDays > 7 ? 7 : diffDays;

    let dayFormatText = '';
    for (let i = 1; i <= totalDays; i++) {
      dayFormatText += `
Day ${i}
- [HH:MM AM/PM] Activity name: Description. (Estimated Cost: ₹X)
`;
    }

    const prompt = `
You are a luxury travel concierge. Create a detailed, professional ${totalDays}-day itinerary for ${data.participants} people in ${data.location}.
Title: ${data.title}
Budget: ₹${data.budget}
Interests: ${data.type}
Range: ${data.range}

Instructions:
1. For each day, provide 4-5 distinct activities with specific times.
2. Use the format: "- [Time] Activity: Detail. (Cost: ₹X)"
3. Ensure costs are realistic and stay within the total ₹${data.budget} budget.
4. Include local dining gems and hidden spots.
5. End with a "Cost Summary:" section.

FORMAT:
${dayFormatText}
`;

    try {
      setLoading(true);
      const key = import.meta.env.VITE_GEMINI_API_KEY;
      if (!key) throw new Error('API Key missing');

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          }),
        }
      );

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || 'Failed to generate.';
      setAiResponse(text);

      const { days, costSummary } = formatAIResponse(text);
      setFormattedResponse(days);
      setCostSummary(costSummary);

      if (data.id) {
        await supabase.from('itineraries').update({ ai_plan: text }).eq('id', data.id);
      }
    } catch (err) {
      setAiResponse('❌ Error generating itinerary.');
      setNotification({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    import('jspdf').then(jsPDFModule => {
      const doc = new jsPDFModule.jsPDF();
      doc.setFont('helvetica');
      doc.setFontSize(22);
      doc.text(savedData?.title || 'Trip Plan', 105, 25, { align: 'center' });
      let y = 40;
      formattedResponse.forEach((day) => {
        doc.setFontSize(16);
        doc.setTextColor(99, 102, 241);
        doc.text(day.title, 14, y);
        y += 10;
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        day.items.forEach(item => {
          if (y > 270) { doc.addPage(); y = 20; }
          const lines = doc.splitTextToSize(`• ${item}`, 180);
          doc.text(lines, 18, y);
          y += lines.length * 6 + 2;
        });
        y += 5;
      });
      doc.save(`${savedData?.title || 'Trip'}-Plan.pdf`);
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Notification
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ type: '', message: '' })}
      />

      {/* --- HEADER --- */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1 rounded-full bg-indigo-500/10 text-indigo-600 text-sm font-bold mb-4"
        >
          ✨ AI Generated Expert Plan
        </motion.div>
        <motion.h2
          className="text-4xl md:text-6xl font-black tracking-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Your <span className="navbar-logo-gradient animate-gradient-text">Premium Itinerary</span>
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={() => navigate('/planner')} className="px-5 py-2.5 rounded-xl glass-ui font-bold hover:scale-105 transition-all flex items-center gap-2">
            <span>🔙</span> Modify
          </button>
          <button onClick={handleDownloadPDF} className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:scale-105 transition-all flex items-center gap-2">
            <span>⬇️</span> Download PDF
          </button>
          <button onClick={handleCopyPlan} className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm font-bold hover:scale-105 transition-all flex items-center gap-2">
            <span>📋</span> Copy
          </button>
          <button onClick={() => savedData && generateAI(savedData)} disabled={loading} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50">
            {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span>🔄</span>}
            Regenerate
          </button>
        </div>
      </div>

      {/* --- CONTENT --- */}
      {loading ? (
        <div className="flex flex-col items-center py-20">
          <div className="w-24 h-24 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-8" />
          <p className="text-2xl font-bold text-slate-400 animate-pulse">Designing your adventure...</p>
        </div>
      ) : formattedResponse.length > 0 ? (
        <div className="space-y-12">
          {formattedResponse.map((day, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative pl-8 md:pl-12 border-l-4 border-indigo-500/20 py-4"
            >
              {/* Day Marker */}
              <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/40">
                {i + 1}
              </div>

              <div className="glass-card p-6 md:p-10 mb-6">
                <h3 className="text-3xl font-black mb-8 flex items-center gap-4">
                  <span className="text-slate-300">#</span> {day.title}
                </h3>

                <div className="space-y-8">
                  {day.items.map((item, j) => {
                    const timeMatch = item.match(/\[(.*?)\]/);
                    const time = timeMatch ? timeMatch[1] : null;
                    const content = item.replace(/\[.*?\]/, '').trim();
                    const [activity, ...detail] = content.split(':');

                    return (
                      <div key={j} className="flex flex-col md:flex-row gap-4 md:gap-8 group">
                        <div className="md:w-32 flex-shrink-0">
                          <span className="text-lg font-black text-indigo-500 group-hover:scale-110 transition-transform inline-block">
                            {time || '--:--'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">{activity}</h4>
                          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">{detail.join(':')}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Cost Summary */}
          {costSummary.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 md:p-12 border-t-8 border-emerald-500 bg-emerald-50/20"
            >
              <h3 className="text-3xl font-black mb-8 text-emerald-700 flex items-center gap-4">
                <span className="text-4xl">💰</span> Cost Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {costSummary.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/50 border border-emerald-100 shadow-sm">
                    <span className="text-slate-600 font-medium">{item.split(':')[0]}</span>
                    <span className="text-xl font-bold text-emerald-600">{item.split(':')[1] || item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-2xl font-bold text-red-500">{aiResponse}</p>
        </div>
      )}

      <FAB show={showFab} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} label="Scroll Top" />
    </div>
  );
};

export default Result;

// Floating Action Button: Show when scrolled down
// (Add this before export default Result;)

// ...inside Result component, before return:
//   const [showFab, setShowFab] = useState(false);
//   useEffect(() => {
//     const onScroll = () => setShowFab(window.scrollY > 200);
//     window.addEventListener('scroll', onScroll);
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);

// ...inside JSX, after main content:
//   <FAB show={showFab} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} label="Scroll to Top" />

export default Result;
