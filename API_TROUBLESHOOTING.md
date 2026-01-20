# Gemini API Troubleshooting Guide

## Error: "Unable to generate itinerary. Please check your internet connection and API key configuration."

### Common Issues and Solutions:

## 1. **API Key Issues**

### Check API Key Validity:
- Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
- Verify your API key is still active
- Check if you have quota remaining

### API Key Format:
Your current key: `AIzaSyAojMJ5fpGIwWXdFDNwjqxMsRacUrsJIxA`
- Should be 39 characters long
- Should start with "AIzaSy"

## 2. **API Endpoint Issues**

### Current Endpoint in Code:
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent
```

### Alternative Endpoints to Try:
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
```

## 3. **Network Issues**

### Check:
- Internet connection
- Firewall blocking API calls
- CORS issues (if running locally)

## 4. **Quota Issues**

### Check Google AI Console:
- Go to [Google AI Console](https://console.cloud.google.com/ai)
- Check API usage and quotas
- Verify billing is set up if required

## 5. **Testing the API**

### Test with HTML File:
1. Open `test-api.html` in your browser
2. Click "Test API Key" button
3. Check the result

### Test with Node.js:
```bash
node debug-api.js
```

## 6. **Quick Fixes to Try**

### Option 1: Generate New API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Update your `.env` file:
   ```
   VITE_GEMINI_API_KEY=your_new_api_key_here
   ```

### Option 2: Try Different Model
Update the API endpoint in `Result.jsx`:
```javascript
// Change this line:
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${key}`, {

// To this:
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
```

### Option 3: Check Environment Variables
Make sure your `.env` file is properly formatted:
```
VITE_SUPABASE_URL=https://ppbobpctnabjbkbovgov.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_A0fK_4cRXn8EMaPzPQEu-A_-oq2vile
VITE_GEMINI_API_KEY=AIzaSyAojMJ5fpGIwWXdFDNwjqxMsRacUrsJIxA
```

## 7. **Debug Steps**

1. **Check Browser Console**: Open DevTools (F12) and look for specific error messages
2. **Network Tab**: Check if the API call is being made and what response it returns
3. **Environment Variables**: Verify the API key is being loaded correctly

## 8. **Contact Support**

If none of these solutions work:
- Check [Google AI Status](https://status.cloud.google.com/) for outages
- Review [Google AI Documentation](https://ai.google.dev/gemini-api/docs)
- Check your Google Cloud billing status

## Next Steps:

1. First, test with the `test-api.html` file I created
2. If that works, the issue is in the application code
3. If that fails, the issue is with the API key or Google services
4. Try generating a new API key as a last resort
