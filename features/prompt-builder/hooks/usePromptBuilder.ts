"use client";

import { useState, useCallback } from "react";
import type { ImagePrompt, PromptObject } from "../types/prompt";
import { defaultPrompt, createDefaultObject } from "@/lib/prompt/defaults";

export function usePromptBuilder(initialPrompt?: Partial<ImagePrompt>) {
  const [prompt, setPrompt] = useState<ImagePrompt>({
    ...defaultPrompt,
    ...initialPrompt,
  });

  const updateMeta = useCallback(
    (updates: Partial<ImagePrompt["meta"]>) => {
      setPrompt((prev) => ({
        ...prev,
        meta: { ...prev.meta, ...updates },
      }));
    },
    []
  );

  const updateGlobalContext = useCallback(
    (updates: Partial<ImagePrompt["global_context"]>) => {
      setPrompt((prev) => ({
        ...prev,
        global_context: { ...prev.global_context, ...updates },
      }));
    },
    []
  );

  const updateLighting = useCallback(
    (updates: Partial<ImagePrompt["global_context"]["lighting"]>) => {
      setPrompt((prev) => ({
        ...prev,
        global_context: {
          ...prev.global_context,
          lighting: { ...prev.global_context.lighting, ...updates },
        },
      }));
    },
    []
  );

  const updateColorPalette = useCallback(
    (updates: Partial<ImagePrompt["global_context"]["color_palette"]>) => {
      setPrompt((prev) => ({
        ...prev,
        global_context: {
          ...prev.global_context,
          color_palette: { ...prev.global_context.color_palette, ...updates },
        },
      }));
    },
    []
  );

  const updateComposition = useCallback(
    (updates: Partial<ImagePrompt["composition"]>) => {
      setPrompt((prev) => ({
        ...prev,
        composition: { ...prev.composition, ...updates },
      }));
    },
    []
  );

  const addObject = useCallback(() => {
    const newId = `obj_${String(prompt.objects.length + 1).padStart(3, "0")}`;
    const newObject = createDefaultObject(newId);
    setPrompt((prev) => ({
      ...prev,
      objects: [...prev.objects, newObject],
    }));
    return newId;
  }, [prompt.objects.length]);

  const updateObject = useCallback(
    (id: string, updates: Partial<PromptObject>) => {
      setPrompt((prev) => ({
        ...prev,
        objects: prev.objects.map((obj) =>
          obj.id === id ? { ...obj, ...updates } : obj
        ),
      }));
    },
    []
  );

  const removeObject = useCallback((id: string) => {
    setPrompt((prev) => ({
      ...prev,
      objects: prev.objects.filter((obj) => obj.id !== id),
    }));
  }, []);

  const duplicateObject = useCallback(
    (id: string) => {
      const sourceObject = prompt.objects.find((obj) => obj.id === id);
      if (!sourceObject) return;

      const newId = `obj_${String(prompt.objects.length + 1).padStart(3, "0")}`;
      const duplicated: PromptObject = {
        ...JSON.parse(JSON.stringify(sourceObject)),
        id: newId,
        label: `${sourceObject.label} (copy)`,
      };

      setPrompt((prev) => ({
        ...prev,
        objects: [...prev.objects, duplicated],
      }));
      return newId;
    },
    [prompt.objects]
  );

  const reorderObjects = useCallback(
    (fromIndex: number, toIndex: number) => {
      setPrompt((prev) => {
        const objects = [...prev.objects];
        const [removed] = objects.splice(fromIndex, 1);
        objects.splice(toIndex, 0, removed);
        return { ...prev, objects };
      });
    },
    []
  );

  const resetPrompt = useCallback(() => {
    setPrompt(defaultPrompt);
  }, []);

  const loadPrompt = useCallback((newPrompt: ImagePrompt) => {
    setPrompt(newPrompt);
  }, []);

  const exportJson = useCallback(() => {
    return JSON.stringify(prompt, null, 2);
  }, [prompt]);

  return {
    prompt,
    updateMeta,
    updateGlobalContext,
    updateLighting,
    updateColorPalette,
    updateComposition,
    addObject,
    updateObject,
    removeObject,
    duplicateObject,
    reorderObjects,
    resetPrompt,
    loadPrompt,
    exportJson,
  };
}
