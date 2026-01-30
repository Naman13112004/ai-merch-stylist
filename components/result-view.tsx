"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { Download, ExternalLink, ImageIcon } from "lucide-react";
import { useGenerationStore } from "@/store/generation.store";
import { Card } from "./ui/card";

export default function ResultView() {
    const { result, loading } = useGenerationStore();

    if (loading) {
        return (
            <div className="h-full min-h-100 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center p-8">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-4 text-slate-600 font-medium animate-pulse">Designing your scene...</p>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="h-full min-h-100 bg-slate-100/50 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                </div>
                <p className="font-medium">Ready to Generate</p>
                <p className="text-sm mt-1 max-w-xs">Upload an image and select a style to see the AI magic happen here.</p>
            </div>
        );
    }

    return (
        <Card className="overflow-hidden border-slate-200 shadow-lg animate-in fade-in zoom-in duration-500 bg-white">
            <div className="relative aspect-square w-full bg-slate-50">
                <Image
                    src={result.generated_image_url}
                    alt="AI Generated Result"
                    fill
                    className="object-cover"
                />
            </div>
            <div className="p-4 bg-white border-t border-slate-100 flex gap-3">
                <Button
                    className="flex-1 bg-slate-900 hover:bg-slate-800 cursor-pointer"
                    onClick={() => window.open(result.generated_image_url)}
                >
                    <Download className="mr-2 w-4 h-4" /> Download HD
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(result.generated_image_url, '_blank')}
                    className="cursor-pointer"
                >
                    <ExternalLink className="w-4 h-4" />
                </Button>
            </div>
        </Card>
    );
}