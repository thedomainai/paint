import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. Image generation will not work.");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateImage(prompt: string): Promise<{
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

    const response = await model.generateContent(prompt);
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

export function buildPromptFromJson(promptData: any): string {
  const parts: string[] = [];

  // Meta information
  if (promptData.meta) {
    const meta = promptData.meta;
    if (meta.image_type) parts.push(`Style: ${meta.image_type}`);
    if (meta.image_quality) parts.push(`Quality: ${meta.image_quality}`);
  }

  // Global context
  if (promptData.global_context) {
    const ctx = promptData.global_context;
    if (ctx.scene_description) parts.push(ctx.scene_description);
    if (ctx.environment_type) parts.push(`Environment: ${ctx.environment_type}`);
    if (ctx.weather_atmosphere) parts.push(`Atmosphere: ${ctx.weather_atmosphere}`);
    
    if (ctx.lighting) {
      const light = ctx.lighting;
      const lightingParts = [light.source, light.quality, light.direction].filter(Boolean);
      if (lightingParts.length > 0) {
        parts.push(`Lighting: ${lightingParts.join(", ")}`);
      }
    }
  }

  // Composition
  if (promptData.composition) {
    const comp = promptData.composition;
    const compParts = [
      comp.camera_angle,
      comp.framing,
      comp.depth_of_field,
    ].filter(Boolean);
    if (compParts.length > 0) {
      parts.push(`Composition: ${compParts.join(", ")}`);
    }
    if (comp.focal_point) parts.push(`Focal point: ${comp.focal_point}`);
  }

  // Objects
  if (promptData.objects && promptData.objects.length > 0) {
    for (const obj of promptData.objects) {
      const objParts: string[] = [];
      if (obj.label) objParts.push(obj.label);
      if (obj.category) objParts.push(`(${obj.category})`);
      if (obj.material) objParts.push(`made of ${obj.material}`);
      if (obj.pose_orientation) objParts.push(obj.pose_orientation);
      if (obj.location?.relative_position) {
        objParts.push(`positioned ${obj.location.relative_position}`);
      }
      if (objParts.length > 0) {
        parts.push(objParts.join(" "));
      }
    }
  }

  return parts.join(". ") + ".";
}
