import { NextRequest, NextResponse } from "next/server";
import { generateRequestSchema } from "@/lib/validators/generate.schema";
import { generateAndSaveImage } from "@/lib/services/generation.service";
import { ApiError } from "@/lib/errors/api-error";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = generateRequestSchema.parse(body);

    const result = await generateAndSaveImage(
      parsed.imageUrl,
      parsed.prompt,
      parsed.stylePreset
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}