"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkflowsList } from "@/hooks/useWorkflows";
import { LayoutGrid } from "lucide-react";
import WorkflowCard from "@/components/WorkflowCard";
import Alert from "@/components/Alert";
import EmptyState from "@/components/EmptyState";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { workflows, loading: workflowsLoading, error: workflowsError } = useWorkflowsList();

  const firstWorkflow = workflows[0];
  const ctaHref = isAuthenticated && firstWorkflow
    ? `/workflows/${encodeURIComponent(firstWorkflow.name)}`
    : "/login";
  const ctaLabel = isAuthenticated && firstWorkflow ? "Run a workflow" : "Get started";

  return (
    <div>
      <div className="rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-gray-200 px-6 py-12 sm:py-16 mb-12">
        <div className="flex flex-col items-center justify-center text-center">
          <Image
            src="/logo.svg"
            alt="Strategist"
            width={144}
            height={144}
            priority
            className="h-32 w-32 sm:h-36 sm:w-36 mb-6"
          />
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-4">
            Welcome to Strategist
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-xl leading-relaxed mb-8">
            Perform corporate strategy analyses on publicly traded companies worldwide using AI-powered frameworks
          </p>
          {(!isAuthenticated || firstWorkflow) && (
            <Link
              href={ctaHref}
              className="inline-flex items-center rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            >
              {ctaLabel}
            </Link>
          )}
        </div>
      </div>

      {isAuthenticated && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Available AI-Powered Corporate Strategy Frameworks</h2>

          {workflowsError && <Alert variant="error">{workflowsError}</Alert>}

          {workflowsLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-32 bg-gray-200 rounded-lg" />
              <div className="h-32 bg-gray-200 rounded-lg" />
            </div>
          ) : workflows.length === 0 ? (
            <EmptyState
              icon={LayoutGrid}
              title="No workflows available"
              description="Once workflows are configured for your account, they will appear here."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workflows.map((workflow) => (
                <WorkflowCard key={workflow.name} workflow={workflow} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
