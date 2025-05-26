import { BaseGenAIService } from "./BaseGenAIService";
import { Type } from "@google/genai";

export class StructuredOutputService extends BaseGenAIService {
  constructor(apiKey: string) {
    super(apiKey);
  }

  /**
   * Generate structured output (JSON or enum) using responseSchema and responseMimeType.
   * @param model Gemini model (e.g., 'gemini-2.0-flash').
   * @param contents Prompt or Content array.
   * @param config Must include responseMimeType and responseSchema.
   * @returns The structured output as a string (JSON or enum value).
   */
  async generateStructuredOutput({
    model,
    contents,
    config,
  }: {
    model: string,
    contents: string | any[],
    config: {
      responseMimeType: "application/json" | "text/x.enum",
      responseSchema: any,
      [key: string]: any,
    },
  }): Promise<string> {
    if (!config.responseMimeType || !config.responseSchema) {
      throw new Error("generateStructuredOutput requires responseMimeType and responseSchema in the config.");
    }
    const response = await this.genAI.models.generateContent({
      model,
      contents,
      config,
    });
    return response.text ?? '';
  }

  /**
   * Expose Type enum for convenience.
   */
  static Type = Type;
} 