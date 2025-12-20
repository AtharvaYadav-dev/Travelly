import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';

const BudgetTracker = ({ plannedBudget, itineraryId, onClose }) => {
  const [expenses, setExpenses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: 'Food',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    { name: 'Food', icon: '🍽️', color: 'text-orange-400' },
    { name: 'Accommodation', icon: '🏨', color: 'text-blue-400' },
    { name: 'Transport', icon: '🚗', color: 'text-green-400' },
    { name: 'Activities', icon: '🎯', color: 'text-purple-400' },
    { name: 'Shopping', icon: '🛍️', color: 'text-pink-400' },
    { name: 'Other', icon: '📌', color: 'text-gray-400' }
  ];

  useEffect(() => {
    // Load expenses from localStorage
    const saved = localStorage.getItem(`expenses_${itineraryId}`);
    if (saved) {
      setExpenses(JSON.parse(saved));
    }
  }, [itineraryId]);

  const saveExpenses = (updatedExpenses) => {
    localStorage.setItem(`expenses_${itineraryId}`, JSON.stringify(updatedExpenses));
    setExpenses(updatedExpenses);
  };

  const addExpense = () => {
    if (!newExpense.amount || !newExpense.description) return;

    const expense = {
      ...newExpense,
      id: Date.now(),
      amount: parseFloat(newExpense.amount)
    };

    const updated = [...expenses, expense];
    saveExpenses(updated);

    setNewExpense({
      category: 'Food',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddForm(false);
  };

  const deleteExpense = (id) => {
    const updated = expenses.filter(e => e.id !== id);
    saveExpenses(updated);
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = plannedBudget - totalSpent;
  const percentUsed = (totalSpent / plannedBudget) * 100;

  const categoryTotals = categories.map(cat => ({
    ...cat,
    total: expenses
      .filter(e => e.category === cat.name)
      .reduce((sum, e) => sum + e.amount, 0)
  }));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="premium-glass max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-3xl border border-white/10"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                💰 Budget Tracker
              </h2>
              <p className="text-sm text-white/60 mt-1">
                Track your spending vs planned budget
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 max-h-[calc(90vh-200px)]">
          {/* Budget Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="premium-glass p-6 rounded-2xl border border-white/10">
              <p className="text-xs text-white/60 uppercase tracking-wider mb-2">Planned Budget</p>
              <p className="text-3xl font-black text-white">${plannedBudget.toLocaleString()}</p>
            </div>
            <div className="premium-glass p-6 rounded-2xl border border-white/10">
              <p className="text-xs text-white/60 uppercase tracking-wider mb-2">Total Spent</p>
              <p className="text-3xl font-black text-primary">${totalSpent.toLocaleString()}</p>
            </div>
            <div className="premium-glass p-6 rounded-2xl border border-white/10">
              <p className="text-xs text-white/60 uppercase tracking-wider mb-2">Remaining</p>
              <p className={`text-3xl font-black ${remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${Math.abs(remaining).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/60">Budget Usage</span>
              <span className={`font-bold ${percentUsed > 100 ? 'text-red-400' : 'text-primary'}`}>
                {percentUsed.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentUsed, 100)}%` }}
                className={`h-full rounded-full ${percentUsed > 100 ? 'bg-red-500' :
                    percentUsed > 80 ? 'bg-orange-500' :
                      'bg-gradient-to-r from-primary to-orange-500'
                  }`}
              />
            </div>
            {percentUsed > 100 && (
              <p className="text-xs text-red-400 mt-2">
                ⚠️ You've exceeded your budget by ${(totalSpent - plannedBudget).toLocaleString()}
              </p>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="mb-8">
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">
              Category Breakdown
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categoryTotals.map(cat => (
                <div key={cat.name} className="premium-glass p-4 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-sm font-bold text-white">{cat.name}</span>
                  </div>
                  <p className={`text-xl font-black ${cat.color}`}>
                    ${cat.total.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Add Expense Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full btn-premium mb-6 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Expense
            </button>
          )}

          {/* Add Expense Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="premium-glass p-6 rounded-2xl border border-primary/20 mb-6"
              >
                <h4 className="text-lg font-black text-white mb-4">Add New Expense</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/60 uppercase tracking-wider block mb-2">
                      Category
                    </label>
                    <select
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                      className="w-full bg-slate-900/80 border border-white/20 px-4 py-3 rounded-lg text-white focus:outline-none focus:border-primary/50"
                    >
                      {categories.map(cat => (
                        <option key={cat.name} value={cat.name}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/60 uppercase tracking-wider block mb-2">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      placeholder="0.00"
                      className="w-full bg-slate-900/80 border border-white/20 px-4 py-3 rounded-lg text-white focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/60 uppercase tracking-wider block mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      placeholder="What did you buy?"
                      className="w-full bg-slate-900/80 border border-white/20 px-4 py-3 rounded-lg text-white focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/60 uppercase tracking-wider block mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                      className="w-full bg-slate-900/80 border border-white/20 px-4 py-3 rounded-lg text-white focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  <button onClick={addExpense} className="btn-premium flex-1">
                    Add Expense
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 rounded-full font-bold uppercase tracking-wider text-sm bg-white/10 text-white hover:bg-white/20 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expenses List */}
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">
              Expense History
            </h3>
            {expenses.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                <p>No expenses recorded yet</p>
                <p className="text-sm mt-2">Add your first expense to start tracking</p>
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).map(expense => {
                  const category = categories.find(c => c.name === expense.category);
                  return (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="premium-glass p-4 rounded-xl border border-white/10 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <span className="text-3xl">{category?.icon}</span>
                        <div className="flex-1">
                          <p className="text-white font-bold">{expense.description}</p>
                          <p className="text-xs text-white/60 mt-1">
                            {category?.name} • {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-xl font-black text-primary">
                          ${expense.amount.toLocaleString()}
                        </p>
                        <button
                          onClick={() => deleteExpense(expense.id)}
                          className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 p-6">
          <button onClick={onClose} className="w-full btn-premium">
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BudgetTracker;
