import { ApiError } from "@/lib/errors/api-error";

export async function generateFreepikImage(prompt: string) {
  if (!process.env.FREEPIK_API_KEY) {
    throw new ApiError("Freepik API key missing", 500);
  }

  const res = await fetch("https://api.freepik.com/v1/ai/text-to-image", {
    method: "POST",
    headers: {
      "x-freepik-api-key": process.env.FREEPIK_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      negative_prompt: "deformed, ugly, watermark, text",
      num_images: 1,
      image: { size: "square_1_1" },
    }),
  });

  if (!res.ok) {
    throw new ApiError("Freepik image generation failed", 502);
  }

  const json = await res.json();

  if (!json.data?.[0]?.base64) {
    throw new ApiError("No image returned from Freepik");
  }

  return Buffer.from(json.data[0].base64, "base64");
}