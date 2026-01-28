"use client";

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

const DEPTH_OPTIONS: ButtonToggleOption<string>[] = [
  { value: "Shallow (Subject in focus, background blurred)", label: "Shallow" },
  { value: "Medium (Moderate blur)", label: "Medium" },
  { value: "Deep (Everything in focus)", label: "Deep" },
];

const SYMMETRY_OPTIONS: ButtonToggleOption<string>[] = [
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
    <SectionCard icon={Camera} title="Composition">
      <div className="pl-2">
        <StepItem
          icon={<Move3d className="w-5 h-5" />}
          label="Camera Angle"
          isComplete={!!composition.camera_angle}
        >
          <SelectField
            value={composition.camera_angle}
            onValueChange={(value) => onUpdate({ camera_angle: value })}
            options={CAMERA_ANGLES}
            placeholder="Select angle..."
          />
        </StepItem>

        <StepItem
          icon={<LayoutGrid className="w-5 h-5" />}
          label="Framing"
          isComplete={!!composition.framing}
        >
          <SelectField
            value={composition.framing}
            onValueChange={(value) => onUpdate({ framing: value })}
            options={FRAMING_OPTIONS}
            placeholder="Select framing..."
          />
        </StepItem>

        <StepItem
          icon={<Focus className="w-5 h-5" />}
          label="Depth of Field"
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
          label="Symmetry"
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
          label="Focal Point"
          isComplete={!!composition.focal_point}
        >
          <SelectField
            value={composition.focal_point}
            onValueChange={(value) => onUpdate({ focal_point: value })}
            options={FOCAL_POINT_OPTIONS}
            placeholder="Select focal point..."
          />
        </StepItem>

        <StepItem
          icon={<Grid3x3 className="w-5 h-5" />}
          label="Rule of Thirds"
          isComplete={!!composition.rule_of_thirds_alignment}
          isLast
        >
          <SelectField
            value={composition.rule_of_thirds_alignment}
            onValueChange={(value) => onUpdate({ rule_of_thirds_alignment: value })}
            options={RULE_OF_THIRDS_OPTIONS}
            placeholder="Select position..."
          />
        </StepItem>
      </div>
    </SectionCard>
  );
}
