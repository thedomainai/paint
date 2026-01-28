"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Globe2, Sun, Palette, MapPin, Sparkles, FileText, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImagePrompt } from "../types/prompt";
import {
  ENVIRONMENT_TYPES,
  ATMOSPHERE_OPTIONS,
  LIGHTING_SOURCES,
  LIGHTING_QUALITIES,
} from "../types/prompt";

interface GlobalContextSectionProps {
  globalContext: ImagePrompt["global_context"];
  onUpdate: (updates: Partial<ImagePrompt["global_context"]>) => void;
  onUpdateLighting: (
    updates: Partial<ImagePrompt["global_context"]["lighting"]>
  ) => void;
  onUpdateColorPalette: (
    updates: Partial<ImagePrompt["global_context"]["color_palette"]>
  ) => void;
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

export function GlobalContextSection({
  globalContext,
  onUpdate,
  onUpdateLighting,
  onUpdateColorPalette,
}: GlobalContextSectionProps) {
  const handleColorChange = (index: number, value: string) => {
    const newColors = [...globalContext.color_palette.dominant_hex_estimates];
    newColors[index] = value;
    onUpdateColorPalette({ dominant_hex_estimates: newColors });
  };

  const addDominantColor = () => {
    onUpdateColorPalette({
      dominant_hex_estimates: [
        ...globalContext.color_palette.dominant_hex_estimates,
        "#FFFFFF",
      ],
    });
  };

  const removeDominantColor = (index: number) => {
    const newColors = globalContext.color_palette.dominant_hex_estimates.filter(
      (_, i) => i !== index
    );
    onUpdateColorPalette({ dominant_hex_estimates: newColors });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <Globe2 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold">Context</h2>
        </div>

        <div className="pl-2">
          <StepItem
            icon={<FileText className="w-5 h-5" />}
            label="Scene Description"
            isComplete={!!globalContext.scene_description}
          >
            <Textarea
              value={globalContext.scene_description}
              onChange={(e) => onUpdate({ scene_description: e.target.value })}
              placeholder="Describe the overall scene..."
              rows={3}
              className="resize-none"
            />
          </StepItem>

          <StepItem
            icon={<MapPin className="w-5 h-5" />}
            label="Environment"
            isComplete={!!globalContext.environment_type}
          >
            <Select
              value={globalContext.environment_type}
              onValueChange={(value) => onUpdate({ environment_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select environment..." />
              </SelectTrigger>
              <SelectContent>
                {ENVIRONMENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </StepItem>

          <StepItem
            icon={<Sparkles className="w-5 h-5" />}
            label="Atmosphere"
            isComplete={!!globalContext.weather_atmosphere}
          >
            <Select
              value={globalContext.weather_atmosphere}
              onValueChange={(value) => onUpdate({ weather_atmosphere: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select atmosphere..." />
              </SelectTrigger>
              <SelectContent>
                {ATMOSPHERE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </StepItem>

          <StepItem
            icon={<Sun className="w-5 h-5" />}
            label="Lighting"
            isComplete={!!globalContext.lighting.source}
          >
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Select
                  value={globalContext.lighting.source}
                  onValueChange={(value) => onUpdateLighting({ source: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    {LIGHTING_SOURCES.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={globalContext.lighting.quality}
                  onValueChange={(value) => onUpdateLighting({ quality: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Quality" />
                  </SelectTrigger>
                  <SelectContent>
                    {LIGHTING_QUALITIES.map((quality) => (
                      <SelectItem key={quality} value={quality}>
                        {quality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={globalContext.lighting.direction}
                  onChange={(e) => onUpdateLighting({ direction: e.target.value })}
                  placeholder="Direction"
                />
                <Input
                  value={globalContext.lighting.color_temperature}
                  onChange={(e) => onUpdateLighting({ color_temperature: e.target.value })}
                  placeholder="Color temperature"
                />
              </div>
            </div>
          </StepItem>

          <StepItem
            icon={<Palette className="w-5 h-5" />}
            label="Colors"
            isComplete={globalContext.color_palette.dominant_hex_estimates.length > 0}
            isLast
          >
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {globalContext.color_palette.dominant_hex_estimates.map(
                  (color, index) => (
                    <div key={index} className="relative group">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        className="w-12 h-12 rounded-lg border-2 border-muted cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => removeDominantColor(index)}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  )
                )}
                <button
                  type="button"
                  onClick={addDominantColor}
                  className="w-12 h-12 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  +
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(["Low", "Medium", "High"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => onUpdateColorPalette({ contrast_level: level })}
                    className={cn(
                      "py-2 px-3 rounded-lg border-2 text-sm transition-all",
                      globalContext.color_palette.contrast_level === level
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted hover:border-muted-foreground/50"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </StepItem>
        </div>
      </CardContent>
    </Card>
  );
}
