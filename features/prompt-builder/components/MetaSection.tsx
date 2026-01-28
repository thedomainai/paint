"use client";

import { useTranslations } from "next-intl";
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
  const t = useTranslations("meta");
  const tc = useTranslations("common");
  const ts = useTranslations("sections");

  const qualityLabels = [tc("low"), tc("medium"), tc("high"), t("ultra")] as const;
  const levelLabels = [tc("none"), tc("low"), tc("medium"), tc("high")] as const;

  return (
    <SectionCard icon={Sliders} title={ts("meta")}>
      <div className="pl-2">
        <StepItem
          icon={<Sparkles className="w-5 h-5" />}
          label={t("imageQuality")}
          isComplete={!!meta.image_quality}
        >
          <ButtonToggleGroup
            options={QUALITY_OPTIONS.map((opt, i) => ({ value: opt, label: qualityLabels[i] }))}
            value={meta.image_quality}
            onChange={(value) => onUpdate({ image_quality: value })}
          />
        </StepItem>

        <StepItem
          icon={<Image className="w-5 h-5" />}
          label={t("imageType")}
          isComplete={!!meta.image_type}
        >
          <SelectField
            value={meta.image_type}
            onValueChange={(value) => onUpdate({ image_type: value })}
            options={IMAGE_TYPES}
            placeholder={t("selectType")}
            className="w-full"
          />
        </StepItem>

        <StepItem
          icon={<ScanLine className="w-5 h-5" />}
          label={t("resolution")}
          isComplete={!!meta.resolution_estimation}
        >
          <SelectField
            value={meta.resolution_estimation}
            onValueChange={(value) => onUpdate({ resolution_estimation: value })}
            options={RESOLUTION_OPTIONS}
            placeholder={t("selectResolution")}
          />
        </StepItem>

        <StepItem
          icon={<span className="text-xs font-mono">JPG</span>}
          label={t("compression")}
          isComplete={meta.file_characteristics.compression_artifacts !== "Low"}
        >
          <ButtonToggleGroup
            options={COMPRESSION_OPTIONS.map((opt, i) => ({ value: opt, label: levelLabels[i] }))}
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
          label={t("noise")}
          isComplete={meta.file_characteristics.noise_level !== "None"}
        >
          <ButtonToggleGroup
            options={NOISE_OPTIONS.map((opt, i) => ({ value: opt, label: levelLabels[i] }))}
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
          label={t("lens")}
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
            placeholder={t("selectLens")}
          />
        </StepItem>
      </div>
    </SectionCard>
  );
}
