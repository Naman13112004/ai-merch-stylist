"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useGenerationStore } from "@/store/generation.store";

export default function HistoryList() {
  const { history, fetchHistory } = useGenerationStore();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (!history.length) {
    return (
      <p className="text-sm text-neutral-400 text-center">
        No generations yet
      </p>
    );
  }

  return (
    <section aria-label="Recent generations">
      <h3 className="text-lg font-semibold mb-4">Recent Generations</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="relative aspect-square rounded-md overflow-hidden"
          >
            <Image
              src={item.generated_image_url}
              alt={item.prompt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}