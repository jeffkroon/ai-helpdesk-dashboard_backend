#!/usr/bin/env python3
"""
Test Voiceflow APIs with correct payloads according to official documentation
"""
import os
import sys
import json
from test_voiceflow_api import *

def test_api_with_correct_payloads():
    PROJECT_ID = "688666ba51c1d0b2cc252cbe"
    START_DATE = "2025-09-01T00:00:00.000Z"
    END_DATE = "2025-10-31T23:59:59.999Z"
    
    print("🚀 TESTING VOICEFLOW APIs WITH CORRECT PAYLOADS")
    print("=" * 60)
    
    # Test 1: Transcripts API (this works!)
    print("\n1. 📝 TRANSCRIPTS API:")
    print("-" * 50)
    try:
        transcripts = list(list_transcripts(PROJECT_ID, None, None, 5))
        print(f"✅ SUCCESS: Found {len(transcripts)} transcripts")
        if transcripts:
            print(f"📋 Sample transcript ID: {transcripts[0].get('id', 'N/A')}")
            print(f"📋 Sample session ID: {transcripts[0].get('sessionID', 'N/A')}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 2: Analytics API v2 - Interactions
    print("\n2. 📊 ANALYTICS V2 - INTERACTIONS:")
    print("-" * 50)
    try:
        # According to docs: {"data": {"name": "interactions", "filter": {...}}}
        response = query_usage_v2("interactions", PROJECT_ID, START_DATE, END_DATE, limit=10)
        print(f"✅ SUCCESS: Got response")
        print(f"📋 Response keys: {list(response.keys())}")
        
        result = response.get("result", {})
        items = result.get("items", [])
        print(f"📋 Found {len(items)} interaction items")
        if items:
            print(f"📋 Sample: {items[0]}")
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 3: Analytics API v2 - Unique Users
    print("\n3. 👥 ANALYTICS V2 - UNIQUE USERS:")
    print("-" * 50)
    try:
        response = query_usage_v2("unique_users", PROJECT_ID, START_DATE, END_DATE, limit=10)
        print(f"✅ SUCCESS: Got response")
        
        result = response.get("result", {})
        items = result.get("items", [])
        print(f"📋 Found {len(items)} unique user items")
        if items:
            print(f"📋 Sample: {items[0]}")
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 4: Analytics API v2 - Top Intents
    print("\n4. 🎯 ANALYTICS V2 - TOP INTENTS:")
    print("-" * 50)
    try:
        response = query_usage_v2("top_intents", PROJECT_ID, START_DATE, END_DATE, limit=10)
        print(f"✅ SUCCESS: Got response")
        
        result = response.get("result", {})
        intents = result.get("intents", [])
        print(f"📋 Found {len(intents)} intent items")
        if intents:
            print(f"📋 Sample: {intents[0]}")
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 5: Analytics API v2 - KB Documents
    print("\n5. 📚 ANALYTICS V2 - KB DOCUMENTS:")
    print("-" * 50)
    try:
        response = query_usage_v2("kb_documents", PROJECT_ID, START_DATE, END_DATE, limit=10)
        print(f"✅ SUCCESS: Got response")
        
        result = response.get("result", {})
        items = result.get("items", [])
        print(f"📋 Found {len(items)} KB document items")
        if items:
            print(f"📋 Sample: {items[0]}")
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 6: Analytics API v2 - LLM Usage
    print("\n6. 🤖 ANALYTICS V2 - LLM USAGE:")
    print("-" * 50)
    try:
        response = query_usage_v2("llm_usage", PROJECT_ID, START_DATE, END_DATE, limit=10)
        print(f"✅ SUCCESS: Got response")
        
        result = response.get("result", {})
        items = result.get("items", [])
        print(f"📋 Found {len(items)} LLM usage items")
        if items:
            print(f"📋 Sample: {items[0]}")
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    print("\n" + "=" * 60)
    print("🎉 API TESTING COMPLETED!")
    print("=" * 60)

if __name__ == "__main__":
    test_api_with_correct_payloads()
