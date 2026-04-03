import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { motion } from 'framer-motion';

const FallbackComponent = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-slate-900 border border-red-500/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 text-2xl">
            ⚠️
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Oops! Snap.</h2>
            <p className="text-slate-400 text-sm">Something went wrong under the hood.</p>
          </div>
        </div>

        <div className="bg-black/50 rounded-lg p-4 mb-8 overflow-x-auto border border-white/5">
          <code className="text-red-400 text-xs font-mono whitespace-pre-wrap">
            {error.message}
          </code>
        </div>

        <div className="flex gap-4">
          <button
            onClick={resetErrorBoundary}
            className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-700 transition-colors border border-white/10"
          >
            Go Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const GlobalErrorBoundary = ({ children }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={FallbackComponent}
      onReset={() => {
        // Reset state here if needed
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default GlobalErrorBoundary;
