import { BaseGenAIService } from "./BaseGenAIService";
import { GenerateTextParams, GenerateTextResult } from "./types";

/**
 * Service for text generation and chat using Gemini API.
 */
export class TextService extends BaseGenAIService {
  /**
   * Create a new TextService instance.
   * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
   */
  constructor(apiKey: string) {
    super(apiKey);
  }

  /**
   * Generate text from a prompt or content array.
   * @param params { model, contents, config }
   * @returns The Gemini API response (raw)
   */
  async generateText({ model, contents, config }: GenerateTextParams): Promise<GenerateTextResult> {
    return await this.genAI.models.generateContent({ model, contents, config });
  }

  /**
   * Generate text as a stream from a prompt or content array.
   * @param params { model, contents, config }
   * @returns The Gemini API response stream (raw)
   */
  async generateTextStream({ model, contents, config }: GenerateTextParams): Promise<GenerateTextResult> {
    return await this.genAI.models.generateContentStream({ model, contents, config });
  }

  /**
   * Create a chat session for multi-turn conversation.
   * @param model Gemini model name
   * @param history Optional chat history
   * @returns The chat session object
   */
  createChat(model: string, history?: any[]): any {
    return this.genAI.chats.create({ model, history });
  }
} 