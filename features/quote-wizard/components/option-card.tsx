"use client";

import type { ReactNode } from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type OptionCardProps = {
  value: string;
  title: string;
  description?: string;
  selected: boolean;
  children?: ReactNode;
  className?: string;
};

export function OptionCard({
  value,
  title,
  description,
  selected,
  children,
  className,
}: OptionCardProps) {
  return (
    <RadioGroupPrimitive.Item
      value={value}
      className={cn(
        "border-border bg-card hover:border-primary/50 data-[state=checked]:border-primary data-[state=checked]:bg-tag-bg flex min-h-32 w-full flex-col rounded-lg border p-4 text-left transition-[border-color,box-shadow,transform] duration-200 hover:shadow-md focus-visible:outline-none data-[state=checked]:shadow-md",
        className,
      )}
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
          <RadioGroupPrimitive.Indicator asChild>
            <Check aria-hidden="true" className="size-3.5" />
          </RadioGroupPrimitive.Indicator>
        </span>
      </span>
      {children ? <span className="mt-4 block">{children}</span> : null}
    </RadioGroupPrimitive.Item>
  );
}
