"use client";

import { Sliders, Sparkles, Image, ScanLine, Aperture, Volume2 } from "lucide-react";
import type { ImagePrompt } from "../types/prompt";
import { IMAGE_TYPES, RESOLUTION_OPTIONS, LENS_TYPES } from "../types/prompt";
import { StepItem, ButtonToggleGroup, SelectField, SectionCard } from "./ui";

interface MetaSectionProps {
  meta: ImagePrompt["meta"];
  onUpdate: (updates: Partial<ImagePrompt["meta"]>) => void;
}

const QUALITY_OPTIONS = ["Low", "Medium", "High", "Ultra"] as const;
const COMPRESSION_OPTIONS = ["None", "Low", "Medium", "High"] as const;
const NOISE_OPTIONS = ["None", "Low", "Medium", "High"] as const;

export function MetaSection({ meta, onUpdate }: MetaSectionProps) {
  return (
    <SectionCard icon={Sliders} title="Meta">
      <div className="pl-2">
        <StepItem
          icon={<Sparkles className="w-5 h-5" />}
          label="Image Quality"
          isComplete={!!meta.image_quality}
        >
          <ButtonToggleGroup
            options={QUALITY_OPTIONS}
            value={meta.image_quality}
            onChange={(value) => onUpdate({ image_quality: value })}
          />
        </StepItem>

        <StepItem
          icon={<Image className="w-5 h-5" />}
          label="Image Type"
          isComplete={!!meta.image_type}
        >
          <SelectField
            value={meta.image_type}
            onValueChange={(value) => onUpdate({ image_type: value })}
            options={IMAGE_TYPES}
            placeholder="Select type..."
            className="w-full"
          />
        </StepItem>

        <StepItem
          icon={<ScanLine className="w-5 h-5" />}
          label="Resolution"
          isComplete={!!meta.resolution_estimation}
        >
          <SelectField
            value={meta.resolution_estimation}
            onValueChange={(value) => onUpdate({ resolution_estimation: value })}
            options={RESOLUTION_OPTIONS}
            placeholder="Select resolution..."
          />
        </StepItem>

        <StepItem
          icon={<span className="text-xs font-mono">JPG</span>}
          label="Compression"
          isComplete={meta.file_characteristics.compression_artifacts !== "Low"}
        >
          <ButtonToggleGroup
            options={COMPRESSION_OPTIONS}
            value={meta.file_characteristics.compression_artifacts}
            onChange={(value) =>
              onUpdate({
                file_characteristics: {
                  ...meta.file_characteristics,
                  compression_artifacts: value,
                },
              })
            }
            size="sm"
          />
        </StepItem>

        <StepItem
          icon={<Volume2 className="w-5 h-5" />}
          label="Noise"
          isComplete={meta.file_characteristics.noise_level !== "None"}
        >
          <ButtonToggleGroup
            options={NOISE_OPTIONS}
            value={meta.file_characteristics.noise_level}
            onChange={(value) =>
              onUpdate({
                file_characteristics: {
                  ...meta.file_characteristics,
                  noise_level: value,
                },
              })
            }
            size="sm"
          />
        </StepItem>

        <StepItem
          icon={<Aperture className="w-5 h-5" />}
          label="Lens"
          isComplete={!!meta.file_characteristics.lens_type_estimation}
          isLast
        >
          <SelectField
            value={meta.file_characteristics.lens_type_estimation}
            onValueChange={(value) =>
              onUpdate({
                file_characteristics: {
                  ...meta.file_characteristics,
                  lens_type_estimation: value,
                },
              })
            }
            options={LENS_TYPES}
            placeholder="Select lens type..."
          />
        </StepItem>
      </div>
    </SectionCard>
  );
}
