#!/usr/bin/env python3
"""
Systematic test of all Voiceflow API calls
"""
import os
import sys
import json
from test_voiceflow_api import *

def test_api_call(name: str, func, *args, **kwargs):
    """Test a single API call and return results"""
    print(f"\n🔍 Testing: {name}")
    print("-" * 60)
    
    try:
        result = func(*args, **kwargs)
        
        # Handle generators
        if hasattr(result, '__iter__') and not isinstance(result, (str, dict)):
            items = list(result)
            print(f"✅ SUCCESS: Found {len(items)} items")
            if items:
                print(f"📋 Sample data: {json.dumps(items[0], indent=2)[:500]}...")
            return items
        else:
            print(f"✅ SUCCESS: {result}")
            print(f"📋 Data: {json.dumps(result, indent=2)[:500]}...")
            return result
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return None

def main():
    PROJECT_ID = "688666ba51c1d0b2cc252cbe"
    START_DATE = "2025-09-01"  # Start from September
    END_DATE = "2025-10-31"
    
    print("🚀 SYSTEMATIC VOICEFLOW API TESTING")
    print("=" * 60)
    
    # Test 1: Basic transcript listing (no date filter)
    transcripts = test_api_call(
        "List Transcripts (All Data)", 
        list_transcripts, 
        PROJECT_ID, None, None, 5
    )
    
    # Test 2: Get specific transcript with logs (if we have transcripts)
    if transcripts:
        first_transcript = transcripts[0]
        transcript_id = first_transcript.get("id") or first_transcript.get("_id")
        if transcript_id:
            test_api_call(
                "Get Transcript with Logs",
                get_transcript_with_logs,
                transcript_id
            )
    
    # Test 3: Time series interactions
    test_api_call(
        "Time Series Interactions",
        time_series_interactions,
        PROJECT_ID, START_DATE, END_DATE
    )
    
    # Test 4: Time series unique users
    test_api_call(
        "Time Series Unique Users", 
        time_series_unique_users,
        PROJECT_ID, START_DATE, END_DATE
    )
    
    # Test 5: Total unique users
    test_api_call(
        "Total Unique Users",
        total_unique_users,
        PROJECT_ID, START_DATE, END_DATE
    )
    
    # Test 6: Top intents
    test_api_call(
        "Top Intents",
        top_intents,
        PROJECT_ID, START_DATE, END_DATE, 5
    )
    
    # Test 7: KB documents usage
    test_api_call(
        "KB Documents Usage",
        kb_documents_usage,
        PROJECT_ID, START_DATE, END_DATE, 5
    )
    
    # Test 8: Transcript properties
    test_api_call(
        "Transcript Properties",
        list_transcript_properties,
        PROJECT_ID
    )
    
    # Test 9: Count conversations
    test_api_call(
        "Count Conversations",
        count_conversations,
        PROJECT_ID, START_DATE, END_DATE
    )
    
    # Test 10: Peak hours
    test_api_call(
        "Peak Hours",
        peak_hours_from_interactions,
        PROJECT_ID, START_DATE, END_DATE
    )
    
    # Test 11: Chat scores
    test_api_call(
        "Chat Scores",
        chat_scores,
        PROJECT_ID, START_DATE, END_DATE
    )
    
    # Test 12: Top questions via intents
    test_api_call(
        "Top Questions via Intents",
        top_questions_via_intents,
        PROJECT_ID, START_DATE, END_DATE, 5
    )
    
    # Test 13: Top questions via transcripts
    test_api_call(
        "Top Questions via Transcripts",
        top_questions_via_transcripts,
        PROJECT_ID, START_DATE, END_DATE, 50
    )
    
    # Test 14: Content gap suggestions
    test_api_call(
        "Content Gap Suggestions",
        content_gap_suggestions,
        PROJECT_ID, START_DATE, END_DATE, 5
    )
    
    print("\n" + "=" * 60)
    print("🎉 ALL API TESTS COMPLETED!")
    print("=" * 60)

if __name__ == "__main__":
    main()
