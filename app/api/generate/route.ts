import { NextRequest, NextResponse } from "next/server";
import { generateImage, buildPromptFromJson, type ReferenceImageInput } from "@/lib/gemini";

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

    // Convert structured prompt to text
    const textPrompt = buildPromptFromJson(promptData);

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

    // Generate image with optional reference images
    const result = await generateImage(
      textPrompt,
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
      prompt: textPrompt,
      hasReferenceImages: referenceImages.length > 0,
    });
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
