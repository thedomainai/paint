import { NextRequest, NextResponse } from "next/server";
import { generateImageFromPrompt } from "@/lib/services";

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

    const result = await generateImageFromPrompt(promptData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      image: result.image,
    });
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
