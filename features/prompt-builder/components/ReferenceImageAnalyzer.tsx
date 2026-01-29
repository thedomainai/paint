"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ImageIcon,
  Sparkles,
  Loader2,
  X,
  Upload,
  Wand2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImagePrompt } from "../types/prompt";

interface ReferenceImageAnalyzerProps {
  onAnalysisComplete: (prompt: ImagePrompt) => void;
}

export function ReferenceImageAnalyzer({
  onAnalysisComplete,
}: ReferenceImageAnalyzerProps) {
  const t = useTranslations("analyzer");
  const tc = useTranslations("common");

  const [image, setImage] = useState<{
    data: string;
    mimeType: string;
    preview: string;
    name: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const base64Data = result.split(",")[1];
      setImage({
        data: base64Data,
        mimeType: file.type,
        preview: result,
        name: file.name,
      });
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemoveImage = useCallback(() => {
    setImage(null);
    setError(null);
  }, []);

  const handleAnalyze = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: image.data,
          mimeType: image.mimeType,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || t("analysisFailed"));
        return;
      }

      onAnalysisComplete(data.prompt);
    } catch (err) {
      setError(t("networkError"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{t("title")}</h2>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>

        {!image ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "relative flex flex-col items-center justify-center py-12 rounded-lg border-2 border-dashed transition-colors cursor-pointer",
              isDragging
                ? "border-primary bg-primary/10"
                : "border-muted-foreground/30 hover:border-primary hover:bg-primary/5"
            )}
          >
            <Upload className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium mb-1">{t("dropImage")}</p>
            <p className="text-xs text-muted-foreground mb-3">
              {t("orClickToUpload")}
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={image.preview}
                alt="Reference"
                className="w-full max-h-64 object-contain rounded-lg border"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {image.name}
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <Button
          onClick={handleAnalyze}
          disabled={!image || isAnalyzing}
          className="w-full mt-4"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("analyzing")}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              {t("analyzeAndGenerate")}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
