"use client";

import Image from "next/image";
import { Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGenerationStore } from "@/store/generation.store";
import { supabase } from "@/lib/supabase";

export default function ImageUpload() {
    const { previewUrl, setPreviewUrl } = useGenerationStore();

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Only images allowed");
            return;
        }

        const fileName = `${Date.now()}-${file.name}`;
        await supabase.storage.from("products").upload(fileName, file);

        const { data } = supabase
            .storage
            .from("products")
            .getPublicUrl(fileName);

        setPreviewUrl(data.publicUrl);
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <label className="flex h-48 cursor-pointer border-2 border-dashed rounded-lg items-center justify-center">
                    {previewUrl ? (
                        <Image src={previewUrl} alt="Preview" fill className="object-contain" />
                    ) : (
                        <Upload className="h-8 w-8 text-neutral-400" />
                    )}
                    <input type="file" hidden onChange={handleFileUpload} />
                </label>
            </CardContent>
        </Card>
    );
}
