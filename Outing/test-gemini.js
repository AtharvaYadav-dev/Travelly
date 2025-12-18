// Quick test of Gemini API
const API_KEY = 'AIzaSyADmaIsPjfO8KLG2_D81YTkYDMQvdmvWg8';

async function testGemini() {
  try {
    console.log('Testing Gemini API...');
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: 'Say hello in one word' }]
          }]
        })
      }
    );

    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));

    if (data.candidates && data.candidates[0]) {
      console.log('\n✅ SUCCESS! Generated text:', data.candidates[0].content.parts[0].text);
    } else if (data.error) {
      console.log('\n❌ ERROR:', data.error.message);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGemini();
