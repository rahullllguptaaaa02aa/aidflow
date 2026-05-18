# AidFlow 🌿
### AI-Powered Community Resource Platform

> Connecting unmet community needs with unused surplus resources across Kolkata — in real time, powered by Google Firebase + Gemini AI.

**Live Demo:** [aidflow-b2ca5.web.app](https://aidflow-b2ca5.web.app)  
**Team:** Newcoderz | **Leader:** Rahul Gupta  
**Hackathon:** Google Solution Challenge 2026

---

## 🚨 The Problem

Local NGOs and community groups collect critical data through paper surveys and field reports — but this information stays scattered, making it impossible to:
- Identify the most urgent community needs clearly
- Connect available volunteers with the right tasks quickly
- Prevent surplus food and medicine from going to waste
- Address sensitive needs like menstrual hygiene with dignity

---

## 💡 Our Solution

AidFlow transforms scattered NGO field data into a unified, real-time community intelligence system. NGOs log needs, restaurants donate surplus, and Gemini AI automatically matches resources to needs based on urgency, location, and decay time — then dispatches the nearest volunteer instantly.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🗺️ **Live Heatmap** | Real-time Kolkata map with color-coded urgency circles (red=critical, orange=moderate, green=low) |
| ⏱️ **Decay Score Engine** | Every resource gets a freshness countdown. Perishables dispatched before they expire — automatically |
| 🔒 **Dignity Mode** | Women request sanitary/hygiene products anonymously using only their pincode. Zero identity stored |
| 🤖 **AI Volunteer Matching** | Gemini explains WHY each volunteer was matched to each task |
| 📊 **NGO Dashboard** | Real-time needs table with urgency badges, decay timers, and action buttons |
| 💝 **Donor Impact Dashboard** | Gemini writes personalized weekly impact stories from live Firebase data |
| 📦 **Resource Donor Portal** | Restaurants/pharmacies log surplus in 30 seconds with expiry slider |
| 🔔 **Real-time Notifications** | Instant alerts when new needs arrive or deliveries complete |
| 🏆 **Live Leaderboard** | Gamified donor rankings with impact scores |
| ➕ **Log New Need** | NGOs add urgent needs live — instantly updates heatmap and volunteer feed |

---

## 🏗️ Architecture
USERS
├── NGO Coordinators → Dashboard + Heatmap
├── Volunteers → Task Feed + Dispatch
├── Restaurants/Pharmacies → Resource Portal
├── Money Donors → Impact Dashboard
└── Anonymous Users → Dignity Mode
FRONTEND
└── React 18 + Tailwind CSS + Vite + React Router
└── Deployed on Firebase Hosting (Google Cloud)
BACKEND — Firebase (Google Cloud, asia-south1 Mumbai)
├── Firestore — needs, resources, volunteers, donors
├── Storage — photo uploads
├── Hosting — CDN + SSL
└── Auth — anonymous authentication
AI LAYER — Google Gemini API
├── gemini-1.5-flash — match explanations + impact stories
└── Gemini Vision — photo verification
MAPPING
└── Leaflet.js + OpenStreetMap (free, no API key)

---

## 🛠️ Tech Stack

**Frontend:** React 18, Tailwind CSS, Vite, React Router, Leaflet.js  
**Backend:** Firebase Firestore, Firebase Storage, Firebase Hosting, Firebase Auth  
**AI:** Google Gemini 1.5 Flash (Google AI Studio)  
**Maps:** Leaflet.js + OpenStreetMap  
**Hosting:** Firebase Hosting (Google Cloud, asia-south1)  
**Version Control:** GitHub  

---

## 💰 Cost

**Total cost to build and run: ₹0**

| Tool | Plan | Limit |
|------|------|-------|
| Firebase Firestore | Spark (Free) | 1GB storage, 50k reads/day |
| Firebase Hosting | Free | 10GB bandwidth/month |
| Gemini API | Free | 1,500 requests/day |
| Leaflet + OpenStreetMap | Free | Unlimited |
| React + Vite | Open Source | Unlimited |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Firebase account (free)
- Gemini API key (free from [aistudio.google.com](https://aistudio.google.com))

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/aidflow.git
cd aidflow

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your Gemini API key to .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Firestore, Storage, and Hosting
3. Replace the Firebase config in `src/firebase.js` with your project config
4. Set Firestore rules to allow read/write for development

### Seed Demo Data

```bash
node seedData.js
```

### Deploy to Firebase

```bash
npm run build
firebase deploy
```

---

## 📁 Project Structure
aidflow/
├── src/
│   ├── components/
│   │   ├── Heatmap.tsx        # Live Leaflet.js map
│   │   ├── Layout.tsx         # Navbar + notifications
│   │   ├── Navbar.tsx         # Navigation
│   │   └── ui/                # Shadcn UI components
│   ├── pages/
│   │   ├── Home.tsx           # Landing page with impact counters
│   │   ├── Dashboard.tsx      # NGO command center + heatmap
│   │   ├── Volunteers.tsx     # AI-matched task feed
│   │   ├── Resources.tsx      # Resource donation portal
│   │   ├── DonorImpact.tsx    # Impact dashboard + leaderboard
│   │   └── Dignity.tsx        # Anonymous request portal
│   ├── firebase.js            # Firebase config + exports
│   └── gemini.js              # Gemini AI config
├── seedData.js                # Demo data loader
├── .env                       # Environment variables (not committed)
└── firebase.json              # Firebase hosting config

---

## 🎯 5 User Types

| User | Page | What They Do |
|------|------|-------------|
| NGO Coordinator | Dashboard | Monitor heatmap, track needs, manage deliveries |
| Volunteer | Volunteer Feed | Accept tasks, get AI match explanation |
| Restaurant/Pharmacy | Resource Portal | Log surplus with expiry timer |
| Money Donor | Donor Impact | See impact, read AI story, climb leaderboard |
| Woman in need | Dignity Mode | Request hygiene products anonymously |

---

## 🌍 Impact

- **8 resource categories** — Food, Medicine, Hygiene, Sanitary, Shelter, Water, Clothing, Emergency
- **Real-time sync** — Firebase onSnapshot listeners update every screen instantly
- **Zero waste** — Decay engine ensures perishables reach people before expiring
- **Zero stigma** — Dignity Mode addresses menstrual hygiene — a problem no other platform solves
- **Zero cost** — Entirely free to run on Google Cloud free tier

---

## 🔮 Future Development

- **Phase 1** — WhatsApp integration, Bengali/Hindi voice input, 48hr scarcity prediction
- **Phase 2** — Expand to Mumbai, Delhi, Chennai; NGO partnership API
- **Long term** — Pan-India network, government disaster relief integration, open API

---

## 👥 Team Newcoderz

**Team Leader:** Rahul Gupta  
**Hackathon:** Google Solution Challenge 2026  
**Track:** Smart Resource Allocation — Data-Driven Volunteer Coordination for Social Impact

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<div align="center">
  Built with ❤️ for communities across Kolkata<br>
  Powered by Google Firebase + Gemini AI
</div>
