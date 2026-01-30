import { ai } from "@/lib/gemini";
import { ApiError } from "@/lib/errors/api-error";

export async function describeProductFromImage(imageUrl: string) {
  const imageResp = await fetch(imageUrl);
  if (!imageResp.ok) {
    throw new ApiError("Failed to fetch original image", 400);
  }

  const buffer = Buffer.from(await imageResp.arrayBuffer()).toString("base64");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        text:
          "Describe this clothing item concisely. Focus only on the item (color, fabric, fit, logos).",
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: buffer,
        },
      },
    ],
  });

  return (
    response.candidates?.[0]?.content?.parts?.[0]?.text ??
    "A clothing item"
  );
}