import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        premiumPrimary: "premium-button premium-button-primary",
        premiumOutline: "premium-button premium-button-outline",
        premiumGhost: "premium-button premium-button-ghost",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        premium:
          "h-[var(--button-premium-height)] px-[var(--button-premium-padding-x)] text-[length:var(--button-premium-font-size)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;

function isPremiumVariant(variant: ButtonVariant | null | undefined) {
  return variant === "premiumPrimary" || variant === "premiumOutline" || variant === "premiumGhost";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, disabled, loading = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const resolvedSize = size ?? (isPremiumVariant(variant) ? "premium" : undefined);

    return (
      <Comp
        {...props}
        className={cn(buttonVariants({ variant, size: resolvedSize, className }))}
        ref={ref}
        disabled={asChild ? undefined : disabled || loading}
        aria-disabled={asChild && (disabled || loading) ? true : props["aria-disabled"]}
        aria-busy={loading ? true : props["aria-busy"]}
        data-loading={loading ? "true" : undefined}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
