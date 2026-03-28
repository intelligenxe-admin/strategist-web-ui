interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export default function PromptInput({ value, onChange, label = "Prompt", placeholder = "Enter your prompt..." }: PromptInputProps) {
  return (
    <div>
      <label
        htmlFor="prompt"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <textarea
        id="prompt"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder={placeholder}
      />
    </div>
  );
}
