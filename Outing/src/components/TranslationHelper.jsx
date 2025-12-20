import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, Copy, Check, Globe } from 'lucide-react';

const TranslationHelper = ({ destination, onClose }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [customPhrase, setCustomPhrase] = useState('');
  const [customTranslation, setCustomTranslation] = useState('');
  const [translating, setTranslating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Common travel phrases
  const commonPhrases = [
    { english: 'Hello', category: 'greetings' },
    { english: 'Good morning', category: 'greetings' },
    { english: 'Good evening', category: 'greetings' },
    { english: 'Goodbye', category: 'greetings' },
    { english: 'Thank you', category: 'courtesy' },
    { english: 'Please', category: 'courtesy' },
    { english: 'Excuse me', category: 'courtesy' },
    { english: 'Sorry', category: 'courtesy' },
    { english: 'Yes', category: 'basic' },
    { english: 'No', category: 'basic' },
    { english: 'Help!', category: 'emergency' },
    { english: 'Where is the bathroom?', category: 'questions' },
    { english: 'How much does this cost?', category: 'questions' },
    { english: 'I don\'t understand', category: 'basic' },
    { english: 'Do you speak English?', category: 'questions' },
    { english: 'Water', category: 'food' },
    { english: 'Food', category: 'food' },
    { english: 'Restaurant', category: 'food' },
    { english: 'Hotel', category: 'travel' },
    { english: 'Airport', category: 'travel' },
    { english: 'Train station', category: 'travel' },
    { english: 'Taxi', category: 'travel' },
    { english: 'How do I get to...?', category: 'questions' },
    { english: 'I need a doctor', category: 'emergency' },
    { english: 'Call the police', category: 'emergency' }
  ];

  // Language database with common translations
  const languages = {
    'French': {
      code: 'fr',
      flag: '🇫🇷',
      phrases: {
        'Hello': 'Bonjour',
        'Good morning': 'Bonjour',
        'Good evening': 'Bonsoir',
        'Goodbye': 'Au revoir',
        'Thank you': 'Merci',
        'Please': 'S\'il vous plaît',
        'Excuse me': 'Excusez-moi',
        'Sorry': 'Désolé',
        'Yes': 'Oui',
        'No': 'Non',
        'Help!': 'Au secours!',
        'Where is the bathroom?': 'Où sont les toilettes?',
        'How much does this cost?': 'Combien ça coûte?',
        'I don\'t understand': 'Je ne comprends pas',
        'Do you speak English?': 'Parlez-vous anglais?',
        'Water': 'Eau',
        'Food': 'Nourriture',
        'Restaurant': 'Restaurant',
        'Hotel': 'Hôtel',
        'Airport': 'Aéroport',
        'Train station': 'Gare',
        'Taxi': 'Taxi',
        'How do I get to...?': 'Comment aller à...?',
        'I need a doctor': 'J\'ai besoin d\'un médecin',
        'Call the police': 'Appelez la police'
      }
    },
    'Spanish': {
      code: 'es',
      flag: '🇪🇸',
      phrases: {
        'Hello': 'Hola',
        'Good morning': 'Buenos días',
        'Good evening': 'Buenas tardes',
        'Goodbye': 'Adiós',
        'Thank you': 'Gracias',
        'Please': 'Por favor',
        'Excuse me': 'Disculpe',
        'Sorry': 'Lo siento',
        'Yes': 'Sí',
        'No': 'No',
        'Help!': '¡Ayuda!',
        'Where is the bathroom?': '¿Dónde está el baño?',
        'How much does this cost?': '¿Cuánto cuesta?',
        'I don\'t understand': 'No entiendo',
        'Do you speak English?': '¿Habla inglés?',
        'Water': 'Agua',
        'Food': 'Comida',
        'Restaurant': 'Restaurante',
        'Hotel': 'Hotel',
        'Airport': 'Aeropuerto',
        'Train station': 'Estación de tren',
        'Taxi': 'Taxi',
        'How do I get to...?': '¿Cómo llego a...?',
        'I need a doctor': 'Necesito un médico',
        'Call the police': 'Llame a la policía'
      }
    },
    'German': {
      code: 'de',
      flag: '🇩🇪',
      phrases: {
        'Hello': 'Hallo',
        'Good morning': 'Guten Morgen',
        'Good evening': 'Guten Abend',
        'Goodbye': 'Auf Wiedersehen',
        'Thank you': 'Danke',
        'Please': 'Bitte',
        'Excuse me': 'Entschuldigung',
        'Sorry': 'Entschuldigung',
        'Yes': 'Ja',
        'No': 'Nein',
        'Help!': 'Hilfe!',
        'Where is the bathroom?': 'Wo ist die Toilette?',
        'How much does this cost?': 'Wie viel kostet das?',
        'I don\'t understand': 'Ich verstehe nicht',
        'Do you speak English?': 'Sprechen Sie Englisch?',
        'Water': 'Wasser',
        'Food': 'Essen',
        'Restaurant': 'Restaurant',
        'Hotel': 'Hotel',
        'Airport': 'Flughafen',
        'Train station': 'Bahnhof',
        'Taxi': 'Taxi',
        'How do I get to...?': 'Wie komme ich zu...?',
        'I need a doctor': 'Ich brauche einen Arzt',
        'Call the police': 'Rufen Sie die Polizei'
      }
    },
    'Italian': {
      code: 'it',
      flag: '🇮🇹',
      phrases: {
        'Hello': 'Ciao',
        'Good morning': 'Buongiorno',
        'Good evening': 'Buonasera',
        'Goodbye': 'Arrivederci',
        'Thank you': 'Grazie',
        'Please': 'Per favore',
        'Excuse me': 'Mi scusi',
        'Sorry': 'Scusa',
        'Yes': 'Sì',
        'No': 'No',
        'Help!': 'Aiuto!',
        'Where is the bathroom?': 'Dov\'è il bagno?',
        'How much does this cost?': 'Quanto costa?',
        'I don\'t understand': 'Non capisco',
        'Do you speak English?': 'Parla inglese?',
        'Water': 'Acqua',
        'Food': 'Cibo',
        'Restaurant': 'Ristorante',
        'Hotel': 'Hotel',
        'Airport': 'Aeroporto',
        'Train station': 'Stazione',
        'Taxi': 'Taxi',
        'How do I get to...?': 'Come arrivo a...?',
        'I need a doctor': 'Ho bisogno di un medico',
        'Call the police': 'Chiama la polizia'
      }
    },
    'Japanese': {
      code: 'ja',
      flag: '🇯🇵',
      phrases: {
        'Hello': 'こんにちは (Konnichiwa)',
        'Good morning': 'おはよう (Ohayou)',
        'Good evening': 'こんばんは (Konbanwa)',
        'Goodbye': 'さようなら (Sayounara)',
        'Thank you': 'ありがとう (Arigatou)',
        'Please': 'お願いします (Onegaishimasu)',
        'Excuse me': 'すみません (Sumimasen)',
        'Sorry': 'ごめんなさい (Gomen nasai)',
        'Yes': 'はい (Hai)',
        'No': 'いいえ (Iie)',
        'Help!': '助けて！(Tasukete!)',
        'Where is the bathroom?': 'トイレはどこですか？(Toire wa doko desu ka?)',
        'How much does this cost?': 'いくらですか？(Ikura desu ka?)',
        'I don\'t understand': '分かりません (Wakarimasen)',
        'Do you speak English?': '英語を話せますか？(Eigo wo hanasemasu ka?)',
        'Water': '水 (Mizu)',
        'Food': '食べ物 (Tabemono)',
        'Restaurant': 'レストラン (Resutoran)',
        'Hotel': 'ホテル (Hoteru)',
        'Airport': '空港 (Kuukou)',
        'Train station': '駅 (Eki)',
        'Taxi': 'タクシー (Takushii)',
        'How do I get to...?': '...へはどう行きますか？(...e wa dou ikimasu ka?)',
        'I need a doctor': '医者が必要です (Isha ga hitsuyou desu)',
        'Call the police': '警察を呼んで (Keisatsu wo yonde)'
      }
    }
  };

  useEffect(() => {
    // Auto-select language based on destination
    const destLower = destination?.toLowerCase() || '';
    if (destLower.includes('france') || destLower.includes('paris')) {
      setSelectedLanguage('French');
    } else if (destLower.includes('spain') || destLower.includes('madrid') || destLower.includes('barcelona')) {
      setSelectedLanguage('Spanish');
    } else if (destLower.includes('germany') || destLower.includes('berlin')) {
      setSelectedLanguage('German');
    } else if (destLower.includes('italy') || destLower.includes('rome')) {
      setSelectedLanguage('Italian');
    } else if (destLower.includes('japan') || destLower.includes('tokyo')) {
      setSelectedLanguage('Japanese');
    } else {
      setSelectedLanguage('French'); // Default
    }
  }, [destination]);

  const getTranslation = (phrase) => {
    return languages[selectedLanguage]?.phrases[phrase] || phrase;
  };

  const speakPhrase = (text, lang) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languages[selectedLanguage]?.code || 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const categories = {
    greetings: { name: 'Greetings', icon: '👋' },
    courtesy: { name: 'Courtesy', icon: '🙏' },
    basic: { name: 'Basic', icon: '💬' },
    questions: { name: 'Questions', icon: '❓' },
    food: { name: 'Food & Drink', icon: '🍽️' },
    travel: { name: 'Travel', icon: '🚗' },
    emergency: { name: 'Emergency', icon: '🚨' }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="premium-glass max-w-5xl w-full max-h-[90vh] overflow-hidden rounded-3xl border border-white/10"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  Translation Helper
                </h2>
                <p className="text-sm text-white/80 mt-1">
                  Essential phrases for {destination}
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
        </div>

        {/* Language Selector */}
        <div className="p-6 border-b border-white/10">
          <p className="text-xs text-white/60 uppercase tracking-wider mb-3">Select Language</p>
          <div className="grid grid-cols-5 gap-3">
            {Object.entries(languages).map(([lang, data]) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`p-4 rounded-xl border transition-all ${selectedLanguage === lang
                    ? 'bg-primary/20 border-primary/50'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
              >
                <span className="text-3xl block mb-2">{data.flag}</span>
                <span className="text-sm font-bold text-white">{lang}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Phrases */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-350px)] custom-scrollbar">
          {Object.entries(categories).map(([catKey, category]) => {
            const categoryPhrases = commonPhrases.filter(p => p.category === catKey);
            if (categoryPhrases.length === 0) return null;

            return (
              <div key={catKey} className="mb-8">
                <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  <span>{category.icon}</span>
                  {category.name}
                </h3>
                <div className="space-y-3">
                  {categoryPhrases.map((phrase, index) => {
                    const translation = getTranslation(phrase.english);
                    const globalIndex = `${catKey}-${index}`;

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="premium-glass p-4 rounded-xl border border-white/10 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="text-white font-medium mb-1">{phrase.english}</p>
                          <p className="text-primary text-lg font-bold">{translation}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => speakPhrase(translation, selectedLanguage)}
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                          >
                            <Volume2 className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={() => copyToClipboard(translation, globalIndex)}
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                          >
                            {copiedIndex === globalIndex ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-white" />
                            )}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-900/50 border-t border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/60">
              💡 Click <Volume2 className="w-3 h-3 inline" /> to hear pronunciation
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-full bg-primary hover:bg-primary/80 text-white font-bold uppercase tracking-wider transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TranslationHelper;
