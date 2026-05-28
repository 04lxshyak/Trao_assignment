import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldProps = {
  label: string;
  error?: string;
};

export function TextField({ label, error, ...props }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">{label}</span>
      <input
        {...props}
        className="mt-2 h-11 w-full rounded-md border border-black/10 bg-white px-3 text-ink shadow-sm transition placeholder:text-ink/35 focus:border-moss"
      />
      {error ? <span className="mt-1 block text-sm text-coral">{error}</span> : null}
    </label>
  );
}

export function TextArea({ label, error, ...props }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">{label}</span>
      <textarea
        {...props}
        className="mt-2 min-h-28 w-full resize-y rounded-md border border-black/10 bg-white px-3 py-3 text-ink shadow-sm transition placeholder:text-ink/35 focus:border-moss"
      />
      {error ? <span className="mt-1 block text-sm text-coral">{error}</span> : null}
    </label>
  );
}
