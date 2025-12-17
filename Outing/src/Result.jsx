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
    const [mainText, costText] = text.split(/Cost Summary:/i);

    const days = mainText
      .split(/Day\s*\d/i)
      .filter(Boolean)
      .map((day, index) => {
        const blocks = day
          .split('\n')
          .map((line) =>
            line.replace(/^\*+/, '').replace(/^[-•🌟]/, '').trim()
          )
          .filter((line) => line.length > 5 && line.length < 300);
        return {
          title: `Day ${index + 1}`,
          items: blocks,
        };
      });

    const costLines = costText
      ? costText
          .split('\n')
          .map((line) => line.replace(/^[-•🌟]/, '').trim())
          .filter((line) => line.length > 3 && line.includes('₹'))
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
Morning: Activity, Location, Time, ₹Cost (category)
Afternoon: ...
Evening: ...
`;
    }

    const prompt = `
You are an expert, detail-oriented travel planning assistant.

Your top priority is to generate a PERFECT, factual, and realistic ${totalDays}-day itinerary. It is OK if it takes extra time—do NOT rush. DO NOT hallucinate or invent information. Only use verifiable, realistic, and logical details that could actually occur in the real world. If you are unsure, leave that part blank or say "Not enough information."

STRICT CONSTRAINTS:
- Do NOT make up places, activities, or costs that do not exist or are not plausible in the specified location and range.
- Only use information that is highly likely to be true for the given location, date, and context.
- If you cannot find or estimate something reliably, say "Not enough information" for that slot.
- Never invent facts, names, or addresses. Avoid generic or vague suggestions.
- If the plan cannot be perfect, err on the side of caution and accuracy.

Based on the following trip details, generate a DEEP, highly detailed, premium ${totalDays}-day itinerary.

Trip Details:
- Trip Title: ${data.title}
- Trip Type: ${data.type}
- Number of Participants: ${data.participants}
- Total Budget: ₹${data.budget}
- Location: ${data.location}
- Distance Range: ${data.range}
- Start Date: ${data.startDate}
- End Date: ${data.endDate}
- Time Window: ${data.startTime} to ${data.endTime}

