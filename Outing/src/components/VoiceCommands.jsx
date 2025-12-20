import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VoiceCommands = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [supported, setSupported] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);

        if (event.results[current].isFinal) {
          handleVoiceCommand(transcriptText);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
      setSupported(true);
    } else {
      setSupported(false);
    }
  }, []);

  const startListening = () => {
    if (recognition && !isListening) {
      setTranscript('');
      recognition.start();
      setIsListening(true);
      speak('Listening...');
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();

    // Navigation commands
    if (lowerCommand.includes('create trip') || lowerCommand.includes('new trip') || lowerCommand.includes('plan trip')) {
      navigate('/planner');
      speak('Opening trip planner');
    }
    else if (lowerCommand.includes('show itinerary') || lowerCommand.includes('view itinerary')) {
      navigate('/result');
      speak('Showing your itinerary');
    }
    else if (lowerCommand.includes('saved trips') || lowerCommand.includes('my trips')) {
      navigate('/saved');
      speak('Showing saved trips');
    }
    else if (lowerCommand.includes('go home') || lowerCommand.includes('home page')) {
      navigate('/');
      speak('Going home');
    }

    // Feature commands
    else if (lowerCommand.includes('show weather') || lowerCommand.includes('check weather')) {
      onCommand?.('show_weather');
      speak('Showing weather information');
    }
    else if (lowerCommand.includes('show map') || lowerCommand.includes('open map')) {
      onCommand?.('show_map');
      speak('Opening map');
    }
    else if (lowerCommand.includes('currency') || lowerCommand.includes('convert currency')) {
      onCommand?.('show_currency');
      speak('Opening currency converter');
    }
    else if (lowerCommand.includes('budget') || lowerCommand.includes('track budget')) {
      onCommand?.('show_budget');
      speak('Opening budget tracker');
    }
    else if (lowerCommand.includes('packing list') || lowerCommand.includes('what to pack')) {
      onCommand?.('show_packing');
      speak('Generating packing list');
    }
    else if (lowerCommand.includes('ai assistant') || lowerCommand.includes('chat')) {
      onCommand?.('show_chat');
      speak('Opening AI assistant');
    }
    else if (lowerCommand.includes('share') || lowerCommand.includes('share trip')) {
      onCommand?.('show_share');
      speak('Opening share options');
    }
    else if (lowerCommand.includes('achievements') || lowerCommand.includes('my achievements')) {
      onCommand?.('show_achievements');
      speak('Showing your achievements');
    }

    // Export commands
    else if (lowerCommand.includes('download pdf') || lowerCommand.includes('export pdf')) {
      onCommand?.('export_pdf');
      speak('Downloading PDF');
    }
    else if (lowerCommand.includes('email') || lowerCommand.includes('send email')) {
      onCommand?.('send_email');
      speak('Opening email');
    }

    // Help command
    else if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
      speak('You can say: create trip, show weather, open map, check budget, packing list, AI chat, share trip, or show achievements');
    }

    // Unknown command
    else {
      speak('Sorry, I didn\'t understand that command. Say "help" for available commands.');
    }

    setTranscript('');
  };

  if (!supported) {
    return null; // Don't show if not supported
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 right-0 premium-glass p-4 rounded-2xl border border-primary/50 min-w-[200px]"
          >
            <p className="text-xs text-white/60 uppercase tracking-wider mb-2">
              Listening...
            </p>
            <p className="text-sm text-white font-medium">
              {transcript || 'Say a command...'}
            </p>
            <div className="mt-3 flex gap-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 h-4 bg-primary rounded-full"
                  animate={{
                    scaleY: [1, 2, 1],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={isListening ? stopListening : startListening}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${isListening
            ? 'bg-red-600 hover:bg-red-700 animate-pulse'
            : 'bg-gradient-to-br from-primary to-orange-500 hover:shadow-primary-glow'
          }`}
      >
        {isListening ? (
          <MicOff className="w-7 h-7 text-white" />
        ) : (
          <Mic className="w-7 h-7 text-white" />
        )}
      </motion.button>

      {/* Hint on first render */}
      {!isListening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-20 right-0 bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none"
        >
          🎤 Click to use voice commands
        </motion.div>
      )}
    </div>
  );
};

export default VoiceCommands;
