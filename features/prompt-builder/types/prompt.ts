// Image Prompt Structure based on prompt-nano-banana.md

export interface FileCharacteristics {
  compression_artifacts: "None" | "Low" | "Medium" | "High";
  noise_level: "None" | "Low" | "Medium" | "High";
  lens_type_estimation: string;
}

export interface Meta {
  image_quality: "Low" | "Medium" | "High" | "Ultra";
  image_type: string;
  resolution_estimation: string;
  file_characteristics: FileCharacteristics;
}

export interface Lighting {
  source: string;
  direction: string;
  quality: string;
  color_temperature: string;
}

export interface ColorPalette {
  dominant_hex_estimates: string[];
  accent_colors: string[];
  contrast_level: "Low" | "Medium" | "High";
}

export interface GlobalContext {
  scene_description: string;
  environment_type: string;
  time_of_day: string;
  weather_atmosphere: string;
  lighting: Lighting;
  color_palette: ColorPalette;
}

export interface Composition {
  camera_angle: string;
  framing: string;
  depth_of_field: string;
  focal_point: string;
  symmetry_type: string;
  rule_of_thirds_alignment: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ObjectLocation {
  relative_position: string;
  bounding_box_percentage: BoundingBox;
}

export interface SurfaceProperties {
  texture: string;
  reflectivity: "None" | "Low" | "Medium" | "High";
  micro_details: string;
  wear_state?: string;
}

export interface ColorDetails {
  base_color_hex: string;
  secondary_colors: string[];
  gradient_or_pattern: string;
}

export interface InteractionWithLight {
  shadow_casting?: string;
  highlight_zones?: string;
  translucency?: string;
}

export interface TextContent {
  raw_text: string;
  font_style: string;
  font_weight: string;
  text_case: string;
  alignment: string;
  color_hex: string;
}

export interface ObjectRelationship {
  type: "wearing" | "interacting_with" | "standing_on" | "originating_from" | "emitting" | "near" | "behind" | "in_front_of";
  target_object_id: string;
}

export type ObjectCategory =
  | "Person"
  | "Apparel"
  | "Footwear"
  | "Accessory"
  | "Illustration/Overlay"
  | "Illustration/Background Element"
  | "Digital Vector"
  | "Prop"
  | "Environment"
  | "Other";

export interface ReferenceImage {
  data: string; // base64 encoded image data
  mimeType: string;
  name: string;
}

export interface PromptObject {
  id: string;
  label: string;
  category: ObjectCategory;
  location: ObjectLocation;
  dimensions_relative: "Small" | "Medium" | "Large";
  distance_from_camera: "Close" | "Mid" | "Far" | "Zero (Overlay)" | "Behind Subject";
  pose_orientation: string;
  material: string;
  surface_properties: SurfaceProperties;
  color_details: ColorDetails;
  interaction_with_light?: InteractionWithLight;
  text_content?: TextContent;
  relationships?: ObjectRelationship[];
  reference_image?: ReferenceImage;
}

export interface ImagePrompt {
  meta: Meta;
  global_context: GlobalContext;
  composition: Composition;
  objects: PromptObject[];
}

// Predefined options for UI dropdowns
export const IMAGE_TYPES = [
  "Photography",
  "Digital Illustration",
  "Mixed Media (Photography combined with Digital Illustration/Collage)",
  "3D Render",
  "Vector Art",
  "Painting Style",
  "Anime/Manga Style",
] as const;

export const CAMERA_ANGLES = [
  "Eye-level",
  "Low-angle (looking up at subject)",
  "High-angle (looking down at subject)",
  "Bird's eye view",
  "Worm's eye view",
  "Dutch angle",
  "Over-the-shoulder",
] as const;

export const FRAMING_OPTIONS = [
  "Extreme Close-up",
  "Close-up (Face)",
  "Medium Close-up (Head and Shoulders)",
  "Medium Shot (Waist up)",
  "Medium Full Shot (Knees up)",
  "Full Shot (Head to Toe)",
  "Wide Shot",
  "Extreme Wide Shot",
] as const;

export const LIGHTING_SOURCES = [
  "Natural Sunlight",
  "Artificial Studio Lighting",
  "Mixed (Natural + Artificial)",
  "Window Light",
  "Neon/Colored Lighting",
  "Ambient/Soft Lighting",
  "Dramatic/High Contrast",
] as const;

export const LIGHTING_QUALITIES = [
  "Soft, Diffused",
  "Hard, Directional",
  "Rim/Backlit",
  "Flat",
  "Dramatic",
  "Natural",
] as const;

export const ENVIRONMENT_TYPES = [
  "Studio/Graphic Design Composition",
  "Indoor/Interior",
  "Outdoor/Exterior",
  "Urban/City",
  "Nature/Landscape",
  "Abstract/Undefined",
] as const;

export const ATMOSPHERE_OPTIONS = [
  "Energetic, Artistic, Urban, Cool",
  "Calm, Peaceful, Serene",
  "Dark, Moody, Mysterious",
  "Bright, Cheerful, Optimistic",
  "Professional, Corporate, Clean",
  "Romantic, Soft, Dreamy",
  "Futuristic, Sci-fi, Tech",
] as const;

export const RESOLUTION_OPTIONS = [
  "4K (3840×2160)",
  "2K (2560×1440)",
  "Full HD (1920×1080)",
  "HD (1280×720)",
  "Square 1:1 (1024×1024)",
  "Portrait 3:4 (768×1024)",
  "Landscape 16:9 (1920×1080)",
] as const;

export const LENS_TYPES = [
  "Wide Angle (14-35mm)",
  "Standard (35-50mm)",
  "Portrait (50-85mm)",
  "Telephoto (85-200mm)",
  "Macro",
  "Fisheye",
  "Tilt-Shift",
] as const;

export const LIGHTING_DIRECTIONS = [
  "Front",
  "Back (Backlit)",
  "Left Side",
  "Right Side",
  "Top (Overhead)",
  "Bottom (Underlit)",
  "45° Key Light",
  "Rim Light",
  "Split (Half/Half)",
] as const;

export const COLOR_TEMPERATURES = [
  "Warm (2700K - Golden Hour)",
  "Neutral (4000K - Daylight)",
  "Cool (5500K - Overcast)",
  "Cold (6500K+ - Blue Hour)",
  "Mixed (Warm & Cool)",
  "Candlelight (1800K)",
  "Tungsten (3200K)",
] as const;

export const FOCAL_POINT_OPTIONS = [
  "Subject's Face",
  "Subject's Eyes",
  "Center of Frame",
  "Foreground Object",
  "Background Element",
  "Product/Item",
  "Text/Logo",
  "Leading Lines Intersection",
] as const;

export const RULE_OF_THIRDS_OPTIONS = [
  "Subject Center",
  "Subject Left Third",
  "Subject Right Third",
  "Subject Upper Third",
  "Subject Lower Third",
  "Upper-Left Intersection",
  "Upper-Right Intersection",
  "Lower-Left Intersection",
  "Lower-Right Intersection",
] as const;
