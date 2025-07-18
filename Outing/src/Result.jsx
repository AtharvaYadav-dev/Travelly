import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useNavigate } from 'react-router-dom';

const Result = () => {
  const [formattedResponse, setFormattedResponse] = useState([]);
  const [costSummary, setCostSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState('');
  const [savedData, setSavedData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('currentItinerary'));
    if (saved) {
      setSavedData(saved);
      generateAI(saved);
    } else {
      setAiResponse('No itinerary found.');
      setLoading(false);
    }
  }, []);

  const formatAIResponse = (text) => {
    const [mainText, costText] = text.split(/Cost Summary:/i);

    const days = mainText
      .split(/Day\s*\d/i)
      .filter(Boolean)
      .map((day, index) => {
        const blocks = day
          .split('\n')
          .map((line) =>
            line.replace(/^\*+/, '').replace(/^[-•🌟]/, '').trim()
          )
          .filter((line) => line.length > 5 && line.length < 300);
        return {
          title: `Day ${index + 1}`,
          items: blocks,
        };
      });

    const costLines = costText
      ? costText
          .split('\n')
          .map((line) => line.replace(/^[-•🌟]/, '').trim())
          .filter((line) => line.length > 3 && line.includes('₹'))
      : [];

    return { days, costSummary: costLines };
  };

  const generateAI = async (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const totalDays = diffDays > 7 ? 7 : diffDays;

    let dayFormatText = '';
    for (let i = 1; i <= totalDays; i++) {
      dayFormatText += `
Day ${i}
Morning: Activity, Location, Time, ₹Cost (category)
Afternoon: ...
Evening: ...
`;
    }

    const prompt = `
You are a travel planning assistant.

Based on the following trip details, generate a clean, easy-to-read ${totalDays}-day itinerary.

Trip Details:
- Trip Title: ${data.title}
- Trip Type: ${data.type}
- Number of Participants: ${data.participants}
- Total Budget: ₹${data.budget}
- Location: ${data.location}
- Distance Range: ${data.range}
- Start Date: ${data.startDate}
- End Date: ${data.endDate}
- Time Window: ${data.startTime} to ${data.endTime}

Rules:
1. Use exactly ${data.participants} participants.
2. Stay within ₹${data.budget} total.
3. Suggest exactly 3 activities per day: Morning, Afternoon, Evening.
4. Stay within ${data.range} of ${data.location}.
5. Ensure all activities are scheduled between ${data.startTime} and ${data.endTime}.
6. DO NOT use Markdown, emojis, bullet points, or asterisks (**). Plain clean text only.

FORMAT:
${dayFormatText}

Cost Summary:
Transport: ₹...
Food: ₹...
Tickets: ₹...
Shopping: ₹...
Total: ₹...
`;

    try {
      setLoading(true);
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBHKpfTcUeu5Pvc9eds6oLweEEWm5QNPL8',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      const result = await response.json();
      const text =
        result?.candidates?.[0]?.content?.parts?.[0]?.text ||
        '❌ Failed to generate.';
      setAiResponse(text);

      const { days, costSummary } = formatAIResponse(text);
      setFormattedResponse(days);
      setCostSummary(costSummary);

      if (data.id) {
        const { error } = await supabase
          .from('itineraries')
          .update({ ai_plan: text })
          .eq('id', data.id);

        if (error) {
          console.error('❌ Error saving AI plan to Supabase:', error);
        } else {
          console.log('✅ AI plan saved to Supabase');
        }
      }
    } catch (err) {
      console.error('❌ Gemini API Error:', err);
      setAiResponse('❌ Error generating itinerary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Your Smart Itinerary
      </h2>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => navigate('/planner')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded shadow"
        >
          🔙 Back to Planner
        </button>
        <button
          onClick={() => savedData && generateAI(savedData)}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow disabled:opacity-50"
        >
          🔁 Regenerate Itinerary
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">
          Generating your personalized plan...
        </p>
      ) : formattedResponse.length > 0 ? (
        <>
          <div className="space-y-6">
            {formattedResponse.map((day, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-lg shadow border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                  {day.title}
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {day.items.map((item, j) => (
                    <li key={j}>🌟 {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {costSummary.length > 0 && (
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-300 mt-8">
              <h3 className="text-xl font-semibold text-green-700 mb-3">
                Cost Summary
              </h3>
              <ul className="list-disc list-inside text-gray-800 space-y-1">
                {costSummary.map((item, index) => (
                  <li key={index}>💰 {item}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p className="text-red-500 text-center">{aiResponse}</p>
      )}
    </div>
  );
};

export default Result;
