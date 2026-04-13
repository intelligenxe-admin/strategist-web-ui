"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { WorkflowSummary } from "@/types";
import { startRun } from "@/services/api";
import SubmitButton from "./SubmitButton";

const ARRAY_FIELDS = new Set(["focus_areas"]);

const WORKFLOW_SCHEMAS: Record<string, { required: string[]; optional: string[] }> = {
  corporate_strategy: {
    required: ["company_name", "ticker", "industry"],
    optional: ["focus_areas"],
  },
};

interface WorkflowFormProps {
  workflow: WorkflowSummary;
}

function humanize(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function WorkflowForm({ workflow }: WorkflowFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleInputChange(key: string, value: string) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  const fallback = WORKFLOW_SCHEMAS[workflow.name];
  const requiredInputs =
    workflow.required_inputs?.length ? workflow.required_inputs : fallback?.required ?? [];
  const optionalInputs =
    workflow.optional_inputs?.length ? workflow.optional_inputs : fallback?.optional ?? [];

  async function handleSubmit() {
    if (!user) return;

    for (const key of requiredInputs) {
      if (!inputs[key]?.trim()) {
        setError(`Please fill in the required field: ${humanize(key)}`);
        return;
      }
    }

    const processed: Record<string, unknown> = {};
    const allKeys = [...requiredInputs, ...optionalInputs];
    for (const key of allKeys) {
      const value = inputs[key]?.trim();
      if (!value) continue;
      if (ARRAY_FIELDS.has(key)) {
        processed[key] = value.split(",").map((s) => s.trim()).filter(Boolean);
      } else {
        processed[key] = value;
      }
    }

    setSubmitting(true);
    setError(null);
    try {
      const result = await startRun(workflow.name, processed, user.token);
      router.push(`/workflows/runs/${result.run_id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to start workflow");
      setSubmitting(false);
    }
  }

  function renderField(key: string, required: boolean) {
    const isArray = ARRAY_FIELDS.has(key);
    const placeholder = isArray
      ? `Comma-separated, e.g., item 1, item 2`
      : `Enter ${humanize(key).toLowerCase()}`;

    return (
      <div key={key}>
        <label
          htmlFor={`field-${key}`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {humanize(key)}
          {required && <span className="text-red-500 ml-1">*</span>}
          {isArray && <span className="ml-2 text-xs text-gray-400">(comma-separated)</span>}
        </label>
        <input
          id={`field-${key}`}
          type="text"
          value={inputs[key] || ""}
          onChange={(e) => handleInputChange(key, e.target.value)}
          disabled={submitting}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requiredInputs.map((key) => renderField(key, true))}
      {optionalInputs.map((key) => renderField(key, false))}

      {error && (
        <div className="rounded-lg bg-red-50 p-3 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="pt-2">
        <SubmitButton
          onClick={handleSubmit}
          loading={submitting}
          label="Run Workflow"
          loadingLabel="Starting..."
        />
      </div>
    </div>
  );
}
