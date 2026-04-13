"use client";

import Link from "next/link";
import { RunSummary } from "@/types";

interface RunHistoryProps {
  runs: RunSummary[];
  loading: boolean;
  onRefresh: () => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function prettyName(name: string): string {
  return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusColor(status: string): string {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "failed":
      return "bg-red-100 text-red-700";
    case "running":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function RunHistory({ runs, loading, onRefresh }: RunHistoryProps) {
  return (
    <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Recent Runs</h2>
        <button
          type="button"
          onClick={onRefresh}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
        </div>
      ) : runs.length === 0 ? (
        <p className="text-sm text-gray-400">No workflow runs yet.</p>
      ) : (
        <ul className="space-y-2 max-h-[500px] overflow-y-auto">
          {runs.map((run) => (
            <li key={run.run_id}>
              <Link
                href={`/workflows/runs/${run.run_id}`}
                className="block rounded bg-white px-3 py-2.5 border border-gray-100 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {prettyName(run.workflow)}
                  </span>
                  <span
                    className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(run.status)}`}
                  >
                    {run.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{formatDate(run.created_at)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
