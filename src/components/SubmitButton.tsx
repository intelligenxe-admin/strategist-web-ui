import { Loader2 } from "lucide-react";
import Button from "./Button";

interface SubmitButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
  label?: string;
  loadingLabel?: string;
}

export default function SubmitButton({ onClick, loading, disabled, label = "Submit", loadingLabel = "Submitting..." }: SubmitButtonProps) {
  return (
    <Button onClick={onClick} disabled={loading || disabled}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {loading ? loadingLabel : label}
    </Button>
  );
}
