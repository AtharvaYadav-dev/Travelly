import React, { useState } from 'react';
import { supabase } from './supabase';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!fullName || !phone || !email || !password) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      alert('Signup successful! Now login.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-purple-100 transition-all duration-500">
      <div className="flex w-full max-w-3xl shadow-2xl rounded-3xl overflow-hidden bg-white">
        {/* Left Accent Side */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-br from-green-500 to-purple-500 p-8 text-white relative">
          <svg width="120" height="120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6 animate-bounce">
            <circle cx="60" cy="60" r="60" fill="#fff2" />
            <path d="M40 80 Q60 60 80 80" stroke="#fff" strokeWidth="4" fill="none" />
            <circle cx="60" cy="55" r="8" fill="#fff" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Join Us!</h2>
          <p className="text-center opacity-80">Create your account to start planning amazing outings.</p>
        </div>
        {/* Right Form Side */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
          {errorMsg && <p className="text-red-500 mb-3 text-center animate-pulse">{errorMsg}</p>}
          <input
            type="text"
            placeholder="Full Name"
            className="p-3 border border-gray-300 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="p-3 border border-gray-300 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="email"
            placeholder="Gmail ID"
            className="p-3 border border-gray-300 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 border border-gray-300 w-full mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleSignup}
            className="bg-green-600 text-white py-3 w-full rounded-lg font-semibold shadow hover:bg-green-700 transition-all duration-200"
          >
            Sign Up
          </button>
          <p className="mt-6 text-center text-gray-500 text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-green-600 hover:underline font-medium">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
