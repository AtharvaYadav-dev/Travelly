import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';

const Saved = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserItineraries();
  }, []);

  const fetchUserItineraries = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('User not logged in or fetch error:', userError);
      setItineraries([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('user_id', user.id)
      .order('id', { ascending: false });

    if (error) {
      console.error('❌ Error fetching itineraries:', error);
    } else {
      setItineraries(data);
    }

    setLoading(false);
  };

  const deleteItinerary = async (id) => {
    const { error } = await supabase.from('itineraries').delete().eq('id', id);

    if (error) {
      alert('Failed to delete itinerary.');
    } else {
      alert('Itinerary deleted ✅');
      setItineraries(itineraries.filter((item) => item.id !== id));
    }
  };

  return (
    <section className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Your Saved Itineraries</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : itineraries.length === 0 ? (
        <p className="text-center text-gray-500">No itineraries found.</p>
      ) : (
        itineraries.map((trip) => (
          <div key={trip.id} className="mb-6 bg-white p-4 rounded shadow border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-blue-800">{trip.title}</h3>
                <p className="text-gray-600">
                  Type: {trip.type} | Budget: ₹{trip.budget} | Participants: {trip.participants}
                </p>
                <p className="text-sm text-gray-500">
                  From {trip.startDate} to {trip.endDate}
                </p>
              </div>
              <button
                onClick={() => deleteItinerary(trip.id)}
                className="text-red-600 hover:underline text-sm ml-4"
              >
                🗑 Delete
              </button>
            </div>

            {trip.ai_plan && (
              <div className="mt-4 p-3 bg-gray-50 border rounded text-sm text-gray-700 whitespace-pre-line">
                <h4 className="text-blue-600 font-semibold mb-2">🧠 Generated Plan:</h4>
                {trip.ai_plan}
              </div>
            )}
          </div>
        ))
      )}
    </section>
  );
};

export default Saved;
