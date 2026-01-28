import { NextRequest, NextResponse } from "next/server";
import { generateImage, buildPromptFromJson } from "@/lib/gemini";

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
    
    // Generate image
    const result = await generateImage(textPrompt);

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
    });
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
