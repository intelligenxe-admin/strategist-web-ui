"use client";

import { Workflow, WorkflowRunDetail } from "@/types";
import SubmitButton from "./SubmitButton";
import MarkdownContent from "./MarkdownContent";

interface WorkflowField {
  key: string;
  label: string;
  required: boolean;
  placeholder: string;
  isArray?: boolean;
}

interface WorkflowFormProps {
  workflows: Workflow[];
  workflowsLoading: boolean;
  selectedWorkflow: string;
  onSelectWorkflow: (name: string) => void;
  formFields: WorkflowField[];
  inputs: Record<string, string>;
  onInputChange: (key: string, value: string) => void;
  running: boolean;
  elapsedSeconds: number;
  onRun: () => void;
  onCancel: () => void;
  runResult: WorkflowRunDetail | null;
  runError: string | null;
  selectedRunDetail: WorkflowRunDetail | null;
  runDetailLoading: boolean;
}

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

export default function WorkflowForm({
  workflows,
  workflowsLoading,
  selectedWorkflow,
  onSelectWorkflow,
  formFields,
  inputs,
  onInputChange,
  running,
  elapsedSeconds,
  onRun,
  onCancel,
  runResult,
  runError,
  selectedRunDetail,
  runDetailLoading,
}: WorkflowFormProps) {
  const selectedWorkflowData = workflows.find((w) => w.name === selectedWorkflow);
  const displayResult = runResult || selectedRunDetail;

  return (
    <div className="space-y-6">
      {/* Workflow Selector */}
      <div>
        <label
          htmlFor="workflow-select"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Workflow
        </label>
        {workflowsLoading ? (
          <div className="animate-pulse h-10 bg-gray-200 rounded-lg" />
        ) : (
          <select
            id="workflow-select"
            value={selectedWorkflow}
            onChange={(e) => onSelectWorkflow(e.target.value)}
            disabled={running}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select a workflow...</option>
            {workflows.map((w) => (
              <option key={w.name} value={w.name}>
                {w.name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
        )}
        {selectedWorkflowData && (
          <p className="mt-2 text-sm text-gray-500">{selectedWorkflowData.description}</p>
        )}
      </div>

      {/* Dynamic Input Fields */}
      {selectedWorkflow && (
        <div className="space-y-4">
          {formFields.map((field) => (
            <div key={field.key}>
              <label
                htmlFor={`field-${field.key}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                id={`field-${field.key}`}
                type="text"
                value={inputs[field.key] || ""}
                onChange={(e) => onInputChange(field.key, e.target.value)}
                disabled={running}
                placeholder={field.placeholder}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          ))}

          {/* Run / Cancel Buttons */}
          <div className="flex items-center gap-3">
            <SubmitButton
              onClick={onRun}
              loading={running}
              disabled={!selectedWorkflow}
              label="Run Workflow"
              loadingLabel={`Running... ${formatElapsed(elapsedSeconds)}`}
            />
            {running && (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading state for run detail */}
      {runDetailLoading && (
        <div className="rounded-lg bg-gray-50 p-6 border border-gray-200">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      )}

      {/* Error Display */}
      {runError && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-700">{runError}</p>
        </div>
      )}

      {/* Result Display */}
      {displayResult?.result && (
        <div className="rounded-lg bg-gray-50 p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Result</h2>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              displayResult.status === "completed"
                ? "bg-green-100 text-green-700"
                : displayResult.status === "failed"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}>
              {displayResult.status}
            </span>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            <MarkdownContent content={displayResult.result.result} />
          </div>
        </div>
      )}

      {/* Failed run with error */}
      {displayResult && displayResult.status === "failed" && displayResult.error && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <p className="text-sm font-medium text-red-700">Workflow failed</p>
          <p className="text-sm text-red-600 mt-1">{displayResult.error}</p>
        </div>
      )}
    </div>
  );
}
