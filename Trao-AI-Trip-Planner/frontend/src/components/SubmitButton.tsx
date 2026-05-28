import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export function SubmitButton({ loading, children, className = "", ...props }: SubmitButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-white transition hover:bg-moss disabled:cursor-not-allowed disabled:opacity-65 ${className}`}
    >
      {loading ? <Loader2 size={17} className="animate-spin" aria-hidden /> : null}
      {children}
    </button>
  );
}
