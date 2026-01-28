"use client";

import { useTranslations } from "next-intl";
import { Textarea } from "@/components/ui/textarea";
import { Globe2, Sun, Palette, MapPin, Sparkles, FileText } from "lucide-react";
import type { ImagePrompt } from "../types/prompt";
import {
  ENVIRONMENT_TYPES,
  ATMOSPHERE_OPTIONS,
  LIGHTING_SOURCES,
  LIGHTING_QUALITIES,
  LIGHTING_DIRECTIONS,
  COLOR_TEMPERATURES,
} from "../types/prompt";
import {
  StepItem,
  ButtonToggleGroup,
  SelectField,
  SectionCard,
  ColorPickerList,
} from "./ui";

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

const CONTRAST_OPTIONS = ["Low", "Medium", "High"] as const;

export function GlobalContextSection({
  globalContext,
  onUpdate,
  onUpdateLighting,
  onUpdateColorPalette,
}: GlobalContextSectionProps) {
  const t = useTranslations("context");
  const tc = useTranslations("common");
  const ts = useTranslations("sections");

  const contrastLabels = [tc("low"), tc("medium"), tc("high")] as const;

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
    <SectionCard icon={Globe2} title={ts("context")}>
      <div className="pl-2">
        <StepItem
          icon={<FileText className="w-5 h-5" />}
          label={t("sceneDescription")}
          isComplete={!!globalContext.scene_description}
        >
          <Textarea
            value={globalContext.scene_description}
            onChange={(e) => onUpdate({ scene_description: e.target.value })}
            placeholder={t("sceneDescriptionPlaceholder")}
            rows={3}
            className="resize-none"
          />
        </StepItem>

        <StepItem
          icon={<MapPin className="w-5 h-5" />}
          label={t("environment")}
          isComplete={!!globalContext.environment_type}
        >
          <SelectField
            value={globalContext.environment_type}
            onValueChange={(value) => onUpdate({ environment_type: value })}
            options={ENVIRONMENT_TYPES}
            placeholder={t("selectEnvironment")}
          />
        </StepItem>

        <StepItem
          icon={<Sparkles className="w-5 h-5" />}
          label={t("atmosphere")}
          isComplete={!!globalContext.weather_atmosphere}
        >
          <SelectField
            value={globalContext.weather_atmosphere}
            onValueChange={(value) => onUpdate({ weather_atmosphere: value })}
            options={ATMOSPHERE_OPTIONS}
            placeholder={t("selectAtmosphere")}
          />
        </StepItem>

        <StepItem
          icon={<Sun className="w-5 h-5" />}
          label={t("lighting")}
          isComplete={!!globalContext.lighting.source}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <SelectField
                value={globalContext.lighting.source}
                onValueChange={(value) => onUpdateLighting({ source: value })}
                options={LIGHTING_SOURCES}
                placeholder={t("lightingSource")}
              />
              <SelectField
                value={globalContext.lighting.quality}
                onValueChange={(value) => onUpdateLighting({ quality: value })}
                options={LIGHTING_QUALITIES}
                placeholder={t("lightingQuality")}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SelectField
                value={globalContext.lighting.direction}
                onValueChange={(value) => onUpdateLighting({ direction: value })}
                options={LIGHTING_DIRECTIONS}
                placeholder={t("lightingDirection")}
              />
              <SelectField
                value={globalContext.lighting.color_temperature}
                onValueChange={(value) => onUpdateLighting({ color_temperature: value })}
                options={COLOR_TEMPERATURES}
                placeholder={t("colorTemperature")}
              />
            </div>
          </div>
        </StepItem>

        <StepItem
          icon={<Palette className="w-5 h-5" />}
          label={t("colors")}
          isComplete={globalContext.color_palette.dominant_hex_estimates.length > 0}
          isLast
        >
          <div className="space-y-4">
            <ColorPickerList
              colors={globalContext.color_palette.dominant_hex_estimates}
              onChange={handleColorChange}
              onAdd={addDominantColor}
              onRemove={removeDominantColor}
            />

            <ButtonToggleGroup
              options={CONTRAST_OPTIONS.map((opt, i) => ({ value: opt, label: contrastLabels[i] }))}
              value={globalContext.color_palette.contrast_level}
              onChange={(value) => onUpdateColorPalette({ contrast_level: value })}
              columns={3}
              size="sm"
            />
          </div>
        </StepItem>
      </div>
    </SectionCard>
  );
}
