import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto w-full bg-gradient-to-tr from-indigo-600 via-fuchsia-500 to-pink-400 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="font-bold text-lg">Travelly © 2025</div>
        <div className="flex gap-4 text-sm">
          <a href="https://www.instagram.com/accounts/login/?hl=en" target="_blank" className="hover:text-indigo-100 transition">Instagram</a>
          <a href="https://x.com/i/flow/login?lang=en" target="_blank" className="hover:text-indigo-100 transition">Twitter</a>
          <a href="https://travelly1-seven.vercel.app/contact" target="_blank" className="hover:text-indigo-100 transition">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
