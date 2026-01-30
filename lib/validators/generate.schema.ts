import { z } from "zod";

export const generateRequestSchema = z.object({
  imageUrl: z.string().url("Invalid image URL"),
  prompt: z.string().min(5, "Prompt too short"),
  stylePreset: z.string().optional().default(""),
});

export type GenerateRequest = z.infer<typeof generateRequestSchema>;