import type { ReactNode } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type OptionCardProps = {
  title: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  children?: ReactNode;
  className?: string;
};

export function OptionCard({
  title,
  description,
  selected,
  onSelect,
  children,
  className,
}: OptionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "border-border bg-card hover:border-primary/50 flex min-h-32 w-full flex-col rounded-lg border p-4 text-left transition-[border-color,box-shadow,transform] duration-200 hover:shadow-md focus-visible:outline-none",
        selected ? "border-primary bg-tag-bg shadow-md" : null,
        className,
      )}
      onClick={onSelect}
    >
      <span className="flex items-start justify-between gap-3">
        <span>
          <span className="block text-base font-semibold">{title}</span>
          {description ? (
            <span className="text-muted-foreground mt-2 block text-sm leading-6">
              {description}
            </span>
          ) : null}
        </span>
        <span
          className={cn(
            "border-border grid size-6 shrink-0 place-items-center rounded-full border",
            selected ? "bg-primary text-primary-foreground border-primary" : "bg-surface",
          )}
        >
          {selected ? <Check aria-hidden="true" className="size-3.5" /> : null}
        </span>
      </span>
      {children ? <span className="mt-4 block">{children}</span> : null}
    </button>
  );
}
