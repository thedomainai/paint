"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Focus, LayoutGrid, Move3d, Crosshair, Grid3x3, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImagePrompt } from "../types/prompt";
import { CAMERA_ANGLES, FRAMING_OPTIONS, FOCAL_POINT_OPTIONS, RULE_OF_THIRDS_OPTIONS } from "../types/prompt";

interface CompositionSectionProps {
  composition: ImagePrompt["composition"];
  onUpdate: (updates: Partial<ImagePrompt["composition"]>) => void;
}

interface StepItemProps {
  icon: React.ReactNode;
  label: string;
  isComplete: boolean;
  isLast?: boolean;
  children: React.ReactNode;
}

function StepItem({ icon, label, isComplete, isLast, children }: StepItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
            isComplete
              ? "bg-primary border-primary text-primary-foreground"
              : "border-muted-foreground/30 text-muted-foreground"
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

const DEPTH_OPTIONS = [
  { value: "Shallow (Subject in focus, background blurred)", label: "Shallow" },
  { value: "Medium (Moderate blur)", label: "Medium" },
  { value: "Deep (Everything in focus)", label: "Deep" },
];

const SYMMETRY_OPTIONS = [
  { value: "Symmetrical", label: "Symmetrical" },
  { value: "Asymmetrical balance", label: "Asymmetrical" },
  { value: "Radial", label: "Radial" },
  { value: "None", label: "None" },
];

export function CompositionSection({
  composition,
  onUpdate,
}: CompositionSectionProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold">Composition</h2>
        </div>

        <div className="pl-2">
          <StepItem
            icon={<Move3d className="w-5 h-5" />}
            label="Camera Angle"
            isComplete={!!composition.camera_angle}
          >
            <Select
              value={composition.camera_angle}
              onValueChange={(value) => onUpdate({ camera_angle: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select angle..." />
              </SelectTrigger>
              <SelectContent>
                {CAMERA_ANGLES.map((angle) => (
                  <SelectItem key={angle} value={angle}>
                    {angle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </StepItem>

          <StepItem
            icon={<LayoutGrid className="w-5 h-5" />}
            label="Framing"
            isComplete={!!composition.framing}
          >
            <Select
              value={composition.framing}
              onValueChange={(value) => onUpdate({ framing: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select framing..." />
              </SelectTrigger>
              <SelectContent>
                {FRAMING_OPTIONS.map((framing) => (
                  <SelectItem key={framing} value={framing}>
                    {framing}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </StepItem>

          <StepItem
            icon={<Focus className="w-5 h-5" />}
            label="Depth of Field"
            isComplete={!!composition.depth_of_field}
          >
            <div className="grid grid-cols-3 gap-2">
              {DEPTH_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onUpdate({ depth_of_field: opt.value })}
                  className={cn(
                    "py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all",
                    composition.depth_of_field === opt.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-muted hover:border-muted-foreground/50"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </StepItem>

          <StepItem
            icon={<LayoutGrid className="w-5 h-5" />}
            label="Symmetry"
            isComplete={!!composition.symmetry_type}
          >
            <div className="grid grid-cols-4 gap-2">
              {SYMMETRY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onUpdate({ symmetry_type: opt.value })}
                  className={cn(
                    "py-2 px-3 rounded-lg border-2 text-sm transition-all",
                    composition.symmetry_type === opt.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-muted hover:border-muted-foreground/50"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </StepItem>

          <StepItem
            icon={<Crosshair className="w-5 h-5" />}
            label="Focal Point"
            isComplete={!!composition.focal_point}
          >
            <Select
              value={composition.focal_point}
              onValueChange={(value) => onUpdate({ focal_point: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select focal point..." />
              </SelectTrigger>
              <SelectContent>
                {FOCAL_POINT_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </StepItem>

          <StepItem
            icon={<Grid3x3 className="w-5 h-5" />}
            label="Rule of Thirds"
            isComplete={!!composition.rule_of_thirds_alignment}
            isLast
          >
            <Select
              value={composition.rule_of_thirds_alignment}
              onValueChange={(value) => onUpdate({ rule_of_thirds_alignment: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select position..." />
              </SelectTrigger>
              <SelectContent>
                {RULE_OF_THIRDS_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </StepItem>
        </div>
      </CardContent>
    </Card>
  );
}
