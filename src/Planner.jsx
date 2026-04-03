import React, { useState, useMemo, useActionState } from 'react';
import { useBhaiLogic } from './hooks/useBhaiLogic';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabase';
import Notification from './Notification';
import Magnetic from './Magnetic';
import { getBudgetSuggestion, getBudgetTier } from './utils/budgetSuggestions';
import { useTheme } from './contexts/ThemeContext';

const PremiumInput = ({ label, name, type = "text", placeholder, onChange, value, options }) => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-2 md:space-y-3 group">
      <label className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] transition-colors ml-1" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </label>
      <div className="relative overflow-hidden rounded-lg md:rounded-xl">
        {options ? (
          <select
            name={name}
            onChange={onChange}
            className={`w-full px-4 md:px-8 py-3 md:py-5 text-sm md:text-base focus:outline-none focus:border-primary/50 transition-all font-medium italic appearance-none premium-glass border`}
          >
            {options.map(o => <option key={o} value={o} className="bg-slate-900 text-white">{o}</option>)}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            className={`w-full px-4 md:px-8 py-3 md:py-5 text-sm md:text-base focus:outline-none focus:border-primary/50 transition-all font-medium italic premium-glass border`}
            style={{ color: 'var(--text-primary)' }}
          />
        )}
        <motion.div
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          className="absolute bottom-0 left-0 right-0 h-px bg-primary origin-left"
        />
      </div>
    </div>
  );
};

