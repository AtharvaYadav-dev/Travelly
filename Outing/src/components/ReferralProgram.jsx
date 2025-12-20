import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Gift, Users, Trophy, Copy, Check } from 'lucide-react';

const ReferralProgram = ({ userId, onClose }) => {
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState([]);
  const [credits, setCredits] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadReferralData();
  }, [userId]);

  const loadReferralData = () => {
    // Generate unique referral code
    const code = `TRAVEL${userId?.slice(0, 6).toUpperCase() || 'GUEST'}`;
    setReferralCode(code);

    // Load referral data
    const saved = localStorage.getItem(`referrals_${userId || 'guest'}`);
    if (saved) {
      const data = JSON.parse(saved);
      setReferrals(data.referrals || []);
      setCredits(data.credits || 0);
    }
  };

  const copyReferralLink = () => {
    const link = `https://travelly.com/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = 'Join me on Travelly!';
    const body = `Hey! I've been using Travelly to plan amazing trips. Use my referral code ${referralCode} to get started and we both get rewards!\n\nhttps://travelly.com/signup?ref=${referralCode}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const leaderboard = [
    { name: 'Sarah J.', referrals: 45, rank: 1 },
    { name: 'Mike C.', referrals: 38, rank: 2 },
    { name: 'Emma D.', referrals: 32, rank: 3 },
    { name: 'You', referrals: referrals.length, rank: referrals.length > 0 ? 15 : '-' },
  ];

  const rewards = [
    { threshold: 1, reward: '$10 Credit', unlocked: referrals.length >= 1 },
    { threshold: 5, reward: 'Premium Template', unlocked: referrals.length >= 5 },
    { threshold: 10, reward: '$50 Credit', unlocked: referrals.length >= 10 },
    { threshold: 25, reward: 'VIP Support', unlocked: referrals.length >= 25 },
    { threshold: 50, reward: 'Lifetime Premium', unlocked: referrals.length >= 50 },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="premium-glass max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-3xl border border-white/10"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Gift className="w-8 h-8 text-white" />
              <div>
                <h2 className="text-2xl font-black text-white">🎁 Referral Program</h2>
                <p className="text-white/80 text-sm">Invite friends, earn rewards!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="premium-glass p-6 rounded-2xl border border-white/10 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-black text-white">{referrals.length}</p>
              <p className="text-sm text-white/60">Referrals</p>
            </div>
            <div className="premium-glass p-6 rounded-2xl border border-white/10 text-center">
              <Gift className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-3xl font-black text-white">${credits}</p>
              <p className="text-sm text-white/60">Credits Earned</p>
            </div>
            <div className="premium-glass p-6 rounded-2xl border border-white/10 text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-3xl font-black text-white">#{leaderboard.find(l => l.name === 'You')?.rank || '-'}</p>
              <p className="text-sm text-white/60">Rank</p>
            </div>
          </div>

          {/* Referral Code */}
          <div className="premium-glass p-6 rounded-2xl border border-white/10 mb-8">
            <h3 className="text-white font-bold mb-4">Your Referral Code</h3>
            <div className="flex gap-3">
              <div className="flex-1 bg-white/10 border border-white/20 rounded-lg px-6 py-4 text-center">
                <p className="text-3xl font-black text-primary tracking-wider">{referralCode}</p>
              </div>
              <button
                onClick={copyReferralLink}
                className="px-6 py-4 rounded-lg bg-primary hover:bg-primary/80 text-white font-bold flex items-center gap-2 transition-all"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
            <button
              onClick={shareViaEmail}
              className="w-full mt-3 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
            >
              📧 Share via Email
            </button>
          </div>

          {/* Rewards */}
          <div className="mb-8">
            <h3 className="text-white font-bold mb-4">Unlock Rewards</h3>
            <div className="space-y-3">
              {rewards.map((reward, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border transition-all ${reward.unlocked
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-white/5 border-white/10'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${reward.unlocked ? 'bg-green-500/20' : 'bg-white/10'
                        }`}>
                        {reward.unlocked ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <span className="text-white/60 font-bold">{reward.threshold}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-bold">{reward.reward}</p>
                        <p className="text-white/60 text-sm">{reward.threshold} referrals</p>
                      </div>
                    </div>
                    {reward.unlocked && (
                      <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                        Unlocked!
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <h3 className="text-white font-bold mb-4">🏆 Leaderboard</h3>
            <div className="space-y-2">
              {leaderboard.map((user, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border transition-all ${user.name === 'You'
                      ? 'bg-primary/10 border-primary/30'
                      : 'bg-white/5 border-white/10'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black text-white/40">#{user.rank}</span>
                      <span className="text-white font-bold">{user.name}</span>
                    </div>
                    <span className="text-primary font-bold">{user.referrals} referrals</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReferralProgram;
