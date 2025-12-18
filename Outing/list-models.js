// List available Gemini models
const API_KEY = 'AIzaSyADmaIsPjfO8KLG2_D81YTkYDMQvdmvWg8';

async function listModels() {
  try {
    console.log('Fetching available models...');
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );

    const data = await response.json();

    if (data.models) {
      console.log('\n✅ Available models:');
      data.models.forEach(model => {
        console.log(`- ${model.name}`);
        console.log(`  Supported methods: ${model.supportedGenerationMethods?.join(', ')}`);
      });
    } else {
      console.log('Response:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listModels();
