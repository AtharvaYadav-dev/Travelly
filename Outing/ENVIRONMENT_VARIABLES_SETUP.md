# 🔧 HOW TO ADD ENVIRONMENT VARIABLES TO VERCEL

## The Problem You're Seeing:
Your app shows "❌ Failed to generate" because the Gemini API key is missing on Vercel.

---

## STEP-BY-STEP SOLUTION:

### Step 1: Go to Vercel Dashboard
1. Open your browser
2. Go to: **https://vercel.com/dashboard**
3. Log in if needed

### Step 2: Select Your Project
1. Find your **Travelly** project in the list
2. Click on it to open

### Step 3: Open Settings
1. Click **"Settings"** in the top navigation bar
2. Click **"Environment Variables"** in the left sidebar

### Step 4: Add Each Variable

You need to add **4 variables**. For each one:

#### Variable 1: VITE_SUPABASE_URL
```
Name: VITE_SUPABASE_URL
Value: https://ppbobpctnabjbkbovgov.supabase.co
```
- Click **"Add New"** button
- Paste the name in the "Key" field
- Paste the value in the "Value" field
- ✅ Check **Production**
- ✅ Check **Preview**
- ✅ Check **Development**
- Click **"Save"**

#### Variable 2: VITE_SUPABASE_ANON_KEY
```
Name: VITE_SUPABASE_ANON_KEY
Value: sb_publishable_A0fK_4cRXn8EMaPzPQEu-A_-oq2vile
```
- Click **"Add New"** button
- Paste the name in the "Key" field
- Paste the value in the "Value" field
- ✅ Check **Production**
- ✅ Check **Preview**
- ✅ Check **Development**
- Click **"Save"**

#### Variable 3: GEMINI_API_KEY
```
Name: GEMINI_API_KEY
Value: AIzaSyAojMJ5fpGIwWXdFDNwjqxMsRacUrsJIxA
```
- Click **"Add New"** button
- Paste the name in the "Key" field
- Paste the value in the "Value" field
- ✅ Check **Production**
- ✅ Check **Preview**
- ✅ Check **Development**
- Click **"Save"**

#### Variable 4: VITE_GEMINI_API_KEY
```
Name: VITE_GEMINI_API_KEY
Value: AIzaSyAojMJ5fpGIwWXdFDNwjqxMsRacUrsJIxA
```
- Click **"Add New"** button
- Paste the name in the "Key" field
- Paste the value in the "Value" field
- ✅ Check **Production**
- ✅ Check **Preview**
- ✅ Check **Development**
- Click **"Save"**

---

### Step 5: Verify All Variables Are Added

You should now see **4 environment variables** listed:
- ✅ VITE_SUPABASE_URL
- ✅ VITE_SUPABASE_ANON_KEY
- ✅ GEMINI_API_KEY
- ✅ VITE_GEMINI_API_KEY

Each should show: **Production, Preview, Development**

---

### Step 6: Redeploy Your Application

**IMPORTANT:** Adding environment variables does NOT automatically redeploy. You must manually redeploy!

1. Click **"Deployments"** tab (top navigation)
2. Find the **latest deployment** (should be at the top)
3. Click the **three dots (...)** on the right side
4. Click **"Redeploy"**
5. **UNCHECK** the box that says "Use existing Build Cache"
6. Click **"Redeploy"** button

---

### Step 7: Wait for Deployment (2-3 minutes)

Watch the deployment progress. It should:
1. ✅ Clone repository
2. ✅ Install dependencies
3. ✅ Build application
4. ✅ Deploy

---

### Step 8: Test Your App

1. Once deployment is complete, click **"Visit"** to open your live site
2. Log in or sign up
3. Go to **"Plan Your Outing"**
4. Fill out the form completely
5. Click **"Generate Itinerary"**
6. You should now see a **detailed AI-generated plan** instead of "Failed to generate"!

---

## 🎯 Quick Copy-Paste Reference:

```
VITE_SUPABASE_URL=https://ppbobpctnabjbkbovgov.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_A0fK_4cRXn8EMaPzPQEu-A_-oq2vile
GEMINI_API_KEY=AIzaSyAojMJ5fpGIwWXdFDNwjqxMsRacUrsJIxA
VITE_GEMINI_API_KEY=AIzaSyAojMJ5fpGIwWXdFDNwjqxMsRacUrsJIxA
```

---

## 🐛 Troubleshooting:

### If it still shows "Failed to generate":

1. **Check Browser Console:**
   - Press F12 on your live site
   - Go to "Console" tab
   - Look for error messages
   - Share screenshot if you see errors

2. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Deployments
   - Click on latest deployment
   - Click "Functions" tab
   - Look for `/api/generate` errors

3. **Verify Environment Variables:**
   - Go to Settings → Environment Variables
   - Make sure all 4 are there
   - Make sure "Production" is checked for each

4. **Check Gemini API Key:**
   - Go to https://makersuite.google.com/app/apikey
   - Verify your API key is active
   - Check if you have quota remaining

---

## 📸 Visual Guide:

### Where to find Environment Variables:
```
Vercel Dashboard
  └─ Your Project (Travelly)
      └─ Settings (top menu)
          └─ Environment Variables (left sidebar)
              └─ Add New (button)
```

### What each variable does:
- **VITE_SUPABASE_URL**: Connects to your database
- **VITE_SUPABASE_ANON_KEY**: Authenticates with Supabase
- **GEMINI_API_KEY**: Server-side AI generation (primary)
- **VITE_GEMINI_API_KEY**: Client-side AI generation (fallback)

---

**Follow these steps exactly, and your app will work! 🎉**
