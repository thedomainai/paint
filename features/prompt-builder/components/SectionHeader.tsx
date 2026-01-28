"use client";

import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  tip?: string;
  stepNumber?: number;
  isComplete?: boolean;
}

export function SectionHeader({
  icon,
  title,
  description,
  tip,
  stepNumber,
  isComplete,
}: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {stepNumber && (
            <Badge variant="outline" className="text-xs">
              Step {stepNumber}
            </Badge>
          )}
          <h2 className="text-lg font-semibold">{title}</h2>
          {isComplete && (
            <Badge variant="success" className="text-xs">
              Complete
            </Badge>
          )}
          {tip && (
            <Tooltip content={tip}>
              <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
            </Tooltip>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
