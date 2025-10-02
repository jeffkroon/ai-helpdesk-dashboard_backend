# voiceflow_analytics.py
from __future__ import annotations
import os, time, typing as t
from dataclasses import dataclass
from datetime import datetime
from dateutil import tz
import requests

VF_BASE = "https://analytics-api.voiceflow.com"
API_KEY = os.getenv("VOICEFLOW_API_KEY")  # zet je key in env

def _headers() -> dict:
    return {"Authorization": API_KEY, "Content-Type": "application/json"}

class VFError(RuntimeError): ...

def _request(method: str, url: str, **kwargs):
    for attempt in range(3):
        r = requests.request(method, url, headers=_headers(), timeout=30, **kwargs)
        if r.status_code >= 500 and attempt < 2:
            time.sleep(0.8 * (attempt + 1))
            continue
        if r.status_code >= 400:
            raise VFError(f"{r.status_code} {r.text}")
        return r.json() if r.content else None

# ---------- Transcripts API (v1) ----------
def list_transcripts(project_id: str, start_iso: str | None = None, end_iso: str | None = None,
                     limit: int = 250) -> t.Iterable[dict]:
    url = f"{VF_BASE}/v1/transcript/project/{project_id}"
    payload: dict = {}
    
    data = _request("POST", url, json=payload)
    
    # The response structure is: {"items": [array of transcripts]}
    items = data.get("items", [])
    if isinstance(items, list):
        for x in items: 
            yield x
    else:
        print(f"DEBUG: Unexpected items structure: {items}")
        yield data

def get_transcript_with_logs(transcript_id: str) -> dict:
    url = f"{VF_BASE}/v1/transcript/{transcript_id}"
    return _request("GET", url)

# ---------- Analytics API v2 ----------
def query_usage_v2(name: str, project_id: str, start_iso: str | None = None,
                   end_iso: str | None = None, limit: int | None = None,
                   cursor: t.Any | None = None) -> dict:
    url = f"{VF_BASE}/v2/query/usage"
    filt = {"projectID": project_id}
    if start_iso: filt["startTime"] = start_iso
    if end_iso:   filt["endTime"] = end_iso
    if limit:     filt["limit"] = limit
    if cursor is not None: filt["cursor"] = cursor
    
    # According to docs: {"data": {"name": "interactions", "filter": {...}}}
    body = {"data": {"name": name, "filter": filt}}
    return _request("POST", url, json=body)

def time_series_interactions(project_id: str, start_iso: str | None = None,
                             end_iso: str | None = None) -> t.Iterable[dict]:
    cursor = None
    while True:
        res = query_usage_v2("interactions", project_id, start_iso, end_iso, cursor=cursor)
        result = res.get("result", {})
        for item in result.get("items", []): yield item
        cursor = result.get("cursor")
        if not cursor: break

def time_series_unique_users(project_id: str, start_iso: str | None = None,
                             end_iso: str | None = None) -> t.Iterable[dict]:
    cursor = None
    while True:
        res = query_usage_v2("unique_users", project_id, start_iso, end_iso, cursor=cursor)
        result = res.get("result", {})
        for item in result.get("items", []): yield item
        cursor = result.get("cursor")
        if not cursor: break

def total_unique_users(project_id: str, start_iso: str | None = None, end_iso: str | None = None) -> int:
    return sum(row.get("count", 0) for row in time_series_unique_users(project_id, start_iso, end_iso))

def top_intents(project_id: str, start_iso: str | None = None,
                end_iso: str | None = None, limit: int = 50) -> list[dict]:
    res = query_usage_v2("top_intents", project_id, start_iso, end_iso, limit=limit)
    return res.get("result", {}).get("intents", [])

def kb_documents_usage(project_id: str, start_iso: str | None = None,
                       end_iso: str | None = None, limit: int = 100) -> list[dict]:
    res = query_usage_v2("kb_documents", project_id, start_iso, end_iso, limit=limit)
    return res.get("result", {}).get("items", [])

# ---------- Transcript Properties ----------
def list_transcript_properties(project_id: str) -> list[dict]:
    url = f"{VF_BASE}/v1/transcript-property/project/{project_id}"
    return _request("GET", url).get("items", [])

def get_transcript_property_values(transcript_id: str) -> dict:
    url = f"{VF_BASE}/v1/transcript-property-value/transcript/{transcript_id}"
    return _request("GET", url)

# ---------- Evaluations ----------
def create_evaluation(project_id: str, name: str, config: dict) -> dict:
    url = f"{VF_BASE}/v1/transcript-evaluation"
    body = {"projectID": project_id, "name": name, "config": config}
    return _request("POST", url, json=body)

def queue_evaluation(project_id: str, evaluation_id: str,
                     transcript_ids: list[str] | None = None) -> dict:
    url = f"{VF_BASE}/v1/transcript-evaluation/queue"
    body = {"projectID": project_id, "evaluationID": evaluation_id}
    if transcript_ids: body["transcriptIDs"] = transcript_ids
    return _request("POST", url, json=body)

