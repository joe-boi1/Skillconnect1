import { InputHTMLAttributes, forwardRef } from "react";
import { clsx } from "@/lib/clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="w-full">
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "h-11 w-full rounded-xl border bg-white px-3.5 text-[15px] text-ink placeholder:text-ink/40",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
            error ? "border-coral-400" : "border-line",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-coral-500">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-ink/50">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
