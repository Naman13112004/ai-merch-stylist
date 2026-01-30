import { ai } from "@/lib/gemini"; 
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, prompt, stylePreset } = await req.json();

    if (!imageUrl || !prompt) {
      return NextResponse.json({ error: "Missing image or prompt" }, { status: 400 });
    }

    if (!process.env.FREEPIK_API_KEY) {
      return NextResponse.json({ error: "Missing Freepik API Key" }, { status: 500 });
    }

    console.log("Starting generation process...");

    // --- STEP A: FETCH ORIGINAL IMAGE (For Gemini Vision) ---
    const imageResp = await fetch(imageUrl);
    if (!imageResp.ok) throw new Error("Failed to fetch original image");
    const imageArrayBuffer = await imageResp.arrayBuffer();
    const imageBase64 = Buffer.from(imageArrayBuffer).toString("base64");

    // --- STEP B: DESCRIBE PRODUCT WITH GEMINI (Vision) ---
    console.log("Analyzing product with Gemini Vision...");
    
    // We ask Gemini to describe the product so we can pass that text to Freepik
    const visionPrompt = [
      {
        text: "Describe this clothing item in concise physical detail. Focus ONLY on the item itself (color, fabric, neck style, fit, logos). Do not describe the background. Example: 'A red cotton t-shirt with a round neck'."
      },
      {
        inlineData: {
          mimeType: "image/jpeg", 
          data: imageBase64,
        },
      },
    ];

    const visionResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: visionPrompt,
    });

    const productDescription = visionResponse.candidates?.[0]?.content?.parts?.[0]?.text || "A clothing item";
    console.log("Product Description:", productDescription);

    // --- STEP C: GENERATE WITH FREEPIK API ---
    console.log("Generating image via Freepik...");

    // Construct the final prompt for Freepik
    const finalPrompt = `Professional product photography of ${productDescription}. ${stylePreset} ${prompt}. High quality, photorealistic, cinematic lighting.`;

    const freepikOptions = {
      method: 'POST',
      headers: {
        'x-freepik-api-key': process.env.FREEPIK_API_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: finalPrompt,
        negative_prompt: "deformed, ugly, watermark, text, low quality, blurry, human face",
        num_images: 1,
        image: { size: "square_1_1" }, 
        styling: {
          style: "photo", 
          framing: "portrait",
          lightning: "studio"
        },
        filter_nsfw: true
      })
    };

    const freepikRes = await fetch('https://api.freepik.com/v1/ai/text-to-image', freepikOptions);
    
    if (!freepikRes.ok) {
      const errorText = await freepikRes.text();
      console.error("Freepik API Error:", errorText);
      throw new Error(`Freepik API failed: ${freepikRes.statusText}`);
    }

    const freepikData = await freepikRes.json();

    // --- STEP D: PROCESS & UPLOAD RESULT ---
    let generatedPublicUrl = "";
    
    // Freepik returns: { data: [ { base64: "..." } ], meta: ... }
    if (freepikData.data && freepikData.data.length > 0) {
      const base64Image = freepikData.data[0].base64;
      
      console.log("Image generated. Uploading to Storage...");

      // Convert Base64 string to Buffer
      const aiImageBuffer = Buffer.from(base64Image, "base64");
      const fileName = `freepik_${Date.now()}.jpg`; // Freepik usually returns JPEG/PNG

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, aiImageBuffer, {
          contentType: "image/jpeg",
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);
        
      generatedPublicUrl = urlData.publicUrl;
    } else {
      throw new Error("No image data received from Freepik");
    }

    // --- STEP E: SAVE TO DATABASE ---
    const { data: record, error: dbError } = await supabase
      .from("generations")
      .insert({
        original_image_url: imageUrl,
        prompt: finalPrompt,
        generated_image_url: generatedPublicUrl,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    console.log("Success! Image saved:", record.id);
    return NextResponse.json({ success: true, data: record });

  } catch (error: any) {
    console.error("Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate image" }, 
      { status: 500 }
    );
  }
}