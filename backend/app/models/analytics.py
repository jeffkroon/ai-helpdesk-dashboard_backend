from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class OverviewRequest(BaseModel):
    project_id: str
    start: str
    end: str

class CompareRequest(BaseModel):
    project_id: str
    start: str
    end: str

class ExportRequest(BaseModel):
    project_id: str
    start: str
    end: str
    format: str  # "csv" or "pdf"

class KPIMetrics(BaseModel):
    total_interactions: int
    unique_users: int
    avg_session_duration: float
    completion_rate: float
    satisfaction_score: float

class OverviewResponse(BaseModel):
    metrics: KPIMetrics
    interactions_chart: List[Dict[str, Any]]
    top_intents: List[Dict[str, Any]]
    sentiment_distribution: Dict[str, int]

class CompareResponse(BaseModel):
    current: OverviewResponse
    previous: OverviewResponse
    changes: Dict[str, float]  # Percentage changes
