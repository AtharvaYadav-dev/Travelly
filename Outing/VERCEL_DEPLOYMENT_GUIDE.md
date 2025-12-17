# 🚀 Vercel Deployment Guide for Travelly

## ⚠️ CRITICAL: Environment Variables Setup

Your app is **NOT working on Vercel** because the environment variables are missing. Follow these steps:

### Step 1: Add Environment Variables to Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your **Travelly** project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://ppbobpctnabjbkbovgov.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_A0fK_4cRXn8EMaPzPQEu-A_-oq2vile` | Production, Preview, Development |
| `GEMINI_API_KEY` | `AIzaSyAojMJ5fpGIwWXdFDNwjqxMsRacUrsJIxA` | Production, Preview, Development |
| `VITE_GEMINI_API_KEY` | `AIzaSyAojMJ5fpGIwWXdFDNwjqxMsRacUrsJIxA` | Production, Preview, Development |

⚠️ **IMPORTANT:** 
- Select **ALL environments** (Production, Preview, Development) for each variable
- Click "Save" after adding each variable

### Step 2: Redeploy Your Application

After adding environment variables:

1. Go to **Deployments** tab in Vercel
2. Click on the **three dots (...)** next to your latest deployment
3. Select **Redeploy**
4. Check **"Use existing Build Cache"** is UNCHECKED
5. Click **Redeploy**

OR simply push a new commit to trigger automatic redeployment.

---

## 🔧 What Was Fixed

### 1. Created `vercel.json`
- Configured proper API routing for `/api/generate`
- Set up CORS headers for API requests
- Specified build command and output directory

### 2. How the App Works

**Flow:**
1. User fills out trip planning form → Saves to Supabase
2. Navigates to `/result` page
3. App tries to call `/api/generate` (Vercel serverless function)
4. If that fails, falls back to direct Gemini API call using `VITE_GEMINI_API_KEY`
5. AI generates detailed itinerary
6. Result is displayed and saved to Supabase

**Why it's failing on Vercel:**
- Environment variables are missing
- API can't access `GEMINI_API_KEY`
- Client-side fallback can't access `VITE_GEMINI_API_KEY`
- Result: ❌ "Failed to generate itinerary"

---

## 🧪 Testing After Deployment

1. Visit your Vercel URL
2. Sign up / Log in
3. Go to "Plan Your Outing"
4. Fill out the form completely
5. Click "Generate Itinerary"
6. You should be redirected to `/result` with AI-generated plan

---

## 🐛 Troubleshooting

### If it still doesn't work:

1. **Check Vercel Logs:**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on latest deployment → "View Function Logs"
   - Look for errors related to `GEMINI_API_KEY`

2. **Check Browser Console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for errors like "Missing VITE_GEMINI_API_KEY"

3. **Verify Environment Variables:**
   - In Vercel Dashboard → Settings → Environment Variables
   - Make sure ALL 4 variables are present
   - Make sure they're enabled for "Production"

4. **Check Supabase Connection:**
   - Make sure your Supabase project is active
   - Verify the `itineraries` table exists
   - Check RLS (Row Level Security) policies allow inserts/updates

---

## 📝 Security Note

⚠️ **Your API keys are exposed in this guide!** 

For production apps, you should:
1. Regenerate your Gemini API key
2. Use Supabase service role key (not anon key) for sensitive operations
3. Add API key restrictions in Google Cloud Console
4. Never commit `.env` files to Git

---

## 🎯 Quick Checklist

- [ ] Added all 4 environment variables to Vercel
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Saved all variables
- [ ] Redeployed the application (without cache)
- [ ] Tested the live URL
- [ ] Checked Vercel function logs if issues persist

---

## 💡 Additional Tips

- The app has a **fallback mechanism**: if `/api/generate` fails, it tries direct Gemini API
- Both paths need the respective API keys to work
- The `vercel.json` file ensures proper API routing
- Make sure your Gemini API key has quota remaining

---

**Need help?** Check the Vercel deployment logs or browser console for specific error messages.
