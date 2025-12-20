import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Navigation } from 'lucide-react';

const TimeTracker = ({ formattedResponse }) => {
  const [timeBreakdown, setTimeBreakdown] = useState([]);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    if (formattedResponse && formattedResponse.length > 0) {
      calculateTimeBreakdown();
    }
  }, [formattedResponse]);

  const calculateTimeBreakdown = () => {
    const breakdown = formattedResponse.map((day, index) => {
      const activities = day.items || [];

      // Estimate time for each activity
      const activityTimes = activities.map(activity => {
        const activityLower = activity.toLowerCase();

        // Activity duration estimates (in hours)
        if (activityLower.includes('museum') || activityLower.includes('gallery')) return 2.5;
        if (activityLower.includes('tour') || activityLower.includes('sightseeing')) return 3;
        if (activityLower.includes('hike') || activityLower.includes('trek')) return 4;
        if (activityLower.includes('beach') || activityLower.includes('relax')) return 3;
        if (activityLower.includes('shopping')) return 2;
        if (activityLower.includes('dinner') || activityLower.includes('lunch')) return 1.5;
        if (activityLower.includes('breakfast')) return 1;
        if (activityLower.includes('show') || activityLower.includes('performance')) return 2;
        if (activityLower.includes('park') || activityLower.includes('garden')) return 1.5;
        if (activityLower.includes('temple') || activityLower.includes('church')) return 1;

        return 2; // Default activity time
      });

      // Travel time between activities (15-30 min each)
      const travelTime = (activities.length - 1) * 0.5;

      // Buffer time (10% of total)
      const activityTime = activityTimes.reduce((sum, time) => sum + time, 0);
      const bufferTime = (activityTime + travelTime) * 0.1;

      const totalDayTime = activityTime + travelTime + bufferTime;

      return {
        day: index + 1,
        title: day.title,
        activities: activities.map((activity, i) => ({
          name: activity,
          duration: activityTimes[i],
          startTime: calculateStartTime(activityTimes.slice(0, i), i)
        })),
        activityTime,
        travelTime,
        bufferTime,
        totalTime: totalDayTime
      };
    });

    setTimeBreakdown(breakdown);
    setTotalTime(breakdown.reduce((sum, day) => sum + day.totalTime, 0));
  };

  const calculateStartTime = (previousTimes, index) => {
    const startHour = 9; // Start at 9 AM
    const totalPreviousTime = previousTimes.reduce((sum, time) => sum + time, 0);
    const travelTime = index * 0.5; // 30 min travel between activities

    const totalHours = startHour + totalPreviousTime + travelTime;
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const formatTime = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  if (!formattedResponse || formattedResponse.length === 0) {
    return null;
  }

  return (
    <div className="max-w-[1600px] mx-auto px-10 py-16">
      <div className="flex items-center gap-3 mb-8">
        <Clock className="w-8 h-8 text-primary" />
        <h2 className="text-4xl font-black text-white uppercase">
          ⏱️ Time Breakdown
        </h2>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="premium-glass p-6 rounded-2xl border border-white/10">
          <p className="text-white/60 text-sm mb-2">Total Trip Time</p>
          <p className="text-3xl font-black text-primary">{formatTime(totalTime)}</p>
        </div>
        <div className="premium-glass p-6 rounded-2xl border border-white/10">
          <p className="text-white/60 text-sm mb-2">Avg Per Day</p>
          <p className="text-3xl font-black text-white">
            {formatTime(totalTime / timeBreakdown.length)}
          </p>
        </div>
        <div className="premium-glass p-6 rounded-2xl border border-white/10">
          <p className="text-white/60 text-sm mb-2">Activities</p>
          <p className="text-3xl font-black text-white">
            {timeBreakdown.reduce((sum, day) => sum + day.activities.length, 0)}
          </p>
        </div>
        <div className="premium-glass p-6 rounded-2xl border border-white/10">
          <p className="text-white/60 text-sm mb-2">Travel Time</p>
          <p className="text-3xl font-black text-orange-400">
            {formatTime(timeBreakdown.reduce((sum, day) => sum + day.travelTime, 0))}
          </p>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="space-y-6">
        {timeBreakdown.map((day) => (
          <div key={day.day} className="premium-glass p-6 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-white">
                Day {day.day}: {day.title}
              </h3>
              <div className="text-right">
                <p className="text-sm text-white/60">Total Time</p>
                <p className="text-xl font-black text-primary">{formatTime(day.totalTime)}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {day.activities.map((activity, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">{activity.startTime}</span>
                    </div>
                    {i < day.activities.length - 1 && (
                      <div className="w-0.5 h-16 bg-white/10 my-2" />
                    )}
                  </div>

                  <div className="flex-1 pt-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-white font-bold mb-1">{activity.name}</p>
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(activity.duration)}
                          </span>
                          {i < day.activities.length - 1 && (
                            <span className="flex items-center gap-1">
                              <Navigation className="w-3 h-3" />
                              30 min travel
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-32 bg-white/5 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-orange-500"
                          style={{ width: `${(activity.duration / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Day Summary */}
            <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-white/60 mb-1">Activities</p>
                <p className="text-lg font-bold text-white">{formatTime(day.activityTime)}</p>
              </div>
              <div>
                <p className="text-xs text-white/60 mb-1">Travel</p>
                <p className="text-lg font-bold text-orange-400">{formatTime(day.travelTime)}</p>
              </div>
              <div>
                <p className="text-xs text-white/60 mb-1">Buffer</p>
                <p className="text-lg font-bold text-green-400">{formatTime(day.bufferTime)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-8 premium-glass p-6 rounded-2xl border border-primary/30 bg-primary/5">
        <h4 className="text-white font-bold mb-3 flex items-center gap-2">
          💡 Time Management Tips
        </h4>
        <ul className="text-sm text-white/80 space-y-2">
          <li>• Start early to make the most of your day</li>
          <li>• Buffer time accounts for unexpected delays</li>
          <li>• Travel times are estimates - check actual distances</li>
          <li>• Consider peak hours when planning activities</li>
          <li>• Book time-sensitive activities in advance</li>
        </ul>
      </div>
    </div>
  );
};

export default TimeTracker;
