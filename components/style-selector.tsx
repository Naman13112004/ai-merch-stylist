"use client";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { useGenerationStore } from "@/store/generation.store";

const PRESETS = ["Studio Minimal", "Urban Streetwear", "Luxury Lifestyle", "Flat Lay on Wood"];

export default function StyleSelector() {
    const { prompt, setPrompt, generateImage, loading, previewUrl } = useGenerationStore();

    return (
        <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
                {PRESETS.map((preset) => (
                    <Badge
                        key={preset}
                        onClick={() => setPrompt(`${prompt} ${preset}`.trim())}
                    >
                        + {preset}
                    </Badge>
                ))}
            </div>

            <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />

            <Button
                onClick={generateImage}
                disabled={loading || !previewUrl}
                className="w-full"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                Generate
            </Button>
        </div>
    );
}