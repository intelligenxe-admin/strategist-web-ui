"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkflowsList, useRunsList } from "@/hooks/useWorkflows";
import WorkflowForm from "@/components/WorkflowForm";
import RunHistory from "@/components/RunHistory";
import Alert from "@/components/Alert";
import { workflowDisplayName } from "@/lib/workflows";

export default function WorkflowRunnerPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = use(params);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  const { workflows, loading, error } = useWorkflowsList();
  const workflow = workflows.find((w) => w.name === name);

  const { runs, loading: runsLoading, refetch: refetchRuns, deleteRun, deleteError: runsDeleteError } = useRunsList();
  const filteredRuns = runs.filter((run) => run.workflow === name);

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
      >
        ← Back to home
      </Link>

      {loading ? (
        <div className="animate-pulse space-y-4 max-w-2xl">
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      ) : error ? (
        <Alert variant="error" className="max-w-2xl">{error}</Alert>
      ) : !workflow ? (
        <Alert variant="warning" className="max-w-2xl">Workflow &quot;{name}&quot; not found.</Alert>
      ) : (
        <>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-2">
            {workflowDisplayName(workflow.name)}
          </h1>
          <p className="text-base text-gray-700 leading-relaxed mb-8">{workflow.description}</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="rounded-lg bg-white p-4 border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Inputs</h2>
                <WorkflowForm workflow={workflow} />
              </div>
            </div>

            <div className="lg:col-span-1">
              <RunHistory
                runs={filteredRuns}
                loading={runsLoading}
                onRefresh={refetchRuns}
                onDelete={deleteRun}
                deleteError={runsDeleteError}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
