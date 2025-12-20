import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const CurrencyConverter = ({ amount = 1000, baseCurrency = 'USD' }) => {
  const [rates, setRates] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const popularCurrencies = [
    { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥' },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', symbol: 'Fr' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', symbol: 'A$' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹' },
    { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬', symbol: 'S$' },
    { code: 'THB', name: 'Thai Baht', flag: '🇹🇭', symbol: '฿' },
    { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽', symbol: '$' },
    { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷', symbol: 'R$' }
  ];

  useEffect(() => {
    fetchExchangeRates();
  }, [baseCurrency]);

  const fetchExchangeRates = async () => {
    try {
      setLoading(true);

      // Using exchangerate-api.com (free tier: 1,500 requests/month)
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
      );

      setRates(response.data.rates);
      setLastUpdated(new Date(response.data.time_last_updated));
      setLoading(false);
    } catch (error) {
      console.error('Currency fetch error:', error);
      // Fallback to mock rates if API fails
      setRates(getMockRates());
      setLoading(false);
    }
  };

  const getMockRates = () => ({
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.50,
    CHF: 0.88,
    CAD: 1.36,
    AUD: 1.53,
    CNY: 7.24,
    INR: 83.12,
    SGD: 1.34,
    THB: 35.42,
    MXN: 17.08,
    BRL: 4.97
  });

  const convert = (amount, toCurrency) => {
    if (!rates[toCurrency]) return 0;
    return (amount * rates[toCurrency]).toFixed(2);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-glass p-6 rounded-2xl border border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">
            💱 Currency Converter
          </h3>
          <p className="text-xs text-white/40 mt-1">
            {lastUpdated ? `Updated: ${lastUpdated.toLocaleTimeString()}` : 'Real-time rates'}
          </p>
        </div>
        <button
          onClick={fetchExchangeRates}
          disabled={loading}
          className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-all"
        >
          {loading ? '⏳' : '🔄'} Refresh
        </button>
      </div>

      {/* Base Amount */}
      <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
        <p className="text-xs text-white/60 uppercase tracking-wider mb-2">Your Budget</p>
        <p className="text-4xl font-black text-white">
          ${formatNumber(amount)} <span className="text-xl text-white/60">{baseCurrency}</span>
        </p>
      </div>

      {/* Quick Convert Buttons */}
      <div className="mb-6">
        <p className="text-xs text-white/60 uppercase tracking-wider mb-3">Quick Convert</p>
        <div className="grid grid-cols-3 gap-2">
          {popularCurrencies.slice(0, 6).map(currency => (
            <button
              key={currency.code}
              onClick={() => setSelectedCurrency(currency.code)}
              className={`p-3 rounded-xl border transition-all ${selectedCurrency === currency.code
                  ? 'bg-primary/20 border-primary/50'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
            >
              <span className="text-2xl block mb-1">{currency.flag}</span>
              <span className="text-xs font-bold text-white block">{currency.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Converted Amount */}
      {!loading && rates[selectedCurrency] && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-6 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 mb-6"
        >
          <p className="text-xs text-white/60 uppercase tracking-wider mb-2">
            Converted to {popularCurrencies.find(c => c.code === selectedCurrency)?.name}
          </p>
          <p className="text-5xl font-black text-white">
            {popularCurrencies.find(c => c.code === selectedCurrency)?.symbol}
            {formatNumber(convert(amount, selectedCurrency))}
          </p>
          <p className="text-sm text-white/60 mt-2">
            1 {baseCurrency} = {rates[selectedCurrency]?.toFixed(4)} {selectedCurrency}
          </p>
        </motion.div>
      )}

      {/* All Currencies List */}
      <div>
        <p className="text-xs text-white/60 uppercase tracking-wider mb-3">All Currencies</p>
        <div className="max-h-64 overflow-y-auto space-y-2 custom-scrollbar">
          {popularCurrencies.map(currency => {
            const converted = convert(amount, currency.code);
            return (
              <button
                key={currency.code}
                onClick={() => setSelectedCurrency(currency.code)}
                className={`w-full p-3 rounded-xl border transition-all flex items-center justify-between ${selectedCurrency === currency.code
                    ? 'bg-primary/20 border-primary/50'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{currency.flag}</span>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">{currency.code}</p>
                    <p className="text-xs text-white/60">{currency.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-white">
                    {currency.symbol}{formatNumber(converted)}
                  </p>
                  <p className="text-xs text-white/40">
                    1 = {rates[currency.code]?.toFixed(4)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Exchange Rate Info */}
      <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
        <p className="text-xs text-white/60 text-center">
          💡 Rates are indicative and may vary at banks and exchange offices
        </p>
      </div>
    </motion.div>
  );
};

export default CurrencyConverter;
