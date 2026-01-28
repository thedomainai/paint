"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Upload, Download, Code, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImagePrompt } from "../types/prompt";

interface JsonPreviewProps {
  prompt: ImagePrompt;
  onLoad: (prompt: ImagePrompt) => void;
}

export function JsonPreview({ prompt, onLoad }: JsonPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const prevJsonRef = useRef<string>("");

  const jsonString = JSON.stringify(prompt, null, 2);

  // Detect changes and trigger animation
  useEffect(() => {
    if (prevJsonRef.current && prevJsonRef.current !== jsonString) {
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 600);
      return () => clearTimeout(timer);
    }
    prevJsonRef.current = jsonString;
  }, [jsonString]);

  // Count non-empty fields for stats
  const stats = {
    meta: prompt.meta.image_type ? 1 : 0,
    context: prompt.global_context.scene_description ? 1 : 0,
    composition: prompt.composition.camera_angle ? 1 : 0,
    objects: prompt.objects.length,
  };
  const totalProgress =
    (stats.meta + stats.context + stats.composition + (stats.objects > 0 ? 1 : 0)) / 4;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "image-prompt.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText);
      onLoad(parsed);
      setShowImport(false);
      setImportText("");
      setError(null);
    } catch {
      setError("Invalid JSON format");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        onLoad(parsed);
        setShowImport(false);
        setError(null);
      } catch {
        setError("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card
      className={cn(
        "transition-all duration-300",
        isUpdating && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
                isUpdating
                  ? "bg-primary text-primary-foreground animate-pulse"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Code className="w-5 h-5" />
            </div>
            <CardTitle className="text-lg flex items-center gap-2">
              JSON
              {isUpdating && (
                <Sparkles className="w-4 h-4 text-primary animate-spin" />
              )}
            </CardTitle>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowImport(!showImport)}
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Stats badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant={stats.meta ? "default" : "outline"} className="text-xs">
            Meta {stats.meta ? "✓" : "○"}
          </Badge>
          <Badge variant={stats.context ? "default" : "outline"} className="text-xs">
            Context {stats.context ? "✓" : "○"}
          </Badge>
          <Badge variant={stats.composition ? "default" : "outline"} className="text-xs">
            Composition {stats.composition ? "✓" : "○"}
          </Badge>
          <Badge variant={stats.objects > 0 ? "default" : "outline"} className="text-xs">
            Objects ({stats.objects})
          </Badge>
        </div>

        {/* Progress indicator */}
        <div className="mt-3">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${totalProgress * 100}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {showImport && (
          <div className="space-y-3 p-4 border rounded-lg bg-muted/50 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Import from file:</label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="text-sm"
              />
            </div>
            <div className="text-sm font-medium">Or paste JSON:</div>
            <Textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste JSON here..."
              rows={4}
              className="font-mono text-xs"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={handleImport} size="sm">
              Load
            </Button>
          </div>
        )}

        <div className="relative">
          <pre
            className={cn(
              "bg-muted p-4 rounded-lg overflow-auto max-h-[500px] text-xs font-mono",
              "transition-all duration-300",
              isUpdating && "bg-primary/5"
            )}
          >
            <code>{jsonString}</code>
          </pre>

          {/* Update indicator overlay */}
          {isUpdating && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-2 right-2">
                <Badge className="animate-pulse bg-primary">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Updated
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
