import { BaseGenAIService } from './BaseGenAIService';
import { GenerateTextParams, GenerateTextResult } from '../types/types';
import type { Content } from '@google/genai';
/**
 * Service for text generation and chat using Gemini API.
 */
export declare class TextService extends BaseGenAIService {
    /**
     * Create a new TextService instance.
     * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
     */
    constructor(apiKey: string);
    /**
     * Generate text from a prompt or content array.
     * @param params { model, contents, config }
     * @returns The Gemini API response (raw)
     */
    generateText({ model, contents, config }: GenerateTextParams): Promise<GenerateTextResult>;
    /**
     * Generate text as a stream from a prompt or content array.
     * @param params { model, contents, config }
     * @returns The Gemini API response stream (raw)
     */
    generateTextStream({ model, contents, config, }: GenerateTextParams): Promise<GenerateTextResult>;
    /**
     * Create a chat session for multi-turn conversation.
     * @param model Gemini model name
     * @param history Optional chat history
     * @returns The chat session object
     */
    createChat(model: string, history?: Content[]): unknown;
}