Instructions:
1. For each day, break down the schedule into Morning, Afternoon, and Evening with specific times (e.g., 8:00 AM - 10:00 AM).
2. For each activity, provide:
   - Activity Name
   - Exact Location (with local landmark or address if possible)
   - Start & End Time
   - Estimated Cost (₹, with category)
   - Short Description (why it's special, what to expect)
   - Local insights/tips (e.g., best photo spot, must-try food, cultural etiquette)
   - Food/Dining suggestions (local cuisine, best-rated spots, veg/non-veg options)
   - Weather or packing tips if relevant
   - Safety/comfort notes (if needed)
   - 1 alternative (backup) activity for each slot
3. Make the plan realistic, actionable, and personalized for the group size and budget.
4. Ensure all activities are scheduled within ${data.range} of ${data.location} and between ${data.startTime} and ${data.endTime}.
5. DO NOT use Markdown, emojis, bullet points, or asterisks (**). Use clear, plain text with good spacing for readability.

FORMAT:
${dayFormatText}

After the itinerary, add a detailed Cost Summary (with breakdowns for transport, food, tickets, shopping, etc.) and a "Local Tips & Warnings" section with any extra advice for this trip.
`;

    // Direct Gemini API call (skip serverless function)
    try {
      setLoading(true);
      setNotification({ type: '', message: '' });
      
      const key = import.meta.env.VITE_GEMINI_API_KEY;
      console.log('🔑 API Key present:', !!key);
      
      if (!key) {
        throw new Error('Missing VITE_GEMINI_API_KEY environment variable');
      }

      console.log('🚀 Calling Gemini API...');
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            contents: [{ 
              parts: [{ text: prompt }] 
            }] 
          }),
        }
      );

      console.log('📡 Response status:', response.status);
      
      const raw = await response.text();
      console.log('📦 Raw response length:', raw.length);
      
      let result = null;
      try { 
        result = raw ? JSON.parse(raw) : null; 
      } catch (e) { 
        console.error('❌ JSON parse error:', e);
        result = { raw }; 
      }

      if (!response.ok) {
        const errorMsg = result?.error?.message || `Gemini API error (${response.status})`;
        console.error('❌ API Error:', errorMsg);
        throw new Error(errorMsg);
      }

      const text =
        result?.candidates?.[0]?.content?.parts?.[0]?.text ||
        '❌ Failed to generate.';
      
      console.log('✅ Generated text length:', text.length);
      setAiResponse(text);

      const { days, costSummary } = formatAIResponse(text);
      setFormattedResponse(days);
      setCostSummary(costSummary);

      if (data.id) {
        const { error } = await supabase
          .from('itineraries')
          .update({ ai_plan: text })
          .eq('id', data.id);

        if (error) {
          console.error('❌ Error saving AI plan to Supabase:', error);
          setNotification({ type: 'error', message: 'Error saving AI plan to Supabase.' });
        } else {
          setNotification({ type: 'success', message: 'AI plan saved to Supabase!' });
          console.log('✅ AI plan saved to Supabase');
        }
      }
    } catch (err) {
      console.error('❌ Gemini API Error:', err);
      setAiResponse('❌ Error generating itinerary.');
      setNotification({ 
        type: 'error', 
        message: `Error: ${err?.message || 'Failed to generate itinerary'}` 
      });
    } finally {
      setLoading(false);
    }
  };

  // Download as PDF (jsPDF implementation)
  const handleDownloadPDF = () => {
    import('jspdf').then(jsPDFModule => {
      const doc = new jsPDFModule.jsPDF();
      doc.setFont('helvetica');
      doc.setFontSize(18);
      doc.text('AI-Powered Trip Plan', 105, 18, { align: 'center' });
      let y = 30;
      formattedResponse.forEach((day, i) => {
        doc.setFontSize(15);
        doc.setTextColor(54, 79, 199);
        doc.text(`${day.title}`, 14, y);
        y += 8;
        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);
        day.items.forEach(item => {
          if (y > 275) { doc.addPage(); y = 20; }
          doc.text(`- ${item}`, 18, y);
          y += 7;
        });
        y += 4;
      });
      if (costSummary.length > 0) {
        doc.setFontSize(15);
        doc.setTextColor(32, 180, 90);
        doc.text('Cost Summary', 14, y);
        y += 8;
        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);
        costSummary.forEach(item => {
          if (y > 275) { doc.addPage(); y = 20; }
          doc.text(`- ${item}`, 18, y);
          y += 7;
        });
      }
      doc.save('AI-Trip-Plan.pdf');
    });
  };

  // Save plan to Supabase on success
  const savePlanToSupabase = async (planText) => {
    if (!savedData || !savedData.id) return;
    try {
      const { error } = await supabase
        .from('itineraries')
        .update({ ai_plan: planText })
        .eq('id', savedData.id);
      if (error) {
        setNotification({ type: 'error', message: 'Error saving AI plan to Supabase.' });
      } else {
        setNotification({ type: 'success', message: 'AI plan saved to Supabase!' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Error saving AI plan to Supabase.' });
    }
  };


  return (
    <>
      <div className="max-w-3xl mx-auto p-2 sm:p-8" id="itinerary-export">
      <Notification
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ type: '', message: '' })}
      />
      <motion.h2
        className="text-4xl font-extrabold text-center mb-10 drop-shadow-lg"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <span className="bg-gradient-to-tr from-indigo-600 via-fuchsia-500 to-pink-400 bg-clip-text text-transparent inline-block animate-gradient-move">
          <span className="inline-block animate-bounce mr-2">🤖</span> Your AI-Powered Trip Plan
        </span>
      </motion.h2>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={() => navigate('/planner')}
          className="px-5 py-2 rounded-xl bg-gradient-to-tr from-gray-200 via-white to-pink-100 text-gray-700 font-semibold shadow hover:scale-[1.04] active:scale-95 transition-all border border-gray-200"
        >
          <span className="mr-2">🔙</span> Back to Planner
        </button>
        <button
          onClick={() => savedData && generateAI(savedData)}
          disabled={loading}
          className="px-5 py-2 rounded-xl bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-pink-400 text-white font-semibold shadow hover:scale-[1.04] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 border border-indigo-200"
        >
          {loading && (
            <span className="w-5 h-5 border-2 border-white border-t-indigo-400 rounded-full animate-spin inline-block"></span>
          )}
          <span className="mr-2">🔄</span> Regenerate Plan
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-5 py-2 rounded-xl bg-gradient-to-tr from-green-400 via-blue-400 to-indigo-400 text-white font-semibold shadow hover:scale-[1.04] active:scale-95 transition-all flex items-center gap-2 border border-green-200"
        >
          <span className="mr-2">⬇️</span> Download as PDF
        </button>
        <button
          onClick={handleCopyPlan}
          className="px-5 py-2 rounded-xl bg-gradient-to-tr from-amber-300 via-yellow-300 to-orange-300 text-gray-900 font-semibold shadow hover:scale-[1.04] active:scale-95 transition-all flex items-center gap-2 border border-amber-200"
        >
          <span className="mr-1">📋</span> Copy Plan
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[320px] gap-4">
          {/* Lottie travel loader animation */}
          <div className="w-40 h-40 md:w-56 md:h-56 flex items-center justify-center">
            <Lottie animationData={travelLoader} loop={true} style={{ width: '100%', height: '100%' }} />
          </div>
          {/* Skeleton shimmer loader */}
          <div className="w-full space-y-6">
            {[1,2].map((_, idx) => (
              <div key={idx} className="animate-pulse bg-white/60 dark:bg-dark-glass backdrop-blur rounded-2xl shadow-xl border border-indigo-100 dark:border-dark-border p-8 mb-4">
                <div className="h-6 w-32 bg-indigo-100 dark:bg-dark-card rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-indigo-50 dark:bg-dark-card rounded"></div>
                  <div className="h-4 w-2/3 bg-indigo-50 dark:bg-dark-card rounded"></div>
                  <div className="h-4 w-1/2 bg-indigo-50 dark:bg-dark-card rounded"></div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 dark:text-gray-300 font-medium">Generating your personalized plan...</p>
        </div>
      ) : formattedResponse.length > 0 ? (
        <>
           <div className="space-y-8">
            {formattedResponse.map((day, i) => (
              <motion.div
                key={i}
                className="glass-card p-4 sm:p-8 rounded-2xl shadow-xl border border-indigo-100 dark:border-dark-border backdrop-blur-md bg-white/70 dark:bg-dark-glass dark:shadow-glass-dark hover:scale-[1.02] transition-transform duration-200"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.13 }}
              >
                <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-300 mb-3 flex items-center gap-2">
                  <span className="inline-block text-2xl">🗓️</span> {day.title}
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-100">
                  {day.items.map((item, j) => {
                    // Icon logic for activity times
                    let icon = '📍';
                    if (/morning/i.test(item)) icon = '☀️';
                    else if (/afternoon/i.test(item)) icon = '🌞';
                    else if (/evening/i.test(item)) icon = '🌙';
                    else if (/breakfast|brunch/i.test(item)) icon = '🍳';
                    else if (/lunch/i.test(item)) icon = '🍽️';
                    else if (/dinner/i.test(item)) icon = '🍽️';
                    else if (/party|night|event/i.test(item)) icon = '🎉';
                    return (
                      <li key={j} className="flex items-center gap-2">
                        <span className="inline-block text-lg">{icon}</span> {item}
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            ))}
          </div>
          {costSummary.length > 0 && (
            <motion.div
              className="glass-card p-4 sm:p-8 rounded-2xl shadow-xl border border-green-100 dark:border-dark-border backdrop-blur-md bg-green-50/60 dark:bg-dark-glass dark:shadow-glass-dark mt-10"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: (formattedResponse.length + 1) * 0.13 }}
            >
              <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-4 flex items-center gap-2">
                <span className="inline-block text-2xl">💸</span> Cost Summary
              </h3>
              <ul className="space-y-2 text-gray-800 dark:text-gray-100">
                {costSummary.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="inline-block text-lg">💰</span> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </>
      ) : (
        <p className="text-red-500 text-center font-semibold">{aiResponse}</p>
      )}
    </div>
      <FAB show={showFab} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} label="Scroll to Top" />
    </>
  );
};

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
