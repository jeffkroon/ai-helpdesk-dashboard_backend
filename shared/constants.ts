// Shared constants for frontend and backend

export const API_ENDPOINTS = {
  OVERVIEW: '/api/analytics/overview',
  COMPARE: '/api/analytics/compare',
  TRANSCRIPTS: '/api/analytics/transcripts',
  INTENTS: '/api/analytics/intents',
  EXPORT: '/api/export',
} as const;

export const CACHE_KEYS = {
  OVERVIEW: (projectId: string, start: string, end: string) => 
    `overview:${projectId}:${start}:${end}`,
  COMPARE: (projectId: string, start: string, end: string) => 
    `compare:${projectId}:${start}:${end}`,
  TRANSCRIPTS: (projectId: string, start: string, end: string, limit: number) => 
    `transcripts:${projectId}:${start}:${end}:${limit}`,
  INTENTS: (projectId: string, start: string, end: string) => 
    `intents:${projectId}:${start}:${end}`,
} as const;

export const DATE_FORMATS = {
  API: 'YYYY-MM-DD',
  DISPLAY: 'MMM DD, YYYY',
  ISO: 'YYYY-MM-DDTHH:mm:ss.sssZ',
} as const;

export const DEFAULT_VALUES = {
  CACHE_TTL_MINUTES: 5,
  TRANSCRIPTS_LIMIT: 100,
  CHART_COLORS: {
    PRIMARY: '#3b82f6',
    SECONDARY: '#10b981',
    TERTIARY: '#f59e0b',
    DANGER: '#ef4444',
  },
} as const;
