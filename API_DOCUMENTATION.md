# Backend API Documentation

## Base URL
```
http://localhost:8000
```

## Available Endpoints

### 1. Analytics Overview
**Endpoint:** `POST /api/analytics/overview`

**Request Body:**
```json
{
  "project_id": "string",
  "start": "string (YYYY-MM-DD or ISO-8601)",
  "end": "string (YYYY-MM-DD or ISO-8601)"
}
```

**Response Format:**
```json
{
  "metrics": {
    "total_interactions": 229,
    "unique_users": 71,
    "avg_session_duration": 837.3,
    "completion_rate": 0.47,
    "satisfaction_score": 3.5
  },
  "interactions_chart": [
    {
      "date": "2025-09-01T06:00:00.000Z",
      "interactions": 4
    }
  ],
  "top_intents": [
    {
      "intent": "None",
      "count": 132,
      "percentage": 57.6
    }
  ],
  "sentiment_distribution": {
    "positive": 36,
    "neutral": 23,
    "negative": 21
  }
}
```

---

### 2. Analytics Comparison
**Endpoint:** `POST /api/analytics/compare`

**Request Body:**
```json
{
  "project_id": "string",
  "start": "string (YYYY-MM-DD or ISO-8601)",
  "end": "string (YYYY-MM-DD or ISO-8601)"
}
```

**Response Format:**
```json
{
  "current": {
    "metrics": { /* same as overview */ },
    "interactions_chart": [ /* same as overview */ ],
    "top_intents": [ /* same as overview */ ],
    "sentiment_distribution": { /* same as overview */ }
  },
  "previous": {
    "metrics": { /* same as overview */ },
    "interactions_chart": [ /* same as overview */ ],
    "top_intents": [ /* same as overview */ ],
    "sentiment_distribution": { /* same as overview */ }
  },
  "changes": {
    "total_interactions": 15.2,
    "unique_users": -5.8,
    "avg_session_duration": 2.1,
    "completion_rate": -12.5,
    "satisfaction_score": 8.3
  }
}
```

---

### 3. Transcripts List
**Endpoint:** `GET /api/analytics/transcripts`

**Query Parameters:**
- `project_id` (string, required)
- `start` (string, required) - YYYY-MM-DD or ISO-8601
- `end` (string, required) - YYYY-MM-DD or ISO-8601
- `limit` (integer, optional) - default: 100
- `skip` (integer, optional) - default: 0
- `order` (string, optional) - "DESC" or "ASC", default: "DESC"

**Example Request:**
```
GET /api/analytics/transcripts?project_id=688666ba51c1d0b2cc252cbe&start=2025-09-01&end=2025-10-01&limit=25&skip=0&order=DESC
```

**Response Format:**
```json
[
  {
    "id": "68dbd574e97538911f860a7a",
    "sessionID": "g9o39z28627evsn03yy84b60",
    "createdAt": "2025-09-30T13:04:51.916Z",
    "endedAt": "2025-09-30T13:20:07.407Z",
    "duration": 915,
    "sentiment": 1,
    "resolution": false,
    "course_recommended": "NONE",
    "user_question": "Onvoldoende informatie over de vraag van de gebruiker.",
    "ai_summary": "incomplete transcript"
  }
]
```

---

### 4. Chat Messages
**Endpoint:** `GET /api/analytics/transcripts/{transcript_id}/messages`

**Path Parameters:**
- `transcript_id` (string, required)

**Example Request:**
```
GET /api/analytics/transcripts/68dbd574e97538911f860a7a/messages
```

**Response Format:**
```json
[
  {
    "type": "action",
    "role": "user",
    "text": "hoe duur is excel basisplus",
    "timestamp": "2025-09-29T12:08:34.750Z",
    "raw_data": { /* original message data */ }
  },
  {
    "type": "trace",
    "role": "assistant",
    "text": "Voor actuele prijzen van de Excel Basisplus cursus verwijs ik je door naar onze website...",
    "timestamp": "2025-09-29T12:08:42.342Z",
    "raw_data": { /* original message data */ }
  }
]
```

---

### 5. Top Intents
**Endpoint:** `GET /api/analytics/intents`

**Query Parameters:**
- `project_id` (string, required)
- `start` (string, required) - YYYY-MM-DD or ISO-8601
- `end` (string, required) - YYYY-MM-DD or ISO-8601

**Example Request:**
```
GET /api/analytics/intents?project_id=688666ba51c1d0b2cc252cbe&start=2025-09-01&end=2025-10-01
```

**Response Format:**
```json
[
  {
    "name": "None",
    "count": 132
  },
  {
    "name": "course_inquiry",
    "count": 45
  },
  {
    "name": "support_request",
    "count": 23
  }
]
```

---

### 6. Data Export
**Endpoint:** `POST /api/export/`

**Request Body:**
```json
{
  "project_id": "string",
  "start": "string (YYYY-MM-DD or ISO-8601)",
  "end": "string (YYYY-MM-DD or ISO-8601)",
  "format": "string (csv or pdf)"
}
```

**Response Format:**
- **CSV**: Returns CSV file with transcript data
- **PDF**: Returns PDF report with analytics

---

## Data Types & Formats

### Date Formats
- Accepts both `YYYY-MM-DD` and full ISO-8601 formats
- Examples: `2025-09-01`, `2025-09-01T00:00:00.000Z`
- Automatically normalized to ISO-8601 with timezone

### Sentiment Scores
- Integer values 1-5
- 1 = Very negative
- 2 = Negative  
- 3 = Neutral
- 4 = Positive
- 5 = Very positive

### Duration
- Integer values in seconds
- Example: 915 = 15 minutes 15 seconds

### Resolution
- Boolean values
- `true` = Issue was resolved
- `false` = Issue was not resolved

### Course Recommended
- String values
- Common values: `"NONE"`, `"EXCEL_BASISPLUS"`, `"WORD_ADVANCED"`
- `"NONE"` = No course was recommended

### Message Roles
- `"user"` = User message
- `"assistant"` = AI/Assistant message
- `"system"` = System message (usually filtered out)

---

## Error Responses

All endpoints return standardized error responses:

```json
{
  "detail": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `422` - Validation error (invalid parameters)
- `500` - Internal server error

---

## Caching

All endpoints use caching with 5-minute TTL by default. Cache keys are automatically generated based on request parameters.

---

## Example Usage

### Frontend Integration Examples

```javascript
// Get analytics overview
const overview = await fetch('http://localhost:8000/api/analytics/overview', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    project_id: '688666ba51c1d0b2cc252cbe',
    start: '2025-09-01',
    end: '2025-10-01'
  })
});

// Get transcripts with pagination
const transcripts = await fetch(
  'http://localhost:8000/api/analytics/transcripts?project_id=688666ba51c1d0b2cc252cbe&start=2025-09-01&end=2025-10-01&limit=25&skip=0&order=DESC'
);

// Get chat messages for a specific transcript
const messages = await fetch(
  'http://localhost:8000/api/analytics/transcripts/68dbd574e97538911f860a7a/messages'
);
```

---

## Notes for Frontend Development

1. **Pagination**: Use `limit` and `skip` for transcript pagination
2. **Date Handling**: Backend automatically normalizes date formats
3. **Caching**: Responses are cached for 5 minutes
4. **Error Handling**: Always check response status codes
5. **Data Structure**: All responses follow consistent JSON structure
6. **Real-time Data**: Cache TTL is 5 minutes, so data may be slightly delayed
