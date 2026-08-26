import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  required?: boolean;
  error?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor} className="text-[0.92rem]">
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden>
            *
          </span>
        ) : (
          <span className="font-normal text-muted-foreground">(pilihan)</span>
        )}
      </Label>
      {children}
      {hint ? (
        <p
          className={cn(
            "text-xs leading-relaxed",
            error ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Blank({
  value,
  onChange,
  placeholder,
  ariaLabel,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className={cn(
        "mx-1 inline-block min-w-[10rem] border-0 border-b-2 border-dashed border-primary/45 bg-primary/6 px-1.5 py-0.5 text-[0.98em] text-foreground outline-none placeholder:text-muted-foreground/80 focus:border-solid focus:border-primary focus:bg-primary/10",
        className
      )}
    />
  );
}
