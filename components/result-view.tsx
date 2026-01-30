"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { useGenerationStore } from "@/store/generation.store";

export default function ResultView() {
    const { result } = useGenerationStore();

    if (!result) {
        return <div className="border-dashed border h-64">No Result</div>;
    }

    return (
        <div>
            <Image src={result.generated_image_url} alt="AI Generated Result" className="rounded-lg" />
            <Button onClick={() => window.open(result.generated_image_url)}>
                Download
            </Button>
        </div>
    );
}
