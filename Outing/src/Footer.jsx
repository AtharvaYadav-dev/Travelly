import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h4 className="text-white font-black text-2xl mb-4">Travelly</h4>
            <p className="leading-relaxed">
              Elevating the art of travel through high-performance artificial intelligence
              and world-class design.
            </p>
          </div>
          <div>
            <h5 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Explore</h5>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-indigo-400 transition-colors">Home</a></li>
              <li><a href="/planner" className="hover:text-indigo-400 transition-colors">AI Planner</a></li>
              <li><a href="/saved" className="hover:text-indigo-400 transition-colors">My Routes</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Connect</h5>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">IG</a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">TW</a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">LI</a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between gap-4 text-sm font-medium">
          <p>© 2025 Travelly. All rights reserved.</p>
          <p className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
