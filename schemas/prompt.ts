import { z } from "zod";

export const fileCharacteristicsSchema = z.object({
  compression_artifacts: z.enum(["None", "Low", "Medium", "High"]),
  noise_level: z.enum(["None", "Low", "Medium", "High"]),
  lens_type_estimation: z.string(),
});

export const metaSchema = z.object({
  image_quality: z.enum(["Low", "Medium", "High", "Ultra"]),
  image_type: z.string(),
  resolution_estimation: z.string(),
  file_characteristics: fileCharacteristicsSchema,
});

export const lightingSchema = z.object({
  source: z.string(),
  direction: z.string(),
  quality: z.string(),
  color_temperature: z.string(),
});

export const colorPaletteSchema = z.object({
  dominant_hex_estimates: z.array(z.string()),
  accent_colors: z.array(z.string()),
  contrast_level: z.enum(["Low", "Medium", "High"]),
});

export const globalContextSchema = z.object({
  scene_description: z.string(),
  environment_type: z.string(),
  time_of_day: z.string(),
  weather_atmosphere: z.string(),
  lighting: lightingSchema,
  color_palette: colorPaletteSchema,
});

export const compositionSchema = z.object({
  camera_angle: z.string(),
  framing: z.string(),
  depth_of_field: z.string(),
  focal_point: z.string(),
  symmetry_type: z.string(),
  rule_of_thirds_alignment: z.string(),
});

export const boundingBoxSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  width: z.number().min(0).max(1),
  height: z.number().min(0).max(1),
});

export const objectLocationSchema = z.object({
  relative_position: z.string(),
  bounding_box_percentage: boundingBoxSchema,
});

export const surfacePropertiesSchema = z.object({
  texture: z.string(),
  reflectivity: z.enum(["None", "Low", "Medium", "High"]),
  micro_details: z.string(),
  wear_state: z.string().optional(),
});

export const colorDetailsSchema = z.object({
  base_color_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondary_colors: z.array(z.string()),
  gradient_or_pattern: z.string(),
});

export const interactionWithLightSchema = z.object({
  shadow_casting: z.string().optional(),
  highlight_zones: z.string().optional(),
  translucency: z.string().optional(),
});

export const textContentSchema = z.object({
  raw_text: z.string(),
  font_style: z.string(),
  font_weight: z.string(),
  text_case: z.string(),
  alignment: z.string(),
  color_hex: z.string(),
});

export const objectRelationshipSchema = z.object({
  type: z.enum([
    "wearing",
    "interacting_with",
    "standing_on",
    "originating_from",
    "emitting",
    "near",
    "behind",
    "in_front_of",
  ]),
  target_object_id: z.string(),
});

export const promptObjectSchema = z.object({
  id: z.string(),
  label: z.string(),
  category: z.enum([
    "Person",
    "Apparel",
    "Footwear",
    "Accessory",
    "Illustration/Overlay",
    "Illustration/Background Element",
    "Digital Vector",
    "Prop",
    "Environment",
    "Other",
  ]),
  location: objectLocationSchema,
  dimensions_relative: z.enum(["Small", "Medium", "Large"]),
  distance_from_camera: z.enum(["Close", "Mid", "Far", "Zero (Overlay)", "Behind Subject"]),
  pose_orientation: z.string(),
  material: z.string(),
  surface_properties: surfacePropertiesSchema,
  color_details: colorDetailsSchema,
  interaction_with_light: interactionWithLightSchema.optional(),
  text_content: textContentSchema.optional(),
  relationships: z.array(objectRelationshipSchema).optional(),
});

export const imagePromptSchema = z.object({
  meta: metaSchema,
  global_context: globalContextSchema,
  composition: compositionSchema,
  objects: z.array(promptObjectSchema),
});

export type ImagePromptSchema = z.infer<typeof imagePromptSchema>;
