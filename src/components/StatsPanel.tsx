"use client";

import { StatsResponse } from "@/types";

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
        {stats.total_chunks} chunks from {stats.documents.length} document{stats.documents.length !== 1 ? "s" : ""}
      </p>
      {stats.documents.length > 0 ? (
        <ul className="space-y-2">
          {stats.documents.map((doc) => (
            <li key={doc} className="flex items-center justify-between rounded bg-white px-3 py-2 border border-gray-100 text-sm">
              <div className="flex items-center gap-2 min-w-0 mr-2">
                {isUrlDocument(doc) ? (
                  <svg className="h-4 w-4 shrink-0 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6.807 7.262 8H4.332zM12.738 8c-.288-1.193-.75-2.27-1.018-2.679a6.012 6.012 0 011.912 2.706L12.738 8zM10 4.044c-.452.2-1.233 1.164-1.632 3.956h3.264C11.233 5.208 10.452 4.244 10 4.044zM8.368 12c.399 2.792 1.18 3.756 1.632 3.956.452-.2 1.233-1.164 1.632-3.956H8.368zM7.262 12H4.332a6.012 6.012 0 001.912 2.706c.268-.41.73-1.486 1.018-2.706zm5.476 0c.288 1.22.75 2.296 1.018 2.706A6.012 6.012 0 0015.668 12h-2.93zM16 10a6.01 6.01 0 00-.332-2h-2.93c.108.643.172 1.31.196 2h2.734-.004.004zm-4.07 0a13.21 13.21 0 00-.198-2H8.268a13.21 13.21 0 00-.198 2h3.86zm-7.598 0H7.066c.024-.69.088-1.357.196-2H4.332A6.01 6.01 0 004 10h.332z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4 shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
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
      ) : (
        <p className="text-sm text-gray-400">No documents uploaded yet.</p>
      )}
    </div>
  );
}
