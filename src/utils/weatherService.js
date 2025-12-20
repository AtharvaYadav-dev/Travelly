import axios from 'axios';

// Weather service using OpenWeatherMap API
// Get free API key at: https://openweathermap.org/api

export const fetchWeatherForecast = async (location, dates) => {
  try {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

    // If no API key, return mock data
    if (!API_KEY || API_KEY === 'your_weather_api_key_here') {
      return getMockWeatherData(dates);
    }

    // Geocoding to get coordinates
    const geoResponse = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`
    );

    if (!geoResponse.data || geoResponse.data.length === 0) {
      return getMockWeatherData(dates);
    }

    const { lat, lon } = geoResponse.data[0];

    // Get 5-day forecast
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    // Process forecast data
    const forecast = processWeatherData(weatherResponse.data, dates);
    return forecast;
  } catch (error) {
    console.error('Weather fetch error:', error);
    return getMockWeatherData(dates);
  }
};

const processWeatherData = (data, dates) => {
  const dailyForecasts = {};

  data.list.forEach(item => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];

    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        temp: item.main.temp,
        feels_like: item.main.feels_like,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        humidity: item.main.humidity,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        wind_speed: item.wind.speed,
        clouds: item.clouds.all,
        rain: item.rain?.['3h'] || 0
      };
    }
  });

  return dailyForecasts;
};

const getMockWeatherData = (dates) => {
  // Return realistic mock data when API key is not available
  const mockData = {};
  const conditions = [
    { description: 'clear sky', icon: '01d', temp: 22 },
    { description: 'few clouds', icon: '02d', temp: 20 },
    { description: 'scattered clouds', icon: '03d', temp: 18 },
    { description: 'partly cloudy', icon: '04d', temp: 19 },
    { description: 'light rain', icon: '10d', temp: 16 }
  ];

  if (dates && dates.length > 0) {
    dates.forEach((date, index) => {
      const condition = conditions[index % conditions.length];
      mockData[date] = {
        temp: condition.temp + Math.random() * 5,
        feels_like: condition.temp + Math.random() * 3,
        temp_min: condition.temp - 2,
        temp_max: condition.temp + 3,
        humidity: 60 + Math.random() * 20,
        description: condition.description,
        icon: condition.icon,
        wind_speed: 3 + Math.random() * 5,
        clouds: Math.random() * 100,
        rain: condition.description.includes('rain') ? Math.random() * 5 : 0
      };
    });
  }

  return mockData;
};

export const getWeatherIcon = (iconCode) => {
  const iconMap = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
  };
  return iconMap[iconCode] || '🌤️';
};

export const getWeatherRecommendation = (weather) => {
  if (!weather) return null;

  const recommendations = [];

  if (weather.temp < 10) {
    recommendations.push('🧥 Pack warm clothing');
  } else if (weather.temp > 25) {
    recommendations.push('🕶️ Bring sunscreen and sunglasses');
  }

  if (weather.rain > 0 || weather.description.includes('rain')) {
    recommendations.push('☔ Don\'t forget an umbrella');
  }

  if (weather.wind_speed > 20) {
    recommendations.push('💨 Expect windy conditions');
  }

  if (weather.humidity > 80) {
    recommendations.push('💧 High humidity expected');
  }

  return recommendations;
};
