# YouTube Video Recommender Extension

A Chrome extension that recommends YouTube videos based on user viewing history and preferences, surfacing the most reliable videos tailored to individual user behavior.

## Features

✨ **Core Capabilities:**
- 🎥 Personalized video recommendations based on watch history
- 📊 Reliability scoring system (engagement, channel credibility, likes)
- 👤 User preference learning and adaptation
- 🔍 Smart video discovery suggestions
- 🎯 Real-time recommendations on YouTube pages
- 💾 Persistent user profiles and preference tracking
- 🔐 Privacy-first design with local and optional cloud sync

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Extension API:** Chrome Extension Manifest V3
- **Backend:** Node.js + Express, MongoDB
- **ML:** TensorFlow.js for recommendation algorithms
- **Build:** Webpack, Vite
- **Testing:** Jest, React Testing Library

## Project Structure

```
expert-broccoli/
├── extension/              # Chrome Extension source
│   ├── public/
│   │   ├── manifest.json   # Extension manifest (MV3)
│   │   ├── icons/          # Extension icons (16, 48, 128px)
│   │   └── popup.html
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── background/     # Service worker
│   │   ├── content/        # Content script for YouTube
│   │   ├── popup/          # Extension popup UI
│   │   ├── options/        # Settings page
│   │   └── utils/          # Utilities and helpers
│   └── package.json
│
├── backend/                # Node.js/Express API
│   ├── src/
│   │   ├── controllers/    # API controllers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth, validation
│   │   ├── services/       # Business logic
│   │   └── config/         # Configuration
│   ├── tests/              # API tests
│   └── package.json
│
├── ml/                     # ML recommendation engine
│   ├── models/             # Pre-trained models
│   ├── scripts/            # Training scripts
│   └── requirements.txt
│
├── docs/                   # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── SETUP.md
│   └── CONTRIBUTING.md
│
├── docker-compose.yml      # Development environment
├── .env.example
└── .gitignore
```

## Getting Started

### Prerequisites
- Node.js >= 16
- npm or yarn
- MongoDB (local or Atlas)
- Chrome browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shubhamcodecc-ctrl/expert-broccoli.git
   cd expert-broccoli
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd extension && npm install
   cd ../backend && npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and API keys
   ```

4. **Start backend server**
   ```bash
   npm run backend:dev
   ```

5. **Build extension**
   ```bash
   npm run extension:build:dev
   ```

6. **Load extension in Chrome**
   - Go to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select `extension/dist` folder

## Development

### Watch mode (auto-rebuild)
```bash
npm run dev  # Runs both backend and extension in watch mode
```

### Run tests
```bash
npm run test
```

### Build for production
```bash
npm run build
```

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/users/preferences` - Get user preferences
- `PUT /api/users/preferences` - Update preferences
- `GET /api/videos/recommendations` - Get personalized recommendations
- `POST /api/videos/watch-history` - Log watched video
- `GET /api/videos/reliability-score` - Get video reliability score

## How the Recommendation Algorithm Works

1. **Data Collection:** Tracks user watch history, engagement (likes, dislikes, comments)
2. **Feature Extraction:** Analyzes video metadata, channel info, user patterns
3. **Scoring:** Combines multiple factors:
   - User preference similarity
   - Video reliability (engagement rate, likes/dislikes)
   - Channel credibility
   - Recency and popularity
4. **Ranking:** Returns top-N personalized recommendations

## Browser Support

- Chrome 90+
- Edge 90+ (Chromium-based)

## License

MIT License - see LICENSE file for details

## Contributing

See CONTRIBUTING.md for development guidelines

## Roadmap

- [ ] Firefox extension support
- [ ] Advanced ML model integration
- [ ] Cloud sync with privacy controls
- [ ] Video clustering by topic
- [ ] Collaborative filtering
- [ ] Dark mode UI
- [ ] Analytics dashboard
