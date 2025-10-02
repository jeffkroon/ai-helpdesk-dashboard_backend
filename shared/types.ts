// Shared TypeScript types for frontend and backend communication

export interface KPIMetrics {
  total_interactions: number;
  unique_users: number;
  avg_session_duration: number;
  completion_rate: number;
  satisfaction_score: number;
}

export interface OverviewRequest {
  project_id: string;
  start: string;
  end: string;
}

export interface CompareRequest {
  project_id: string;
  start: string;
  end: string;
}

export interface ExportRequest {
  project_id: string;
  start: string;
  end: string;
  format: 'csv' | 'pdf';
}

export interface OverviewResponse {
  metrics: KPIMetrics;
  interactions_chart: Array<{
    date: string;
    interactions: number;
  }>;
  top_intents: Array<{
    intent: string;
    count: number;
    percentage: number;
  }>;
  sentiment_distribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface CompareResponse {
  current: OverviewResponse;
  previous: OverviewResponse;
  changes: {
    total_interactions: number;
    unique_users: number;
    avg_session_duration: number;
    completion_rate: number;
    satisfaction_score: number;
  };
}

export interface Transcript {
  id: string;
  user_id: string;
  session_id: string;
  timestamp: string;
  content: string;
  sentiment_score: number;
  intent: string;
  duration: number;
}

export interface Intent {
  name: string;
  count: number;
  percentage: number;
  avg_satisfaction: number;
}
