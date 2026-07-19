# YouTube Video Recommendation Extension

A smart Chrome extension that recommends the most reliable YouTube videos based on user's past viewing preferences and engagement patterns.

## Features

- **Smart Recommendations**: AI-powered video recommendations based on:
  - Watch history
  - Video engagement metrics (likes, views, channel credibility)
  - User preferences and viewing patterns
  - Video quality indicators

- **Reliability Score**: Proprietary algorithm that rates videos based on:
  - Channel authority and subscriber count
  - Video engagement ratio (likes/views)
  - Comment sentiment analysis
  - Viewer retention metrics

- **User Dashboard**: Track recommendation history and personalized analytics

- **Privacy-First**: All data processing happens locally with optional cloud sync

## Tech Stack

### Frontend
- **React 18** - UI components
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State management

### Backend
- **Node.js + Express** - API server
- **Python + FastAPI** - ML model serving
- **MongoDB** - User data & preferences
- **Redis** - Caching & sessions

### ML/AI
- **TensorFlow/PyTorch** - Recommendation model
- **Scikit-learn** - Feature engineering
- **NLTK** - Sentiment analysis

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Local development
- **GitHub Actions** - CI/CD pipeline
- **AWS/GCP** - Cloud deployment

## Project Structure

```
expert-broccoli/
├── extension/              # Chrome extension (content script, popup, background)
├── frontend/              # React dashboard UI
├── backend/               # Express API server
├── ml-service/            # Python FastAPI ML model
├── shared/                # Shared types and utilities
├── docker-compose.yml     # Local development environment
├── Dockerfile             # Multi-stage builds
└── .github/workflows/     # CI/CD automation
```

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Docker & Docker Compose
- MongoDB (via Docker)
- Redis (via Docker)

### Development Setup

```bash
# Clone the repository
git clone https://github.com/shubhamcodecc-ctrl/expert-broccoli.git
cd expert-broccoli

# Install dependencies
npm run setup

# Start all services (Docker Compose)
docker-compose up -d

# Run migrations and seed data
npm run db:migrate
npm run db:seed

# Start development servers
npm run dev
```

Services will be available at:
- Extension: Load from `extension/` in Chrome
- Frontend Dashboard: http://localhost:3000
- Backend API: http://localhost:5000
- ML API: http://localhost:8000
- MongoDB: localhost:27017
- Redis: localhost:6379

## Building for Production

```bash
# Build extension
npm run build:extension

# Build docker images
docker build -t youtube-recommendation-api .

# Push to registry
docker push your-registry/youtube-recommendation-api
```

## Testing

```bash
# Run all tests
npm run test

# Frontend tests
npm run test:frontend

# Backend tests
npm run test:backend

# ML model tests
npm run test:ml
```

## API Documentation

Swagger docs available at: http://localhost:5000/api/docs

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

MIT
