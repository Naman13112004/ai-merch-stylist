import Header from "@/components/header";
import ResultView from "@/components/result-view";
import HistoryList from "@/components/history-list";
import ImageUpload from "@/components/image-upload";
import StyleSelector from "@/components/style-selector";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50/50 p-6 md:p-12 font-sans text-slate-900 animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header Section */}
        <Header />

        {/* Main Workspace Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Inputs (5/12 width) */}
          <div className="lg:col-span-5 space-y-6">
            <section className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">1. Upload Product</h2>
              <ImageUpload />
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">2. Define Style</h2>
              <StyleSelector />
            </section>
          </div>

          {/* Right Column: Results (7/12 width) */}
          <div className="lg:col-span-7 space-y-6">
            <section className="space-y-4 h-full">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">3. Result</h2>
              <ResultView />
            </section>
          </div>
        </div>

        {/* Footer: History */}
        <div className="pt-10 border-t border-slate-200">
          <Suspense fallback={<div>Loading history...</div>}>
            <HistoryList />
          </Suspense>
        </div>
      </div>
    </main>
  );
}