const Planner = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [form, setForm] = useState({
    title: '',
    type: '',
    budget: '',
    participants: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    range: ''
  });
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [isListening, setIsListening] = useState(false);
  const [isParsingVoice, setIsParsingVoice] = useState(false);
  const { translate } = useBhaiLogic(true);

  // 🚀 React 19: useActionState for Form Handling
  const [state, formAction, isPending] = useActionState(async (prevState, formData) => {
    const title = formData.get('title');
    const location = formData.get('location');
    const budget = formData.get('budget');
    const participants = formData.get('participants');
    const type = formData.get('type');
    const startDate = formData.get('startDate');
    const endDate = formData.get('endDate');

    if (!title || !location || !budget || !participants || !type || !startDate || !endDate) {
      return { error: 'Bhai saare details bhari na!' };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: 'Pehle login karle bhai!' };

      const { data, error } = await supabase
        .from('itineraries')
        .insert([{
          title: title.trim(),
          type: type.trim(),
          budget: parseInt(budget),
          participants: parseInt(participants),
          startDate,
          endDate,
          location: location.trim(),
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      localStorage.setItem('currentItinerary', JSON.stringify(data));
      setTimeout(() => navigate('/result'), 2000);
      return { success: true };
    } catch (err) {
      return { error: err.message };
    }
  }, null);

  const parseVoiceWithAI = async (transcript) => {
    setIsParsingVoice(true);
    setNotification({ type: 'info', message: '🤖 AI is filling your form based on what you said...' });
    try {
      const key = import.meta.env.VITE_GROQ_API_KEY;
      if (!key) throw new Error("API key missing.");
      
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{
            role: 'system',
            content: `You are an AI that extracts travel data from raw text. Extract to ONLY valid JSON containing EXACTLY these keys: { title: string, location: string, budget: number, participants: number, type: string (must be one of: 'Adventure Trip', 'Beach Vibe', 'Historic Ghumo', 'Luxury Trip', 'Scenic Beauty', 'Pilgrimage', 'Food Tour'), startDate: "YYYY-MM-DD", endDate: "YYYY-MM-DD" }. Leave missing fields empty string or null. Date must be YYYY-MM-DD. ONLY OUTPUT JSON.`
          }, {
            role: 'user',
            content: transcript
          }],
          response_format: { type: "json_object" }
        })
      });

      const data = await response.json();
      const parsed = JSON.parse(data.choices[0].message.content);
      
      setForm(prev => ({
        ...prev,
        title: parsed.title || prev.title,
        location: parsed.location || prev.location,
        budget: parsed.budget || prev.budget,
        participants: parsed.participants || prev.participants,
        type: parsed.type || prev.type,
        startDate: parsed.startDate || prev.startDate,
        endDate: parsed.endDate || prev.endDate,
      }));
      setNotification({ type: 'success', message: '✨ Form auto-filled by AI! Just review and click submit.' });
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Voice parsing failed. Try typing instead.' });
    } finally {
      setIsParsingVoice(false);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setNotification({ type: 'error', message: 'Browser does not support voice input.' });
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // Indian English supports Hindi mix well
    recognition.start();
    setIsListening(true);
    setNotification({ type: 'info', message: '🎤 Listening... Tell me your trip details! ("I want to go to Goa for 5 days with 3 friends under 40000 budget")' });

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setIsListening(false);
      parseVoiceWithAI(transcript);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setNotification({ type: 'error', message: 'Mic error: ' + event.error });
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ type: '', message: '' });

    const required = ['title', 'location', 'budget', 'participants', 'type', 'startDate', 'endDate'];
    for (let field of required) {
      if (!form[field]) {
        setNotification({ type: 'error', message: `Bhai ${field} field toh bhar na re!` });
        return;
      }
    }

    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        setNotification({ type: 'error', message: 'Login karle pehle, bhai!' });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('itineraries')
        .insert([{
          title: form.title.trim(),
          type: form.type.trim(),
          budget: parseInt(form.budget),
          participants: parseInt(form.participants),
          startDate: form.startDate,
          endDate: form.endDate,
          startTime: form.startTime || '09:00',
          endTime: form.endTime || '21:00',
          location: form.location.trim(),
          range: form.range || 'Swiss Explorer',
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) {
        setNotification({ type: 'error', message: `Database mein issue: ${error.message}` });
      } else {
        localStorage.setItem('currentItinerary', JSON.stringify(data));
        setNotification({ type: 'success', message: 'Itinerary bana raha hai... wait kar!' });
        setTimeout(() => navigate('/result'), 2000);
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Connection fail ho gaya. Try kar dobara!' });
    } finally {
      setLoading(false);
    }
  };

  // Calculate form completion progress
  const calculateProgress = () => {
    const requiredFields = ['title', 'location', 'budget', 'participants', 'type', 'startDate', 'endDate'];
    const filledFields = requiredFields.filter(field => form[field] && form[field] !== 'Select Type');
    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  // Get budget suggestion based on location
  const budgetSuggestion = useMemo(() => {
    if (!form.location) return null;
    const days = form.startDate && form.endDate
      ? Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24)) + 1
      : 5;
    return getBudgetSuggestion(form.location, days);
  }, [form.location, form.startDate, form.endDate]);

  const budgetTier = useMemo(() => {
    if (!form.budget || !form.location) return null;
    return getBudgetTier(parseInt(form.budget), form.location);
  }, [form.budget, form.location]);

  return (
    <div className="min-h-screen pb-48" style={{ background: 'var(--bg-primary)' }}>
      <Notification
        type={state?.error ? 'error' : state?.success ? 'success' : notification.type}
        message={state?.error || (state?.success ? translate('Success') : notification.message)}
        onClose={() => setNotification({ type: '', message: '' })}
      />

      {/* Header Space */}
      <div className="h-24 md:h-32 lg:h-48" />

      <div className="max-w-[1700px] mx-auto px-4 md:px-6 lg:px-10">
        <div className="flex flex-col xl:flex-row gap-12 md:gap-20 lg:gap-32 items-start">

          {/* --- LEFT: ARCHITECT STUDIO --- */}
          <div className="flex-1 w-full order-2 xl:order-1">
            <div className="mb-12 md:mb-16 lg:mb-24">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 md:gap-6 mb-6 md:mb-10"
              >
                <div className="w-1.5 md:w-2 h-12 md:h-16 bg-primary rounded-full shadow-primary-glow" />
                <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-black uppercase tracking-tighter italic leading-none" style={{ color: 'var(--text-primary)' }}>
                  <span className="text-primary">Trip Plan</span> <br /> <span className="primary-gradient-text">Karo Bhai!</span>
                </h2>
              </motion.div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 mt-10">
                <p className="text-base md:text-lg lg:text-2xl font-medium max-w-3xl italic leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Apna next trip plan karo India mein! Bata preferences aur hum banayenge personalized itinerary for you.
                </p>

                {/* 🎤 VOICE TO TRIP BUTTON */}
                <Magnetic>
                  <button 
                    type="button" 
                    onClick={startVoiceInput}
                    disabled={isListening || isParsingVoice}
                    className={`shrink-0 flex items-center justify-center gap-3 px-6 py-4 rounded-full border-2 transition-all duration-300 shadow-2xl ${
                      isListening ? 'border-red-500 bg-red-500/20 text-red-500 animate-pulse' : 
                      isParsingVoice ? 'border-primary/50 bg-primary/20 text-primary animate-pulse' : 
                      'border-primary bg-primary/10 text-primary hover:bg-primary hover:text-white shadow-primary-glow'
                    }`}
                  >
                    <span className="text-2xl">{isListening ? '🎙️' : '🎤'}</span>
                    <span className="font-black italic uppercase tracking-wider text-sm">
                      {isListening ? 'Bol Bhai...' : isParsingVoice ? 'AI Samajh Raha Hai...' : 'Voice Se Autofill'}
                    </span>
                  </button>
                </Magnetic>
              </div>
            </div>

            <form action={formAction} className="space-y-12 md:space-y-16 lg:space-y-24">
              {/* PHASE 01 */}
              <div className="space-y-6 md:space-y-12">
                <div className="flex items-center gap-3 md:gap-6">
                  <span className="text-[8px] md:text-[10px] font-black text-primary border border-primary/30 px-3 md:px-4 py-1 rounded-full">STEP 1</span>
                  <h3 className="text-lg md:text-2xl font-black uppercase italic tracking-widest" style={{ color: 'var(--text-primary)' }}>Trip Ki Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                  <PremiumInput label="Trip Ka Name" name="title" placeholder="jaise. Manali Adventure" onChange={handleChange} />
                  <PremiumInput label="Kahan Jaana Hai?" name="location" placeholder="Kaunsa city ya region?" onChange={handleChange} />
                </div>
              </div>

              {/* PHASE 02 */}
              <div className="space-y-6 md:space-y-12">
                <div className="flex items-center gap-3 md:gap-6">
                  <span className="text-[8px] md:text-[10px] font-black text-primary border border-primary/30 px-3 md:px-4 py-1 rounded-full">STEP 2</span>
                  <h3 className="text-lg md:text-2xl font-black uppercase italic tracking-widest" style={{ color: 'var(--text-primary)' }}>Budget & Type</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                  <PremiumInput label="Kitne Log Ja Rahe?" name="participants" type="number" placeholder="Kitne?" onChange={handleChange} />
                  <PremiumInput label="Budget Kitna Hai?" name="budget" type="number" placeholder="₹ (INR)" onChange={handleChange} />
                  <PremiumInput
                    label="Trip Type"
                    name="type"
                    onChange={handleChange}
                    options={['Select Type', 'Adventure Trip', 'Beach Vibe', 'Historic Ghumo', 'Luxury Trip', 'Scenic Beauty', 'Pilgrimage', 'Food Tour']}
                  />
                </div>
              </div>

              {/* PHASE 03 */}
              <div className="space-y-6 md:space-y-12">
                <div className="flex items-center gap-3 md:gap-6">
                  <span className="text-[8px] md:text-[10px] font-black text-primary border border-primary/30 px-3 md:px-4 py-1 rounded-full">STEP 3</span>
                  <h3 className="text-lg md:text-2xl font-black uppercase italic tracking-widest" style={{ color: 'var(--text-primary)' }}>Trip Ki Dates</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                  <PremiumInput label="Kab Start Karu?" name="startDate" type="date" onChange={handleChange} />
                  <PremiumInput label="Kab Khatam?" name="endDate" type="date" onChange={handleChange} />
                  <PremiumInput label="Daily Start Time" name="startTime" type="time" onChange={handleChange} />
                  <PremiumInput label="Daily End Time" name="endTime" type="time" onChange={handleChange} />
                </div>
              </div>

              <div className="pt-6 md:pt-12">
                <Magnetic>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full btn-expensive bg-primary hover:bg-orange-600 border-none text-white text-sm md:text-base py-5 md:py-8 shadow-primary-glow"
                  >
                    {isPending ? translate('Loading') : translate('Create')}
                  </button>
                </Magnetic>
              </div>
            </form>
          </div>

          {/* --- RIGHT: LIVE BLUEPRINT --- */}
          <aside className="xl:sticky xl:top-32 lg:top-48 w-full xl:w-[500px] order-1 xl:order-2">
            <motion.div
              layoutId="blueprint-card"
              className="premium-glass p-6 md:p-10 lg:p-16 rounded-2xl md:rounded-3xl lg:rounded-[3rem] space-y-8 md:space-y-12 lg:space-y-16 border-primary/5 shadow-2xl"
            >
              <div className="flex justify-between items-center pb-6 md:pb-10 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <div className="space-y-1">
                  <span className="text-primary text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">Trip Preview</span>
                  <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Status: Real-time mein update ho raha hai</h4>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 md:w-10 md:h-10 border-2 border-dashed border-primary/40 rounded-full flex items-center justify-center italic font-black text-primary text-[9px] md:text-[10px]"
                >
                  T
                </motion.div>
              </div>

              <div className="space-y-8 md:space-y-12">
                <div className="relative group overflow-hidden rounded-xl md:rounded-2xl h-40 md:h-48 premium-glass border" style={{ borderColor: 'var(--border-color)' }}>
                  <img
                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800"
                    className="w-full h-full object-cover opacity-20 grayscale scale-110 group-hover:scale-100 transition-all duration-[2s]"
                    alt="Preview"
                  />
                  <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-12">
                    <span className="text-primary text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] mb-2">TUMHARA TRIP</span>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-black italic truncate uppercase tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                      {form.title || 'Naam Nahi Diya'}
                    </h3>
                  </div>
                  <div className="absolute top-0 right-0 p-3 md:p-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 md:gap-12">
                  <div className="space-y-1 md:space-y-2">
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Location</span>
                    <p className="text-lg md:text-xl font-black italic" style={{ color: 'var(--text-primary)' }}>{form.location || '--'}</p>
                  </div>
                  <div className="space-y-1 md:space-y-2 text-right">
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Budget</span>
                    <p className="text-lg md:text-xl font-black text-primary italic">₹{form.budget || '0,000'}</p>
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Log Ja Rahe</span>
                    <p className="text-lg md:text-xl font-black italic" style={{ color: 'var(--text-primary)' }}>{form.participants || '0'} Log</p>
                  </div>
                  <div className="space-y-1 md:space-y-2 text-right">
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Type</span>
                    <p className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-widest">{form.type || 'Standard'}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 md:pt-10 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <p className="text-[10px] md:text-[11px] font-medium italic leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  "Hum banayenge detailed day-by-day itinerary tumhare preferences ke according."
                </p>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Planner;
