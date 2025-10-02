import json
import redis
from typing import Any, Optional, Callable
from datetime import timedelta
from app.core.config import settings

class CacheService:
    def __init__(self):
        self.redis_client = None
        if settings.redis_url:
            self.redis_client = redis.from_url(settings.redis_url)
    
    async def get_cached_or_fetch(
        self, 
        cache_key: str, 
        fetch_fn: Callable, 
        ttl_minutes: int = None
    ) -> Any:
        """Get data from cache or fetch and cache it"""
        if ttl_minutes is None:
            ttl_minutes = settings.cache_ttl_minutes
        
        # Try to get from cache first
        if self.redis_client:
            try:
                cached = self.redis_client.get(cache_key)
                if cached:
                    return json.loads(cached)
            except Exception as e:
                print(f"Cache read error: {e}")
        
        # Fetch fresh data
        data = await fetch_fn()
        
        # Cache the data
        if self.redis_client:
            try:
                self.redis_client.setex(
                    cache_key,
                    timedelta(minutes=ttl_minutes),
                    json.dumps(data)
                )
            except Exception as e:
                print(f"Cache write error: {e}")
        
        return data
    
    def invalidate(self, pattern: str):
        """Invalidate cache entries matching pattern"""
        if self.redis_client:
            try:
                keys = self.redis_client.keys(pattern)
                if keys:
                    self.redis_client.delete(*keys)
            except Exception as e:
                print(f"Cache invalidation error: {e}")

# Global instance
cache_service = CacheService()
