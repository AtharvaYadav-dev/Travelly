// Achievement definitions and tracking system

export const achievements = [
  {
    id: 'first-trip',
    name: 'First Adventure',
    description: 'Create your first trip itinerary',
    icon: '🎒',
    points: 10,
    category: 'beginner',
    requirement: { type: 'trips_created', count: 1 }
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Create 5 trip itineraries',
    icon: '🗺️',
    points: 25,
    category: 'beginner',
    requirement: { type: 'trips_created', count: 5 }
  },
  {
    id: 'globe-trotter',
    name: 'Globe Trotter',
    description: 'Visit 5 different continents',
    icon: '🌍',
    points: 100,
    category: 'advanced',
    requirement: { type: 'continents_visited', count: 5 }
  },
  {
    id: 'budget-master',
    name: 'Budget Master',
    description: 'Stay under budget on 3 trips',
    icon: '💰',
    points: 50,
    category: 'intermediate',
    requirement: { type: 'under_budget', count: 3 }
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Book a trip 3 months in advance',
    icon: '🐦',
    points: 25,
    category: 'intermediate',
    requirement: { type: 'early_booking', days: 90 }
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Share 10 trips on social media',
    icon: '🦋',
    points: 40,
    category: 'intermediate',
    requirement: { type: 'shares', count: 10 }
  },
  {
    id: 'foodie',
    name: 'Foodie Explorer',
    description: 'Complete 10 food-focused trips',
    icon: '🍽️',
    points: 75,
    category: 'advanced',
    requirement: { type: 'trip_type', value: 'Culinary Tours', count: 10 }
  },
  {
    id: 'adventurer',
    name: 'Adrenaline Junkie',
    description: 'Complete 5 adventure trips',
    icon: '🏔️',
    points: 80,
    category: 'advanced',
    requirement: { type: 'trip_type', value: 'Hiking Adventure', count: 5 }
  },
  {
    id: 'photographer',
    name: 'Shutterbug',
    description: 'Use packing list feature 20 times',
    icon: '📸',
    points: 60,
    category: 'intermediate',
    requirement: { type: 'packing_lists', count: 20 }
  },
  {
    id: 'planner',
    name: 'Master Planner',
    description: 'Create trips worth $50,000 total',
    icon: '📋',
    points: 150,
    category: 'expert',
    requirement: { type: 'total_budget', amount: 50000 }
  },
  {
    id: 'weather-watcher',
    name: 'Weather Watcher',
    description: 'Check weather on 15 trips',
    icon: '🌤️',
    points: 30,
    category: 'beginner',
    requirement: { type: 'weather_checks', count: 15 }
  },
  {
    id: 'currency-expert',
    name: 'Currency Expert',
    description: 'Use currency converter 25 times',
    icon: '💱',
    points: 35,
    category: 'intermediate',
    requirement: { type: 'currency_conversions', count: 25 }
  },
  {
    id: 'ai-enthusiast',
    name: 'AI Enthusiast',
    description: 'Chat with AI assistant 50 times',
    icon: '🤖',
    points: 45,
    category: 'intermediate',
    requirement: { type: 'ai_chats', count: 50 }
  },
  {
    id: 'world-traveler',
    name: 'World Traveler',
    description: 'Plan trips to 20 different countries',
    icon: '✈️',
    points: 200,
    category: 'expert',
    requirement: { type: 'countries_visited', count: 20 }
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Use Travelly for 30 days in a row',
    icon: '🔥',
    points: 100,
    category: 'advanced',
    requirement: { type: 'login_streak', days: 30 }
  }
];

export const categories = {
  beginner: { name: 'Beginner', color: '#10b981', minPoints: 0 },
  intermediate: { name: 'Intermediate', color: '#3b82f6', minPoints: 50 },
  advanced: { name: 'Advanced', color: '#8b5cf6', minPoints: 150 },
  expert: { name: 'Expert', color: '#f59e0b', minPoints: 300 }
};

// Achievement tracking functions
export const trackAchievement = (userId, eventType, eventData) => {
  const userProgress = getUserProgress(userId);

  // Update progress based on event
  switch (eventType) {
    case 'trip_created':
      userProgress.trips_created = (userProgress.trips_created || 0) + 1;
      userProgress.total_budget = (userProgress.total_budget || 0) + eventData.budget;
      if (eventData.type) {
        userProgress.trip_types = userProgress.trip_types || {};
        userProgress.trip_types[eventData.type] = (userProgress.trip_types[eventData.type] || 0) + 1;
      }
      break;
    case 'share':
      userProgress.shares = (userProgress.shares || 0) + 1;
      break;
    case 'weather_check':
      userProgress.weather_checks = (userProgress.weather_checks || 0) + 1;
      break;
    case 'currency_conversion':
      userProgress.currency_conversions = (userProgress.currency_conversions || 0) + 1;
      break;
    case 'ai_chat':
      userProgress.ai_chats = (userProgress.ai_chats || 0) + 1;
      break;
    case 'packing_list':
      userProgress.packing_lists = (userProgress.packing_lists || 0) + 1;
      break;
  }

  // Check for newly unlocked achievements
  const newAchievements = checkAchievements(userProgress);

  // Save progress
  saveUserProgress(userId, userProgress);

  return newAchievements;
};

export const checkAchievements = (userProgress) => {
  const unlocked = [];

  achievements.forEach(achievement => {
    if (isAchievementUnlocked(achievement, userProgress)) {
      if (!userProgress.unlocked?.includes(achievement.id)) {
        unlocked.push(achievement);
      }
    }
  });

  return unlocked;
};

const isAchievementUnlocked = (achievement, progress) => {
  const req = achievement.requirement;

  switch (req.type) {
    case 'trips_created':
      return (progress.trips_created || 0) >= req.count;
    case 'shares':
      return (progress.shares || 0) >= req.count;
    case 'weather_checks':
      return (progress.weather_checks || 0) >= req.count;
    case 'currency_conversions':
      return (progress.currency_conversions || 0) >= req.count;
    case 'ai_chats':
      return (progress.ai_chats || 0) >= req.count;
    case 'packing_lists':
      return (progress.packing_lists || 0) >= req.count;
    case 'total_budget':
      return (progress.total_budget || 0) >= req.amount;
    case 'trip_type':
      return (progress.trip_types?.[req.value] || 0) >= req.count;
    default:
      return false;
  }
};

const getUserProgress = (userId) => {
  const stored = localStorage.getItem(`achievements_${userId}`);
  return stored ? JSON.parse(stored) : { unlocked: [] };
};

const saveUserProgress = (userId, progress) => {
  localStorage.setItem(`achievements_${userId}`, JSON.stringify(progress));
};

export const getTotalPoints = (userId) => {
  const progress = getUserProgress(userId);
  return achievements
    .filter(a => progress.unlocked?.includes(a.id))
    .reduce((sum, a) => sum + a.points, 0);
};

export const getUserLevel = (totalPoints) => {
  if (totalPoints >= 300) return { level: 'Expert', icon: '👑', color: '#f59e0b' };
  if (totalPoints >= 150) return { level: 'Advanced', icon: '⭐', color: '#8b5cf6' };
  if (totalPoints >= 50) return { level: 'Intermediate', icon: '🎯', color: '#3b82f6' };
  return { level: 'Beginner', icon: '🌱', color: '#10b981' };
};
