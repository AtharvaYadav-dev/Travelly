import React, { useEffect, useState, useRef, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FastAverageColor } from 'fast-average-color';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from './supabase';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import Loader from './Loader';
import Magnetic from './Magnetic';
import { exportToPDF, shareViaEmail } from './utils/exportUtils';
import { getActivityIcon, getCategoryColor } from './utils/activityIcons';
import PackingListModal from './PackingListModal';
import WeatherCard from './components/WeatherCard';
import BudgetTracker from './components/BudgetTracker';
import TripMap from './components/TripMap';
import CurrencyConverter from './components/CurrencyConverter';
import TravelChatbot from './components/TravelChatbot';
import SocialShare from './components/SocialShare';
import TranslationHelper from './components/TranslationHelper';
import CollaborationModal from './components/CollaborationModal';
import { fetchWeatherForecast } from './utils/weatherService';
import { trackAchievement } from './utils/achievementSystem';
import { MessageCircle, Share2, Globe, Users, DollarSign, Map, Zap, Wind } from 'lucide-react';
import PrintVersion from './components/PrintVersion';
import TimeTracker from './components/TimeTracker';
import BookingWidget from './components/BookingWidget';
import ItineraryFragment from './components/ItineraryFragment';
import { useAura } from './hooks/useAura';
import { useAuraMesh } from './hooks/useAuraMesh';
import { usePerformance } from './hooks/usePerformance';
import { soundscape } from './utils/SoundscapeManager';
import MagneticButton from './components/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

