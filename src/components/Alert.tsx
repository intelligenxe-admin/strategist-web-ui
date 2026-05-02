import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { ReactNode } from "react";

type Variant = "error" | "success" | "warning" | "info";

interface AlertProps {
  variant: Variant;
  children: ReactNode;
  className?: string;
}

const styles: Record<Variant, { container: string; icon: string; Icon: typeof AlertCircle }> = {
  error: {
    container: "bg-red-50 border-red-200 text-red-700",
    icon: "text-red-500",
    Icon: AlertCircle,
  },
  success: {
    container: "bg-green-50 border-green-200 text-green-700",
    icon: "text-green-600",
    Icon: CheckCircle2,
  },
  warning: {
    container: "bg-yellow-50 border-yellow-200 text-yellow-800",
    icon: "text-yellow-600",
    Icon: AlertTriangle,
  },
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-800",
    icon: "text-blue-600",
    Icon: Info,
  },
};

export default function Alert({ variant, children, className = "" }: AlertProps) {
  const { container, icon, Icon } = styles[variant];
  return (
    <div className={`flex items-start gap-2.5 rounded-lg border p-3 text-sm ${container} ${className}`}>
      <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${icon}`} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