def list_project_evaluations(project_id: str) -> list[dict]:
    url = f"{VF_BASE}/v1/transcript-evaluation/project/{project_id}"
    return _request("GET", url).get("items", [])

def get_evaluation(evaluation_id: str) -> dict:
    url = f"{VF_BASE}/v1/transcript-evaluation/{evaluation_id}"
    return _request("GET", url)

# ---------- Aggregaties voor dashboard ----------
def count_conversations(project_id: str, start_iso: str | None = None, end_iso: str | None = None) -> int:
    return sum(1 for _ in list_transcripts(project_id, start_iso, end_iso))

def peak_hours_from_interactions(project_id: str, start_iso: str | None = None,
                                 end_iso: str | None = None) -> list[tuple[str, int]]:
    out = []
    for row in time_series_interactions(project_id, start_iso, end_iso):
        out.append((row["period"], row.get("count", 0)))
    return out

def chat_scores(project_id: str, start_iso: str | None = None, end_iso: str | None = None,
                score_key: str = "chat_score") -> list[dict]:
    scores = []
    for tr in list_transcripts(project_id, start_iso, end_iso):
        tid = tr.get("_id") or tr.get("id") or tr.get("transcriptID")
        if not tid: continue
        props = get_transcript_property_values(tid) or {}
        if score_key in props: scores.append({"transcriptID": tid, "score": props[score_key]})
    return scores

def top_questions_via_intents(project_id: str, start_iso: str | None = None,
                              end_iso: str | None = None, limit: int = 50) -> list[dict]:
    return top_intents(project_id, start_iso, end_iso, limit)

def top_questions_via_transcripts(project_id: str, start_iso: str | None = None,
                                  end_iso: str | None = None, limit_logs: int = 200) -> list[dict]:
    results = []
    for tr in list_transcripts(project_id, start_iso, end_iso):
        tid = tr.get("_id") or tr.get("id") or tr.get("transcriptID")
        if not tid: continue
        full = get_transcript_with_logs(tid)
        logs = full.get("logs", []) or full.get("dialog", [])
        user_msgs = []
        for ev in logs[:limit_logs]:
            txt = (ev.get("payload", {}) or {}).get("text") or ev.get("text")
            role = ev.get("role") or ev.get("source") or ""
            if role == "user" and txt: user_msgs.append(txt)
        results.append({"transcriptID": tid, "user_messages": user_msgs})
    return results

def content_gap_suggestions(project_id: str, start_iso: str | None = None,
                            end_iso: str | None = None, top_n: int = 20) -> dict:
    intents = top_intents(project_id, start_iso, end_iso, limit=top_n)
    kb = kb_documents_usage(project_id, start_iso, end_iso, limit=200)
    return {"top_intents": intents, "kb": kb}

