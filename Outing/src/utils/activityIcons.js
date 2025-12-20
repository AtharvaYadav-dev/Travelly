// Activity icon mapping
export const getActivityIcon = (activity) => {
  const activityLower = activity.toLowerCase();

  // Meals
  if (activityLower.includes('breakfast')) return '🍳';
  if (activityLower.includes('brunch')) return '🥐';
  if (activityLower.includes('lunch')) return '🍽️';
  if (activityLower.includes('dinner')) return '🍷';
  if (activityLower.includes('coffee') || activityLower.includes('café') || activityLower.includes('cafe')) return '☕';
  if (activityLower.includes('snack')) return '🥨';

  // Activities
  if (activityLower.includes('hik')) return '🥾';
  if (activityLower.includes('climb')) return '🧗';
  if (activityLower.includes('ski')) return '⛷️';
  if (activityLower.includes('swim')) return '🏊';
  if (activityLower.includes('dive') || activityLower.includes('snorkel')) return '🤿';
  if (activityLower.includes('surf')) return '🏄';
  if (activityLower.includes('bike') || activityLower.includes('cycl')) return '🚴';
  if (activityLower.includes('kayak') || activityLower.includes('canoe')) return '🛶';
  if (activityLower.includes('paraglid')) return '🪂';
  if (activityLower.includes('yoga')) return '🧘';
  if (activityLower.includes('spa') || activityLower.includes('massage')) return '💆';

  // Sightseeing
  if (activityLower.includes('museum')) return '🏛️';
  if (activityLower.includes('temple') || activityLower.includes('shrine')) return '⛩️';
  if (activityLower.includes('church') || activityLower.includes('cathedral')) return '⛪';
  if (activityLower.includes('castle') || activityLower.includes('palace')) return '🏰';
  if (activityLower.includes('monument')) return '🗿';
  if (activityLower.includes('park') || activityLower.includes('garden')) return '🌳';
  if (activityLower.includes('beach')) return '🏖️';
  if (activityLower.includes('mountain') || activityLower.includes('peak')) return '⛰️';
  if (activityLower.includes('waterfall')) return '💧';
  if (activityLower.includes('lake')) return '🏞️';
  if (activityLower.includes('view') || activityLower.includes('scenic')) return '🌄';

  // Transportation
  if (activityLower.includes('flight') || activityLower.includes('fly')) return '✈️';
  if (activityLower.includes('train')) return '🚂';
  if (activityLower.includes('bus')) return '🚌';
  if (activityLower.includes('taxi') || activityLower.includes('uber')) return '🚕';
  if (activityLower.includes('boat') || activityLower.includes('ferry')) return '⛴️';
  if (activityLower.includes('cable car') || activityLower.includes('gondola')) return '🚡';

  // Shopping & Entertainment
  if (activityLower.includes('shop')) return '🛍️';
  if (activityLower.includes('market') || activityLower.includes('bazaar')) return '🏪';
  if (activityLower.includes('cinema') || activityLower.includes('movie')) return '🎬';
  if (activityLower.includes('theater') || activityLower.includes('theatre') || activityLower.includes('show')) return '🎭';
  if (activityLower.includes('concert') || activityLower.includes('music')) return '🎵';
  if (activityLower.includes('nightlife') || activityLower.includes('bar') || activityLower.includes('club')) return '🍸';

  // Accommodation
  if (activityLower.includes('check-in') || activityLower.includes('check in')) return '🏨';
  if (activityLower.includes('check-out') || activityLower.includes('check out')) return '🧳';
  if (activityLower.includes('hotel') || activityLower.includes('accommodation')) return '🛏️';

  // Miscellaneous
  if (activityLower.includes('photo')) return '📸';
  if (activityLower.includes('tour') || activityLower.includes('guide')) return '🗺️';
  if (activityLower.includes('rest') || activityLower.includes('relax')) return '😌';
  if (activityLower.includes('sunset')) return '🌅';
  if (activityLower.includes('sunrise')) return '🌄';
  if (activityLower.includes('star') || activityLower.includes('night sky')) return '⭐';
  if (activityLower.includes('wildlife') || activityLower.includes('safari')) return '🦁';
  if (activityLower.includes('aquarium')) return '🐠';
  if (activityLower.includes('zoo')) return '🦒';

  // Default
  return '📍';
};

export const getCategoryColor = (activity) => {
  const activityLower = activity.toLowerCase();

  if (activityLower.includes('breakfast') || activityLower.includes('lunch') || activityLower.includes('dinner')) {
    return 'text-orange-400';
  }
  if (activityLower.includes('hik') || activityLower.includes('climb') || activityLower.includes('ski')) {
    return 'text-green-400';
  }
  if (activityLower.includes('museum') || activityLower.includes('temple') || activityLower.includes('castle')) {
    return 'text-purple-400';
  }
  if (activityLower.includes('beach') || activityLower.includes('swim') || activityLower.includes('dive')) {
    return 'text-blue-400';
  }

  return 'text-primary';
};
