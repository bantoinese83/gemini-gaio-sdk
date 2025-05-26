import { BaseGenAIService } from './BaseGenAIService';
import { createUserContent, createPartFromUri, Content } from '@google/genai';
import { Logger, GeminiApiError, ValidationError } from '../utils/Logger';

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
    try {
      if (!model || !text) {
        Logger.error('TokenService.countTextTokens: Missing required params', { model, text });
        throw new ValidationError('model and text are required');
      }
      const resp = await this.genAI.models.countTokens({ model, contents: text });
      return resp.totalTokens ?? 0;
    } catch (err) {
      Logger.error('TokenService.countTextTokens error', err);
      throw new GeminiApiError('Failed to count text tokens', err);
    }
  }

  /**
   * Count tokens for a chat history (array of turns).
   * @param model Model name.
   * @param history Array of chat turns (role/parts objects).
   * @returns Total token count.
   */
  async countChatTokens(model: string, history: Content[]): Promise<number> {
    try {
      if (!model || !history) {
        Logger.error('TokenService.countChatTokens: Missing required params', { model, history });
        throw new ValidationError('model and history are required');
      }
      const resp = await this.genAI.models.countTokens({ model, contents: history });
      return resp.totalTokens ?? 0;
    } catch (err) {
      Logger.error('TokenService.countChatTokens error', err);
      throw new GeminiApiError('Failed to count chat tokens', err);
    }
  }

  /**
   * Count tokens for multimodal input (text + files/images/audio/video).
   * @param model Model name.
   * @param prompt Text prompt.
   * @param files Array of { uri, mimeType } or a single file { uri, mimeType }.
   * @returns Total token count.
   */
  async countMultimodalTokens(
    model: string,
    prompt: string,
    files: Array<{ uri: string; mimeType: string }> | { uri: string; mimeType: string },
  ): Promise<number> {
    try {
      if (!model || !prompt || !files) {
        Logger.error('TokenService.countMultimodalTokens: Missing required params', {
          model,
          prompt,
          files,
        });
        throw new ValidationError('model, prompt, and files are required');
      }
      const fileArr = Array.isArray(files) ? files : [files];
      const contents = createUserContent([
        prompt,
        ...fileArr.map((f) => createPartFromUri(f.uri, f.mimeType)),
      ]);
      const resp = await this.genAI.models.countTokens({ model, contents });
      return resp.totalTokens ?? 0;
    } catch (err) {
      Logger.error('TokenService.countMultimodalTokens error', err);
      throw new GeminiApiError('Failed to count multimodal tokens', err);
    }
  }

  /**
   * Extract usage metadata from a generateContent response.
   * @param response The response from generateContent.
   * @returns Usage metadata (input/output/total token counts, etc).
   */
  getUsageMetadata(response: Record<string, unknown>): Record<string, unknown> | undefined {
    try {
      const usage = response.usageMetadata;
      if (usage && typeof usage === 'object') {
        return usage as Record<string, unknown>;
      }
      return undefined;
    } catch (err) {
      Logger.error('TokenService.getUsageMetadata error', err);
      throw new GeminiApiError('Failed to extract usage metadata', err);
    }
  }
}
