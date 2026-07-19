# Architecture Overview

## System Design

```
┌─────────────────────────────────────────────────────────┐
│                  YouTube Website                         │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│          Chrome Extension (Content Script)              │
│  - Injects recommendation UI                            │
│  - Captures user interactions                           │
│  - Logs watch events                                    │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│      Extension Background Service Worker               │
│  - Manages authentication                              │
│  - Handles API communication                           │
│  - Local data storage (IndexedDB)                      │
└────────────────┬────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
   ┌────────┐      ┌──────────────┐
   │ Popup  │      │  Options     │
   │  UI    │      │    Page      │
   └────────┘      └──────────────┘
        │                 │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │  API Server     │
        │  (Port 5000)    │
        │                 │
        │  - Auth         │
        │  - Preferences  │
        │  - Videos       │
        │  - Scoring      │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │    MongoDB      │
        │                 │
        │  - Users        │
        │  - Preferences  │
        │  - Watch Log    │
        │  - Video Index  │
        └─────────────────┘
```

## Component Details

### 1. Chrome Extension

**Manifest V3 Structure:**
- `manifest.json` - Extension configuration
- `service_worker.js` - Background script (replaces content_scripts)
- `content.js` - Injects into YouTube pages
- React components for popup and options

**Data Flow:**
1. Content script detects YouTube page load
2. Injects recommendation widget
3. User interactions logged to background script
4. Background script communicates with backend API
5. Results stored locally in IndexedDB

### 2. Backend API (Node.js/Express)

**Layers:**
```
Routes (Express Router)
   ↓
Controllers (Request handling)
   ↓
Services (Business logic, recommendations)
   ↓
Models (MongoDB schemas)
   ↓
Database (MongoDB)
```

**Key Services:**
- `AuthService` - JWT authentication
- `UserService` - Profile and preference management
- `RecommendationService` - Scoring and ranking algorithm
- `VideoService` - Video metadata and indexing

### 3. Recommendation Engine

**Algorithm Stages:**

1. **Data Collection**
   - User watch history
   - Video metadata (title, description, channel)
   - Engagement metrics (likes, comments, views)

2. **Feature Extraction**
   - User behavior patterns
   - Video characteristics
   - Temporal patterns

3. **Scoring System**
   ```
   Final Score = (0.4 × User Preference Similarity)
                + (0.3 × Video Reliability)
                + (0.2 × Channel Credibility)
                + (0.1 × Recency Factor)
   
   Where:
   - User Preference Similarity: Cosine similarity with user vector
   - Video Reliability: (likes / (likes + dislikes)) × engagement_rate
   - Channel Credibility: Subscriber count × avg_engagement × verification_status
   - Recency Factor: exp(-days_old / 30)
   ```

4. **Ranking & Filtering**
   - Sort by score
   - Apply content filters (if any)
   - Return top N results

### 4. Data Models

**User**
```json
{
  "_id": "ObjectId",
  "email": "user@example.com",
  "preferences": {
    "categories": ["Tech", "Gaming"],
    "channels": ["favorites", "blocked"],
    "language": "en"
  },
  "watchHistory": ["videoId"],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Video**
```json
{
  "_id": "ObjectId",
  "youtubeId": "string",
  "title": "string",
  "description": "string",
  "channelId": "string",
  "metrics": {
    "views": "number",
    "likes": "number",
    "dislikes": "number",
    "comments": "number"
  },
  "lastUpdated": "timestamp"
}
```

**Watch Log**
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "videoId": "ObjectId",
  "watchedAt": "timestamp",
  "duration": "number (seconds)",
  "completionRate": "number (0-100)"
}
```

## Communication Flow

### Example: Getting Recommendations

1. **User Request (Extension)**
   ```
   GET /api/videos/recommendations?limit=10
   Headers: { Authorization: "Bearer token" }
   ```

2. **Backend Processing**
   - Validate JWT token
   - Fetch user preferences
   - Query recent watch history
   - Calculate recommendation scores
   - Return sorted results

3. **Extension Response**
   ```json
   {
     "recommendations": [
       {
         "youtubeId": "dQw4w9WgXcQ",
         "title": "Video Title",
         "channel": "Channel Name",
         "reliability_score": 0.92,
         "thumbnail": "url",
         "reason": "Based on your interest in Tech"
       }
     ]
   }
   ```

4. **UI Rendering**
   - Display recommendations in popup or YouTube page
   - Allow user interaction (click, dismiss, save)

## Security Considerations

1. **Authentication**: JWT tokens with expiration
2. **Authorization**: User can only access own data
3. **Data Privacy**: User watch history not shared
4. **CORS**: Extension uses specific API endpoint
5. **Rate Limiting**: Prevent API abuse
6. **Content Security Policy**: Extension follows CSP best practices

## Scalability

- **Horizontal Scaling**: Stateless API servers behind load balancer
- **Caching**: Redis for recommendation caching
- **Indexing**: MongoDB indexes on userId, videoId, timestamp
- **Batch Processing**: Async jobs for model updates
