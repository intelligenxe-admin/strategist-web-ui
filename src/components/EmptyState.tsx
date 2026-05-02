import { ComponentType, ReactNode } from "react";
import { LucideProps } from "lucide-react";

interface EmptyStateProps {
  icon: ComponentType<LucideProps>;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({ icon: Icon, title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center rounded-lg border border-dashed border-gray-300 bg-white px-6 py-10 ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500 mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
      {description && <p className="text-sm text-gray-500 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
