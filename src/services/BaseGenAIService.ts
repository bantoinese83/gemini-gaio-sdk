import { GoogleGenAI } from "@google/genai";

export class BaseGenAIService {
  protected genAI: GoogleGenAI;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error("GEMINI_API_KEY is required for this service.");
    this.genAI = new GoogleGenAI({ apiKey });
  }
} 