"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useGenerationStore } from "@/store/generation.store";
import { Clock } from "lucide-react";

export default function HistoryList() {
    const { history, fetchHistory } = useGenerationStore();

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    if (!history.length) return null;

    return (
        <section aria-label="Recent generations" className="space-y-4">
            <div className="flex items-center gap-2 text-slate-500 mb-4">
                <Clock className="w-4 h-4" />
                <h3 className="text-sm font-semibold uppercase tracking-wider">Session History</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {history.map((item) => (
                    <div
                        key={item.id}
                        className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer"
                        onClick={() => window.open(item.generated_image_url, '_blank')}
                    >
                        <Image
                            src={item.generated_image_url}
                            alt={item.prompt}
                            fill
                            sizes="(max-width: 768px) 50vw, 20vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                            <p className="text-xs text-white line-clamp-2 font-medium">{item.prompt}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}