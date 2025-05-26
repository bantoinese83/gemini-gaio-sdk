import { BaseGenAIService } from './BaseGenAIService';
import { Content } from '@google/genai';
export declare class TokenService extends BaseGenAIService {
    constructor(apiKey: string);
    /**
     * Count tokens for a text-only input.
     * @param model Model name.
     * @param text Text prompt.
     * @returns Total token count.
     */
    countTextTokens(model: string, text: string): Promise<number>;
    /**
     * Count tokens for a chat history (array of turns).
     * @param model Model name.
     * @param history Array of chat turns (role/parts objects).
     * @returns Total token count.
     */
    countChatTokens(model: string, history: Content[]): Promise<number>;
    /**
     * Count tokens for multimodal input (text + files/images/audio/video).
     * @param model Model name.
     * @param prompt Text prompt.
     * @param files Array of { uri, mimeType } or a single file { uri, mimeType }.
     * @returns Total token count.
     */
    countMultimodalTokens(model: string, prompt: string, files: Array<{
        uri: string;
        mimeType: string;
    }> | {
        uri: string;
        mimeType: string;
    }): Promise<number>;
    /**
     * Extract usage metadata from a generateContent response.
     * @param response The response from generateContent.
     * @returns Usage metadata (input/output/total token counts, etc).
     */
    getUsageMetadata(response: Record<string, unknown>): Record<string, unknown> | undefined;
}
