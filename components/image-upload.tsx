"use client";

import Image from "next/image";
import { Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGenerationStore } from "@/store/generation.store";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function ImageUpload() {
    const { previewUrl, setPreviewUrl } = useGenerationStore();
    const [isHovering, setIsHovering] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Only images allowed");
            return;
        }

        setIsUploading(true);
        const fileName = `${Date.now()}-${file.name}`;
        
        try {
            await supabase.storage.from("products").upload(fileName, file);
            const { data } = supabase.storage.from("products").getPublicUrl(fileName);
            setPreviewUrl(data.publicUrl);
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Card className={`overflow-hidden transition-all duration-300 border-2 ${previewUrl ? 'border-blue-500 ring-4 ring-blue-50' : 'border-dashed hover:border-blue-400'}`}>
            <CardContent className="p-0">
                <label 
                    className="relative flex flex-col items-center justify-center w-full h-64 cursor-pointer bg-white hover:bg-slate-50 transition-colors group"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {previewUrl ? (
                        <div className="relative w-full h-full">
                            <Image 
                                src={previewUrl} 
                                alt="Preview" 
                                fill 
                                className="object-contain p-4" 
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                                Click to Change Image
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                            <div className={`p-4 rounded-full mb-3 transition-all duration-300 ${isHovering ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                {isUploading ? <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" /> : <Upload className="w-8 h-8" />}
                            </div>
                            <p className="mb-2 text-sm text-slate-700 font-semibold">
                                Click to upload product
                            </p>
                            <p className="text-xs text-slate-500">
                                PNG, JPG or WEBP (Max 5MB)
                            </p>
                        </div>
                    )}
                    <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                </label>
            </CardContent>
        </Card>
    );
}