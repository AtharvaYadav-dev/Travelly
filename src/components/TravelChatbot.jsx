import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, MessageCircle, Sparkles } from 'lucide-react';

const TravelChatbot = ({ itinerary, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 Hi! I'm your AI travel assistant for ${itinerary?.location || 'your trip'}. I can help you with:\n\n• Activity recommendations\n• Local tips & customs\n• Transportation advice\n• Food & dining suggestions\n• Budget optimization\n• Safety information\n\nWhat would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    { icon: '🍽️', text: 'Best local restaurants?', query: 'What are the best local restaurants in ' + itinerary?.location + '?' },
    { icon: '🚇', text: 'How to get around?', query: 'What is the best way to get around ' + itinerary?.location + '?' },
    { icon: '💰', text: 'Save money tips?', query: 'How can I save money while traveling in ' + itinerary?.location + '?' },
    { icon: '⚠️', text: 'Safety tips?', query: 'What safety tips should I know for ' + itinerary?.location + '?' },
    { icon: '🎯', text: 'Hidden gems?', query: 'What are some hidden gems or off-the-beaten-path places in ' + itinerary?.location + '?' },
    { icon: '🌤️', text: 'Best time to visit?', query: 'What is the best time of year to visit ' + itinerary?.location + '?' }
  ];

  const askAI = async (question) => {
    if (!question.trim()) return;

    // Add user message
    const userMessage = {
      role: 'user',
      content: question,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

      if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
        throw new Error('API key not configured');
      }

      // Build context from itinerary
      const context = `You are an expert Indian travel assistant with deep knowledge of ${itinerary?.location}. Here's the complete trip context:

Destination: ${itinerary?.location}
Duration: ${calculateDays(itinerary?.startDate, itinerary?.endDate)} days
Budget: ₹${itinerary?.budget} INR
Travelers: ${itinerary?.participants} people
Trip Type: ${itinerary?.type}
Dates: ${itinerary?.startDate} to ${itinerary?.endDate}

Provide detailed, practical, and insider travel advice. Include:
- Specific recommendations with names of places, restaurants, shops
- Local tips and cultural insights
- Budget-friendly alternatives
- Transportation options and costs
- Safety advice specific to the destination
- Local food recommendations with price ranges
- Hidden gems and offbeat places
- Best times to visit attractions
- Local customs and etiquette

Be friendly, conversational, and use some Hinglish phrases. Give actionable advice with specific details.

User question: ${question}`;

      const response = await fetch(
        `https://api.groq.com/openai/v1/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [{ role: 'user', content: context }],
            temperature: 0.7,
            max_tokens: 2048,
          }),
        }
      );

      const result = await response.json();
      const aiResponse = result.choices[0].message.content;

      if (!aiResponse) {
        throw new Error('No response from AI');
      }

      // Add AI message
      const assistantMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);

      // Fallback response
      const fallbackMessage = {
        role: 'assistant',
        content: `I apologize, but I'm having trouble connecting right now. Here are some general tips for ${itinerary?.location}:\n\n• Research local customs and etiquette\n• Keep emergency numbers handy\n• Try local cuisine\n• Use public transportation when possible\n• Stay hydrated and take breaks\n\nPlease try asking again in a moment!`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      askAI(input);
    }
  };

  const handleQuickQuestion = (query) => {
    askAI(query);
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return 5;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="premium-glass max-w-4xl w-full h-[90vh] flex flex-col rounded-3xl border border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-orange-500 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                AI Travel Assistant
              </h2>
              <p className="text-sm text-white/80 mt-1">
                Ask me anything about your trip to {itinerary?.location}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-white/10 text-white border border-white/10'
                  }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <p className="text-xs opacity-60 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  <p className="text-sm text-white/60">Thinking...</p>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <p className="text-xs text-white/60 uppercase tracking-wider mb-3">Quick Questions</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickQuestion(q.query)}
                  disabled={loading}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all text-left disabled:opacity-50"
                >
                  <span className="text-xl block mb-1">{q.icon}</span>
                  <span className="text-xs text-white font-medium">{q.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-6 bg-slate-900/50 border-t border-white/10">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your trip..."
              disabled={loading}
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-14 h-14 rounded-full bg-primary hover:bg-primary/80 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TravelChatbot;
