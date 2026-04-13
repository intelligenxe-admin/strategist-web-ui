"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkflowsList } from "@/hooks/useWorkflows";
import WorkflowForm from "@/components/WorkflowForm";

function prettyName(name: string): string {
  return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

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

  return (
    <div className="max-w-2xl">
      <Link
        href="/workflows"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
      >
        ← Back to workflows
      </Link>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      ) : !workflow ? (
        <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-200">
          <p className="text-sm text-yellow-800">Workflow &quot;{name}&quot; not found.</p>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {prettyName(workflow.name)}
          </h1>
          <p className="text-gray-600 mb-8">{workflow.description}</p>
          <WorkflowForm workflow={workflow} />
        </>
      )}
    </div>
  );
}
