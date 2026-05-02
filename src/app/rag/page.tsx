"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRag } from "@/hooks/useRag";
import FileUpload from "@/components/FileUpload";
import UrlIngestion from "@/components/UrlIngestion";
import PromptInput from "@/components/PromptInput";
import OptionDropdown from "@/components/OptionDropdown";
import ParameterInput from "@/components/ParameterInput";
import SubmitButton from "@/components/SubmitButton";
import ResponseDisplay from "@/components/ResponseDisplay";
import StatsPanel from "@/components/StatsPanel";
import Alert from "@/components/Alert";

export default function RagPage() {
  const {
    file,
    setFile,
    extractionMethod,
    setExtractionMethod,
    extractionOptions,
    uploading,
    uploadMessage,
    uploadError,
    handleUpload,
    urls,
    setUrls,
    sourceType,
    setSourceType,
    sourceTypeOptions,
    ingesting,
    ingestResult,
    ingestError,
    handleIngestUrls,
    stats,
    statsLoading,
    handleDeleteDocument,
    handleClearKnowledgeBase,
    question,
    setQuestion,
    topK,
    setTopK,
    queryResponse,
    querying,
    queryError,
    handleQuery,
  } = useRag();

  const [dataSource, setDataSource] = useState<"upload" | "urls">("upload");

  const searchParams = useSearchParams();
  const returnWorkflow = searchParams.get("return") ?? "swot";
  const backHref = `/workflows/${returnWorkflow}`;

  return (
    <div>
      <Link
        href={backHref}
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
      >
        ← Back to Strategist
      </Link>

      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-6">Knowledge</h1>

      <div className="mb-8 text-base text-gray-700 leading-relaxed">
        <p className="mb-2">
          Upload documents and/or ingest websites containing:
        </p>
        <ol className="list-decimal list-inside space-y-1 pl-2">
          <li>
            Company or industry facts to emphasize when designing the corporate
            strategy
          </li>
          <li>
            Special management techniques to apply when designing the corporate
            strategy (in addition to the framework&rsquo;s approach)
          </li>
        </ol>
      </div>

      {/* Document Management */}
      <section className="mb-8 rounded-lg bg-white p-6 border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Knowledge</h2>

        {/* Tabs */}
        <div className="inline-flex rounded-lg bg-gray-100 p-1 mb-4">
          <button
            type="button"
            onClick={() => setDataSource("upload")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              dataSource === "upload"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setDataSource("urls")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              dataSource === "urls"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Ingest URLs
          </button>
        </div>

        {/* Tab Content */}
        {dataSource === "upload" ? (
          <div className="space-y-4">
            <FileUpload file={file} onFileChange={setFile} />
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <OptionDropdown
                  options={extractionOptions}
                  selected={extractionMethod}
                  onChange={setExtractionMethod}
                  label="Extraction Method"
                />
              </div>
              <SubmitButton
                onClick={handleUpload}
                loading={uploading}
                disabled={!file}
                label="Upload"
                loadingLabel="Uploading..."
              />
            </div>
            {uploadMessage && <Alert variant="success">{uploadMessage}</Alert>}
            {uploadError && <Alert variant="error">{uploadError}</Alert>}
          </div>
        ) : (
          <UrlIngestion
            urls={urls}
            onUrlsChange={setUrls}
            sourceType={sourceType}
            onSourceTypeChange={setSourceType}
            sourceTypeOptions={sourceTypeOptions}
            onSubmit={handleIngestUrls}
            ingesting={ingesting}
            ingestResult={ingestResult}
            ingestError={ingestError}
          />
        )}
      </section>

      {/* Knowledge Base Stats */}
      <section className="mb-8">
        <StatsPanel
          stats={stats}
          loading={statsLoading}
          onDelete={handleDeleteDocument}
          onClear={handleClearKnowledgeBase}
        />
      </section>

      {/* Query */}
      <section className="rounded-lg bg-white p-6 border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Query Knowledge Base (optional test)</h2>
        <div className="space-y-4">
          <PromptInput
            value={question}
            onChange={setQuestion}
            label="Question"
            placeholder="Ask a question about your documents..."
          />
          <ParameterInput value={topK} onChange={setTopK} label="Top K" />
          <SubmitButton
            onClick={handleQuery}
            loading={querying}
            disabled={!question.trim()}
            label="Query"
            loadingLabel="Querying..."
          />
        </div>
        <ResponseDisplay response={queryResponse} loading={querying} error={queryError} />
      </section>

      <div className="mt-8">
        <Link
          href={backHref}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back to Strategist
        </Link>
      </div>
    </div>
  );
}
