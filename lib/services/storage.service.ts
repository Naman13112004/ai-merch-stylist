import { supabase } from "@/lib/supabase";
import { ApiError } from "@/lib/errors/api-error";

export async function uploadGeneratedImage(buffer: Buffer) {
  const fileName = `ai_${Date.now()}.jpg`;

  const { error } = await supabase.storage
    .from("products")
    .upload(fileName, buffer, {
      contentType: "image/jpeg",
    });

  if (error) {
    throw new ApiError("Failed to upload image", 500);
  }

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  return data.publicUrl;
}