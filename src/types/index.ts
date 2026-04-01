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
  total_chunks: number;
  documents: string[];
}

// URL Ingestion
export interface IngestUrlResult {
  url: string;
  status: "ok" | "error";
  error?: string;
}

export interface IngestUrlsResponse {
  total_chunks: number;
  results: IngestUrlResult[];
}

// Body-based document delete
export interface DeleteDocumentResponse {
  deleted: boolean;
  filename: string;
  chunks_remaining: number;
}

// UI
export interface ApiOption {
  id: string;
  label: string;
}
