# 👑 Travelly: Ultimate King Edition 🌍✈️

> **The World's Most Advanced AI Travel Planner, built with a Cinematic Experience and Multi-Agent Intelligence.**

[![Status](https://img.shields.io/badge/status-Ultimate%20King-orange.svg?style=for-the-badge)](https://github.com/AtharvaYadav-dev/Travelly)
[![AI](https://img.shields.io/badge/AI-Groq%20%7C%20Llama%203.3-red.svg?style=for-the-badge)](https://groq.com/)
[![Framework](https://img.shields.io/badge/Framework-React%2019-blue.svg?style=for-the-badge)](https://react.dev/)
[![Design](https://img.shields.io/badge/Design-Cinematic%20GSAP-black.svg?style=for-the-badge)](https://gsap.com/)

---

## ✨ Why "Ultimate King"?

Travelly has been transformed from a simple itinerary tool into an enterprise-grade, cinematic AI powerhouse. It doesn't just generate text; it weaves a travel story with industry-leading technology and premium aesthetics.

### 🎥 Phase 1: Cinematic Visual Overhaul
- **GSAP Scroll-Jacking**: High-performance `ScrollTrigger` implementation in the Hero section for cinematic pinning and scrub-based storytelling.
- **Dynamic Theme Engine**: Integrated `fast-average-color` to extract dominant tones from destination images, dynamically shifting the entire app's primary theme in real-time.
- **Apple-esque Physics**: Upgraded `Magnetic.jsx` with high-stiffness spring physics (`stiffness: 350`, `mass: 0.5`) for a world-class tactile feel.

### 🛡️ Phase 2: Extreme System Robustness
- **AI Streaming (SSE)**: Character-by-character real-time itinerary generation using Server-Sent Events via the Groq API.
- **Strict Zod Validation**: Every AI response is validated against a rigorous schema to prevent hallucinations and malformed UI crashes.
- **Global Error Boundary**: A premium, fail-safe UI layer that catches runtime exceptions gracefully.
- **PWA Ready**: Offline-first stability with valid manifest icons and service worker precaching.

### 🎙️ Phase 3: Next-Gen AI Capabilities
- **Voice-to-Trip**: Native `webkitSpeechRecognition` integration. Just say *"Bhai, Goa ka plan banao 5 din ka budget 40k"* and watch the form auto-fill itself using AI parsing.
- **Smart Rerouting**: Don't like a specific day? Use the **✨ TWEAK DAY** button to regenerate individual days while keeping the rest of your itinerary intact.

### 🗺️ Phase 4: Multiplayer & Gamified Maps
- **Interactive Drag-and-Drop**: Every map pin is now interactive. Drag them to reroute your journey; the paths elastic-band in real-time.
- **Multiplayer Sync**: Built with **Supabase Realtime Broadcast**. Share your URL, and your friends can watch your map pins move live as you plan together.
- **Distance Gamification**: Real-time geodesic distance calculations with popping scale animations for a satisfying "score-counter" travel metric.

### ✈️ Phase 5: Real-World Integrations
- **Deep Booking Links**: Directly connected to **Skyscanner, Booking.com, and Viator**. 
- **Auto-Fill Data**: Your dates, cities, and participant counts are pre-injected into booking search queries so you can convert your dream into a ticket in one click.

---

## 🛠️ The Tech Stack (King's Choice)

| Layer | Technology |
|-------|------------|
| **Core** | React 19 (Latest), Vite 7, Tailwind CSS |
| **Logic** | JavaScript (ESNext), Zod (Validation), Supabase (Auth/Realtime) |
| **Animations** | GSAP 3.12 (ScrollTrigger), Framer Motion 12 |
| **Intelligence** | Groq (Llama 3.3 70B & 8B), Web Speech API |
| **Mapping** | React-Leaflet, OpenStreetMap, Geodesic Algorithms |
| **Performance** | PWA (Vite PWA), Fast Average Color |

---

## 🚀 Quick Setup (Dev Mode)

### Prerequisites
- Node.js v18+
- [Groq AI API Key](https://console.groq.com/keys)
- [Supabase Project](https://supabase.com/)

### Installation
1. **Clone & Enter**
   ```bash
   git clone https://github.com/AtharvaYadav-dev/Travelly.git
   cd Travelly
   ```

2. **Install Power**
   ```bash
   npm install
   ```

3. **Configure Environment (`.env`)**
   ```env
   VITE_GROQ_API_KEY=your_groq_key
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_WEATHER_API_KEY=your_weather_key
   ```

4. **Ignite**
   ```bash
   npm run dev
   ```

---

## 📅 Roadmap to the Future
- [x] Cinematic Scroll Overhaul
- [x] AI Streaming & Zod Validation
- [x] Voice-to-Trip (Llama Parsing)
- [x] Multiplayer Map Collaboration
- [x] Real-World Booking Deeplinks
- [ ] Multi-City Flight Routing Logic
- [ ] Expense Sharing Splitter
- [ ] Offline Map Downloads (Full PWA)

---

## 🤝 Community & Support
Developed with ❤️ by **Atharva**. For the travelers who want speed, and the developers who want power.

**"Ghumne Chale? Bhai!"** 🚀🌍
