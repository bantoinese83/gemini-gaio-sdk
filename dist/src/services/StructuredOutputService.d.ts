import { BaseGenAIService } from './BaseGenAIService';
import { Type } from '@google/genai';
import type { Part } from '@google/genai';
import type { StructuredOutputConfig } from '../types/types';
export declare class StructuredOutputService extends BaseGenAIService {
    constructor(apiKey: string);
    /**
     * Generate structured output (JSON or enum) using responseSchema and responseMimeType.
     * @param model Gemini model (e.g., 'gemini-2.0-flash').
     * @param contents Prompt or Content array.
     * @param config Must include responseMimeType and responseSchema.
     * @returns The structured output as a string (JSON or enum value).
     */
    generateStructuredOutput({ model, contents, config, }: {
        model: string;
        contents: string | Part[];
        config: StructuredOutputConfig;
    }): Promise<string>;
    /**
     * Expose Type enum for convenience.
     */
    static Type: typeof Type;
}
