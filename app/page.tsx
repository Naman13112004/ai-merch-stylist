"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { supabase } from "@/lib/supabase";
import { Loader2, Upload, Sparkles } from "lucide-react";

const PRESETS = ["Studio Minimal", "Urban Streetwear", "Luxury Lifestyle", "Flat Lay on Wood"];

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  // Load history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      const { data } = await supabase.from("generations").select("*").order("created_at", { ascending: false }).limit(5);
      if (data) setHistory(data);
    };
    fetchHistory();
  }, [result]); // Refresh when new result comes in

  // Handle Image Upload to Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));

    // Upload immediately for MVP simplicity
    const fileName = `${Date.now()}-${selectedFile.name}`;
    const { data, error } = await supabase.storage
      .from("products")
      .upload(fileName, selectedFile);
    
    if (error) {
      console.log(error);
      alert("Upload failed");
    } else {
      // Get public URL
      const { data: publicUrlData } = supabase.storage.from("products").getPublicUrl(fileName);
      setPreviewUrl(publicUrlData.publicUrl);
    }
  };

  const generateImage = async () => {
    if (!previewUrl || !prompt) return;
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ imageUrl: previewUrl, prompt, stylePreset: "" }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (e) {
      console.error(e);
      alert("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 p-8 font-sans text-neutral-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-blue-600">MerchAI Restyler</h1>
          <p className="text-neutral-500">Transform basic product photos into marketing assets instantly.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN: Controls */}
          <div className="space-y-6">
            
            {/* 1. Upload */}
            <Card>
              <CardContent className="pt-6">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="h-full object-contain" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-neutral-400" />
                      <p className="text-sm text-neutral-500">Click to upload product image</p>
                    </div>
                  )}
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                </label>
              </CardContent>
            </Card>

            {/* 2. Prompt & Presets */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Style Instructions</label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset) => (
                  <Badge 
                    key={preset} 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => setPrompt((prev) => `${prev} ${preset}`.trim())}
                  >
                    + {preset}
                  </Badge>
                ))}
              </div>
              <Textarea 
                placeholder="E.g., Place this t-shirt on a hanger against a brick wall..." 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="h-32"
              />
              <Button 
                onClick={generateImage} 
                disabled={loading || !previewUrl} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Generative Magic...</> : <><Sparkles className="mr-2 h-4 w-4"/> Restyle Image</>}
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: Results */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Generated Result</h2>
            {result ? (
              <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="relative aspect-square bg-neutral-200 rounded-lg overflow-hidden border">
                  <img src={result.generated_image_url} alt="AI Result" className="object-cover w-full h-full" />
                </div>
                <div className="flex gap-2">
                   <Button variant="outline" className="w-full" onClick={() => window.open(result.generated_image_url, '_blank')}>Download</Button>
                </div>
              </div>
            ) : (
              <div className="h-full bg-neutral-100 rounded-lg flex items-center justify-center border-2 border-dashed text-neutral-400">
                AI Output will appear here
              </div>
            )}
          </div>
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <div className="pt-8 border-t">
            <h3 className="text-lg font-semibold mb-4">Recent Generations</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {history.map((item) => (
                <div key={item.id} className="group relative aspect-square bg-gray-100 rounded-md overflow-hidden">
                  <img src={item.generated_image_url} className="object-cover w-full h-full" alt="History" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-end p-2">
                    <p className="text-xs text-white truncate">{item.prompt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}