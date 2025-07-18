import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase';

const Planner = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    type: '',
    budget: '',
    participants: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    range: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    for (const [key, value] of Object.entries(form)) {
      if (typeof value === 'string' && value.trim() === '') {
        setError('All fields are required.');
        return;
      }
    }

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert('You must be logged in to save an itinerary.');
        return;
      }

      const { data, error } = await supabase
        .from('itineraries')
        .insert([{
          title: form.title.trim(),
          type: form.type.trim(),
          budget: parseInt(form.budget),
          participants: parseInt(form.participants),
          startDate: form.startDate,
          endDate: form.endDate,
          startTime: form.startTime,
          endTime: form.endTime,
          location: form.location.trim(),
          range: form.range.trim(),
          user_id: user.id
        }])
        .select()
        .single(); // ✅ Prevents data[0] errors

      if (error) {
        console.error('❌ Supabase Error:', error);
        alert('Failed to save itinerary.');
      } else {
        console.log('✅ Supabase Success:', data);
        localStorage.setItem('currentItinerary', JSON.stringify(data)); // ✅ Store entire itinerary
        alert('Itinerary saved to cloud!');
        navigate('/result');
      }
    } catch (err) {
      console.error('Unexpected Error:', err);
      alert('Unexpected error occurred.');
    }
  };

  return (
    <section className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Plan Your Outing</h2>
      <form onSubmit={handleSubmit} className="grid gap-4 bg-gray-100 p-6 rounded shadow">
        {error && <p className="text-red-500">{error}</p>}

        <input name="title" placeholder="Trip Title" onChange={handleChange} className="p-2 border border-gray-300 rounded" />

        <select name="type" onChange={handleChange} className="p-2 border border-gray-300 rounded">
          <option value="">Select Type</option>
          <option>Family Outing</option>
          <option>Date</option>
          <option>Activities Near You</option>
          <option>Friends Outing</option>
        </select>

        <input name="budget" type="number" placeholder="Budget (₹)" onChange={handleChange} className="p-2 border border-gray-300 rounded" />
        <input name="participants" type="number" placeholder="Participants" onChange={handleChange} className="p-2 border border-gray-300 rounded" />

        <label className="text-gray-700 font-medium">Start Date</label>
        <input name="startDate" type="date" onChange={handleChange} className="p-2 border border-gray-300 rounded" />

        <label className="text-gray-700 font-medium">End Date</label>
        <input name="endDate" type="date" onChange={handleChange} className="p-2 border border-gray-300 rounded" />

        <label className="text-gray-700 font-medium">Start Time</label>
        <input name="startTime" type="time" onChange={handleChange} className="p-2 border border-gray-300 rounded" />

        <label className="text-gray-700 font-medium">End Time</label>
        <input name="endTime" type="time" onChange={handleChange} className="p-2 border border-gray-300 rounded" />

        <input name="location" placeholder="Location / City" onChange={handleChange} className="p-2 border border-gray-300 rounded" />

        <select name="range" onChange={handleChange} className="p-2 border border-gray-300 rounded">
          <option value="">Select Range</option>
          <option>5 KM</option>
          <option>10 KM</option>
          <option>15 KM</option>
          <option>20+ KM</option>
        </select>

        <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Generate Itinerary</button>
      </form>
    </section>
  );
};

export default Planner;
