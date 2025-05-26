import { BaseGenAIService } from "./BaseGenAIService";
import { Type } from "@google/genai";
import { Logger, GeminiApiError, ValidationError } from "../utils/Logger";

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
    try {
      if (!model || !contents || !config || !config.responseMimeType || !config.responseSchema) {
        Logger.error('StructuredOutputService.generateStructuredOutput: Missing required params', { model, contents, config });
        throw new ValidationError('model, contents, responseMimeType, and responseSchema are required');
      }
      const response = await this.genAI.models.generateContent({
        model,
        contents,
        config,
      });
      return response.text ?? '';
    } catch (err) {
      Logger.error('StructuredOutputService.generateStructuredOutput error', err);
      throw new GeminiApiError('Failed to generate structured output', err);
    }
  }

  /**
   * Expose Type enum for convenience.
   */
  static Type = Type;
} 