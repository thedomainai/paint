import { NextRequest, NextResponse } from "next/server";
import { analyzeImageForPrompt } from "@/lib/services";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, mimeType } = body;

    if (!image || !mimeType) {
      return NextResponse.json(
        { success: false, error: "Image data and mimeType are required" },
        { status: 400 }
      );
    }

    const result = await analyzeImageForPrompt(image, mimeType);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      prompt: result.prompt,
    });
  } catch (error) {
    console.error("Analyze API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
