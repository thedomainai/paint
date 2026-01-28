"use client";

import { useState, useEffect } from "react";

export interface HistoryItem {
  id: string;
  image: string;
  createdAt: number;
}

const STORAGE_KEY = "paint-image-history";
const MAX_HISTORY_ITEMS = 50;

export function useImageHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load image history:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (e) {
        console.error("Failed to save image history:", e);
      }
    }
  }, [history, isLoaded]);

  const addToHistory = (image: string) => {
    const newItem: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      image,
      createdAt: Date.now(),
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
      return updated;
    });

    return newItem;
  };

  const removeFromHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return {
    history,
    isLoaded,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}
