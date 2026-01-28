"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Sliders, Globe2, Camera, Layers } from "lucide-react";

export interface Step {
  id: string;
  icon: React.ReactNode;
  isComplete: boolean;
}

interface WorkflowStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (index: number) => void;
}

export function WorkflowStepper({
  steps,
  currentStep,
  onStepClick,
}: WorkflowStepperProps) {
  const t = useTranslations("sections");

  return (
    <div className="w-full">
      {/* Navigation header */}
      <div className="relative mb-8">
        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = step.isComplete || index < currentStep;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <button
                  type="button"
                  onClick={() => onStepClick(index)}
                  className={cn(
                    "flex flex-col items-center gap-2 group",
                    "transition-all duration-200"
                  )}
                >
                  {/* Circle - always shows icon */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                      isActive && "bg-brand-gradient text-white scale-110 shadow-lg",
                      isCompleted && !isActive && "bg-brand-gradient text-white opacity-60",
                      !isActive && !isCompleted && "border-2 border-muted-foreground/30 text-muted-foreground bg-background"
                    )}
                  >
                    <span className="w-5 h-5">{step.icon}</span>
                  </div>

                  {/* Label */}
                  <div
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isActive && "text-brand-gradient",
                      !isActive && "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {t(step.id)}
                  </div>
                </button>

                {/* Connector line between steps */}
                {!isLast && (
                  <div className="flex-1 h-0.5 mx-2 mt-[-24px]">
                    <div
                      className={cn(
                        "h-full transition-all duration-500",
                        index < currentStep ? "bg-brand-gradient" : "bg-muted"
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const WORKFLOW_STEPS: Omit<Step, "isComplete">[] = [
  {
    id: "meta",
    icon: <Sliders className="w-5 h-5" />,
  },
  {
    id: "context",
    icon: <Globe2 className="w-5 h-5" />,
  },
  {
    id: "composition",
    icon: <Camera className="w-5 h-5" />,
  },
  {
    id: "objects",
    icon: <Layers className="w-5 h-5" />,
  },
];
