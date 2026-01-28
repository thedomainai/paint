"use client";

import { cn } from "@/lib/utils";

export interface ButtonToggleOption<T extends string> {
  value: T;
  label: string;
}

interface ButtonToggleGroupProps<T extends string> {
  options: readonly T[] | ButtonToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  columns?: 2 | 3 | 4;
  size?: "sm" | "md";
}

function isOptionObject<T extends string>(
  option: T | ButtonToggleOption<T>
): option is ButtonToggleOption<T> {
  return typeof option === "object" && "value" in option && "label" in option;
}

export function ButtonToggleGroup<T extends string>({
  options,
  value,
  onChange,
  columns = 4,
  size = "md",
}: ButtonToggleGroupProps<T>) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  const sizeClasses = {
    sm: "py-2 px-3 text-sm",
    md: "py-3 px-4 text-sm font-medium",
  };

  return (
    <div className={cn("grid gap-2", gridCols[columns])}>
      {options.map((option) => {
        const optValue = isOptionObject(option) ? option.value : option;
        const optLabel = isOptionObject(option) ? option.label : option;

        return (
          <button
            key={optValue}
            type="button"
            onClick={() => onChange(optValue)}
            className={cn(
              "rounded-lg border-2 transition-all",
              sizeClasses[size],
              value === optValue
                ? "border-primary bg-primary/10 text-primary"
                : "border-muted hover:border-muted-foreground/50"
            )}
          >
            {optLabel}
          </button>
        );
      })}
    </div>
  );
}
