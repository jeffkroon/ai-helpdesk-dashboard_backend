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

router = APIRouter()

@router.post("/overview", response_model=OverviewResponse)
async def get_overview(request: OverviewRequest):
    """Get overview analytics with caching"""
    cache_key = f"overview:{request.project_id}:{request.start}:{request.end}"
    
    async def fetch_data():
        return await voiceflow_client.get_analytics_overview(
            request.project_id, 
            request.start, 
            request.end
        )
    
    try:
        data = await cache_service.get_cached_or_fetch(cache_key, fetch_data)
        return OverviewResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch overview data: {str(e)}")

@router.post("/compare", response_model=CompareResponse)
async def get_comparison(request: CompareRequest):
    """Get comparison analytics between current and previous period"""
    # Calculate previous period
    start_date = datetime.fromisoformat(request.start)
    end_date = datetime.fromisoformat(request.end)
    period_days = (end_date - start_date).days
    
    prev_end = start_date
    prev_start = prev_end - timedelta(days=period_days)
    
    # Create cache keys
    current_cache_key = f"overview:{request.project_id}:{request.start}:{request.end}"
    previous_cache_key = f"overview:{request.project_id}:{prev_start.isoformat()}:{prev_end.isoformat()}"
    
    async def fetch_current():
        return await voiceflow_client.get_analytics_overview(
            request.project_id, 
            request.start, 
            request.end
        )
    
    async def fetch_previous():
        return await voiceflow_client.get_analytics_overview(
            request.project_id, 
            prev_start.isoformat(), 
            prev_end.isoformat()
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
async def get_transcripts(project_id: str, start: str, end: str, limit: int = 100):
    """Get transcripts with caching"""
    cache_key = f"transcripts:{project_id}:{start}:{end}:{limit}"
    
    async def fetch_data():
        return await voiceflow_client.get_transcripts(project_id, start, end, limit)
    
    try:
        data = await cache_service.get_cached_or_fetch(cache_key, fetch_data)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch transcripts: {str(e)}")

@router.get("/intents")
async def get_top_intents(project_id: str, start: str, end: str):
    """Get top intents with caching"""
    cache_key = f"intents:{project_id}:{start}:{end}"
    
    async def fetch_data():
        return await voiceflow_client.get_top_intents(project_id, start, end)
    
    try:
        data = await cache_service.get_cached_or_fetch(cache_key, fetch_data)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch intents: {str(e)}")
