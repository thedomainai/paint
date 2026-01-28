"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Download, Loader2, ImageIcon, AlertCircle, Trash2, History } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImagePrompt } from "../types/prompt";
import { useImageHistory, type HistoryItem } from "../hooks/useImageHistory";

interface ImagePreviewProps {
  prompt: ImagePrompt;
}

export function ImagePreview({ prompt }: ImagePreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usedPrompt, setUsedPrompt] = useState<string | null>(null);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  const { history, addToHistory, removeFromHistory } = useImageHistory();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setSelectedHistoryId(null);

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

      // Add to history
      const historyItem = addToHistory(data.image, data.prompt);
      setSelectedHistoryId(historyItem.id);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (imageUrl?: string) => {
    const url = imageUrl || generatedImage;
    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.download = `generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setGeneratedImage(item.image);
    setUsedPrompt(item.prompt);
    setSelectedHistoryId(item.id);
    setError(null);
  };

  const handleHistoryDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeFromHistory(id);
    if (selectedHistoryId === id) {
      setSelectedHistoryId(null);
      if (history.length > 1) {
        const nextItem = history.find((item) => item.id !== id);
        if (nextItem) {
          handleHistorySelect(nextItem);
        }
      } else {
        setGeneratedImage(null);
        setUsedPrompt(null);
      }
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold">Generate</h2>
          </div>
          {generatedImage && (
            <Button variant="outline" size="sm" onClick={() => handleDownload()}>
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          )}
        </div>

        {/* Main content with history sidebar */}
        <div className="flex gap-3">
          {/* History Sidebar */}
          {history.length > 0 && (
            <div className="w-20 flex-shrink-0">
              <div className="flex items-center gap-1 mb-2 text-xs text-muted-foreground">
                <History className="w-3 h-3" />
                <span>History</span>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleHistorySelect(item)}
                    className={cn(
                      "relative group cursor-pointer rounded-md overflow-hidden border-2 transition-all",
                      selectedHistoryId === item.id
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent hover:border-muted-foreground/30"
                    )}
                  >
                    <img
                      src={item.image}
                      alt="History"
                      className="w-full aspect-square object-cover"
                    />
                    <button
                      onClick={(e) => handleHistoryDelete(e, item.id)}
                      className="absolute top-1 right-1 w-5 h-5 rounded bg-destructive/90 text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Display Area */}
          <div className="flex-1">
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
          </div>
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
