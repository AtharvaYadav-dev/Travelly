import React from 'react';
import { motion } from 'framer-motion';
import { getWeatherIcon, getWeatherRecommendation } from '../utils/weatherService';

const WeatherCard = ({ weather, date, dayTitle }) => {
  if (!weather) return null;

  const recommendations = getWeatherRecommendation(weather);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-glass p-6 rounded-2xl border border-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider">
            {dayTitle} Weather
          </h4>
          <p className="text-xs text-white/40 mt-1">{date}</p>
        </div>
        <span className="text-5xl">{getWeatherIcon(weather.icon)}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-3xl font-black text-white">
            {Math.round(weather.temp)}°C
          </p>
          <p className="text-xs text-white/60 capitalize mt-1">
            {weather.description}
          </p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-sm text-white/60">
            Feels like <span className="text-white font-bold">{Math.round(weather.feels_like)}°C</span>
          </p>
          <p className="text-sm text-white/60">
            High/Low <span className="text-white font-bold">{Math.round(weather.temp_max)}°/{Math.round(weather.temp_min)}°</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 py-3 border-t border-white/10">
        <div className="text-center">
          <p className="text-xs text-white/40">Humidity</p>
          <p className="text-sm font-bold text-white mt-1">
            💧 {Math.round(weather.humidity)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-white/40">Wind</p>
          <p className="text-sm font-bold text-white mt-1">
            💨 {Math.round(weather.wind_speed)} m/s
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-white/40">Clouds</p>
          <p className="text-sm font-bold text-white mt-1">
            ☁️ {Math.round(weather.clouds)}%
          </p>
        </div>
      </div>

      {recommendations && recommendations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
            💡 Recommendations
          </p>
          <div className="space-y-1">
            {recommendations.map((rec, i) => (
              <p key={i} className="text-xs text-white/60">
                {rec}
              </p>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WeatherCard;
