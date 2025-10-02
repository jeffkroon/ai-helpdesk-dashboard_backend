import httpx
import asyncio
from typing import Dict, Any, List, Optional, Iterable
from app.core.config import settings

class VFError(Exception):
    pass

class VoiceflowClient:
    def __init__(self):
        self.api_key = settings.voiceflow_api_key
        self.base_url = "https://analytics-api.voiceflow.com"
        self.headers = {
            "Authorization": self.api_key,
            "Content-Type": "application/json"
        }
    
    async def _request(self, method: str, url: str, **kwargs) -> Any:
        """Make request with retry logic"""
        for attempt in range(3):
            async with httpx.AsyncClient() as client:
                response = await client.request(
                    method, url, headers=self.headers, timeout=30, **kwargs
                )
                if response.status_code >= 500 and attempt < 2:
                    await asyncio.sleep(0.8 * (attempt + 1))
                    continue
                if response.status_code >= 400:
                    raise VFError(f"{response.status_code} {response.text}")
                return response.json() if response.content else None
    
    async def list_transcripts(
        self, 
        project_id: str, 
        start_iso: Optional[str] = None, 
        end_iso: Optional[str] = None,
        limit: int = 250
    ) -> List[Dict[str, Any]]:
        """Get transcripts from Voiceflow API v1"""
        url = f"{self.base_url}/v1/transcript/project/{project_id}"
        payload = {"limit": limit}
        if start_iso or end_iso:
            payload["filter"] = {}
            if start_iso: 
                payload["filter"]["startTime"] = start_iso
            if end_iso:   
                payload["filter"]["endTime"] = end_iso
        
        all_transcripts = []
        cursor = None
        
        while True:
            if cursor:
                payload["cursor"] = cursor
                
            data = await self._request("POST", url, json=payload)
            items = data.get("items") or data.get("result") or data
            if isinstance(items, dict) and "items" in items:
                items = items["items"]
            if not items: 
                break
                
            all_transcripts.extend(items)
            cursor = (data.get("cursor") or data.get("result", {}).get("cursor"))
            if not cursor: 
                break
                
        return all_transcripts
    
    async def get_transcript_with_logs(self, transcript_id: str) -> Dict[str, Any]:
        """Get full transcript with logs"""
        url = f"{self.base_url}/v1/transcript/{transcript_id}"
        return await self._request("GET", url)
    
    async def query_usage_v2(
        self, 
        name: str, 
        project_id: str, 
        start_iso: Optional[str] = None,
        end_iso: Optional[str] = None, 
        limit: Optional[int] = None,
        cursor: Optional[Any] = None
    ) -> Dict[str, Any]:
        """Query usage data from Voiceflow API v2"""
        url = f"{self.base_url}/v2/query/usage"
        filt = {"projectID": project_id}
        if start_iso: 
            filt["startTime"] = start_iso
        if end_iso:   
            filt["endTime"] = end_iso
        if limit:     
            filt["limit"] = limit
        if cursor is not None: 
            filt["cursor"] = cursor
            
        body = {"data": {"name": name, "filter": filt}}
        return await self._request("POST", url, json=body)
    
    async def time_series_interactions(
        self, 
        project_id: str, 
        start_iso: Optional[str] = None,
        end_iso: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Get time series interactions data"""
        all_items = []
        cursor = None
        
        while True:
            res = await self.query_usage_v2(
                "interactions", project_id, start_iso, end_iso, cursor=cursor
            )
            result = res.get("result", {})
            items = result.get("items", [])
            all_items.extend(items)
            
            cursor = result.get("cursor")
            if not cursor: 
                break
                
        return all_items
    
    async def time_series_unique_users(
        self, 
        project_id: str, 
        start_iso: Optional[str] = None,
        end_iso: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Get time series unique users data"""
        all_items = []
        cursor = None
        
        while True:
            res = await self.query_usage_v2(
                "unique_users", project_id, start_iso, end_iso, cursor=cursor
            )
            result = res.get("result", {})
            items = result.get("items", [])
            all_items.extend(items)
            
            cursor = result.get("cursor")
            if not cursor: 
                break
                
        return all_items
    
    async def top_intents(
        self, 
        project_id: str, 
        start_iso: Optional[str] = None,
        end_iso: Optional[str] = None, 
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """Get top intents"""
        res = await self.query_usage_v2("top_intents", project_id, start_iso, end_iso, limit=limit)
        return res.get("result", {}).get("intents", [])
    
    async def get_transcript_property_values(self, transcript_id: str) -> Dict[str, Any]:
        """Get transcript property values"""
        url = f"{self.base_url}/v1/transcript-property-value/transcript/{transcript_id}"
        return await self._request("GET", url)
    
    # Dashboard-specific methods
    async def get_analytics_overview(
        self, 
        project_id: str, 
        start_date: str, 
        end_date: str
    ) -> Dict[str, Any]:
        """Get overview analytics for dashboard"""
        # Get all data in parallel
        interactions, unique_users, intents = await asyncio.gather(
            self.time_series_interactions(project_id, start_date, end_date),
            self.time_series_unique_users(project_id, start_date, end_date),
            self.top_intents(project_id, start_date, end_date, limit=10)
        )
        
        # Calculate metrics
        total_interactions = sum(item.get("count", 0) for item in interactions)
        total_unique_users = sum(item.get("count", 0) for item in unique_users)
        
        # Mock additional metrics (these would need to be calculated from actual data)
        avg_session_duration = 180.5  # seconds
        completion_rate = 0.75
        satisfaction_score = 4.2
        
        return {
            "metrics": {
                "total_interactions": total_interactions,
                "unique_users": total_unique_users,
                "avg_session_duration": avg_session_duration,
                "completion_rate": completion_rate,
                "satisfaction_score": satisfaction_score
            },
            "interactions_chart": [
                {"date": item.get("period", ""), "interactions": item.get("count", 0)}
                for item in interactions
            ],
            "top_intents": [
                {
                    "intent": intent.get("name", ""),
                    "count": intent.get("count", 0),
                    "percentage": intent.get("percentage", 0)
                }
                for intent in intents
            ],
            "sentiment_distribution": {
                "positive": 60,
                "neutral": 30,
                "negative": 10
            }
        }
    
    async def get_transcripts(
        self, 
        project_id: str, 
        start_date: str, 
        end_date: str,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """Get transcripts for dashboard"""
        return await self.list_transcripts(project_id, start_date, end_date, limit)
    
    async def get_top_intents(
        self, 
        project_id: str, 
        start_date: str, 
        end_date: str
    ) -> List[Dict[str, Any]]:
        """Get top intents for dashboard"""
        return await self.top_intents(project_id, start_date, end_date, limit=50)

# Global instance
voiceflow_client = VoiceflowClient()
