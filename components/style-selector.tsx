"use client";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Loader2, Wand2 } from "lucide-react";
import { useGenerationStore } from "@/store/generation.store";
import { cn } from "@/lib/utils";

const PRESETS = [
    "Studio Minimal",
    "Urban Streetwear",
    "Luxury Lifestyle",
    "Flat Lay on Wood",
    "Neon Cyberpunk",
    "Nature Sunlight"
];

export default function StyleSelector() {
    const { prompt, setPrompt, generateImage, loading, previewUrl } = useGenerationStore();

    const handlePresetClick = (preset: string) => {
        if (prompt.includes(preset)) return;

        const nextPrompt = prompt
            ? `${prompt}, ${preset}`
            : preset;

        setPrompt(nextPrompt);
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Quick Presets</label>
                <div className="flex flex-wrap gap-2">
                    {PRESETS.map((preset) => (
                        <Badge
                            key={preset}
                            variant="secondary"
                            onClick={() => handlePresetClick(preset)}
                            className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 transition-all active:scale-95 py-1.5 px-3"
                        >
                            + {preset}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Custom Prompt</label>
                <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the scene (e.g., 'Sitting on a marble table with morning sunlight')"
                    className="min-h-25 resize-none focus-visible:ring-blue-500"
                />
            </div>

            <Button
                onClick={generateImage}
                disabled={loading || !previewUrl || !prompt}
                className={cn(
                    "w-full py-6 text-lg font-medium transition-all shadow-md hover:shadow-lg cursor-pointer",
                    loading
                        ? "bg-slate-100 text-slate-400"
                        : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                )}
            >
                {loading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin" />
                        <span>Dreaming up pixels...</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Wand2 className="w-5 h-5" />
                        <span>Generate Transformation</span>
                    </div>
                )}
            </Button>
        </div>
    );
}