# Test functions
if __name__ == "__main__":
    PROJECT_ID = "688666ba51c1d0b2cc252cbe"
    
    print("=== Testing ALL Voiceflow API Calls ===")
    
    try:
        # Test 1: List transcripts
        print("\n1. 📝 LIST TRANSCRIPTS:")
        print("-" * 50)
        transcripts = list(list_transcripts(PROJECT_ID, "2025-08-01", "2025-10-31", limit=5))
        print(f"Found {len(transcripts)} transcripts")
        for i, tr in enumerate(transcripts):
            print(f"  Transcript {i+1}: {tr}")
            print(f"  Type: {type(tr)}")
        
        # Test 2: Get full transcript with logs
        if transcripts:
            print("\n2. 📋 FULL TRANSCRIPT WITH LOGS:")
            print("-" * 50)
            first_transcript = transcripts[0]
            print(f"First transcript structure: {first_transcript}")
            
            # Try different ways to get ID
            if isinstance(first_transcript, dict):
                first_id = first_transcript.get("_id") or first_transcript.get("id") or first_transcript.get("transcriptID")
            elif isinstance(first_transcript, str):
                first_id = first_transcript
            else:
                first_id = str(first_transcript)
            
            print(f"Using ID: {first_id}")
            if first_id:
                try:
                    full_transcript = get_transcript_with_logs(first_id)
                    print(f"Full transcript data: {full_transcript}")
                except Exception as e:
                    print(f"  ❌ Error getting full transcript: {e}")
        
        # Test 3: Time series interactions
        print("\n3. 📊 TIME SERIES INTERACTIONS:")
        print("-" * 50)
        try:
            interactions = list(time_series_interactions(PROJECT_ID, "2025-08-01", "2025-10-31"))
            print(f"Found {len(interactions)} interaction periods")
            for i, interaction in enumerate(interactions[:3]):  # Show first 3
                print(f"  Period {i+1}: {interaction}")
        except Exception as e:
            print(f"  ❌ Error: {e}")
        
        # Test 4: Time series unique users
        print("\n4. 👥 TIME SERIES UNIQUE USERS:")
        print("-" * 50)
        try:
            users = list(time_series_unique_users(PROJECT_ID, "2025-08-01", "2025-10-31"))
            print(f"Found {len(users)} user periods")
            for i, user in enumerate(users[:3]):  # Show first 3
                print(f"  Period {i+1}: {user}")
        except Exception as e:
            print(f"  ❌ Error: {e}")
        
        # Test 5: Total unique users
        print("\n5. 🔢 TOTAL UNIQUE USERS:")
        print("-" * 50)
        try:
            total_users = total_unique_users(PROJECT_ID, "2025-08-01", "2025-10-31")
            print(f"Total unique users: {total_users}")
        except Exception as e:
            print(f"  ❌ Error: {e}")
        
        # Test 6: Top intents
        print("\n6. 🎯 TOP INTENTS:")
        print("-" * 50)
        try:
            intents = top_intents(PROJECT_ID, "2025-08-01", "2025-10-31", limit=5)
            print(f"Found {len(intents)} intents")
            for i, intent in enumerate(intents):
                print(f"  Intent {i+1}: {intent}")
        except Exception as e:
            print(f"  ❌ Error: {e}")
        
        # Test 7: KB documents usage
        print("\n7. 📚 KB DOCUMENTS USAGE:")
        print("-" * 50)
        try:
            kb_docs = kb_documents_usage(PROJECT_ID, "2025-08-01", "2025-10-31", limit=5)
            print(f"Found {len(kb_docs)} KB documents")
            for i, doc in enumerate(kb_docs):
                print(f"  Doc {i+1}: {doc}")
        except Exception as e:
            print(f"  ❌ Error: {e}")
        
        # Test 8: Transcript properties
        print("\n8. 🏷️ TRANSCRIPT PROPERTIES:")
        print("-" * 50)
        try:
            properties = list_transcript_properties(PROJECT_ID)
            print(f"Found {len(properties)} transcript properties")
            for i, prop in enumerate(properties):
                print(f"  Property {i+1}: {prop}")
        except Exception as e:
            print(f"  ❌ Error: {e}")
        
        # Test 9: Count conversations
        print("\n9. 💬 COUNT CONVERSATIONS:")
        print("-" * 50)
        try:
            count = count_conversations(PROJECT_ID, "2025-08-01", "2025-10-31")
            print(f"Total conversations: {count}")
        except Exception as e:
            print(f"  ❌ Error: {e}")
        
        # Test 10: Peak hours
        print("\n10. ⏰ PEAK HOURS:")
        print("-" * 50)
        try:
            peaks = peak_hours_from_interactions(PROJECT_ID, "2025-08-01", "2025-10-31")
            print(f"Found {len(peaks)} peak periods")
            for i, peak in enumerate(peaks[:5]):  # Show first 5
                print(f"  Peak {i+1}: {peak}")
        except Exception as e:
            print(f"  ❌ Error: {e}")
        
        # Test 11: Chat scores
        print("\n11. ⭐ CHAT SCORES:")
        print("-" * 50)
        try:
            scores = chat_scores(PROJECT_ID, "2025-08-01", "2025-10-31")
            print(f"Found {len(scores)} chat scores")
            for i, score in enumerate(scores):
                print(f"  Score {i+1}: {score}")
        except Exception as e:
            print(f"  ❌ Error: {e}")
        
        # Test 12: Top questions via intents
        print("\n12. ❓ TOP QUESTIONS VIA INTENTS:")
        print("-" * 50)
        try:
            questions_intents = top_questions_via_intents(PROJECT_ID, "2025-08-01", "2025-10-31", limit=5)
            print(f"Found {len(questions_intents)} questions via intents")
            for i, question in enumerate(questions_intents):
                print(f"  Question {i+1}: {question}")
        except Exception as e:
            print(f"  ❌ Error: {e}")
        
        # Test 13: Top questions via transcripts
        print("\n13. 💭 TOP QUESTIONS VIA TRANSCRIPTS:")
        print("-" * 50)
        try:
            questions_transcripts = top_questions_via_transcripts(PROJECT_ID, "2025-08-01", "2025-10-31", limit_logs=50)
            print(f"Found {len(questions_transcripts)} questions via transcripts")
            for i, question in enumerate(questions_transcripts[:3]):  # Show first 3
                print(f"  Question {i+1}: {question}")
        except Exception as e:
            print(f"  ❌ Error: {e}")
        
        # Test 14: Content gap suggestions
        print("\n14. 🔍 CONTENT GAP SUGGESTIONS:")
        print("-" * 50)
        try:
            gaps = content_gap_suggestions(PROJECT_ID, "2025-08-01", "2025-10-31", top_n=5)
            print(f"Content gap data: {gaps}")
        except Exception as e:
            print(f"  ❌ Error: {e}")
        
        print("\n" + "="*60)
        print("🎉 ALL API TESTS COMPLETED!")
        print("="*60)
        
    except Exception as e:
        print(f"\n❌ CRITICAL ERROR: {e}")
        import traceback
        traceback.print_exc()
