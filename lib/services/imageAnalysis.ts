import { analyzeImage } from "@/lib/gemini";
import type { ImagePrompt } from "@/features/prompt-builder/types/prompt";

export interface AnalyzeImageResult {
  success: boolean;
  prompt?: ImagePrompt;
  error?: string;
}

/**
 * Analyzes an image and generates an ImagePrompt.
 */
export async function analyzeImageForPrompt(
  imageData: string,
  mimeType: string
): Promise<AnalyzeImageResult> {
  try {
    const result = await analyzeImage(imageData, mimeType);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    const prompt = JSON.parse(result.promptJson) as ImagePrompt;

    return {
      success: true,
      prompt,
    };
  } catch (error) {
    console.error("Image analysis service error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
