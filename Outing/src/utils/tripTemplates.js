export const tripTemplates = {
  'romantic-getaway': {
    id: 'romantic-getaway',
    name: 'Romantic Getaway',
    icon: '💑',
    emoji: '🌹',
    description: 'Perfect for couples seeking romance and relaxation',
    type: 'Luxury Travel',
    suggestedDuration: 5,
    activities: ['Fine dining', 'Spa treatments', 'Sunset views', 'Wine tasting', 'Couples activities'],
    pace: 'Relaxed',
    budgetMultiplier: 1.5,
    recommendations: {
      destinations: ['Paris', 'Venice', 'Santorini', 'Maldives', 'Bali'],
      accommodation: 'Luxury hotels or romantic villas',
      dining: 'Fine dining restaurants',
      activities: 'Couples spa, sunset cruises, private tours'
    },
    packingEssentials: ['Formal wear', 'Swimwear', 'Camera', 'Sunscreen'],
    tips: [
      'Book restaurants in advance',
      'Consider couples spa packages',
      'Plan at least one surprise activity',
      'Bring nice outfits for dinners'
    ]
  },

  'adventure-seeker': {
    id: 'adventure-seeker',
    name: 'Adventure Seeker',
    icon: '🏔️',
    emoji: '🥾',
    description: 'For thrill-seekers and outdoor enthusiasts',
    type: 'Hiking Adventure',
    suggestedDuration: 7,
    activities: ['Hiking', 'Rock climbing', 'Rafting', 'Mountain biking', 'Camping'],
    pace: 'Very Active',
    budgetMultiplier: 1.2,
    recommendations: {
      destinations: ['Swiss Alps', 'New Zealand', 'Iceland', 'Patagonia', 'Nepal'],
      accommodation: 'Mountain lodges or camping',
      dining: 'Local eateries and packed lunches',
      activities: 'Multi-day treks, adventure sports'
    },
    packingEssentials: ['Hiking boots', 'Technical clothing', 'First aid kit', 'Water bottles'],
    tips: [
      'Check weather conditions',
      'Book guides for technical activities',
      'Pack light but essential gear',
      'Get travel insurance with adventure coverage'
    ]
  },

  'family-vacation': {
    id: 'family-vacation',
    name: 'Family Vacation',
    icon: '👨‍👩‍👧‍👦',
    emoji: '🎈',
    description: 'Fun-filled activities for all ages',
    type: 'Family Vacations',
    suggestedDuration: 7,
    activities: ['Theme parks', 'Museums', 'Beach time', 'Kid-friendly tours', 'Family dining'],
    pace: 'Moderate',
    budgetMultiplier: 1.3,
    recommendations: {
      destinations: ['Orlando', 'Tokyo', 'Barcelona', 'Singapore', 'Gold Coast'],
      accommodation: 'Family-friendly hotels or apartments',
      dining: 'Casual restaurants with kids menus',
      activities: 'Theme parks, interactive museums, beaches'
    },
    packingEssentials: ['Snacks', 'Entertainment for kids', 'Sunscreen', 'First aid'],
    tips: [
      'Plan rest time between activities',
      'Book accommodations with family amenities',
      'Bring entertainment for travel time',
      'Have backup plans for bad weather'
    ]
  },

  'cultural-explorer': {
    id: 'cultural-explorer',
    name: 'Cultural Explorer',
    icon: '🏛️',
    emoji: '🎭',
    description: 'Immerse yourself in history and local culture',
    type: 'Historic Discovery',
    suggestedDuration: 6,
    activities: ['Museums', 'Historical sites', 'Local markets', 'Food tours', 'Cultural shows'],
    pace: 'Moderate',
    budgetMultiplier: 1.0,
    recommendations: {
      destinations: ['Rome', 'Kyoto', 'Istanbul', 'Cairo', 'Athens'],
      accommodation: 'Boutique hotels in historic districts',
      dining: 'Local restaurants and street food',
      activities: 'Guided historical tours, cooking classes'
    },
    packingEssentials: ['Comfortable walking shoes', 'Camera', 'Guidebook', 'Modest clothing'],
    tips: [
      'Research cultural customs',
      'Hire local guides for deeper insights',
      'Visit museums early to avoid crowds',
      'Try local cuisine'
    ]
  },

  'beach-relaxation': {
    id: 'beach-relaxation',
    name: 'Beach Relaxation',
    icon: '🏖️',
    emoji: '🌊',
    description: 'Sun, sand, and total relaxation',
    type: 'Beach Escapes',
    suggestedDuration: 7,
    activities: ['Beach lounging', 'Swimming', 'Snorkeling', 'Spa', 'Sunset watching'],
    pace: 'Very Relaxed',
    budgetMultiplier: 1.2,
    recommendations: {
      destinations: ['Maldives', 'Bali', 'Caribbean', 'Seychelles', 'Hawaii'],
      accommodation: 'Beachfront resorts',
      dining: 'Seafood restaurants and resort dining',
      activities: 'Water sports, beach yoga, spa treatments'
    },
    packingEssentials: ['Swimwear', 'Sunscreen', 'Beach towel', 'Sunglasses'],
    tips: [
      'Book beachfront accommodation',
      'Bring reef-safe sunscreen',
      'Plan some water activities',
      'Don\'t over-schedule - relax!'
    ]
  },

  'foodie-tour': {
    id: 'foodie-tour',
    name: 'Foodie Tour',
    icon: '🍽️',
    emoji: '👨‍🍳',
    description: 'Culinary adventures and gastronomic delights',
    type: 'Culinary Tours',
    suggestedDuration: 5,
    activities: ['Food tours', 'Cooking classes', 'Wine tasting', 'Market visits', 'Fine dining'],
    pace: 'Relaxed',
    budgetMultiplier: 1.4,
    recommendations: {
      destinations: ['Tokyo', 'Paris', 'Bangkok', 'Barcelona', 'New York'],
      accommodation: 'Hotels near food districts',
      dining: 'Mix of street food and fine dining',
      activities: 'Cooking classes, food tours, wine tastings'
    },
    packingEssentials: ['Comfortable shoes', 'Loose clothing', 'Camera', 'Antacids'],
    tips: [
      'Book popular restaurants in advance',
      'Try street food',
      'Take cooking classes',
      'Pace yourself - don\'t overeat!'
    ]
  },

  'photography-trip': {
    id: 'photography-trip',
    name: 'Photography Trip',
    icon: '📸',
    emoji: '🌅',
    description: 'Capture stunning landscapes and moments',
    type: 'Scenic Rail',
    suggestedDuration: 8,
    activities: ['Landscape photography', 'Sunrise/sunset shoots', 'Wildlife photography', 'Street photography'],
    pace: 'Moderate',
    budgetMultiplier: 1.1,
    recommendations: {
      destinations: ['Iceland', 'New Zealand', 'Norway', 'Japan', 'Patagonia'],
      accommodation: 'Hotels with great views',
      dining: 'Flexible - focus on timing for golden hour',
      activities: 'Photography tours, workshops'
    },
    packingEssentials: ['Camera gear', 'Tripod', 'Extra batteries', 'Memory cards'],
    tips: [
      'Research best photo spots',
      'Wake up early for golden hour',
      'Bring backup equipment',
      'Consider photography tours'
    ]
  },

  'wellness-retreat': {
    id: 'wellness-retreat',
    name: 'Wellness Retreat',
    icon: '🧘',
    emoji: '🕉️',
    description: 'Rejuvenate mind, body, and soul',
    type: 'Luxury Travel',
    suggestedDuration: 7,
    activities: ['Yoga', 'Meditation', 'Spa treatments', 'Healthy dining', 'Nature walks'],
    pace: 'Very Relaxed',
    budgetMultiplier: 1.3,
    recommendations: {
      destinations: ['Bali', 'Thailand', 'India', 'Costa Rica', 'Sedona'],
      accommodation: 'Wellness resorts or retreat centers',
      dining: 'Healthy, organic cuisine',
      activities: 'Yoga classes, meditation, spa, detox programs'
    },
    packingEssentials: ['Yoga mat', 'Comfortable clothing', 'Journal', 'Reusable water bottle'],
    tips: [
      'Book wellness programs in advance',
      'Disconnect from technology',
      'Embrace the experience fully',
      'Stay hydrated'
    ]
  },

  'budget-backpacker': {
    id: 'budget-backpacker',
    name: 'Budget Backpacker',
    icon: '🎒',
    emoji: '🚶',
    description: 'Explore more while spending less',
    type: 'Hiking Adventure',
    suggestedDuration: 14,
    activities: ['Hostels', 'Street food', 'Free walking tours', 'Public transport', 'Local experiences'],
    pace: 'Active',
    budgetMultiplier: 0.5,
    recommendations: {
      destinations: ['Southeast Asia', 'Eastern Europe', 'South America', 'India', 'Morocco'],
      accommodation: 'Hostels and budget guesthouses',
      dining: 'Street food and local eateries',
      activities: 'Free tours, hiking, local markets'
    },
    packingEssentials: ['Backpack', 'Quick-dry clothing', 'Padlock', 'First aid kit'],
    tips: [
      'Book hostels with good reviews',
      'Use public transportation',
      'Cook your own meals when possible',
      'Join free walking tours'
    ]
  },

  'luxury-escape': {
    id: 'luxury-escape',
    name: 'Luxury Escape',
    icon: '👑',
    emoji: '💎',
    description: 'Indulge in the finest experiences',
    type: 'Luxury Travel',
    suggestedDuration: 7,
    activities: ['5-star hotels', 'Fine dining', 'Private tours', 'Spa', 'VIP experiences'],
    pace: 'Relaxed',
    budgetMultiplier: 3.0,
    recommendations: {
      destinations: ['Dubai', 'Monaco', 'Maldives', 'Swiss Alps', 'French Riviera'],
      accommodation: '5-star hotels and luxury resorts',
      dining: 'Michelin-starred restaurants',
      activities: 'Private tours, yacht charters, helicopter rides'
    },
    packingEssentials: ['Formal wear', 'Designer accessories', 'Premium toiletries'],
    tips: [
      'Book everything in advance',
      'Consider concierge services',
      'Dress code matters',
      'Tip generously'
    ]
  }
};

export const getTemplateById = (id) => {
  return tripTemplates[id] || null;
};

export const getAllTemplates = () => {
  return Object.values(tripTemplates);
};

export const applyTemplateToForm = (template, baseForm = {}) => {
  const days = template.suggestedDuration;
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + 30); // 30 days from now
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + days);

  return {
    ...baseForm,
    type: template.type,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    // Budget will be calculated based on location if provided
  };
};
