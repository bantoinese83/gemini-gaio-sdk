import { BaseGenAIService } from "./BaseGenAIService";
import { createUserContent, createPartFromUri } from "@google/genai";

export class TokenService extends BaseGenAIService {
  constructor(apiKey: string) {
    super(apiKey);
  }

  /**
   * Count tokens for a text-only input.
   * @param model Model name.
   * @param text Text prompt.
   * @returns Total token count.
   */
  async countTextTokens(model: string, text: string): Promise<number> {
    const resp = await this.genAI.models.countTokens({ model, contents: text });
    return resp.totalTokens ?? 0;
  }

  /**
   * Count tokens for a chat history (array of turns).
   * @param model Model name.
   * @param history Array of chat turns (role/parts objects).
   * @returns Total token count.
   */
  async countChatTokens(model: string, history: any[]): Promise<number> {
    const resp = await this.genAI.models.countTokens({ model, contents: history });
    return resp.totalTokens ?? 0;
  }

  /**
   * Count tokens for multimodal input (text + files/images/audio/video).
   * @param model Model name.
   * @param prompt Text prompt.
   * @param files Array of { uri, mimeType } or a single file { uri, mimeType }.
   * @returns Total token count.
   */
  async countMultimodalTokens(model: string, prompt: string, files: Array<{ uri: string, mimeType: string }> | { uri: string, mimeType: string }): Promise<number> {
    const fileArr = Array.isArray(files) ? files : [files];
    const contents = createUserContent([
      prompt,
      ...fileArr.map(f => createPartFromUri(f.uri, f.mimeType)),
    ]);
    const resp = await this.genAI.models.countTokens({ model, contents });
    return resp.totalTokens ?? 0;
  }

  /**
   * Extract usage metadata from a generateContent response.
   * @param response The response from generateContent.
   * @returns Usage metadata (input/output/total token counts, etc).
   */
  getUsageMetadata(response: any): any {
    return response.usageMetadata;
  }
} 