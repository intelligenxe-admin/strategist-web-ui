"use client";

import { useWorkflows } from "@/hooks/useWorkflows";
import WorkflowForm from "@/components/WorkflowForm";
import RunHistory from "@/components/RunHistory";

export default function WorkflowsPage() {
  const {
    workflows,
    workflowsLoading,
    selectedWorkflow,
    handleSelectWorkflow,
    formFields,
    inputs,
    handleInputChange,
    running,
    runResult,
    runError,
    elapsedSeconds,
    handleRunWorkflow,
    handleCancelRun,
    runs,
    runsLoading,
    selectedRunDetail,
    runDetailLoading,
    handleViewRunDetail,
    refreshRuns,
  } = useWorkflows();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Workflows</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WorkflowForm
            workflows={workflows}
            workflowsLoading={workflowsLoading}
            selectedWorkflow={selectedWorkflow}
            onSelectWorkflow={handleSelectWorkflow}
            formFields={formFields}
            inputs={inputs}
            onInputChange={handleInputChange}
            running={running}
            elapsedSeconds={elapsedSeconds}
            onRun={handleRunWorkflow}
            onCancel={handleCancelRun}
            runResult={runResult}
            runError={runError}
            selectedRunDetail={selectedRunDetail}
            runDetailLoading={runDetailLoading}
          />
        </div>
        <div className="lg:col-span-1">
          <RunHistory
            runs={runs}
            loading={runsLoading}
            onViewDetail={handleViewRunDetail}
            onRefresh={refreshRuns}
          />
        </div>
      </div>
    </div>
  );
}