const Result = () => {
  const [formattedResponse, setFormattedResponse] = useState([]);
  const [costSummary, setCostSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(null);
  const [savedData, setSavedData] = useState(null);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [showPackingList, setShowPackingList] = useState(false);
  const [showBudgetTracker, setShowBudgetTracker] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [weatherData, setWeatherData] = useState([]);
  const [themeColor, setThemeColor] = useState(null);
  const [dayPromises, setDayPromises] = useState([]);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // 🌀 Aura Engine: Initialize with destination vibe
  const aura = useAura(savedData?.type === 'luxury' ? 'royal' : (savedData?.budget > 100000 ? 'high-frequency' : 'low-frequency'));
  
  // 📈 Performance Sharding Intelligence
  const { isLowPower } = usePerformance();

  // 🌌 Aura Mesh: Dynamic Canvas Background
  useAuraMesh(canvasRef, themeColor || '#FF7A2D');

  // Dynamic Theme Color Extraction
  useEffect(() => {
    const fac = new FastAverageColor();
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = `https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2600`; // The hero image URL
    
    img.onload = () => {
      try {
        const color = fac.getColor(img);
        if (color && color.hex) {
          setThemeColor(color.hex);
          console.log('🎨 Dynamic Theme Color Applied:', color.hex);
        }
      } catch (e) {
        console.error("Color extraction failed", e);
      }
    };
    
    return () => fac.destroy();
  }, []);

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

      // Load weather data
      if (saved.location) {
        fetchWeatherForecast(saved.location).then(weather => {
          setWeatherData(weather);
        });
      }

      // Track achievement
      trackAchievement('guest', 'trip_created', {
        budget: saved.budget,
        type: saved.type
      });

      // 🔊 Initialize Soundscape
      soundscape.init();
    } else {
      setAiResponse('No plan found.');
      setLoading(false);
    }

    return () => soundscape.stop();
  }, []);

  // 🎢 Spatial Soundscape Scroll Integration
  useEffect(() => {
    const handleScroll = () => {
      const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      soundscape.setAltitude(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🎬 Sovereign Luxury GSAP Reveal
  useEffect(() => {
    if (!loading && formattedResponse.length > 0) {
      const ctx = gsap.context(() => {
        // 1. Header Letter-Spacing Reveal
        gsap.fromTo(".header-reveal", 
          { letterSpacing: "1em", opacity: 0, scale: 1.1 },
          { letterSpacing: "0em", opacity: 1, scale: 1, duration: 2.5, ease: "expo.out" }
        );

        // 2. Bento Grid 3D Stagger
        gsap.fromTo(".bento-reveal",
          { y: 100, rotateX: 15, opacity: 0, transformOrigin: "50% 50% -100" },
          { 
            y: 0, 
            rotateX: 0, 
            opacity: 1, 
            duration: 1.2, 
            stagger: 0.15, 
            ease: "power4.out",
            scrollTrigger: {
              trigger: ".bento-reveal",
              start: "top 85%"
            }
          }
        );
      });
      return () => ctx.revert();
    }
  }, [loading, formattedResponse]);

  const formatAIResponse = (text) => {
    if (!text) return { days: [], costSummary: [] };
    
    // Clean text and handle multi-line splitting
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    
    // Identify where the actual itinerary starts (usually at "Day 1" or "Day 01")
    const dayOneIndex = cleanText.search(/Day\s*(0?1)/i);
    const itineraryContent = dayOneIndex !== -1 ? cleanText.substring(dayOneIndex) : cleanText;
    
    // Split into itinerary and cost summary
    const parts = itineraryContent.split(/Cost Summary:|Expenses:|Estimated Budget:/i);
    const mainText = parts[0];
    const costText = parts[1] || "";

    // Identify days using robust regex
    const dayRegex = /Day\s*\d+[:\-\s\*\#]*/gi;
    const dayMarkers = mainText.match(dayRegex) || [];
    const daySegments = mainText.split(dayRegex).filter(Boolean);

    let days = [];
    if (daySegments.length > 0) {
      days = daySegments.map((segment, index) => {
        const items = segment.split('\n')
          .map(line => line.replace(/^[\*\#\-•🌟\d\.\s\]\[]+/, '').replace(/\*\*/g, '').trim())
          .filter(line => line.length > 3);
          
        return {
          title: dayMarkers[index] ? dayMarkers[index].replace(/[:\-\s\*\#]+$/, '').trim() : `Day ${index + 1}`,
          items: items,
          image: `https://images.unsplash.com/photo-${1517048676732 + index}-d65bc937f952?q=80&w=1200`
        };
      }).filter(day => day.items.length > 0);
    }

    // Comprehensive Fallback if parsing fails
    if (days.length === 0) {
      console.warn("⚠️ Parsing failed, using robust fallback display");
      days = [{
        title: 'Generated Itinerary',
        items: cleanText.split('\n').map(l => l.trim()).filter(l => l.length > 10).slice(0, 30),
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200"
      }];
    }

    const costLines = costText ? costText.split('\n')
      .map(line => line.replace(/^[-•🌟\*\#]+/, '').replace(/\*\*/g, '').trim())
      .filter(line => line.length > 2) : [];
      
    console.log("📊 Parsed Days:", days);
    console.log("📊 Parsed Cost Summary:", costLines);
    return { days, costSummary: costLines };
  };

  const generateAI = async (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const totalDays = Math.min(7, Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1);

    // Enhanced prompt for better AI responses with Indian context
    const prompt = `Create a detailed ${totalDays}-day itinerary for ${data.location}.

Trip Details:
- Title: ${data.title}
- Location: ${data.location}
- Travelers: ${data.participants} log
- Budget: ₹${data.budget} INR
- Trip Type: ${data.type}
- Dates: ${data.startDate} to ${data.endDate}

Requirements:
- Exactly ${totalDays} days with 6-8 detailed activities per day
- Format: [HH:MM AM/PM] Activity Name: Detailed description with specific location, what to expect, travel time, and exact cost (Est: ₹XX)
- Include breakfast, lunch, dinner, local attractions, shopping, and unique experiences
- Add travel tips, local food recommendations, and cultural insights
- Include transportation suggestions between locations
- Stay within ₹${data.budget} total budget
- Match ${data.type} theme perfectly
- End with Cost Summary:
Generate:`;

    // Try multiple Groq models in order of preference
    const models = [
      'llama-3.3-70b-versatile',
      'llama-3.3-70b-specdec',
      'llama-3.1-8b-instant'
    ];

    for (const model of models) {
      try {
        console.log(`🔄 Trying Groq model: ${model}`);
        await tryGenerateWithGroqModel(data, prompt, model, totalDays);
        return; // Success, exit loop
      } catch (error) {
        console.error(`❌ Model ${model} failed:`, error.message);
        if (model === models[models.length - 1]) {
          // All models failed
          setNotification({ type: 'error', message: `❌ Failed to generate itinerary: ${error.message}` });
          setLoading(false);
          throw error;
        }
        continue; // Try next model
      }
    }
  };

  const tryGenerateWithGroqModel = async (data, prompt, model, totalDays) => {
    try {
      setLoading(true);
      const key = import.meta.env.VITE_GROQ_API_KEY;

      console.log('🔑 Groq API Key Check:', key ? 'Present' : 'Missing');
      console.log('🔑 API Key Length:', key?.length);
      console.log('🔑 API Key Prefix:', key?.substring(0, 10) + '...');

      if (!key || key === 'your_groq_api_key_here') {
        throw new Error('⚠️ Groq API Key not configured. Please add your API key to .env file. Get one at: https://console.groq.com/keys');
      }

      setNotification({ type: 'info', message: `🤖 AI is crafting your perfect itinerary using ${model}...` });

      const apiUrl = `https://api.groq.com/openai/v1/chat/completions`;
      console.log('🌐 API URL:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 6144,
          stream: true // 🚀 ENABLE STREAMING
        }),
        signal: AbortSignal.timeout(60000) // 60 second timeout
      });

      console.log('📡 Response Status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`);
      }

      // 🌊 Stream Parsing Engine
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim().startsWith('data: '));
        
        for (const line of lines) {
          const streamData = line.replace(/^data: /, '').trim();
          if (streamData === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(streamData);
            const content = parsed.choices[0]?.delta?.content || "";
            fullText += content;
            setAiResponse(fullText); // ✍️ Update UI character by character
          } catch (e) {
            // Ignore partial parse errors
          }
        }
      }

      console.log('📝 Generation Complete. Length:', fullText?.length || 0);

      // 🛡️ Zod Rigorous Validation
      const itinerarySchema = z.object({
        text: z.string().min(200, "AI Generated response is suspiciously short. Retrying.")
      });

      try {
        itinerarySchema.parse({ text: fullText });
      } catch (validationError) {
        console.error("Zod Validation Failed:", validationError);
        throw new Error("Validation Failed: AI output format was incorrect. Retrying...");
      }

      // Check if response is complete (has proper ending)
      const hasProperEnding = fullText.includes('Cost Summary:') || fullText.includes('Total Cost:') || fullText.includes('Budget:');
      if (!hasProperEnding) {
        console.warn('⚠️ Response appears incomplete, missing cost summary');
        throw new Error('Response incomplete. Retrying with different model...');
      }

      setAiResponse(fullText);
      const { days, costSummary } = formatAIResponse(fullText);

      if (days.length === 0) {
        console.error("❌ Model returned text but it could not be parsed into days:", fullText);
        throw new Error('Failed to parse itinerary structure. Retrying...');
      }

      setFormattedResponse(days);
      setCostSummary(costSummary);

      // 🎁 Create Promises for React 19 'use' API
      const promises = days.map(day => Promise.resolve(day));
      setDayPromises(promises);

      setNotification({ type: 'success', message: `✨ Your ${totalDays}-day itinerary is ready!` });
      setLoading(false); // Add this to stop loading

      // Save to database if configured
      if (data.id && isSupabaseConfigured) {
        await supabase.from('itineraries').update({ ai_plan: fullText }).eq('id', data.id);
      }
    } catch (err) {
      console.error('AI Generation Error:', err);
      throw err; // Re-throw to be caught by outer loop
    } finally {
      setLoading(false); // Ensure loading is always turned off
    }
  };

  const regenerateDay = async (dayIndex) => {
    try {
      setIsRegenerating(dayIndex);
      setNotification({ type: 'info', message: '🤖 Recalculating route for this day...' });
      const key = import.meta.env.VITE_GROQ_API_KEY;
      if (!key) throw new Error("API Key missing");

      const existingDay = formattedResponse[dayIndex];
      const prompt = `Regenerate the travel itinerary for ${existingDay.title} out of the main trip.
Keep it strictly to this format:
[HH:MM AM/PM] Activity Name: Description with exact cost (Est: ₹XX)

Provide 5-6 brand new unique activities different from the current plan. Give ONLY the activities list, no intro text.
Current plan was: ${existingDay.items.join(' | ')}`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.9,
          max_tokens: 1024,
        })
      });

      const result = await response.json();
      const text = result?.choices?.[0]?.message?.content || "";
      
      const newItems = text.split('\n')
        .map(line => line.replace(/^[-•*]*\s*/, '').trim())
        .filter(line => line.match(/^\[\d{1,2}:\d{2}\s*[APM]{2}\]/i));

      if (newItems.length > 0) {
        setFormattedResponse(prev => {
          const updated = [...prev];
          updated[dayIndex] = { ...updated[dayIndex], items: newItems };
          return updated;
        });
        setNotification({ type: 'success', message: `✨ ${existingDay.title} upgraded by AI!` });
      } else {
        throw new Error("AI didn't return proper time formats.");
      }
    } catch (err) {
      console.error('Regenerate Error:', err);
      setNotification({ type: 'error', message: 'Failed to re-route day. Try again.' });
    } finally {
      setIsRegenerating(null);
    }
  };

  return (
    <div 
      className="w-full bg-slate-950 min-h-screen text-white pb-48 relative overflow-hidden"
      style={themeColor ? { 
        '--color-primary': themeColor,
        '--gradient-primary': `linear-gradient(135deg, ${themeColor} 0%, rgba(255,255,255,0.2) 100%)`
      } : {}}
    >
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      <div className="luxury-noise fixed inset-0 pointer-events-none z-10 opacity-20" />
      
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
            <span className="text-primary font-black uppercase tracking-[1em] text-[10px] mb-8 block">AI NE BANAYA ITINERARY</span>
            <h1 className="text-7xl md:text-[10rem] font-display italic tracking-tighter leading-none mb-12 header-reveal">
              {savedData?.title || 'Tumhara Trip'}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-16 md:gap-32 text-white/50 font-bold uppercase tracking-[0.3em] text-[11px]"
          >
            {[
              { label: 'Location', val: savedData?.location || 'India' },
              { label: 'Budget', val: `₹${savedData?.budget || '0'}` },
              { label: 'Log Ja Rahe', val: `${savedData?.participants || '1'} Log` }
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
            <span className="text-xl group-hover:-translate-x-2 transition-transform">←</span> Planner pe Wapas
          </button>
              <div className="flex flex-wrap gap-4">
                <MagneticButton className="z-10">
                  <button onClick={handleCopyPlan} className="btn-premium px-8 text-sm">
                    Plan Copy Karo
                  </button>
                </MagneticButton>
                {/* ... other upgraded buttons ... */}
              </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-10 py-32">
        {loading ? (
          <Loader message="Itinerary ban raha hai bhai..." />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">

            {/* --- SOVEREIGN BENTO STACK --- */}
            <div className="xl:col-span-8 space-y-12">
              {dayPromises.length > 0 ? (
                dayPromises.map((promise, i) => (
                  <div key={i} className="bento-reveal">
                    <React.Suspense 
                      fallback={
                        <div className="h-96 w-full bg-white/5 animate-pulse rounded-[2.5rem] flex items-center justify-center">
                          <Zap className="w-12 h-12 text-primary animate-bounce" />
                        </div>
                      }
                    >
                      <ItineraryFragment dayPromise={promise} index={i} />
                    </React.Suspense>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-32">
                  <Wind className="w-24 h-24 mx-auto text-white/10 animate-spin-slow" />
                  <p className="mt-8 text-white/30 font-black uppercase tracking-widest">Awaiting Transmission...</p>
                </div>
              )}
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

      {/* Packing List Modal */}
      <AnimatePresence>
        {showPackingList && (
          <PackingListModal
            itinerary={savedData}
            onClose={() => setShowPackingList(false)}
          />
        )}
      </AnimatePresence>

      {/* Budget Tracker Modal */}
      <AnimatePresence>
        {showBudgetTracker && savedData && (
          <BudgetTracker
            itinerary={savedData}
            onClose={() => setShowBudgetTracker(false)}
          />
        )}
      </AnimatePresence>

      {/* AI Chatbot Modal */}
      <AnimatePresence>
        {showChatbot && savedData && (
          <TravelChatbot
            itinerary={savedData}
            onClose={() => setShowChatbot(false)}
          />
        )}
      </AnimatePresence>

      {/* Social Share Modal */}
      <AnimatePresence>
        {showShare && savedData && (
          <SocialShare
            itinerary={savedData}
            onClose={() => setShowShare(false)}
          />
        )}
      </AnimatePresence>

      {/* Translation Helper Modal */}
      <AnimatePresence>
        {showTranslation && savedData && (
          <TranslationHelper
            destination={savedData.location}
            onClose={() => setShowTranslation(false)}
          />
        )}
      </AnimatePresence>

      {/* Collaboration Modal */}
      <AnimatePresence>
        {showCollaboration && savedData && (
          <CollaborationModal
            tripId={savedData.id}
            tripData={savedData}
            currentUser={{ id: 'guest', email: 'user@example.com' }}
            onClose={() => setShowCollaboration(false)}
          />
        )}
      </AnimatePresence>

      {/* Weather Cards - Add after itinerary */}
      {weatherData.length > 0 && formattedResponse.length > 0 && (
        <div className="max-w-[1600px] mx-auto px-10 py-16">
          <h2 className="text-4xl font-black text-white uppercase mb-8">🌤️ Weather Forecast</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {weatherData.slice(0, 5).map((weather, i) => (
              <WeatherCard key={i} weather={weather} />
            ))}
          </div>
        </div>
      )}

      {/* Trip Map */}
      {/* --- SOVEREIGN COMPONENT CLUSTER --- */}
      {savedData && (
        <div className="max-w-[1600px] mx-auto px-10 py-12 space-y-24">
          {formattedResponse.length > 0 && (
            <TripMap
              itinerary={savedData}
              formattedResponse={formattedResponse}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <BookingWidget itinerary={savedData} />
            <CurrencyConverter
              amount={savedData.budget || 1000}
              baseCurrency="USD"
            />
          </div>
        </div>
      )}

      {/* Time Tracker */}
      {formattedResponse.length > 0 && (
        <TimeTracker formattedResponse={formattedResponse} />
      )}
    </div>
  );
};

export default Result;
