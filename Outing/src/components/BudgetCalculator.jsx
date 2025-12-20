import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DollarSign, Home, Utensils, Plane, ShoppingBag, Activity } from 'lucide-react';

const BudgetCalculator = ({ totalBudget = 3000, onBudgetChange }) => {
  const [breakdown, setBreakdown] = useState({
    accommodation: 30,
    food: 25,
    activities: 20,
    transport: 15,
    shopping: 10
  });

  const categories = [
    { key: 'accommodation', name: 'Accommodation', icon: Home, color: '#FF7A2D' },
    { key: 'food', name: 'Food & Dining', icon: Utensils, color: '#3b82f6' },
    { key: 'activities', name: 'Activities', icon: Activity, color: '#10b981' },
    { key: 'transport', name: 'Transport', icon: Plane, color: '#8b5cf6' },
    { key: 'shopping', name: 'Shopping & Misc', icon: ShoppingBag, color: '#f59e0b' }
  ];

  const handleSliderChange = (key, value) => {
    const newBreakdown = { ...breakdown, [key]: value };

    // Adjust other categories proportionally
    const total = Object.values(newBreakdown).reduce((a, b) => a + b, 0);
    if (total !== 100) {
      const diff = 100 - total;
      const otherKeys = Object.keys(newBreakdown).filter(k => k !== key);
      const adjustment = diff / otherKeys.length;

      otherKeys.forEach(k => {
        newBreakdown[k] = Math.max(0, Math.min(100, newBreakdown[k] + adjustment));
      });
    }

    setBreakdown(newBreakdown);
  };

  const calculateAmount = (percentage) => {
    return ((totalBudget * percentage) / 100).toFixed(0);
  };

  const chartData = categories.map(cat => ({
    name: cat.name,
    value: breakdown[cat.key],
    amount: calculateAmount(breakdown[cat.key]),
    color: cat.color
  }));

  return (
    <div className="premium-glass p-8 rounded-2xl border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="w-8 h-8 text-primary" />
        <h3 className="text-2xl font-black text-white">Budget Calculator</h3>
      </div>

      {/* Pie Chart */}
      <div className="mb-8">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px'
              }}
              formatter={(value, name, props) => [
                `$${props.payload.amount} (${value}%)`,
                name
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Sliders */}
      <div className="space-y-6">
        {categories.map(cat => {
          const Icon = cat.icon;
          const amount = calculateAmount(breakdown[cat.key]);

          return (
            <div key={cat.key}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5" style={{ color: cat.color }} />
                  <span className="text-white font-bold">{cat.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-white">
                    ${amount}
                  </span>
                  <span className="text-white/60 text-sm ml-2">
                    ({breakdown[cat.key]}%)
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={breakdown[cat.key]}
                onChange={(e) => handleSliderChange(cat.key, parseInt(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${cat.color} 0%, ${cat.color} ${breakdown[cat.key]}%, rgba(255,255,255,0.1) ${breakdown[cat.key]}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-white/60 uppercase tracking-wider text-sm">
            Total Budget
          </span>
          <span className="text-4xl font-black text-primary">
            ${totalBudget.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BudgetCalculator;
