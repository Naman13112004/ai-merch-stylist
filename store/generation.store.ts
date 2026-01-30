"use client";

import { create } from "zustand";
import { Generation } from "@/types/generation";
import { supabase } from "@/lib/supabase";

// Defining how our zustand store looks like
interface GenerationState {
  previewUrl: string;
  prompt: string;
  loading: boolean;
  result: Generation | null;
  history: Generation[];

  setPreviewUrl: (url: string) => void;
  setPrompt: (prompt: string) => void;

  generateImage: () => Promise<void>;
  fetchHistory: () => Promise<void>;
}

// Actually creating the store using zustand for state management
export const useGenerationStore = create<GenerationState>((set, get) => ({
  previewUrl: "",
  prompt: "",
  loading: false,
  result: null,
  history: [],

  setPreviewUrl: (url) => set({ previewUrl: url }),
  setPrompt: (prompt) => set({ prompt }),

  fetchHistory: async () => {
    const { data } = await supabase
      .from("generations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (data) set({ history: data });
  },

  generateImage: async () => {
    const { previewUrl, prompt } = get();
    if (!previewUrl || !prompt) return;

    set({ loading: true });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({
          imageUrl: previewUrl,
          prompt,
          stylePreset: "",
        }),
      });

      const data = await res.json();

      if (data.success) {
        set({ result: data.data });
        await get().fetchHistory();
      }
    } finally {
      set({ loading: false });
    }
  },
}));