import asyncio
from fastapi import APIRouter, HTTPException
from app.models.analytics import (
    OverviewRequest, 
    CompareRequest, 
    OverviewResponse, 
    CompareResponse
)
from app.services.voiceflow_client import voiceflow_client
from app.services.cache import cache_service
from datetime import datetime, timedelta

def normalize_date_format(date_str: str) -> str:
    """Convert date string to ISO-8601 format with time if needed"""
    if not date_str:
        return date_str
    
    # If it's already in ISO format with time, return as is
    if 'T' in date_str and ('Z' in date_str or '+' in date_str):
        return date_str
    
    # If it's just a date (YYYY-MM-DD), add time
    if len(date_str) == 10 and date_str.count('-') == 2:
        if date_str.endswith('T00:00:00.000Z'):
            return date_str
        elif 'T' in date_str:
            # Already has time, just ensure Z suffix
            return date_str if date_str.endswith('Z') else f"{date_str}Z"
        else:
            # Just date, add start of day
            return f"{date_str}T00:00:00.000Z"
    
    # If it's a datetime without timezone, add Z
    if 'T' in date_str and not date_str.endswith('Z') and '+' not in date_str:
        return f"{date_str}Z"
    
    return date_str

router = APIRouter()

@router.post("/overview", response_model=OverviewResponse)
async def get_overview(request: OverviewRequest):
    """Get overview analytics with caching"""
    # Normalize date formats to ISO-8601 with time
    start_date = normalize_date_format(request.start)
    end_date = normalize_date_format(request.end)
    
    cache_key = f"overview:{request.project_id}:{start_date}:{end_date}"
    
    async def fetch_data():
        return await voiceflow_client.get_analytics_overview(
            request.project_id, 
            start_date, 
            end_date
        )
    
    try:
        data = await cache_service.get_cached_or_fetch(cache_key, fetch_data)
        return OverviewResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch overview data: {str(e)}")

@router.post("/compare", response_model=CompareResponse)
async def get_comparison(request: CompareRequest):
    """Get comparison analytics between current and previous period"""
    # Normalize date formats to ISO-8601 with time
    start_date_str = normalize_date_format(request.start)
    end_date_str = normalize_date_format(request.end)
    
    # Calculate previous period
    start_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00'))
    end_date = datetime.fromisoformat(end_date_str.replace('Z', '+00:00'))
    period_days = (end_date - start_date).days
    
    prev_end = start_date
    prev_start = prev_end - timedelta(days=period_days)
    
    # Normalize previous period dates
    prev_start_str = prev_start.isoformat().replace('+00:00', 'Z')
    prev_end_str = prev_end.isoformat().replace('+00:00', 'Z')
    
    # Create cache keys
    current_cache_key = f"overview:{request.project_id}:{start_date_str}:{end_date_str}"
    previous_cache_key = f"overview:{request.project_id}:{prev_start_str}:{prev_end_str}"
    
    async def fetch_current():
        return await voiceflow_client.get_analytics_overview(
            request.project_id, 
            start_date_str, 
            end_date_str
        )
    
    async def fetch_previous():
        return await voiceflow_client.get_analytics_overview(
            request.project_id, 
            prev_start_str, 
            prev_end_str
        )
    
    try:
        # Fetch both periods in parallel
        current_data, previous_data = await asyncio.gather(
            cache_service.get_cached_or_fetch(current_cache_key, fetch_current),
            cache_service.get_cached_or_fetch(previous_cache_key, fetch_previous)
        )
        
        # Calculate percentage changes
        changes = {}
        if previous_data and current_data:
            for key in ["total_interactions", "unique_users", "avg_session_duration", "completion_rate", "satisfaction_score"]:
                if key in current_data.get("metrics", {}) and key in previous_data.get("metrics", {}):
                    current_val = current_data["metrics"][key]
                    previous_val = previous_data["metrics"][key]
                    if previous_val != 0:
                        changes[key] = ((current_val - previous_val) / previous_val) * 100
                    else:
                        changes[key] = 0
        
        return CompareResponse(
            current=OverviewResponse(**current_data),
            previous=OverviewResponse(**previous_data),
            changes=changes
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch comparison data: {str(e)}")

@router.get("/transcripts")
async def get_transcripts(
    project_id: str, 
    start: str, 
    end: str, 
    limit: int = 100,
    skip: int = 0,
    order: str = "DESC"
):
    """Get transcripts with caching and pagination"""
    # Normalize date formats to ISO-8601 with time
    start_date = normalize_date_format(start)
    end_date = normalize_date_format(end)
    
    cache_key = f"transcripts:{project_id}:{start_date}:{end_date}:{limit}:{skip}:{order}"
    
    async def fetch_data():
        return await voiceflow_client.get_transcript_analytics(project_id, start_date, end_date, limit, skip, order)
    
    try:
        data = await cache_service.get_cached_or_fetch(cache_key, fetch_data)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch transcripts: {str(e)}")

@router.get("/intents")
async def get_top_intents(project_id: str, start: str, end: str):
    """Get top intents with caching"""
    # Normalize date formats to ISO-8601 with time
    start_date = normalize_date_format(start)
    end_date = normalize_date_format(end)
    
    cache_key = f"intents:{project_id}:{start_date}:{end_date}"
    
    async def fetch_data():
        return await voiceflow_client.get_top_intents(project_id, start_date, end_date)
    
    try:
        data = await cache_service.get_cached_or_fetch(cache_key, fetch_data)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch intents: {str(e)}")

@router.get("/transcripts/{transcript_id}/messages")
async def get_transcript_messages(transcript_id: str):
    """Get chat messages from a specific transcript"""
    cache_key = f"transcript_messages:{transcript_id}"
    
    async def fetch_data():
        return await voiceflow_client.get_chat_messages(transcript_id)
    
    try:
        data = await cache_service.get_cached_or_fetch(cache_key, fetch_data)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch transcript messages: {str(e)}")
