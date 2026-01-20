// Debug script to test Gemini API
const API_KEY = 'AIzaSyAojMJ5fpGIwWXdFDNwjqxMsRacUrsJIxA';

async function testGeminiAPI() {
    console.log('Testing Gemini API...');
    console.log('API Key:', API_KEY ? 'Present' : 'Missing');
    console.log('API Key length:', API_KEY.length);
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello, respond with just 'API working'" }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 100,
                }
            }),
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`);
        }

        const result = await response.json();
        console.log('Success response:', result);
        
        if (result.error) {
            throw new Error(`API Error: ${result.error.message}`);
        }

        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log('Generated text:', text);
        
    } catch (error) {
        console.error('API Test Error:', error);
    }
}

// Run test
testGeminiAPI();
