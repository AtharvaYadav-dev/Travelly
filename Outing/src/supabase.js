import { createClient } from '@supabase/supabase-js';

// ✅ Replace these with your actual values







// ✅ Replace both values below with your actual Supabase values
const supabaseUrl = 'https://ppbobpctnabjbkbovgov.supabase.co'; 
const supabaseKey = 'sb_publishable_A0fK_4cRXn8EMaPzPQEu-A_-oq2vile';

export const supabase = createClient(supabaseUrl, supabaseKey);
