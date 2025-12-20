import React, { useEffect, useState } from 'react';
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
import { MessageCircle, Share2, Globe, Users, DollarSign, Map } from 'lucide-react';
import PrintVersion from './components/PrintVersion';
import TimeTracker from './components/TimeTracker';

const Result = () => {
  const [formattedResponse, setFormattedResponse] = useState([]);
  const [costSummary, setCostSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState('');
  const [savedData, setSavedData] = useState(null);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [showPackingList, setShowPackingList] = useState(false);
  const [showBudgetTracker, setShowBudgetTracker] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [weatherData, setWeatherData] = useState([]);
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

    // Enhanced prompt for better AI responses
    const prompt = `You are an expert travel planner specializing in ${data.location}. Create a detailed ${totalDays}-day itinerary.

**Trip Details:**
- Title: ${data.title}
- Location: ${data.location}
- Travelers: ${data.participants} people
- Budget: $${data.budget} USD
- Trip Type: ${data.type}
- Dates: ${data.startDate} to ${data.endDate}

**Instructions:**
1. Create exactly ${totalDays} days of activities
2. For each day, provide 4-6 time-specific activities
3. Format each activity as: "[HH:MM AM/PM] Activity Name: Detailed description (Est: $XX)"
4. Include breakfast, lunch, dinner, and attractions
5. Stay within the total budget of $${data.budget}
6. Match the ${data.type} theme
7. End with a "Cost Summary:" section breaking down major expenses

**Format Example:**
Day 1
[08:00 AM] Breakfast at Local Café: Start your day with traditional cuisine (Est: $15)
[10:00 AM] Visit Historic Site: Explore the main attraction (Est: $30)

Please generate the itinerary now:`;

    try {
      setLoading(true);
      const key = import.meta.env.VITE_GEMINI_API_KEY;

      if (!key || key === 'your_gemini_api_key_here') {
        throw new Error('⚠️ Gemini API Key not configured. Please add your API key to the .env file. Get one at: https://makersuite.google.com/app/apikey');
      }

      setNotification({ type: 'info', message: '🤖 AI is crafting your perfect itinerary...' });

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(`Gemini API Error: ${result.error.message}`);
      }

      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('No response generated. Please try again.');
      }

      setAiResponse(text);
      const { days, costSummary } = formatAIResponse(text);

      if (days.length === 0) {
        throw new Error('Failed to parse itinerary. Please regenerate.');
      }

      setFormattedResponse(days);
      setCostSummary(costSummary);
      setNotification({ type: 'success', message: `✨ Your ${totalDays}-day itinerary is ready!` });

      // Save to database if configured
      if (data.id && isSupabaseConfigured) {
        await supabase.from('itineraries').update({ ai_plan: text }).eq('id', data.id);
      }
    } catch (err) {
      console.error('AI Generation Error:', err);
      setNotification({
        type: 'error',
        message: err.message || 'Failed to generate itinerary. Please check your API key and try again.'
      });

      // Set fallback content
      setFormattedResponse([{
        title: 'Error',
        items: ['Unable to generate itinerary. Please check your internet connection and API key configuration.'],
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200"
      }]);
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
          <div className="flex flex-wrap gap-4">
            <Magnetic>
              <button onClick={handleCopyPlan} className="btn-expensive bg-primary border-none shadow-primary-glow px-8 text-sm">
                Copy Plan
              </button>
            </Magnetic>
            <Magnetic>
              <button onClick={() => savedData && generateAI(savedData)} disabled={loading} className="btn-expensive bg-white/5 px-8 text-sm">
                {loading ? 'Regenerating...' : 'Regenerate'}
              </button>
            </Magnetic>
            <Magnetic>
              <button onClick={() => savedData && exportToPDF(savedData, formattedResponse)} className="btn-expensive bg-white/5 px-8 text-sm">
                📄 PDF
              </button>
            </Magnetic>
            <Magnetic>
              <button onClick={() => savedData && shareViaEmail(savedData, formattedResponse)} className="btn-expensive bg-white/5 px-8 text-sm">
                📧 Email
              </button>
            </Magnetic>
            <Magnetic>
              <button onClick={() => setShowPackingList(true)} className="btn-expensive bg-white/5 px-8 text-sm">
                🎒 Packing
              </button>
            </Magnetic>
            <Magnetic>
              <button onClick={() => setShowBudgetTracker(true)} className="btn-expensive bg-white/5 px-8 text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Budget
              </button>
            </Magnetic>
            <Magnetic>
              <button onClick={() => setShowChatbot(true)} className="btn-expensive bg-white/5 px-8 text-sm flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> AI Chat
              </button>
            </Magnetic>
            <Magnetic>
              <button onClick={() => setShowShare(true)} className="btn-expensive bg-white/5 px-8 text-sm flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </Magnetic>
            <Magnetic>
              <button onClick={() => setShowTranslation(true)} className="btn-expensive bg-white/5 px-8 text-sm flex items-center gap-2">
                <Globe className="w-4 h-4" /> Translate
              </button>
            </Magnetic>
            <Magnetic>
              <button onClick={() => setShowCollaboration(true)} className="btn-expensive bg-white/5 px-8 text-sm flex items-center gap-2">
                <Users className="w-4 h-4" /> Collaborate
              </button>
            </Magnetic>
            <PrintVersion itinerary={savedData} formattedResponse={formattedResponse} />
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
      {formattedResponse.length > 0 && savedData && (
        <div className="max-w-[1600px] mx-auto px-10 py-16">
          <TripMap
            itinerary={savedData}
            formattedResponse={formattedResponse}
          />
        </div>
      )}

      {/* Currency Converter */}
      {savedData && (
        <div className="max-w-[1600px] mx-auto px-10 py-16">
          <CurrencyConverter
            amount={savedData.budget || 1000}
            baseCurrency="USD"
          />
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
