"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useWorkflowsList } from "@/hooks/useWorkflows";
import { workflowDisplayName } from "@/lib/workflows";
import NavLink from "./NavLink";

export default function NavWorkflowLinks() {
  const { isAuthenticated } = useAuth();
  const { workflows } = useWorkflowsList();

  if (!isAuthenticated) return null;

  return (
    <>
      {workflows.map((workflow) => (
        <NavLink key={workflow.name} href={`/workflows/${encodeURIComponent(workflow.name)}`}>
          {workflowDisplayName(workflow.name)}
        </NavLink>
      ))}
    </>
  );
}
