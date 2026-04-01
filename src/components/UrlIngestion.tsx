"use client";

import { ApiOption, IngestUrlsResponse } from "@/types";
import OptionDropdown from "./OptionDropdown";
import SubmitButton from "./SubmitButton";

interface UrlIngestionProps {
  urls: string[];
  onUrlsChange: (urls: string[]) => void;
  sourceType: string;
  onSourceTypeChange: (value: string) => void;
  sourceTypeOptions: ApiOption[];
  onSubmit: () => void;
  ingesting: boolean;
  ingestResult: IngestUrlsResponse | null;
  ingestError: string | null;
}

export default function UrlIngestion({
  urls,
  onUrlsChange,
  sourceType,
  onSourceTypeChange,
  sourceTypeOptions,
  onSubmit,
  ingesting,
  ingestResult,
  ingestError,
}: UrlIngestionProps) {
  const canAdd = urls.length < 10;

  function updateUrl(index: number, value: string) {
    const next = [...urls];
    next[index] = value;
    onUrlsChange(next);
  }

  function removeUrl(index: number) {
    if (urls.length <= 1) return;
    onUrlsChange(urls.filter((_, i) => i !== index));
  }

  function addUrl() {
    if (!canAdd) return;
    onUrlsChange([...urls, ""]);
  }

  const hasValidUrl = urls.some((u) => u.trim() !== "");

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        URLs to Ingest
      </label>

      <div className="space-y-2">
        {urls.map((url, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => updateUrl(i, e.target.value)}
              placeholder="https://example.com/page"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {urls.length > 1 && (
              <button
                type="button"
                onClick={() => removeUrl(i)}
                className="shrink-0 rounded-lg border border-gray-300 p-2 text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors"
                title="Remove URL"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {canAdd && (
        <button
          type="button"
          onClick={addUrl}
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add URL ({urls.length}/10)
        </button>
      )}

      <div className="flex items-end gap-4">
        <div className="flex-1">
          <OptionDropdown
            options={sourceTypeOptions}
            selected={sourceType}
            onChange={onSourceTypeChange}
            label="Source Type"
          />
        </div>
        <SubmitButton
          onClick={onSubmit}
          loading={ingesting}
          disabled={!hasValidUrl}
          label="Ingest URLs"
          loadingLabel="Ingesting..."
        />
      </div>

      {ingestResult && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2">
          <p className="text-sm font-medium text-gray-900">
            Ingestion complete — {ingestResult.total_chunks} chunk{ingestResult.total_chunks !== 1 ? "s" : ""} added
          </p>
          <ul className="space-y-1">
            {ingestResult.results.map((r) => (
              <li key={r.url} className="flex items-start gap-2 text-sm">
                {r.status === "ok" ? (
                  <svg className="h-4 w-4 shrink-0 mt-0.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="h-4 w-4 shrink-0 mt-0.5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span className={r.status === "ok" ? "text-green-700" : "text-red-700"}>
                  <span className="break-all">{r.url}</span>
                  {r.error && <span className="text-red-500"> — {r.error}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {ingestError && (
        <div className="rounded-lg bg-red-50 p-3 border border-red-200">
          <p className="text-sm text-red-700">{ingestError}</p>
        </div>
      )}
    </div>
  );
}
