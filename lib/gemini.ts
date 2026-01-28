import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. Image generation will not work.");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface ReferenceImageInput {
  data: string;
  mimeType: string;
}

export async function generateImage(
  prompt: string,
  referenceImages?: ReferenceImageInput[]
): Promise<{
  success: boolean;
  imageBase64?: string;
  mimeType?: string;
  error?: string;
}> {
  if (!genAI) {
    return {
      success: false,
      error: "Gemini API key is not configured",
    };
  }

  try {
    // Use Gemini 2.0 Flash with image generation
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ["Text", "Image"],
      } as any,
    });

    // Build content parts with JSON prompt and optional reference images
    const contentParts: any[] = [];

    // Add reference images first if provided
    if (referenceImages && referenceImages.length > 0) {
      for (const img of referenceImages) {
        contentParts.push({
          inlineData: {
            mimeType: img.mimeType,
            data: img.data,
          },
        });
      }
      // Add instruction for using reference images with JSON prompt
      contentParts.push({
        text: `Use the above reference image(s) as visual guidance. Generate an image based on this specification:\n\n${prompt}`,
      });
    } else {
      contentParts.push({
        text: `Generate an image based on this specification:\n\n${prompt}`
      });
    }

    const response = await model.generateContent(contentParts);
    const result = response.response;

    // Extract image from response
    const parts = result.candidates?.[0]?.content?.parts || [];

    for (const part of parts) {
      if ((part as any).inlineData) {
        const inlineData = (part as any).inlineData;
        return {
          success: true,
          imageBase64: inlineData.data,
          mimeType: inlineData.mimeType,
        };
      }
    }

    return {
      success: false,
      error: "No image generated in response",
    };
  } catch (error) {
    console.error("Image generation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
