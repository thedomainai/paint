import { generateImage, type ReferenceImageInput } from "@/lib/gemini";
import type { ImagePrompt } from "@/features/prompt-builder/types/prompt";

export interface GenerateImageResult {
  success: boolean;
  image?: string;
  error?: string;
}

/**
 * Extracts reference images from prompt objects.
 * Reference images are sent to Gemini as visual guidance.
 */
function extractReferenceImages(prompt: ImagePrompt): ReferenceImageInput[] {
  const referenceImages: ReferenceImageInput[] = [];

  if (prompt.objects && Array.isArray(prompt.objects)) {
    for (const obj of prompt.objects) {
      if (obj.reference_image?.data && obj.reference_image?.mimeType) {
        referenceImages.push({
          data: obj.reference_image.data,
          mimeType: obj.reference_image.mimeType,
        });
      }
    }
  }

  return referenceImages;
}

/**
 * Creates a clean prompt without reference image data.
 * Reference images are sent separately as multimodal input.
 */
function createCleanPrompt(prompt: ImagePrompt): ImagePrompt {
  const cleanPrompt = JSON.parse(JSON.stringify(prompt)) as ImagePrompt;

  if (cleanPrompt.objects) {
    for (const obj of cleanPrompt.objects) {
      delete (obj as any).reference_image;
    }
  }

  return cleanPrompt;
}

/**
 * Generates an image from an ImagePrompt using the Gemini API.
 */
export async function generateImageFromPrompt(
  prompt: ImagePrompt
): Promise<GenerateImageResult> {
  try {
    const cleanPrompt = createCleanPrompt(prompt);
    const jsonPrompt = JSON.stringify(cleanPrompt, null, 2);
    const referenceImages = extractReferenceImages(prompt);

    const result = await generateImage(
      jsonPrompt,
      referenceImages.length > 0 ? referenceImages : undefined
    );

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      image: `data:${result.mimeType};base64,${result.imageBase64}`,
    };
  } catch (error) {
    console.error("Image generation service error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
