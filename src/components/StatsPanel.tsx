"use client";

import { StatsResponse } from "@/types";

interface StatsPanelProps {
  stats: StatsResponse | null;
  loading: boolean;
  onDelete: (filename: string) => void;
  onClear: () => void;
}

export default function StatsPanel({ stats, loading, onDelete, onClear }: StatsPanelProps) {
  if (loading) {
    return (
      <div className="rounded-lg bg-gray-50 p-6 border border-gray-200">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="rounded-lg bg-gray-50 p-6 border border-gray-200">
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
        {stats.chunk_count} chunks from {stats.documents.length} document{stats.documents.length !== 1 ? "s" : ""}
      </p>
      {stats.documents.length > 0 ? (
        <ul className="space-y-2">
          {stats.documents.map((doc) => (
            <li key={doc} className="flex items-center justify-between rounded bg-white px-3 py-2 border border-gray-100 text-sm">
              <span className="text-gray-700 truncate mr-2">{doc}</span>
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
      ) : (
        <p className="text-sm text-gray-400">No documents uploaded yet.</p>
      )}
    </div>
  );
}
