import type { ImagePrompt, PromptObject } from "@/features/prompt-builder/types/prompt";

export const defaultMeta: ImagePrompt["meta"] = {
  image_quality: "High",
  image_type: "Mixed Media (Photography combined with Digital Illustration/Collage)",
  resolution_estimation: "High resolution, sharp edges",
  file_characteristics: {
    compression_artifacts: "Low",
    noise_level: "None",
    lens_type_estimation: "Standard (approx 50mm)",
  },
};

export const defaultLighting: ImagePrompt["global_context"]["lighting"] = {
  source: "Artificial Studio Lighting",
  direction: "Front-right dominant",
  quality: "Soft, Diffused",
  color_temperature: "Neutral white",
};

export const defaultColorPalette: ImagePrompt["global_context"]["color_palette"] = {
  dominant_hex_estimates: ["#4CA7E8", "#0044CC", "#FFFFFF"],
  accent_colors: ["#FFFFFF"],
  contrast_level: "High",
};

export const defaultGlobalContext: ImagePrompt["global_context"] = {
  scene_description: "",
  environment_type: "Studio/Graphic Design Composition",
  time_of_day: "Indiscernible (Studio Lighting)",
  weather_atmosphere: "Energetic, Artistic, Urban, Cool",
  lighting: defaultLighting,
  color_palette: defaultColorPalette,
};

export const defaultComposition: ImagePrompt["composition"] = {
  camera_angle: "Eye-level",
  framing: "Full Shot (Head to Toe)",
  depth_of_field: "Deep (Everything in focus)",
  focal_point: "Subject's face",
  symmetry_type: "Asymmetrical balance",
  rule_of_thirds_alignment: "Subject centered",
};

export const createDefaultObject = (id: string): PromptObject => ({
  id,
  label: "",
  category: "Other",
  location: {
    relative_position: "Center",
    bounding_box_percentage: {
      x: 0.3,
      y: 0.1,
      width: 0.4,
      height: 0.8,
    },
  },
  dimensions_relative: "Medium",
  distance_from_camera: "Mid",
  pose_orientation: "",
  material: "",
  surface_properties: {
    texture: "",
    reflectivity: "Low",
    micro_details: "",
    wear_state: "New",
  },
  color_details: {
    base_color_hex: "#FFFFFF",
    secondary_colors: [],
    gradient_or_pattern: "Solid",
  },
});

export const defaultPrompt: ImagePrompt = {
  meta: defaultMeta,
  global_context: defaultGlobalContext,
  composition: defaultComposition,
  objects: [],
};
