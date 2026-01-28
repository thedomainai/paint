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
