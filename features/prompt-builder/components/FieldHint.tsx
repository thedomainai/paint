"use client";

import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";

interface FieldHintProps {
  children: React.ReactNode;
  className?: string;
}

export function FieldHint({ children, className }: FieldHintProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 mt-1.5 text-xs text-muted-foreground",
        className
      )}
    >
      <Lightbulb className="w-3 h-3 mt-0.5 shrink-0 text-amber-500" />
      <span>{children}</span>
    </div>
  );
}
