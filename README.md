# Himuria
**NBA Playoff Community App**

A modern web application for NBA playoff predictions, leaderboards, and community engagement.

## 🏀 About

Himuria is a community-driven platform where NBA fans can:
- Make predictions for playoff series, champions, and Finals MVP
- Compete on leaderboards based on prediction accuracy
- Follow live game updates and scores
- Engage with other basketball fans

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **i18n**: i18next (English + Hebrew with RTL support)
- **Backend** (Coming in Step 2): Supabase

## 📁 Project Structure

```
src/
├── app/          # Router and layout configuration
├── pages/        # All page components
├── components/   # Reusable UI components
├── i18n/         # Internationalization files
└── lib/          # Utility functions and helpers
```

## 🛠️ Development

### Prerequisites
- Node.js 18+ and npm

### Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🌐 Available Routes

- `/` - Landing page
- `/auth` - Authentication hub
- `/login` - Login page
- `/register` - Registration page
- `/home` - Home feed
- `/predictions` - Predictions hub
- `/predictions/series/:seriesId` - Series prediction
- `/predictions/champion` - Champion pick
- `/predictions/mvp` - Finals MVP pick
- `/leaderboard` - Leaderboard
- `/game/:gameId` - Game details
- `/profile` - User profile and settings

## 🌍 Language Support

The app supports English and Hebrew with full RTL (Right-to-Left) support. Use the language toggle in the header to switch between languages.

## 📝 Development Status

**Step 1: Basic Structure** ✅ (Current)
- Project setup and configuration
- All pages with placeholder UI
- Routing and navigation
- i18n structure

**Step 2: Authentication** (Next)
- Supabase integration
- User authentication
- Protected routes
- User profiles

**Step 3: Backend Integration** (Future)
- Real-time game data
- Prediction submission and tracking
- Leaderboard calculations
- Social features
