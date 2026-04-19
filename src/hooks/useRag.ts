"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ApiOption, QueryResponse, StatsResponse, IngestUrlsResponse } from "@/types";
import {
  uploadDocument,
  queryKnowledgeBase,
  getStats,
  deleteDocument,
  clearKnowledgeBase,
  ingestUrls,
} from "@/services/api";

const EXTRACTION_OPTIONS: ApiOption[] = [
  { id: "llamaindex", label: "LlamaIndex" },
  { id: "advanced", label: "Advanced" },
];

const SOURCE_TYPE_OPTIONS: ApiOption[] = [
  { id: "website", label: "Website" },
  { id: "news", label: "News Article" },
];

export function useRag() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [extractionMethod, setExtractionMethod] = useState("llamaindex");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Stats state
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // URL ingestion state
  const [urls, setUrls] = useState<string[]>([""]);
  const [sourceType, setSourceType] = useState("website");
  const [ingesting, setIngesting] = useState(false);
  const [ingestResult, setIngestResult] = useState<IngestUrlsResponse | null>(null);
  const [ingestError, setIngestError] = useState<string | null>(null);

  // Query state
  const [question, setQuestion] = useState("");
  const [topK, setTopK] = useState("5");
  const [queryResponse, setQueryResponse] = useState<QueryResponse | null>(null);
  const [querying, setQuerying] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  const refreshStats = useCallback(async () => {
    if (!user) return;
    setStatsLoading(true);
    try {
      const data = await getStats(user.token);
      setStats(data);
    } catch {
      // Stats fetch failure is non-critical
    } finally {
      setStatsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  async function handleUpload() {
    if (!file) {
      setUploadError("Please select a PDF file to upload.");
      return;
    }
    if (!user) return;

    setUploading(true);
    setUploadError(null);
    setUploadMessage(null);
    try {
      const result = await uploadDocument(file, extractionMethod, user.token);
      setUploadMessage(result.message || "Document uploaded successfully.");
      setFile(null);
      refreshStats();
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleQuery() {
    if (!question.trim()) {
      setQueryError("Please enter a question.");
      return;
    }
    if (!user) return;

    setQuerying(true);
    setQueryError(null);
    try {
      const result = await queryKnowledgeBase(question, parseInt(topK) || 5, user.token);
      setQueryResponse(result);
    } catch (err: unknown) {
      setQueryError(err instanceof Error ? err.message : "Query failed");
    } finally {
      setQuerying(false);
    }
  }

  async function handleIngestUrls() {
    const validUrls = urls.map((u) => u.trim()).filter(Boolean);
    if (validUrls.length === 0) {
      setIngestError("Please enter at least one URL.");
      return;
    }
    if (!user) return;

    setIngesting(true);
    setIngestError(null);
    setIngestResult(null);
    try {
      const result = await ingestUrls(validUrls, sourceType, user.token);
      setIngestResult(result);
      setUrls([""]);
      refreshStats();
    } catch (err: unknown) {
      setIngestError(err instanceof Error ? err.message : "URL ingestion failed");
    } finally {
      setIngesting(false);
    }
  }

  async function handleDeleteDocument(filename: string) {
    if (!user) return;
    try {
      await deleteDocument(filename, user.token);
      refreshStats();
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Failed to delete document");
    }
  }

  async function handleClearKnowledgeBase() {
    if (!user) return;
    try {
      await clearKnowledgeBase(user.token);
      refreshStats();
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Failed to clear knowledge base");
    }
  }

  return {
    // Upload
    file,
    setFile,
    extractionMethod,
    setExtractionMethod,
    extractionOptions: EXTRACTION_OPTIONS,
    uploading,
    uploadMessage,
    uploadError,
    handleUpload,
    // URL Ingestion
    urls,
    setUrls,
    sourceType,
    setSourceType,
    sourceTypeOptions: SOURCE_TYPE_OPTIONS,
    ingesting,
    ingestResult,
    ingestError,
    handleIngestUrls,
    // Stats
    stats,
    statsLoading,
    handleDeleteDocument,
    handleClearKnowledgeBase,
    // Query
    question,
    setQuestion,
    topK,
    setTopK,
    queryResponse,
    querying,
    queryError,
    handleQuery,
  };
}
