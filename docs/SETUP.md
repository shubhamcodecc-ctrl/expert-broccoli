# Setup Guide

## Prerequisites

- Node.js v16 or higher
- npm v8 or higher (or yarn)
- MongoDB (local or Atlas)
- Chrome browser (v90+)
- Git

## Step 1: Clone Repository

```bash
git clone https://github.com/shubhamcodecc-ctrl/expert-broccoli.git
cd expert-broccoli
```

## Step 2: Install Dependencies

### Option A: Install all at once (recommended)
```bash
npm install
```

This will install dependencies for both extension and backend (using workspaces).

### Option B: Manual installation
```bash
# Backend
cd backend
npm install
cd ..

# Extension
cd extension
npm install
cd ..
```

## Step 3: Set Up Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# Backend
PORT=5000
NODE_ENV=development

# MongoDB - Use local or Atlas
MONGODB_URI=mongodb://localhost:27017/youtube-recommender

# JWT
JWT_SECRET=your-super-secret-key-here-change-in-prod

# Extension
EXTENSION_API_URL=http://localhost:5000
```

## Step 4: Set Up MongoDB

### Option A: Local MongoDB

**Mac (with Homebrew):**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongod
```

**Windows:**
- Download from https://www.mongodb.com/try/download/community
- Run installer
- Start MongoDB Service from Services

### Option B: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string
4. Add to `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/youtube-recommender
   ```

### Option C: Docker

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Step 5: Start Backend Server

```bash
npm run backend:dev
```

You should see:
```
Server running on http://localhost:5000
Connected to MongoDB
```

## Step 6: Build Extension

In a new terminal:
```bash
npm run extension:build:dev
```

Output files will be in `extension/dist/`

## Step 7: Load Extension in Chrome

1. Open Chrome
2. Go to `chrome://extensions`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Select the `extension/dist` folder

You should see the extension appear in your extensions list.

## Step 8: Verify Setup

1. Click the extension icon in Chrome toolbar
2. You should see the popup
3. If not logged in, you can register/login
4. Visit YouTube.com
5. You should see recommendation widget on the page

## Development Workflow

### Watch Mode (Auto-rebuild)

Run this in the root directory:
```bash
npm run dev
```

This runs both backend and extension in watch mode. Changes will auto-rebuild.

### Backend Development

```bash
npm run backend:dev
```

- API runs on `http://localhost:5000`
- Hot-reload on file changes
- Debug logs printed to console

### Extension Development

```bash
npm run extension:build:dev
```

- Builds to `extension/dist`
- After building, refresh extension in Chrome (or use auto-reload)
- Open popup to test UI

### Testing

```bash
# Run all tests
npm run test

# Run specific tests
npm run backend:test
npm run extension:test
```

## Useful Chrome DevTools

### For Extension Popup
1. Right-click extension icon
2. Select "Inspect popup"
3. DevTools opens for the popup context

### For Content Script
1. Go to any YouTube page
2. Open DevTools (F12)
3. Look for content script logs

### Service Worker Debugging
1. Go to `chrome://extensions`
2. Find the extension
3. Click "Service worker" link
4. DevTools opens for the service worker

## API Testing

### Using cURL

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Using Postman

1. Install Postman
2. Import collection from `docs/postman-collection.json` (we'll create this)
3. Set variables for `baseUrl` and `token`
4. Test endpoints

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongooseError: Cannot connect to MongoDB`

**Solution:**
- Check MongoDB is running: `mongosh` should connect
- Verify `MONGODB_URI` in `.env`
- Check firewall if using remote MongoDB

### Extension Not Showing

**Error:** Extension doesn't appear after loading unpacked

**Solution:**
- Check `extension/dist` exists
- Refresh the extensions page (Ctrl+R)
- Check DevTools for errors
- Try rebuilding: `npm run extension:build`

### API Calls Failing

**Error:** 404 or 500 errors from extension

**Solution:**
- Check backend is running on port 5000
- Verify `EXTENSION_API_URL` in `.env`
- Check browser console for CORS errors
- Restart backend server

### Port Already in Use

**Error:** `Port 5000 already in use`

**Solution:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

## Next Steps

1. Read `docs/API.md` for available endpoints
2. Check `extension/src` for component structure
3. Review `backend/src/services/recommendationService.ts` for algorithm
4. See `docs/CONTRIBUTING.md` for code standards
