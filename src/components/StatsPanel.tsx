"use client";

import { FileText, Globe, Library } from "lucide-react";
import { StatsResponse } from "@/types";
import EmptyState from "./EmptyState";

function isUrlDocument(name: string): boolean {
  return name.startsWith("http://") || name.startsWith("https://");
}

interface StatsPanelProps {
  stats: StatsResponse | null;
  loading: boolean;
  onDelete: (filename: string) => void;
  onClear: () => void;
}

export default function StatsPanel({ stats, loading, onDelete, onClear }: StatsPanelProps) {
  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 border border-gray-200 shadow-sm">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="rounded-lg bg-white p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Knowledge Base</h2>
        {stats.documents.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-3">
        {stats.total_chunks} chunks from {stats.documents.length} document{stats.documents.length !== 1 ? "s" : ""}
      </p>
      {stats.documents.length === 0 ? (
        <EmptyState
          icon={Library}
          title="No documents yet"
          description="Upload a PDF or ingest URLs above to start building your knowledge base."
          className="mt-2"
        />
      ) : (
        <ul className="space-y-2">
          {stats.documents.map((doc) => (
            <li key={doc} className="flex items-center justify-between rounded bg-white px-3 py-2 border border-gray-100 text-sm">
              <div className="flex items-center gap-2 min-w-0 mr-2">
                {isUrlDocument(doc) ? (
                  <Globe className="h-4 w-4 shrink-0 text-brand" />
                ) : (
                  <FileText className="h-4 w-4 shrink-0 text-gray-400" />
                )}
                <span className="text-gray-700 truncate" title={doc}>{doc}</span>
              </div>
              <button
                type="button"
                onClick={() => onDelete(doc)}
                className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors shrink-0"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
