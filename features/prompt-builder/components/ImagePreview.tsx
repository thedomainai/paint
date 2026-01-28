"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Download, Loader2, ImageIcon, AlertCircle } from "lucide-react";
import type { ImagePrompt } from "../types/prompt";

interface ImagePreviewProps {
  prompt: ImagePrompt;
}

export function ImagePreview({ prompt }: ImagePreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usedPrompt, setUsedPrompt] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Failed to generate image");
        return;
      }

      setGeneratedImage(data.image);
      setUsedPrompt(data.prompt);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold">Generate</h2>
          </div>
          {generatedImage && (
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          )}
        </div>

        {/* Image Display Area */}
        <div className="relative aspect-square rounded-lg border-2 border-dashed border-muted mb-4 overflow-hidden bg-muted/20">
          {isGenerating ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Generating...</p>
            </div>
          ) : generatedImage ? (
            <img
              src={generatedImage}
              alt="Generated"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Configure prompt and generate
              </p>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Used Prompt Display */}
        {usedPrompt && !isGenerating && (
          <div className="p-3 mb-4 rounded-lg bg-muted text-xs text-muted-foreground">
            <p className="font-medium mb-1">Generated prompt:</p>
            <p className="line-clamp-3">{usedPrompt}</p>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Image
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
