import { GoogleGenerativeAI, Part } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. Image generation will not work.");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface ReferenceImageInput {
  data: string;
  mimeType: string;
}

export interface GenerateImageSuccess {
  success: true;
  imageBase64: string;
  mimeType: string;
}

export interface GenerateImageError {
  success: false;
  error: string;
}

export type GenerateImageResult = GenerateImageSuccess | GenerateImageError;

const GEMINI_MODEL = "gemini-2.0-flash-exp-image-generation";

/**
 * Builds content parts for Gemini API request.
 * Includes reference images first (if any), followed by the text prompt.
 */
function buildContentParts(
  prompt: string,
  referenceImages?: ReferenceImageInput[]
): Part[] {
  const parts: Part[] = [];

  if (referenceImages && referenceImages.length > 0) {
    for (const img of referenceImages) {
      parts.push({
        inlineData: {
          mimeType: img.mimeType,
          data: img.data,
        },
      });
    }
    parts.push({
      text: `Use the above reference image(s) as visual guidance. Generate an image based on this specification:\n\n${prompt}`,
    });
  } else {
    parts.push({
      text: `Generate an image based on this specification:\n\n${prompt}`,
    });
  }

  return parts;
}

/**
 * Extracts image data from Gemini API response.
 */
function extractImageFromResponse(
  response: any
): { imageBase64: string; mimeType: string } | null {
  const parts = response.response?.candidates?.[0]?.content?.parts || [];

  for (const part of parts) {
    if (part.inlineData) {
      return {
        imageBase64: part.inlineData.data,
        mimeType: part.inlineData.mimeType,
      };
    }
  }

  return null;
}

/**
 * Generates an image using the Gemini API.
 *
 * @param prompt - The text prompt describing the image to generate
 * @param referenceImages - Optional reference images for visual guidance
 * @returns Result object with either image data or error message
 */
export async function generateImage(
  prompt: string,
  referenceImages?: ReferenceImageInput[]
): Promise<GenerateImageResult> {
  if (!genAI) {
    return {
      success: false,
      error: "Gemini API key is not configured",
    };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        responseModalities: ["Text", "Image"],
      } as any,
    });

    const contentParts = buildContentParts(prompt, referenceImages);
    const response = await model.generateContent(contentParts);
    const imageData = extractImageFromResponse(response);

    if (!imageData) {
      return {
        success: false,
        error: "No image generated in response",
      };
    }

    return {
      success: true,
      imageBase64: imageData.imageBase64,
      mimeType: imageData.mimeType,
    };
  } catch (error) {
    console.error("Gemini image generation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// ============================================
// Image Analysis for Prompt Generation
// ============================================

export interface AnalyzeImageSuccess {
  success: true;
  promptJson: string;
}

export interface AnalyzeImageError {
  success: false;
  error: string;
}

export type AnalyzeImageResult = AnalyzeImageSuccess | AnalyzeImageError;

const GEMINI_ANALYSIS_MODEL = "gemini-2.0-flash";

const IMAGE_PROMPT_SCHEMA = `{
  "meta": {
    "image_quality": "Low" | "Medium" | "High" | "Ultra",
    "image_type": string (e.g., "Photography", "Digital Illustration", "Mixed Media"),
    "resolution_estimation": string,
    "file_characteristics": {
      "compression_artifacts": "None" | "Low" | "Medium" | "High",
      "noise_level": "None" | "Low" | "Medium" | "High",
      "lens_type_estimation": string
    }
  },
  "global_context": {
    "scene_description": string (detailed description of the entire scene),
    "environment_type": string,
    "time_of_day": string,
    "weather_atmosphere": string,
    "lighting": {
      "source": string,
      "direction": string,
      "quality": string,
      "color_temperature": string
    },
    "color_palette": {
      "dominant_hex_estimates": string[] (hex colors),
      "accent_colors": string[],
      "contrast_level": "Low" | "Medium" | "High"
    }
  },
  "composition": {
    "camera_angle": string,
    "framing": string,
    "depth_of_field": string,
    "focal_point": string,
    "symmetry_type": string,
    "rule_of_thirds_alignment": string
  },
  "objects": [
    {
      "id": string (e.g., "obj_001"),
      "label": string,
      "category": "Person" | "Apparel" | "Footwear" | "Accessory" | "Illustration/Overlay" | "Illustration/Background Element" | "Digital Vector" | "Prop" | "Environment" | "Other",
      "location": {
        "relative_position": string,
        "bounding_box_percentage": { "x": number, "y": number, "width": number, "height": number }
      },
      "dimensions_relative": "Small" | "Medium" | "Large",
      "distance_from_camera": "Close" | "Mid" | "Far" | "Zero (Overlay)" | "Behind Subject",
      "pose_orientation": string,
      "material": string,
      "surface_properties": {
        "texture": string,
        "reflectivity": "None" | "Low" | "Medium" | "High",
        "micro_details": string
      },
      "color_details": {
        "base_color_hex": string,
        "secondary_colors": string[],
        "gradient_or_pattern": string
      }
    }
  ]
}`;

const ANALYSIS_PROMPT = `You are an expert image analyst. Analyze this image and generate a detailed JSON prompt that could be used to recreate it.

Follow this exact JSON schema:
${IMAGE_PROMPT_SCHEMA}

Important instructions:
1. Be extremely detailed in your analysis
2. Identify ALL objects in the image (people, clothing, accessories, graphics, overlays, etc.)
3. For each object, provide accurate bounding box percentages (0-1 range)
4. Extract actual hex color values from the image
5. Describe textures, materials, and surface properties precisely
6. Note any graphic overlays, illustrations, or digital elements
7. The scene_description should be comprehensive (2-3 sentences)

Return ONLY valid JSON, no markdown formatting or explanations.`;

/**
 * Analyzes an image and generates a detailed JSON prompt.
 */
export async function analyzeImage(
  imageData: string,
  mimeType: string
): Promise<AnalyzeImageResult> {
  if (!genAI) {
    return {
      success: false,
      error: "Gemini API key is not configured",
    };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: GEMINI_ANALYSIS_MODEL,
    });

    const response = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: imageData,
        },
      },
      { text: ANALYSIS_PROMPT },
    ]);

    const text = response.response.text();

    // Clean up the response - remove markdown code blocks if present
    let jsonText = text.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.slice(7);
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.slice(3);
    }
    if (jsonText.endsWith("```")) {
      jsonText = jsonText.slice(0, -3);
    }
    jsonText = jsonText.trim();

    // Validate JSON
    JSON.parse(jsonText);

    return {
      success: true,
      promptJson: jsonText,
    };
  } catch (error) {
    console.error("Gemini image analysis error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
