"use client";

import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepItemProps {
  icon: React.ReactNode;
  label: string;
  isComplete: boolean;
  isLast?: boolean;
  children: React.ReactNode;
}

export function StepItem({
  icon,
  label,
  isComplete,
  isLast = false,
  children,
}: StepItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all",
            isComplete
              ? "bg-brand-gradient text-white"
              : "border-2 border-muted-foreground/30 text-muted-foreground"
          )}
        >
          {isComplete ? <Check className="w-5 h-5" /> : icon}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-border mt-2" />}
      </div>
      <div className={cn("flex-1", !isLast && "pb-8")}>
        <Label className="text-sm font-medium mb-3 block">{label}</Label>
        {children}
      </div>
    </div>
  );
}
