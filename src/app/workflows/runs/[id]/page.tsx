"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRunStatus } from "@/hooks/useWorkflows";
import { deleteRun } from "@/services/api";
import MarkdownContent from "@/components/MarkdownContent";
import Alert from "@/components/Alert";
import { workflowDisplayName } from "@/lib/workflows";

function prettyName(name: string): string {
  return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatElapsed(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function getMarkdownResult(result: Record<string, unknown> | null): string | null {
  if (!result) return null;
  if (typeof result.result === "string") return result.result;
  return null;
}

function getReferences(result: Record<string, unknown> | null): string[] | null {
  if (!result) return null;
  const refs = result.references;
  if (!Array.isArray(refs) || refs.length === 0) return null;
  const filtered = refs.filter((r): r is string => typeof r === "string" && r.length > 0);
  return filtered.length > 0 ? filtered : null;
}

function stripTrailingReferences(md: string): string {
  const re = /(?:^|\n)##\s+references\s*\r?\n/gi;
  let cutAt = -1;
  let match: RegExpExecArray | null;
  while ((match = re.exec(md)) !== null) {
    cutAt = match[0].startsWith("\n") ? match.index + 1 : match.index;
  }
  if (cutAt === -1) return md;
  return md.slice(0, cutAt).trimEnd();
}

export default function RunDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const runId = Number.parseInt(id, 10);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  const { data, error, isPolling, pollingTimeout } = useRunStatus(
    Number.isFinite(runId) ? runId : null
  );

  // Live elapsed timer while running
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!data || data.status !== "running") return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [data]);

  const elapsedMs = useMemo(() => {
    if (!data) return 0;
    const start = new Date(data.created_at).getTime();
    const end =
      data.status === "running"
        ? now
        : data.completed_at
        ? new Date(data.completed_at).getTime()
        : now;
    return Math.max(0, end - start);
  }, [data, now]);

  const rawMarkdownResult = getMarkdownResult(data?.result ?? null);
  const references = getReferences(data?.result ?? null);
  const markdownResult =
    rawMarkdownResult && references ? stripTrailingReferences(rawMarkdownResult) : rawMarkdownResult;

  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function copyResultJson() {
    if (!data?.result) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(data.result, null, 2));
    } catch {
      // Clipboard unavailable — silent
    }
  }

  async function handleDelete() {
    if (!user || !Number.isFinite(runId)) return;
    if (!window.confirm("Delete this run?")) return;
    setDeleteError(null);
    setDeleting(true);
    try {
      await deleteRun(runId, user.token);
      router.push("/");
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete run");
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back to home
        </Link>
        {Number.isFinite(runId) && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete run"}
          </button>
        )}
      </div>

      {deleteError && <Alert variant="error" className="mb-4">{deleteError}</Alert>}

      {!Number.isFinite(runId) ? (
        <Alert variant="error">Invalid run id.</Alert>
      ) : error && !data ? (
        <Alert variant="error">{error}</Alert>
      ) : !data ? (
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
              {workflowDisplayName(data.workflow)}
            </h1>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                data.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : data.status === "failed"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {data.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Run #{data.run_id} · started {new Date(data.created_at).toLocaleString()}
          </p>

          {/* Running state */}
          {data.status === "running" && (
            <div className="rounded-lg bg-yellow-50 p-6 border border-yellow-200 mb-6">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Running for {formatElapsed(elapsedMs)}…
                  </p>
                  <p className="text-xs text-yellow-700 mt-0.5">
                    This typically takes 2–8 minutes. {isPolling && "Checking every 4 seconds."}
                  </p>
                </div>
              </div>
              {pollingTimeout && (
                <p className="text-xs text-yellow-700 mt-3">
                  Taking longer than expected — reload to continue checking.
                </p>
              )}
            </div>
          )}

          {/* Submitted inputs */}
          {data.inputs && Object.keys(data.inputs).length > 0 && (
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200 mb-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">Inputs</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {Object.entries(data.inputs).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-gray-500">{prettyName(key)}</dt>
                    <dd className="text-gray-900 break-words">
                      {Array.isArray(value) ? value.join(", ") : String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Failed state */}
          {data.status === "failed" && data.error && (
            <div className="rounded-lg bg-red-50 p-4 border border-red-200 mb-6">
              <p className="text-sm font-semibold text-red-700 mb-1">Workflow failed</p>
              <p className="text-sm text-red-600 whitespace-pre-wrap">{data.error}</p>
            </div>
          )}

          {/* Completed result */}
          {data.status === "completed" && data.result && (
            <div className="rounded-lg bg-white p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Result</h2>
                <button
                  type="button"
                  onClick={copyResultJson}
                  className="text-xs font-medium text-brand hover:text-brand-hover transition-colors"
                >
                  Copy result JSON
                </button>
              </div>
              {markdownResult ? (
                <div className="max-h-[600px] overflow-y-auto">
                  <MarkdownContent content={markdownResult} />
                  {references && (
                    <div className="text-sm text-gray-700 leading-relaxed">
                      <h2 className="text-xl font-semibold text-gray-900 mt-5 mb-2">References</h2>
                      <ul className="list-disc pl-5 mb-3">
                        {references.map((url) => (
                          <li key={url} className="mb-1 break-all">
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand underline"
                            >
                              {url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <pre className="text-sm font-mono text-gray-100 bg-gray-900 p-4 rounded-lg overflow-x-auto max-h-[600px] leading-relaxed">
                  {JSON.stringify(data.result, null, 2)}
                </pre>
              )}
            </div>
          )}

          {/* Polling error after data exists */}
          {error && data && (
            <Alert variant="warning" className="mt-4">Polling issue: {error}</Alert>
          )}
        </>
      )}
    </div>
  );
}
