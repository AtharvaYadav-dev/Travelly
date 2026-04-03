import { useState, useCallback } from 'react';
import { supabase } from '../supabase';

/**
 * useVibeSearch Hook: Semantic Intent Matching
 * Uses pgvector cosine similarity to find destinations based on natural language
 */
export const useVibeSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchVibes = useCallback(async (vibeQuery) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Generate embedding for query (Llama/OpenAI/Mistral)
      // For demo, we simulate a vector generation then call Supabase RPC
      const queryEmbedding = Array.from({ length: 1536 }, () => Math.random() - 0.5);

      const { data, error } = await supabase.rpc('match_vibes', {
        query_embedding: queryEmbedding,
        match_threshold: 0.8, // Adjust for strictness
        match_count: 5
      });

      if (error) throw error;
      setResults(data);
    } catch (err) {
      console.error('❌ Vibe Search Failed:', err);
      setError(err.message);
      // Fallback Results
      setResults([{
        title: "Lahaul Valley",
        vibe_tag: "Cinematic Loneliness",
        description: "A stark, beautiful region in Himachal with no signal, only scale."
      }]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { searchVibes, results, loading, error };
};
