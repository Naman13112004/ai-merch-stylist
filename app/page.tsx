import Header from "@/components/header";
import ResultView from "@/components/result-view";
import HistoryList from "@/components/history-list";
import ImageUpload from "@/components/image-upload";
import StyleSelector from "@/components/style-selector";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50 p-8 font-sans text-neutral-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <Header />

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN: Controls */}
          <div className="space-y-6">
            
            {/* 1. Upload */}
            <ImageUpload />

            {/* 2. Prompt & Presets */}
            <StyleSelector />
          </div>

          {/* RIGHT COLUMN: Results */}
          <ResultView />
        </div>

        {/* History Section */}
        <Suspense fallback={<div>Loading history...</div>}>
          <HistoryList />
        </Suspense>
      </div>
    </main>
  );
}