"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Workflow, WorkflowRunSummary, WorkflowRunDetail } from "@/types";
import {
  getWorkflows,
  getWorkflowRuns,
  getWorkflowRunDetail,
  runWorkflow,
} from "@/services/api";

interface WorkflowField {
  key: string;
  label: string;
  required: boolean;
  placeholder: string;
  isArray?: boolean;
}

const WORKFLOW_FIELDS: Record<string, WorkflowField[]> = {
  corporate_strategy: [
    { key: "company_name", label: "Company Name", required: true, placeholder: "e.g., Apple Inc." },
    { key: "ticker", label: "Ticker", required: true, placeholder: "e.g., AAPL" },
    { key: "industry", label: "Industry", required: true, placeholder: "e.g., Consumer Electronics" },
    { key: "focus_areas", label: "Focus Areas", required: false, placeholder: "e.g., AI integration, supply chain (comma-separated)", isArray: true },
  ],
};

const DEFAULT_FIELDS: WorkflowField[] = [
  { key: "input", label: "Input", required: true, placeholder: "Enter your input..." },
];

const FALLBACK_WORKFLOWS: Workflow[] = [
  {
    name: "corporate_strategy",
    description: "Analyzes a US publicly traded company's strategic position, competitive landscape, and market opportunities using AI-powered research.",
  },
];

export function useWorkflows() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  // Workflows list state
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [workflowsLoading, setWorkflowsLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("");

  // Form inputs state
  const [inputs, setInputs] = useState<Record<string, string>>({});

  // Execution state
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<WorkflowRunDetail | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Run history state
  const [runs, setRuns] = useState<WorkflowRunSummary[]>([]);
  const [runsLoading, setRunsLoading] = useState(true);
  const [selectedRunDetail, setSelectedRunDetail] = useState<WorkflowRunDetail | null>(null);
  const [runDetailLoading, setRunDetailLoading] = useState(false);

  // Computed form fields for the selected workflow
  const formFields = WORKFLOW_FIELDS[selectedWorkflow] || DEFAULT_FIELDS;

  // Load workflows on mount, fall back to known workflows if API unavailable
  const loadWorkflows = useCallback(async () => {
    if (!user) return;
    setWorkflowsLoading(true);
    try {
      const data = await getWorkflows(user.token);
      setWorkflows(data.workflows);
    } catch {
      setWorkflows(FALLBACK_WORKFLOWS);
    } finally {
      setWorkflowsLoading(false);
    }
  }, [user]);

  // Load run history
  const refreshRuns = useCallback(async () => {
    if (!user) return;
    setRunsLoading(true);
    try {
      const data = await getWorkflowRuns(user.token);
      setRuns(data.runs);
    } catch {
      // Non-critical
    } finally {
      setRunsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadWorkflows();
    refreshRuns();
  }, [loadWorkflows, refreshRuns]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function handleSelectWorkflow(name: string) {
    setSelectedWorkflow(name);
    setInputs({});
    setRunResult(null);
    setRunError(null);
    setSelectedRunDetail(null);
  }

  function handleInputChange(key: string, value: string) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  async function handleRunWorkflow() {
    if (!selectedWorkflow) {
      setRunError("Please select a workflow.");
      return;
    }
    if (!user) return;

    // Validate required fields
    const fields = WORKFLOW_FIELDS[selectedWorkflow] || DEFAULT_FIELDS;
    for (const field of fields) {
      if (field.required && !inputs[field.key]?.trim()) {
        setRunError(`Please fill in the required field: ${field.label}`);
        return;
      }
    }

    // Build inputs object, splitting array fields
    const processedInputs: Record<string, unknown> = {};
    for (const field of fields) {
      const value = inputs[field.key]?.trim();
      if (!value) continue;
      if (field.isArray) {
        processedInputs[field.key] = value.split(",").map((s) => s.trim()).filter(Boolean);
      } else {
        processedInputs[field.key] = value;
      }
    }

    setRunning(true);
    setRunError(null);
    setRunResult(null);
    setSelectedRunDetail(null);
    setElapsedSeconds(0);

    // Start elapsed timer
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    // Create abort controller with 10-min timeout
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 600_000);

    try {
      const result = await runWorkflow(selectedWorkflow, processedInputs, user.token, controller.signal);
      setRunResult(result);
      refreshRuns();
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        setRunError("Workflow execution timed out or was cancelled.");
      } else {
        setRunError(err instanceof Error ? err.message : "Workflow execution failed");
      }
    } finally {
      setRunning(false);
      clearTimeout(timeout);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      abortControllerRef.current = null;
    }
  }

  function handleCancelRun() {
    abortControllerRef.current?.abort();
  }

  async function handleViewRunDetail(id: number) {
    if (!user) return;
    setRunDetailLoading(true);
    setRunResult(null);
    setRunError(null);
    try {
      const detail = await getWorkflowRunDetail(id, user.token);
      setSelectedRunDetail(detail);
    } catch (err: unknown) {
      setRunError(err instanceof Error ? err.message : "Failed to fetch run details");
    } finally {
      setRunDetailLoading(false);
    }
  }

  return {
    // Workflows
    workflows,
    workflowsLoading,
    selectedWorkflow,
    handleSelectWorkflow,
    // Form
    formFields,
    inputs,
    handleInputChange,
    // Execution
    running,
    runResult,
    runError,
    elapsedSeconds,
    handleRunWorkflow,
    handleCancelRun,
    // Run History
    runs,
    runsLoading,
    selectedRunDetail,
    runDetailLoading,
    handleViewRunDetail,
    refreshRuns,
  };
}
