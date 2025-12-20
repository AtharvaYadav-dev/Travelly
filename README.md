# 🌍 Travelly - AI-Powered Travel Itinerary Generator

> **Your intelligent travel companion that creates personalized day-by-day itineraries using Google Gemini AI**

![Status](https://img.shields.io/badge/status-active-success.svg)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-blue.svg)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB.svg)

---

## ✨ Features

- 🤖 **AI-Powered Generation** - Uses Google Gemini 2.0 Flash for intelligent itinerary creation
- 📅 **Day-by-Day Planning** - Detailed timeline with time-specific activities
- 💰 **Budget Management** - Stays within your budget with cost breakdowns
- 🎨 **Premium UI** - Beautiful, modern interface with smooth animations
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 💾 **Save & Share** - Copy itineraries to clipboard
- 🔄 **Regenerate** - Don't like it? Generate a new one instantly
- 🗺️ **Multiple Destinations** - Plan trips anywhere in the world

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   cd Travelly-1/Outing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   cp .env.example .env
   ```

4. **Add your API keys to `.env`**
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:5173
   ```

---

## 📖 How It Works

### User Flow

```
1. Navigate to /planner
   ↓
2. Fill out trip details
   ↓
3. Submit form
   ↓
4. AI generates itinerary
   ↓
5. View beautiful results on /result
```

### Technical Flow

```
Planner.jsx → Supabase → Result.jsx → Gemini API → Formatted Display
```

---

## 🎯 Usage Example

1. **Go to Planner** (`/planner`)
2. **Enter trip details:**
   - Trip Name: "Swiss Alps Adventure"
   - Location: "Interlaken, Switzerland"
   - Travelers: 2 people
   - Budget: $3,000
   - Type: "Hiking Adventure"
   - Dates: June 15-20, 2024

3. **Click "Create My Trip"**
4. **Wait 10-30 seconds** for AI generation
5. **View your personalized itinerary!**

---

## 📁 Project Structure

```
Outing/
├── src/
│   ├── Planner.jsx          # Trip planning form
│   ├── Result.jsx           # AI itinerary display
│   ├── HeroNew.jsx          # Landing page
│   ├── Navbar.jsx           # Navigation
│   ├── Footer.jsx           # Footer component
│   ├── Loader.jsx           # Loading animation
│   ├── supabase.js          # Database config
│   └── index.css            # Global styles
├── .env                     # Environment variables
├── package.json             # Dependencies
├── ITINERARY_SETUP_GUIDE.md # Detailed setup guide
└── TESTING_GUIDE.md         # Testing instructions
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | Frontend framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Smooth animations |
| **Google Gemini AI** | Itinerary generation |
| **Supabase** | Database & authentication |
| **React Router** | Client-side routing |

---

## 📚 Documentation

- **[Setup Guide](./ITINERARY_SETUP_GUIDE.md)** - Comprehensive setup instructions
- **[Testing Guide](./TESTING_GUIDE.md)** - How to test the application
- **[.env.example](./.env.example)** - Environment variables template

---

## 🎨 Features in Detail

### AI Itinerary Generation
- Uses Google Gemini 2.0 Flash Experimental model
- Generates 1-7 day itineraries
- Includes time-specific activities
- Provides cost estimates
- Matches trip type preferences

### Beautiful UI
- Premium glassmorphism effects
- Smooth scroll animations
- Responsive design
- Dark mode optimized
- Custom cursor effects

### Smart Features
- Real-time form preview
- Budget breakdown
- Copy to clipboard
- Regenerate option
- Error handling with helpful messages

---

## 🐛 Troubleshooting

### "API Key missing" error
**Solution:** Add your Gemini API key to `.env` file and restart the dev server

### Blank result page
**Solution:** Make sure you submitted the form from `/planner` first

### "Failed to generate" error
**Solution:** 
- Check your internet connection
- Verify API key is valid
- Check Gemini API quota limits
- Look at browser console for detailed errors

### More help?
Check the [Setup Guide](./ITINERARY_SETUP_GUIDE.md) and [Testing Guide](./TESTING_GUIDE.md)

---

## 🔐 Security

- Never commit `.env` file to version control
- Keep API keys secret
- Use environment variables for sensitive data
- `.gitignore` includes `.env` by default

---

## 🚀 Deployment

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Deploy to Vercel/Netlify
1. Connect your repository
2. Add environment variables in dashboard
3. Deploy!

---

## 📝 License

This project is part of the Travelly application.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## 👨‍💻 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🎉 What's New

### Recent Enhancements (Latest)

✅ **Improved AI Prompt** - Better structured prompts for more consistent results  
✅ **Enhanced Error Handling** - Clear error messages with solutions  
✅ **Better Parsing** - More robust parsing of AI responses  
✅ **User Feedback** - Loading states and success/error notifications  
✅ **Updated Model** - Using latest Gemini 2.0 Flash Experimental  
✅ **Documentation** - Comprehensive setup and testing guides  

---

## 📞 Support

Having issues? 
1. Check the [Setup Guide](./ITINERARY_SETUP_GUIDE.md)
2. Read the [Testing Guide](./TESTING_GUIDE.md)
3. Look at browser console for errors
4. Verify your `.env` configuration

---

## ⭐ Acknowledgments

- Google Gemini AI for powering the itinerary generation
- Unsplash for beautiful destination images
- Framer Motion for smooth animations
- The React community

---

**Made with ❤️ for travelers around the world 🌍✈️**

---

## 🎯 Roadmap

Future enhancements:
- [ ] PDF export
- [ ] Email itinerary
- [ ] Multiple itinerary comparison
- [ ] Weather integration
- [ ] Map integration
- [ ] Collaborative planning
- [ ] Social sharing
- [ ] Mobile app

---

**Ready to start planning your next adventure? Let's go! 🚀**
