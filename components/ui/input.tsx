"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface LabeledInputProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
  size?: "sm" | "md" | "lg" | "xl";
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const sizeClasses: Record<NonNullable<LabeledInputProps["size"]>, string> = {
  sm: "h-8 text-sm px-2",
  md: "h-9 text-base px-3",
  lg: "h-10 text-base px-3.5",
  xl: "h-12 text-lg px-4",
};

const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(
  (
    {
      className,
      type,
      label,
      id,
      error,
      size = "md",
      prefix,
      suffix,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const isInvalid = Boolean(error);
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    const paddingLeft = prefix ? "pl-10" : "";
    const paddingRight = isPassword || suffix ? "pr-10" : "";

    return (
      <div className="grid w-full gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {prefix}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={inputType}
            aria-invalid={isInvalid}
            data-slot="input"
            className={cn(
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent py-1 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              sizeClasses[size],
              paddingLeft,
              paddingRight,
              className
            )}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          ) : suffix ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {suffix}
            </div>
          ) : null}
        </div>
        {isInvalid && <p className="text-sm text-destructive mt-1">{error}</p>}
      </div>
    );
  }
);

LabeledInput.displayName = "LabeledInput";
export { LabeledInput };
