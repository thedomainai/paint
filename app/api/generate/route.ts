import { NextRequest, NextResponse } from "next/server";
import { generateImage, type ReferenceImageInput } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt: promptData } = body;

    if (!promptData) {
      return NextResponse.json(
        { success: false, error: "Prompt data is required" },
        { status: 400 }
      );
    }

    // Create a clean copy without reference_image data for the prompt
    const cleanPromptData = JSON.parse(JSON.stringify(promptData));
    if (cleanPromptData.objects) {
      for (const obj of cleanPromptData.objects) {
        delete obj.reference_image;
      }
    }

    // Convert to JSON string for Gemini
    const jsonPrompt = JSON.stringify(cleanPromptData, null, 2);

    // Extract reference images from objects
    const referenceImages: ReferenceImageInput[] = [];
    if (promptData.objects && Array.isArray(promptData.objects)) {
      for (const obj of promptData.objects) {
        if (obj.reference_image?.data && obj.reference_image?.mimeType) {
          referenceImages.push({
            data: obj.reference_image.data,
            mimeType: obj.reference_image.mimeType,
          });
        }
      }
    }

    // Generate image with JSON prompt and optional reference images
    const result = await generateImage(
      jsonPrompt,
      referenceImages.length > 0 ? referenceImages : undefined
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      image: `data:${result.mimeType};base64,${result.imageBase64}`,
    });
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
