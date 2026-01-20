import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Check } from 'lucide-react';

const PackingListModal = ({ isOpen, onClose, itineraryData }) => {
  const [packingList, setPackingList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  const generatePackingList = async () => {
    setLoading(true);

    const prompt = `Generate a comprehensive and detailed packing list for a trip with these details:
    
**Trip Information:**
- Destination: ${itineraryData?.location}
- Duration: ${calculateDays(itineraryData?.startDate, itineraryData?.endDate)} days
- Trip Type: ${itineraryData?.type}
- Travelers: ${itineraryData?.participants} people
- Dates: ${itineraryData?.startDate} to ${itineraryData?.endDate}
- Budget: ₹${itineraryData?.budget}

**Instructions:**
Create a highly detailed categorized packing list with these categories:
1. Clothing (with specific quantities and weather-appropriate items)
2. Toiletries & Personal Care (travel-sized essentials)
3. Electronics & Gadgets (with chargers and accessories)
4. Documents & Money (including digital and physical copies)
5. Health & Safety (first aid, medications, emergency items)
6. Activity-Specific Gear (based on trip type)
7. Indian Essentials (local context items)
8. Food & Snacks (travel-friendly options)
9. Miscellaneous (often forgotten items)

For each category, list 8-12 specific items with brief descriptions and quantities where relevant.
Consider weather, local culture, and practical needs for ${itineraryData?.location}.
Include Indian context like power adapters, local SIM cards, etc.

Format as:
Category Name
- Item with specific details (quantity/purpose)
- Another item with description
...`;

    try {
      const key = import.meta.env.VITE_GROQ_API_KEY;
      if (!key) throw new Error('Groq API Key not configured');

      const response = await fetch(
        `https://api.groq.com/openai/v1/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 3072,
          }),
        }
      );

      const result = await response.json();
      const text = result?.choices?.[0]?.message?.content;

      if (!text) throw new Error('No response from AI');

      // Parse the response into categories
      const parsed = parsePackingList(text);
      setPackingList(parsed);
    } catch (error) {
      console.error('Packing list generation error:', error);
      // Fallback packing list
      setPackingList(getFallbackPackingList(itineraryData));
    } finally {
      setLoading(false);
    }
  };

  const parsePackingList = (text) => {
    const categories = {};
    const lines = text.split('\n').filter(line => line.trim());
    let currentCategory = null;

    lines.forEach(line => {
      const trimmed = line.trim();
      // Check if it's a category header
      if (trimmed && !trimmed.startsWith('-') && !trimmed.startsWith('•') && !trimmed.match(/^\d+\./)) {
        currentCategory = trimmed.replace(/[*#]/g, '').replace(/^\d+\.\s*/, '').trim();
        if (currentCategory && !categories[currentCategory]) {
          categories[currentCategory] = [];
        }
      } else if (currentCategory && (trimmed.startsWith('-') || trimmed.startsWith('•'))) {
        const item = trimmed.replace(/^[-•]\s*/, '').trim();
        if (item) {
          categories[currentCategory].push(item);
        }
      }
    });

    return categories;
  };

  const getFallbackPackingList = (data) => {
    return {
      'Clothing': [
        'Comfortable walking shoes',
        'Weather-appropriate outerwear',
        'Casual day outfits',
        'Evening wear',
        'Underwear and socks',
        'Sleepwear',
        'Hat and sunglasses'
      ],
      'Toiletries & Personal Care': [
        'Toothbrush and toothpaste',
        'Shampoo and conditioner',
        'Body wash/soap',
        'Deodorant',
        'Sunscreen (SPF 30+)',
        'Moisturizer',
        'Personal medications'
      ],
      'Electronics & Gadgets': [
        'Smartphone and charger',
        'Camera and memory cards',
        'Power bank',
        'Universal travel adapter',
        'Headphones',
        'E-reader or tablet'
      ],
      'Documents & Money': [
        'Passport and visa',
        'Travel insurance documents',
        'Booking confirmations',
        'Credit/debit cards',
        'Local currency',
        'Emergency contact list'
      ],
      'Health & Safety': [
        'First aid kit',
        'Hand sanitizer',
        'Face masks',
        'Insect repellent',
        'Motion sickness medication',
        'Prescription medications'
      ],
      'Miscellaneous': [
        'Reusable water bottle',
        'Daypack/backpack',
        'Travel pillow',
        'Snacks',
        'Guidebook or maps',
        'Plastic bags for laundry'
      ]
    };
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return 5;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  };

  const toggleItem = (category, item) => {
    const key = `${category}-${item}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getProgress = () => {
    if (!packingList) return 0;
    const total = Object.values(packingList).flat().length;
    const checked = Object.keys(checkedItems).filter(k => checkedItems[k]).length;
    return Math.round((checked / total) * 100);
  };

  React.useEffect(() => {
    if (isOpen && !packingList && !loading) {
      generatePackingList();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="premium-glass max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-3xl border border-white/10"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                  🎒 Packing List
                </h2>
                <p className="text-sm text-white/60 mt-1">
                  AI-generated for {itineraryData?.location}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {packingList && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Progress</span>
                  <span className="text-primary font-bold">{getProgress()}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgress()}%` }}
                    className="bg-primary h-2 rounded-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-6 max-h-[calc(90vh-200px)]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-white/60">Generating your packing list...</p>
              </div>
            ) : packingList ? (
              <div className="space-y-8">
                {Object.entries(packingList).map(([category, items]) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                      <span className="w-1 h-6 bg-primary rounded-full" />
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {items.map((item, idx) => {
                        const key = `${category}-${item}`;
                        const isChecked = checkedItems[key];

                        return (
                          <motion.button
                            key={idx}
                            onClick={() => toggleItem(category, item)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${isChecked
                                ? 'bg-primary/20 border-primary/50'
                                : 'bg-white/5 border-white/10 hover:border-white/20'
                              }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isChecked
                                  ? 'bg-primary border-primary'
                                  : 'border-white/30'
                                }`}
                            >
                              {isChecked && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span
                              className={`text-sm font-medium transition-all ${isChecked
                                  ? 'text-white line-through'
                                  : 'text-white/80'
                                }`}
                            >
                              {item}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 p-6">
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setPackingList(null);
                  setCheckedItems({});
                  generatePackingList();
                }}
                disabled={loading}
                className="btn-premium flex-1"
              >
                {loading ? 'Generating...' : '🔄 Regenerate List'}
              </button>
              <button
                onClick={onClose}
                className="px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PackingListModal;
