# 🧪 Testing Your Itinerary Generator

## Quick Test Steps

### 1. Check if API Key is Set

Open your browser console (F12) and run:
```javascript
console.log(import.meta.env.VITE_GEMINI_API_KEY ? 'API Key is set ✅' : 'API Key missing ❌');
```

### 2. Test the Complete Flow

1. **Navigate to Planner**
   - Go to `http://localhost:5173/planner`

2. **Fill Out the Form**
   ```
   Trip Name: "Swiss Alps Adventure"
   Location: "Interlaken, Switzerland"
   Number of Travelers: 2
   Budget: 3000
   Trip Type: "Hiking Adventure"
   Start Date: (any future date)
   End Date: (3-5 days after start)
   ```

3. **Submit and Watch**
   - Click "Create My Trip"
   - You should see: "Creating your itinerary..."
   - Then redirect to `/result`
   - Loading animation appears
   - AI generates itinerary (10-30 seconds)
   - Beautiful result displays!

### 3. What to Expect

**On Success:**
- ✅ Day-by-day timeline
- ✅ Time-specific activities
- ✅ Cost breakdown sidebar
- ✅ Beautiful images for each day
- ✅ Copy/Regenerate buttons work

**On Error:**
- ❌ Check browser console for errors
- ❌ Verify API key in `.env`
- ❌ Check internet connection
- ❌ Verify Gemini API quota

### 4. Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "API Key missing" | Add `VITE_GEMINI_API_KEY` to `.env` file |
| Blank result page | Submit form from `/planner` first |
| "Failed to generate" | Check API key validity and quota |
| No cost summary | AI might not include it - try regenerate |

### 5. Verify Database (Optional)

If using Supabase:
```javascript
// In browser console
const { data } = await supabase.from('itineraries').select('*');
console.log(data);
```

### 6. Test Regeneration

1. On result page, click "Regenerate"
2. Should generate a new itinerary
3. Different activities but same structure

### 7. Test Copy Function

1. Click "Copy Plan"
2. Paste into notepad
3. Should see formatted itinerary text

---

## Sample Expected Output

```
Day 1
[08:00 AM] Breakfast at Hotel: Traditional Swiss breakfast (Est: $25)
[10:00 AM] Jungfraujoch Excursion: Top of Europe experience (Est: $200)
[01:00 PM] Lunch at Mountain Restaurant: Alpine cuisine (Est: $40)
[03:00 PM] Hiking in Lauterbrunnen: Valley of waterfalls (Est: $0)
[07:00 PM] Dinner in Interlaken: Local specialties (Est: $60)

Day 2
[09:00 AM] Breakfast at Café: Coffee and pastries (Est: $20)
[10:30 AM] Paragliding Adventure: Tandem flight (Est: $180)
...

Cost Summary:
Accommodation: $600
Food & Dining: $400
Activities: $800
Transportation: $200
Miscellaneous: $100
Total Estimated Cost: $2,100
```

---

## Debug Mode

If things aren't working, add this to `Result.jsx` temporarily:

```javascript
// After line 113 (after setAiResponse)
console.log('=== AI RESPONSE ===');
console.log(text);
console.log('=== PARSED DAYS ===');
console.log(days);
console.log('=== COST SUMMARY ===');
console.log(costSummary);
```

This will help you see exactly what the AI returned and how it was parsed.

---

## Performance Tips

- **First generation**: 15-30 seconds (normal)
- **Regeneration**: 10-20 seconds
- **Larger budgets**: Might take longer (more details)
- **More days**: Longer generation time

---

## Next Steps After Testing

Once it works:
1. ✅ Test with different locations
2. ✅ Try various budgets
3. ✅ Test different trip types
4. ✅ Share with friends!
5. ✅ Consider adding more features

---

**Happy Testing! 🎉**
