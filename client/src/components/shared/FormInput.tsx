"use client";

import { InputHTMLAttributes, ReactNode } from "react";
import { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError | string;
  icon?: ReactNode;
  rightElement?: ReactNode;
  containerClassName?: string;
  helperText?: string;
}

const FormInput = ({
  label,
  error,
  icon,
  rightElement,
  className,
  containerClassName,
  helperText,
  id,
  ref,
  ...props
}: FormInputProps & { ref?: React.Ref<HTMLInputElement> }) => {
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const errorMessage = typeof error === "string" ? error : error?.message;

  return (
    <div className={cn("w-full space-y-2", containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 text-muted-foreground group-focus-within:text-primary">
            {icon}
          </div>
        )}
        <input
          {...props}
          id={id}
          ref={ref}
          aria-invalid={!!errorMessage}
          aria-describedby={
            errorMessage ? errorId : helperText ? helperId : undefined
          }
          className={cn(
            "w-full rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60",
            "disabled:cursor-not-allowed disabled:opacity-50",
            icon ? "pl-10" : "px-4",
            rightElement ? "pr-11" : "pr-4",
            "py-3",
            errorMessage &&
              "border-destructive focus:ring-destructive/30 focus:border-destructive",
            className,
          )}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {errorMessage ? (
        <p
          id={errorId}
          className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1"
        >
          {errorMessage}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export { FormInput };
