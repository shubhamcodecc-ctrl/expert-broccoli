# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require JWT authentication. Include token in header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register

```
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe" (optional)
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Status Codes:**
- 201: User created successfully
- 400: Invalid input or user already exists

---

#### Login

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Status Codes:**
- 200: Login successful
- 401: Invalid credentials

---

### Users

#### Get User Profile

```
GET /users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "preferences": {
      "categories": ["Technology", "Gaming"],
      "language": "en"
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized

---

#### Get User Preferences

```
GET /users/preferences
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": ["Technology", "Gaming", "Music"],
    "blockedChannels": ["spam_channel_id"],
    "blockedVideos": ["bad_video_id"],
    "language": "en",
    "maturityRating": "PG-13"
  }
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized

---

#### Update User Preferences

```
PUT /users/preferences
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "categories": ["Technology", "Gaming"],
  "blockedChannels": ["channel_id_to_block"],
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": ["Technology", "Gaming"],
    "blockedChannels": ["channel_id_to_block"],
    "language": "en"
  }
}
```

**Status Codes:**
- 200: Updated successfully
- 400: Invalid data
- 401: Unauthorized

---

### Videos

#### Get Recommendations

```
GET /videos/recommendations?limit=10&offset=0
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional, default: 10): Number of recommendations
- `offset` (optional, default: 0): Pagination offset
- `category` (optional): Filter by category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "videoId": "dQw4w9WgXcQ",
      "title": "Amazing Technology Breakthrough",
      "channelName": "Tech Channel",
      "channelId": "UCxxxxxx",
      "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg",
      "viewCount": 1500000,
      "likeCount": 50000,
      "reliability_score": 0.92,
      "reason": "Based on your interest in Technology",
      "relevance_score": 0.85
    }
  ],
  "total": 250
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized

---

#### Get Video Details

```
GET /videos/:videoId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `videoId`: YouTube video ID

**Response:**
```json
{
  "success": true,
  "data": {
    "videoId": "dQw4w9WgXcQ",
    "title": "Amazing Technology Breakthrough",
    "description": "This is an amazing technology breakdown...",
    "channelName": "Tech Channel",
    "channelId": "UCxxxxxx",
    "channelSubscribers": 5000000,
    "publishedAt": "2024-01-10T15:30:00Z",
    "viewCount": 1500000,
    "likeCount": 50000,
    "commentCount": 2000,
    "duration": "PT15M30S",
    "reliability_score": 0.92,
    "url": "https://youtube.com/watch?v=dQw4w9WgXcQ"
  }
}
```

**Status Codes:**
- 200: Success
- 404: Video not found
- 401: Unauthorized

---

#### Get Reliability Score

```
GET /videos/:videoId/reliability-score
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "videoId": "dQw4w9WgXcQ",
    "overallScore": 0.92,
    "components": {
      "engagementScore": 0.88,
      "channelCredibility": 0.95,
      "likeDislikeRatio": 0.96,
      "recencyScore": 0.80
    }
  }
}
```

**Status Codes:**
- 200: Success
- 404: Video not found
- 401: Unauthorized

---

### Watch History

#### Log Video Watch

```
POST /videos/watch-history
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "videoId": "dQw4w9WgXcQ",
  "watchedDuration": 900,
  "totalDuration": 930,
  "completionRate": 97,
  "watchedAt": "2024-01-15T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "videoId": "dQw4w9WgXcQ",
    "completionRate": 97,
    "watchedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Status Codes:**
- 201: Watch logged successfully
- 400: Invalid data
- 401: Unauthorized

---

#### Get Watch History

```
GET /videos/watch-history?limit=20&offset=0
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional, default: 20): Number of records
- `offset` (optional, default: 0): Pagination offset
- `fromDate` (optional): ISO date string, get history after this date
- `toDate` (optional): ISO date string, get history before this date

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "videoId": "dQw4w9WgXcQ",
      "title": "Video Title",
      "watchedAt": "2024-01-15T10:30:00Z",
      "completionRate": 97
    }
  ],
  "total": 125
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "message": "User not found",
    "code": "USER_NOT_FOUND",
    "statusCode": 404
  }
}
```

## Rate Limiting

API implements rate limiting:
- 100 requests per minute per IP
- 1000 requests per hour per IP
- Returns 429 (Too Many Requests) when exceeded

## CORS

CORS is enabled for the extension:
```
Allowed Origin: chrome-extension://[extension-id]
Allowed Methods: GET, POST, PUT, DELETE
Allowed Headers: Authorization, Content-Type
```

## Webhooks (Future)

Planned for Phase 2:
- Video metadata sync
- Recommendation model updates
- User preference notifications
