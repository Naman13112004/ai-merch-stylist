import { supabase } from "@/lib/supabase";
import { describeProductFromImage } from "./gemini.service";
import { generateFreepikImage } from "./freepik.service";
import { uploadGeneratedImage } from "./storage.service";

export async function generateAndSaveImage(
  imageUrl: string,
  prompt: string,
  stylePreset = ""
) {
  const description = await describeProductFromImage(imageUrl);

  const finalPrompt = `
    Professional product photography of ${description}.
    ${stylePreset} ${prompt}.
    High quality, photorealistic.
  `;

  const buffer = await generateFreepikImage(finalPrompt);
  const publicUrl = await uploadGeneratedImage(buffer);

  const { data, error } = await supabase
    .from("generations")
    .insert({
      original_image_url: imageUrl,
      prompt: finalPrompt,
      generated_image_url: publicUrl,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}