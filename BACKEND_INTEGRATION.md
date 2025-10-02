# Backend Integration Guide

This document explains how to integrate the Next.js frontend with your Python backend.

## Architecture

\`\`\`
Frontend (Next.js) → API Routes → Python Backend → Voiceflow API
\`\`\`

## Caching Strategy

### Frontend Caching (React Query)
- **Stale Time**: 5 minutes - Data is considered fresh for 5 minutes
- **GC Time**: 10 minutes - Unused data is kept in cache for 10 minutes
- **Refetch on Focus**: Enabled - Fresh data when user returns to tab

### Backend Caching (Recommended)

#### Option 1: Redis (Best for Production)
\`\`\`python
import redis
import json
from datetime import timedelta

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def get_cached_or_fetch(cache_key: str, fetch_fn, ttl_minutes: int = 5):
    """Get data from cache or fetch and cache it"""
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    
    data = fetch_fn()
    redis_client.setex(
        cache_key,
        timedelta(minutes=ttl_minutes),
        json.dumps(data)
    )
    return data

# Usage in your voiceflow_analytics.py
def get_overview_metrics(project_id: str, start: str, end: str):
    cache_key = f"metrics:overview:{project_id}:{start}:{end}"
    return get_cached_or_fetch(
        cache_key,
        lambda: fetch_from_voiceflow_api(project_id, start, end),
        ttl_minutes=5
    )
\`\`\`

#### Option 2: Supabase Cache
\`\`\`python
from supabase import create_client
import json
from datetime import datetime, timedelta

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_cached_or_fetch(cache_key: str, fetch_fn, ttl_minutes: int = 5):
    """Get data from Supabase cache or fetch and cache it"""
    result = supabase.table('analytics_cache').select('*').eq('key', cache_key).execute()
    
    if result.data:
        cache_entry = result.data[0]
        expires_at = datetime.fromisoformat(cache_entry['expires_at'])
        if datetime.now() < expires_at:
            return json.loads(cache_entry['data'])
    
    data = fetch_fn()
    expires_at = datetime.now() + timedelta(minutes=ttl_minutes)
    
    supabase.table('analytics_cache').upsert({
        'key': cache_key,
        'data': json.dumps(data),
        'expires_at': expires_at.isoformat()
    }).execute()
    
    return data
\`\`\`

#### Option 3: Simple File Cache (Development)
\`\`\`python
import json
import os
from datetime import datetime, timedelta
from pathlib import Path

CACHE_DIR = Path('.cache')
CACHE_DIR.mkdir(exist_ok=True)

def get_cached_or_fetch(cache_key: str, fetch_fn, ttl_minutes: int = 5):
    """Simple file-based cache"""
    cache_file = CACHE_DIR / f"{cache_key}.json"
    
    if cache_file.exists():
        with open(cache_file, 'r') as f:
            cache_data = json.load(f)
            expires_at = datetime.fromisoformat(cache_data['expires_at'])
            if datetime.now() < expires_at:
                return cache_data['data']
    
    data = fetch_fn()
    expires_at = datetime.now() + timedelta(minutes=ttl_minutes)
    
    with open(cache_file, 'w') as f:
        json.dump({
            'data': data,
            'expires_at': expires_at.isoformat()
        }, f)
    
    return data
\`\`\`

## API Endpoints to Implement

### 1. Overview Metrics
**Endpoint**: `POST /api/analytics/overview`
\`\`\`python
@app.post("/api/analytics/overview")
def get_overview(request: OverviewRequest):
    cache_key = f"overview:{request.project_id}:{request.start}:{request.end}"
    return get_cached_or_fetch(
        cache_key,
        lambda: voiceflow_analytics.get_overview_metrics(
            request.project_id,
            request.start,
            request.end
        )
    )
\`\`\`

### 2. Comparison Metrics
**Endpoint**: `POST /api/analytics/compare`
\`\`\`python
@app.post("/api/analytics/compare")
def get_comparison(request: CompareRequest):
    # Calculate previous period
    current_days = (request.end - request.start).days
    prev_end = request.start
    prev_start = prev_end - timedelta(days=current_days)
    
    # Fetch both periods in parallel
    current = get_overview(request.project_id, request.start, request.end)
    previous = get_overview(request.project_id, prev_start, prev_end)
    
    # Calculate changes
    return calculate_changes(current, previous)
\`\`\`

### 3. Export
**Endpoint**: `POST /api/export`
\`\`\`python
import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

@app.post("/api/export")
def export_report(request: ExportRequest):
    data = get_overview(request.project_id, request.start, request.end)
    
    if request.format == "csv":
        df = pd.DataFrame(data)
        return df.to_csv(index=False)
    
    elif request.format == "pdf":
        # Generate PDF with reportlab
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        # Add your PDF generation logic here
        p.save()
        return buffer.getvalue()
\`\`\`

## Environment Variables

Add these to your `.env` file:

\`\`\`bash
# Voiceflow API
VOICEFLOW_API_KEY=your_api_key_here

# Backend URL (for Next.js to call)
BACKEND_URL=http://localhost:8000

# Cache (choose one)
REDIS_URL=redis://localhost:6379
# or
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
\`\`\`

## Performance Tips

1. **Batch Requests**: When fetching multiple metrics, batch them in a single API call
2. **Parallel Fetching**: Use `asyncio` to fetch multiple periods in parallel for comparisons
3. **Cache Invalidation**: Implement cache invalidation when data is updated
4. **Rate Limiting**: Respect Voiceflow API rate limits (cache helps with this)
5. **Compression**: Enable gzip compression for API responses

## Testing Cache

\`\`\`python
# Test cache hit/miss
import time

# First call (cache miss)
start = time.time()
data1 = get_overview_metrics("project-1", "2025-01-01", "2025-01-31")
print(f"First call: {time.time() - start:.2f}s")

# Second call (cache hit)
start = time.time()
data2 = get_overview_metrics("project-1", "2025-01-01", "2025-01-31")
print(f"Second call: {time.time() - start:.2f}s")  # Should be much faster
