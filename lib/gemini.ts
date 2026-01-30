import { GoogleGenAI } from "@google/genai";
// Exporting GoogleGenAI Client
export const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });