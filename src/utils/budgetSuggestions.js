// Budget suggestions based on destination
export const budgetData = {
  // Europe - Expensive
  'Switzerland': { min: 2500, recommended: 4000, max: 8000, currency: 'USD', perDay: 400 },
  'Norway': { min: 2000, recommended: 3500, max: 7000, currency: 'USD', perDay: 350 },
  'Iceland': { min: 2200, recommended: 3800, max: 7500, currency: 'USD', perDay: 380 },
  'Denmark': { min: 1800, recommended: 3000, max: 6000, currency: 'USD', perDay: 300 },
  'Sweden': { min: 1700, recommended: 2800, max: 5500, currency: 'USD', perDay: 280 },

  // Europe - Moderate
  'France': { min: 1500, recommended: 2500, max: 5000, currency: 'USD', perDay: 250 },
  'Italy': { min: 1400, recommended: 2300, max: 4500, currency: 'USD', perDay: 230 },
  'Spain': { min: 1200, recommended: 2000, max: 4000, currency: 'USD', perDay: 200 },
  'Germany': { min: 1400, recommended: 2400, max: 4800, currency: 'USD', perDay: 240 },
  'Austria': { min: 1500, recommended: 2500, max: 5000, currency: 'USD', perDay: 250 },
  'Netherlands': { min: 1600, recommended: 2600, max: 5200, currency: 'USD', perDay: 260 },
  'Belgium': { min: 1400, recommended: 2300, max: 4600, currency: 'USD', perDay: 230 },
  'Greece': { min: 1000, recommended: 1800, max: 3500, currency: 'USD', perDay: 180 },
  'Portugal': { min: 1000, recommended: 1700, max: 3400, currency: 'USD', perDay: 170 },

  // Europe - Budget
  'Poland': { min: 800, recommended: 1400, max: 2800, currency: 'USD', perDay: 140 },
  'Czech Republic': { min: 900, recommended: 1500, max: 3000, currency: 'USD', perDay: 150 },
  'Hungary': { min: 800, recommended: 1300, max: 2600, currency: 'USD', perDay: 130 },
  'Croatia': { min: 1000, recommended: 1700, max: 3400, currency: 'USD', perDay: 170 },

  // Asia - Expensive
  'Japan': { min: 1800, recommended: 3000, max: 6000, currency: 'USD', perDay: 300 },
  'Singapore': { min: 1600, recommended: 2700, max: 5400, currency: 'USD', perDay: 270 },
  'South Korea': { min: 1400, recommended: 2400, max: 4800, currency: 'USD', perDay: 240 },
  'Hong Kong': { min: 1500, recommended: 2500, max: 5000, currency: 'USD', perDay: 250 },

  // Asia - Moderate
  'China': { min: 1200, recommended: 2000, max: 4000, currency: 'USD', perDay: 200 },
  'Malaysia': { min: 900, recommended: 1500, max: 3000, currency: 'USD', perDay: 150 },
  'Indonesia': { min: 800, recommended: 1400, max: 2800, currency: 'USD', perDay: 140 },
  'Bali': { min: 800, recommended: 1400, max: 2800, currency: 'USD', perDay: 140 },

  // Asia - Budget
  'Thailand': { min: 700, recommended: 1200, max: 2400, currency: 'USD', perDay: 120 },
  'Vietnam': { min: 600, recommended: 1000, max: 2000, currency: 'USD', perDay: 100 },
  'Cambodia': { min: 600, recommended: 1000, max: 2000, currency: 'USD', perDay: 100 },
  'India': { min: 500, recommended: 900, max: 1800, currency: 'USD', perDay: 90 },
  'Nepal': { min: 500, recommended: 900, max: 1800, currency: 'USD', perDay: 90 },
  'Sri Lanka': { min: 600, recommended: 1100, max: 2200, currency: 'USD', perDay: 110 },

  // Americas - Expensive
  'United States': { min: 1800, recommended: 3000, max: 6000, currency: 'USD', perDay: 300 },
  'Canada': { min: 1700, recommended: 2800, max: 5600, currency: 'USD', perDay: 280 },

  // Americas - Moderate
  'Mexico': { min: 1000, recommended: 1700, max: 3400, currency: 'USD', perDay: 170 },
  'Costa Rica': { min: 1200, recommended: 2000, max: 4000, currency: 'USD', perDay: 200 },
  'Chile': { min: 1100, recommended: 1900, max: 3800, currency: 'USD', perDay: 190 },
  'Argentina': { min: 1000, recommended: 1700, max: 3400, currency: 'USD', perDay: 170 },
  'Brazil': { min: 1100, recommended: 1900, max: 3800, currency: 'USD', perDay: 190 },

  // Americas - Budget
  'Peru': { min: 800, recommended: 1400, max: 2800, currency: 'USD', perDay: 140 },
  'Colombia': { min: 800, recommended: 1400, max: 2800, currency: 'USD', perDay: 140 },
  'Ecuador': { min: 700, recommended: 1200, max: 2400, currency: 'USD', perDay: 120 },
  'Bolivia': { min: 600, recommended: 1000, max: 2000, currency: 'USD', perDay: 100 },

  // Oceania
  'Australia': { min: 2000, recommended: 3500, max: 7000, currency: 'USD', perDay: 350 },
  'New Zealand': { min: 1900, recommended: 3200, max: 6400, currency: 'USD', perDay: 320 },
  'Fiji': { min: 1200, recommended: 2000, max: 4000, currency: 'USD', perDay: 200 },

  // Middle East
  'UAE': { min: 1800, recommended: 3000, max: 6000, currency: 'USD', perDay: 300 },
  'Dubai': { min: 1800, recommended: 3000, max: 6000, currency: 'USD', perDay: 300 },
  'Turkey': { min: 1000, recommended: 1700, max: 3400, currency: 'USD', perDay: 170 },
  'Jordan': { min: 1200, recommended: 2000, max: 4000, currency: 'USD', perDay: 200 },

  // Africa
  'South Africa': { min: 1200, recommended: 2000, max: 4000, currency: 'USD', perDay: 200 },
  'Morocco': { min: 900, recommended: 1500, max: 3000, currency: 'USD', perDay: 150 },
  'Egypt': { min: 800, recommended: 1400, max: 2800, currency: 'USD', perDay: 140 },
  'Kenya': { min: 1300, recommended: 2200, max: 4400, currency: 'USD', perDay: 220 },
  'Tanzania': { min: 1400, recommended: 2400, max: 4800, currency: 'USD', perDay: 240 },
};

export const getBudgetSuggestion = (location, days = 5) => {
  // Try exact match first
  let suggestion = budgetData[location];

  // If no exact match, try partial match
  if (!suggestion) {
    const locationLower = location.toLowerCase();
    const matchedKey = Object.keys(budgetData).find(key =>
      locationLower.includes(key.toLowerCase()) || key.toLowerCase().includes(locationLower)
    );
    suggestion = matchedKey ? budgetData[matchedKey] : null;
  }

  // Default suggestion if no match
  if (!suggestion) {
    suggestion = {
      min: 1000,
      recommended: 2000,
      max: 4000,
      currency: 'USD',
      perDay: 200
    };
  }

  // Calculate for number of days
  return {
    ...suggestion,
    minForDays: suggestion.min * (days / 5),
    recommendedForDays: suggestion.recommended * (days / 5),
    maxForDays: suggestion.max * (days / 5),
  };
};

export const getBudgetTier = (budget, location) => {
  const suggestion = getBudgetSuggestion(location);

  if (budget < suggestion.min) return { tier: 'Budget', color: 'text-yellow-400', icon: '💰' };
  if (budget < suggestion.recommended) return { tier: 'Moderate', color: 'text-green-400', icon: '💵' };
  if (budget < suggestion.max) return { tier: 'Comfortable', color: 'text-blue-400', icon: '💎' };
  return { tier: 'Luxury', color: 'text-purple-400', icon: '👑' };
};
