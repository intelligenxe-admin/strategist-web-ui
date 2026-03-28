"use client";

import { useStrategist } from "@/hooks/useStrategist";
import FileUpload from "@/components/FileUpload";
import PromptInput from "@/components/PromptInput";
import OptionDropdown from "@/components/OptionDropdown";
import ParameterInput from "@/components/ParameterInput";
import SubmitButton from "@/components/SubmitButton";
import ResponseDisplay from "@/components/ResponseDisplay";
import StatsPanel from "@/components/StatsPanel";

export default function StrategistPage() {
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
  } = useStrategist();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Strategist</h1>

      {/* Document Management */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Document</h2>
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
          {uploadMessage && (
            <div className="rounded-lg bg-green-50 p-3 border border-green-200">
              <p className="text-sm text-green-700">{uploadMessage}</p>
            </div>
          )}
          {uploadError && (
            <div className="rounded-lg bg-red-50 p-3 border border-red-200">
              <p className="text-sm text-red-700">{uploadError}</p>
            </div>
          )}
        </div>
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
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Query Knowledge Base</h2>
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
    </div>
  );
}
