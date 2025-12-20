import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Check, Facebook, Twitter, Mail, MessageCircle, Link2 } from 'lucide-react';

const SocialShare = ({ itinerary, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl] = useState(window.location.href);

  // Generate shareable content
  const shareTitle = `Check out my ${itinerary?.location} trip!`;
  const shareText = `I'm planning an amazing ${calculateDays(itinerary?.startDate, itinerary?.endDate)}-day trip to ${itinerary?.location}! 🌍✈️`;
  const shareHashtags = ['Travelly', 'TravelPlanning', itinerary?.location?.replace(/\s+/g, '')];

  const calculateDays = (start, end) => {
    if (!start || !end) return 5;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const shareOptions = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank', 'width=600,height=400');
      }
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      action: () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=${shareHashtags.join(',')}`;
        window.open(url, '_blank', 'width=600,height=400');
      }
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-600 hover:bg-green-700',
      action: () => {
        const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        window.open(url, '_blank');
      }
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700',
      action: () => {
        const subject = encodeURIComponent(shareTitle);
        const body = encodeURIComponent(`${shareText}\n\nView my itinerary: ${shareUrl}\n\nPlanned with Travelly - AI Travel Planner`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
      }
    },
    {
      name: 'Copy Link',
      icon: copied ? Check : Link2,
      color: copied ? 'bg-green-600' : 'bg-primary hover:bg-primary/80',
      action: copyToClipboard
    }
  ];

  // Native share API (for mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="premium-glass max-w-2xl w-full rounded-3xl border border-white/10 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-orange-500 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  Share Your Trip
                </h2>
                <p className="text-sm text-white/80 mt-1">
                  Let others know about your adventure!
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

          {/* Content */}
          <div className="p-6">
            {/* Trip Preview */}
            <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-orange-500/10 border border-primary/20">
              <h3 className="text-xl font-black text-white mb-2">
                {itinerary?.title || 'My Trip'}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/60">Destination</p>
                  <p className="text-white font-bold">{itinerary?.location}</p>
                </div>
                <div>
                  <p className="text-white/60">Duration</p>
                  <p className="text-white font-bold">
                    {calculateDays(itinerary?.startDate, itinerary?.endDate)} days
                  </p>
                </div>
                <div>
                  <p className="text-white/60">Budget</p>
                  <p className="text-white font-bold">${itinerary?.budget}</p>
                </div>
                <div>
                  <p className="text-white/60">Type</p>
                  <p className="text-white font-bold">{itinerary?.type}</p>
                </div>
              </div>
            </div>

            {/* Native Share (Mobile) */}
            {navigator.share && (
              <button
                onClick={handleNativeShare}
                className="w-full mb-4 p-4 rounded-xl bg-primary hover:bg-primary/80 text-white font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-3"
              >
                <Share2 className="w-5 h-5" />
                Share via...
              </button>
            )}

            {/* Share Options */}
            <div className="space-y-3 mb-6">
              <p className="text-xs text-white/60 uppercase tracking-wider">Share On</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {shareOptions.map((option, index) => (
                  <motion.button
                    key={option.name}
                    onClick={option.action}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-xl ${option.color} text-white font-bold transition-all flex flex-col items-center gap-2`}
                  >
                    <option.icon className="w-6 h-6" />
                    <span className="text-sm">{option.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Share Link */}
            <div className="space-y-3">
              <p className="text-xs text-white/60 uppercase tracking-wider">Share Link</p>
              <div className="flex gap-3">
                <div className="flex-1 p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-white/80 truncate">{shareUrl}</p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className={`px-6 py-4 rounded-xl font-bold transition-all flex items-center gap-2 ${copied
                      ? 'bg-green-600 text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Social Preview */}
            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-white/60 mb-3">Preview</p>
              <div className="space-y-2">
                <p className="text-white font-bold">{shareTitle}</p>
                <p className="text-sm text-white/80">{shareText}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {shareHashtags.map(tag => (
                    <span key={tag} className="text-xs text-primary">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-xs text-blue-400 font-bold mb-2">💡 Sharing Tips</p>
              <ul className="text-xs text-white/60 space-y-1">
                <li>• Share on social media to inspire others</li>
                <li>• Send to travel companions for collaboration</li>
                <li>• Save the link for easy access later</li>
                <li>• Tag @Travelly to be featured!</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-slate-900/50 border-t border-white/10">
            <button
              onClick={onClose}
              className="w-full py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SocialShare;
