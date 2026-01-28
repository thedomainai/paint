"use client";

import { useTranslations } from "next-intl";
import { Camera, Focus, LayoutGrid, Move3d, Crosshair, Grid3x3 } from "lucide-react";
import type { ImagePrompt } from "../types/prompt";
import {
  CAMERA_ANGLES,
  FRAMING_OPTIONS,
  FOCAL_POINT_OPTIONS,
  RULE_OF_THIRDS_OPTIONS,
} from "../types/prompt";
import { StepItem, ButtonToggleGroup, SelectField, SectionCard } from "./ui";
import type { ButtonToggleOption } from "./ui";

interface CompositionSectionProps {
  composition: ImagePrompt["composition"];
  onUpdate: (updates: Partial<ImagePrompt["composition"]>) => void;
}

export function CompositionSection({
  composition,
  onUpdate,
}: CompositionSectionProps) {
  const t = useTranslations("composition");
  const tc = useTranslations("common");
  const ts = useTranslations("sections");

  const DEPTH_OPTIONS: ButtonToggleOption<string>[] = [
    { value: "Shallow (Subject in focus, background blurred)", label: t("shallow") },
    { value: "Medium (Moderate blur)", label: tc("medium") },
    { value: "Deep (Everything in focus)", label: t("deep") },
  ];

  const SYMMETRY_OPTIONS: ButtonToggleOption<string>[] = [
    { value: "Symmetrical", label: t("symmetrical") },
    { value: "Asymmetrical balance", label: t("asymmetrical") },
    { value: "Radial", label: t("radial") },
    { value: "None", label: tc("none") },
  ];

  return (
    <SectionCard icon={Camera} title={ts("composition")}>
      <div className="pl-2">
        <StepItem
          icon={<Move3d className="w-5 h-5" />}
          label={t("cameraAngle")}
          isComplete={!!composition.camera_angle}
        >
          <SelectField
            value={composition.camera_angle}
            onValueChange={(value) => onUpdate({ camera_angle: value })}
            options={CAMERA_ANGLES}
            placeholder={t("selectAngle")}
          />
        </StepItem>

        <StepItem
          icon={<LayoutGrid className="w-5 h-5" />}
          label={t("framing")}
          isComplete={!!composition.framing}
        >
          <SelectField
            value={composition.framing}
            onValueChange={(value) => onUpdate({ framing: value })}
            options={FRAMING_OPTIONS}
            placeholder={t("selectFraming")}
          />
        </StepItem>

        <StepItem
          icon={<Focus className="w-5 h-5" />}
          label={t("depthOfField")}
          isComplete={!!composition.depth_of_field}
        >
          <ButtonToggleGroup
            options={DEPTH_OPTIONS}
            value={composition.depth_of_field}
            onChange={(value) => onUpdate({ depth_of_field: value })}
            columns={3}
          />
        </StepItem>

        <StepItem
          icon={<LayoutGrid className="w-5 h-5" />}
          label={t("symmetry")}
          isComplete={!!composition.symmetry_type}
        >
          <ButtonToggleGroup
            options={SYMMETRY_OPTIONS}
            value={composition.symmetry_type}
            onChange={(value) => onUpdate({ symmetry_type: value })}
            size="sm"
          />
        </StepItem>

        <StepItem
          icon={<Crosshair className="w-5 h-5" />}
          label={t("focalPoint")}
          isComplete={!!composition.focal_point}
        >
          <SelectField
            value={composition.focal_point}
            onValueChange={(value) => onUpdate({ focal_point: value })}
            options={FOCAL_POINT_OPTIONS}
            placeholder={t("selectFocalPoint")}
          />
        </StepItem>

        <StepItem
          icon={<Grid3x3 className="w-5 h-5" />}
          label={t("ruleOfThirds")}
          isComplete={!!composition.rule_of_thirds_alignment}
          isLast
        >
          <SelectField
            value={composition.rule_of_thirds_alignment}
            onValueChange={(value) => onUpdate({ rule_of_thirds_alignment: value })}
            options={RULE_OF_THIRDS_OPTIONS}
            placeholder={t("selectPosition")}
          />
        </StepItem>
      </div>
    </SectionCard>
  );
}
