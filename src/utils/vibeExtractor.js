/**
 * Sovereign Vibe Extractor (Vision AI)
 * Extracting aesthetic soul from pixels via Llama 3.2 Vision.
 */

export const extractVibeFromImage = async (imageBlob) => {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  if (!key) throw new Error("Bhai, Groq API key toh daal pehle!");

  // Convert blob to base64 for vision processing
  const base64Image = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(imageBlob);
  });

  console.log("🏙️ Sovereign Reasoner: Extracting vibes from visual buffer...");

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${key}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        model: 'llama-3.2-11b-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: "Analyze this travel image. Extract exactly 3 aesthetic keywords (vibes) like 'cinematic loneliness', 'neon grit', or 'tranquil heritage'. Only output the keywords separated by commas."
              },
              {
                type: 'image_url',
                image_url: { url: `data:image/jpeg;base64,${base64Image}` }
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    const vibes = data.choices[0].message.content.split(',');
    
    console.log("✅ Sovereign Reasoner: Vibes extracted successfully:", vibes);
    
    return vibes.map(v => v.trim().toLowerCase());
  } catch (error) {
    console.error("❌ Sovereign Reasoner: Vision system failure!", error);
    // Bhai logic: Fallback vibes
    return ['cinematic', 'heritage', 'adventure'];
  }
};
