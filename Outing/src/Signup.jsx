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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-center">Sign Up</h2>
      {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}

      <input
        type="text"
        placeholder="Full Name"
        className="p-2 border w-full mb-4 rounded"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Phone Number"
        className="p-2 border w-full mb-4 rounded"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        type="email"
        placeholder="Gmail ID"
        className="p-2 border w-full mb-4 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="p-2 border w-full mb-4 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSignup} className="bg-green-600 text-white py-2 w-full rounded hover:bg-green-700">
        Sign Up
      </button>
    </div>
  );
};

export default Signup;
