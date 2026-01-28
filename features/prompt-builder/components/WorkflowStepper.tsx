"use client";

import { cn } from "@/lib/utils";
import { Check, Sliders, Globe2, Camera, Layers } from "lucide-react";

export interface Step {
  id: string;
  label: string;
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
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative mb-8">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = step.isComplete || index < currentStep;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onStepClick(index)}
                className={cn(
                  "flex flex-col items-center gap-2 group",
                  "transition-all duration-200"
                )}
              >
                {/* Circle */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    "border-2 bg-background",
                    isActive && "border-primary bg-primary text-primary-foreground scale-110 shadow-lg",
                    isCompleted && !isActive && "border-primary bg-primary/10 text-primary",
                    !isActive && !isCompleted && "border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {isCompleted && !isActive ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="w-5 h-5">{step.icon}</span>
                  )}
                </div>

                {/* Label */}
                <div
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive && "text-primary",
                    !isActive && "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {step.label}
                </div>
              </button>
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
    label: "Meta",
    icon: <Sliders className="w-5 h-5" />,
  },
  {
    id: "context",
    label: "Context",
    icon: <Globe2 className="w-5 h-5" />,
  },
  {
    id: "composition",
    label: "Composition",
    icon: <Camera className="w-5 h-5" />,
  },
  {
    id: "objects",
    label: "Objects",
    icon: <Layers className="w-5 h-5" />,
  },
];
