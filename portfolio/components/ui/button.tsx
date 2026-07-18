import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] font-mono text-sm font-medium tracking-tight transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none",
  {
    variants: {
      variant: {
        primary:
          "bg-(--color-signal) text-(--color-signal-ink) hover:bg-(--color-signal-dim) shadow-(--shadow-signal-glow)",
        outline:
          "border border-(--color-hairline-strong) text-(--color-text-high) hover:border-(--color-signal) hover:text-(--color-signal)",
        ghost: "text-(--color-text-mid) hover:text-(--color-text-high)",
        link: "text-(--color-signal) underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
