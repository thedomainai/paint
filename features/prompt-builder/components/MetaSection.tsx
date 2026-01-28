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
import { Sliders, Sparkles, Image, ScanLine, Aperture, Volume2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImagePrompt } from "../types/prompt";
import { IMAGE_TYPES, RESOLUTION_OPTIONS, LENS_TYPES } from "../types/prompt";

interface MetaSectionProps {
  meta: ImagePrompt["meta"];
  onUpdate: (updates: Partial<ImagePrompt["meta"]>) => void;
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

export function MetaSection({ meta, onUpdate }: MetaSectionProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center">
            <Sliders className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold">Meta</h2>
        </div>

        <div className="pl-2">
          <StepItem
            icon={<Sparkles className="w-5 h-5" />}
            label="Image Quality"
            isComplete={!!meta.image_quality}
          >
            <div className="grid grid-cols-4 gap-2">
              {(["Low", "Medium", "High", "Ultra"] as const).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => onUpdate({ image_quality: q })}
                  className={cn(
                    "py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all",
                    meta.image_quality === q
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-muted hover:border-muted-foreground/50"
                  )}
                >
                  {q}
                </button>
              ))}
            </div>
          </StepItem>

          <StepItem
            icon={<Image className="w-5 h-5" />}
            label="Image Type"
            isComplete={!!meta.image_type}
          >
            <Select
              value={meta.image_type}
              onValueChange={(value) => onUpdate({ image_type: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </StepItem>

          <StepItem
            icon={<ScanLine className="w-5 h-5" />}
            label="Resolution"
            isComplete={!!meta.resolution_estimation}
          >
            <Select
              value={meta.resolution_estimation}
              onValueChange={(value) => onUpdate({ resolution_estimation: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select resolution..." />
              </SelectTrigger>
              <SelectContent>
                {RESOLUTION_OPTIONS.map((res) => (
                  <SelectItem key={res} value={res}>
                    {res}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </StepItem>

          <StepItem
            icon={<span className="text-xs font-mono">JPG</span>}
            label="Compression"
            isComplete={meta.file_characteristics.compression_artifacts !== "Low"}
          >
            <div className="grid grid-cols-4 gap-2">
              {(["None", "Low", "Medium", "High"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() =>
                    onUpdate({
                      file_characteristics: {
                        ...meta.file_characteristics,
                        compression_artifacts: level,
                      },
                    })
                  }
                  className={cn(
                    "py-2 px-3 rounded-lg border-2 text-sm transition-all",
                    meta.file_characteristics.compression_artifacts === level
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-muted hover:border-muted-foreground/50"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </StepItem>

          <StepItem
            icon={<Volume2 className="w-5 h-5" />}
            label="Noise"
            isComplete={meta.file_characteristics.noise_level !== "None"}
          >
            <div className="grid grid-cols-4 gap-2">
              {(["None", "Low", "Medium", "High"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() =>
                    onUpdate({
                      file_characteristics: {
                        ...meta.file_characteristics,
                        noise_level: level,
                      },
                    })
                  }
                  className={cn(
                    "py-2 px-3 rounded-lg border-2 text-sm transition-all",
                    meta.file_characteristics.noise_level === level
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-muted hover:border-muted-foreground/50"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </StepItem>

          <StepItem
            icon={<Aperture className="w-5 h-5" />}
            label="Lens"
            isComplete={!!meta.file_characteristics.lens_type_estimation}
            isLast
          >
            <Select
              value={meta.file_characteristics.lens_type_estimation}
              onValueChange={(value) =>
                onUpdate({
                  file_characteristics: {
                    ...meta.file_characteristics,
                    lens_type_estimation: value,
                  },
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select lens type..." />
              </SelectTrigger>
              <SelectContent>
                {LENS_TYPES.map((lens) => (
                  <SelectItem key={lens} value={lens}>
                    {lens}
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
