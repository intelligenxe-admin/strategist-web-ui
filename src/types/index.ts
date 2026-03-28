// Auth
export interface AuthUser {
  token: string;
  user_id: number;
  username: string;
}

// RAG
export interface UploadResponse {
  message: string;
  document?: string;
  chunks?: number;
}

export interface QueryResponse {
  answer: string;
  sources?: Array<{ document: string; chunk: string; score: number }>;
}

export interface StatsResponse {
  chunk_count: number;
  documents: string[];
}

// UI
export interface ApiOption {
  id: string;
  label: string;
}
