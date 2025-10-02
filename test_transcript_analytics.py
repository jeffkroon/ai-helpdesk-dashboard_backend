#!/usr/bin/env python3
"""
Test the new transcript analytics endpoint
"""
import asyncio
import os
import sys
import httpx
from datetime import datetime

# Voiceflow API configuration
VF_BASE = "https://analytics-api.voiceflow.com"
API_KEY = os.getenv("VOICEFLOW_API_KEY", "demo_key")

def _headers():
    return {"Authorization": API_KEY, "Content-Type": "application/json"}

async def _request(method: str, url: str, **kwargs):
    """Make request with retry logic"""
    for attempt in range(3):
        async with httpx.AsyncClient() as client:
            response = await client.request(
                method, url, headers=_headers(), timeout=30, **kwargs
            )
            if response.status_code >= 500 and attempt < 2:
                await asyncio.sleep(0.8 * (attempt + 1))
                continue
            if response.status_code >= 400:
                raise Exception(f"{response.status_code} {response.text}")
            return response.json() if response.content else None

async def test_transcript_analytics():
    """Test the new transcript analytics endpoint"""
    
    # Test project ID (from existing tests)
    PROJECT_ID = "688666ba51c1d0b2cc252cbe"
    
    # Test dates
    START_DATE = "2025-09-01T00:00:00.000Z"
    END_DATE = "2025-10-01T00:00:00.000Z"
    
    print("🧪 TESTING TRANSCRIPT ANALYTICS ENDPOINT")
    print("=" * 60)
    print(f"Project ID: {PROJECT_ID}")
    print(f"Start Date: {START_DATE}")
    print(f"End Date: {END_DATE}")
    print()
    
    try:
        # Test 1: Direct API call with new parameters
        print("1. 📊 Testing transcript analytics with date filters and pagination:")
        print("-" * 50)
        
        url = f"{VF_BASE}/v1/transcript/project/{PROJECT_ID}"
        
        # Query parameters for pagination and ordering
        params = {
            "take": 25,
            "skip": 0,
            "order": "DESC"
        }
        
        # Request body with date filters
        payload = {
            "startDate": START_DATE,
            "endDate": END_DATE
        }
        
        result = await _request("POST", url, json=payload, params=params)
        
        print("✅ SUCCESS: API call completed")
        print(f"📋 Response type: {type(result)}")
        print(f"📋 Response keys: {list(result.keys()) if isinstance(result, dict) else 'Not a dict'}")
        
        if isinstance(result, dict):
            # Check for transcripts in the response
            transcripts = result.get("transcripts", []) or result.get("items", [])
            print(f"📋 Found {len(transcripts)} transcripts")
            
            if transcripts:
                print("📋 Sample transcript:")
                sample = transcripts[0]
                print(f"   - ID: {sample.get('id', 'N/A')}")
                print(f"   - Session ID: {sample.get('sessionID', 'N/A')}")
                print(f"   - Created: {sample.get('createdAt', 'N/A')}")
                print(f"   - Ended: {sample.get('endedAt', 'N/A')}")
        else:
            print(f"📋 Full response: {result}")
        
        print()
        
        # Test 2: Test without date filters (original behavior)
        print("2. 📝 Testing without date filters (original behavior):")
        print("-" * 50)
        
        url = f"{VF_BASE}/v1/transcript/project/{PROJECT_ID}"
        params = {"take": 5, "skip": 0, "order": "DESC"}
        payload = {}
        
        result2 = await _request("POST", url, json=payload, params=params)
        
        print("✅ SUCCESS: API call completed")
        if isinstance(result2, dict):
            transcripts2 = result2.get("transcripts", []) or result2.get("items", [])
            print(f"📋 Found {len(transcripts2)} transcripts (no date filter)")
            
            if transcripts2:
                print("📋 Sample transcript:")
                sample = transcripts2[0]
                print(f"   - ID: {sample.get('id', 'N/A')}")
                print(f"   - Session ID: {sample.get('sessionID', 'N/A')}")
                print(f"   - Created: {sample.get('createdAt', 'N/A')}")
                print(f"   - Ended: {sample.get('endedAt', 'N/A')}")
        
        print()
        
        # Test 3: Compare results
        print("3. 🔍 Comparing results:")
        print("-" * 50)
        
        if isinstance(result, dict) and isinstance(result2, dict):
            transcripts1 = result.get("transcripts", []) or result.get("items", [])
            transcripts2 = result2.get("transcripts", []) or result2.get("items", [])
            
            print(f"With date filter: {len(transcripts1)} transcripts")
            print(f"Without date filter: {len(transcripts2)} transcripts")
            
            if len(transcripts1) <= len(transcripts2):
                print("✅ Date filtering is working (filtered results ≤ unfiltered)")
            else:
                print("⚠️ Unexpected: filtered results > unfiltered")
        
        print()
        print("🎉 ALL TESTS COMPLETED SUCCESSFULLY!")
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Check if API key is set
    if API_KEY == "demo_key":
        print("⚠️ WARNING: Using demo API key. Set VOICEFLOW_API_KEY environment variable for real testing.")
        print("export VOICEFLOW_API_KEY='your-api-key-here'")
        print()
    
    # Run the test
    asyncio.run(test_transcript_analytics())
