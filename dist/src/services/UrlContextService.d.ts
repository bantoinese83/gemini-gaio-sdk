/**
 * Service for URL context and Google Search grounding using Gemini API.
 */
import { BaseGenAIService } from './BaseGenAIService';
import type { Part, GenerateContentResponse } from '@google/genai';
export declare class UrlContextService extends BaseGenAIService {
    /**
     * Create a new UrlContextService instance.
     * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
     */
    constructor(apiKey: string);
    /**
     * Generate content using URL context only.
     * @param params { model, contents, config? }
     * @returns { text, urlContextMetadata, rawResponse }
     */
    generateWithUrlContext({ model, contents, config, }: {
        model: string;
        contents: Part[];
        config?: Record<string, unknown>;
    }): Promise<{
        text: string;
        urlContextMetadata?: Record<string, unknown>;
        rawResponse: GenerateContentResponse;
    }>;
    /**
     * Generate content using both URL context and Google Search grounding.
     * @param params { model, contents, config? }
     * @returns { text, urlContextMetadata, rawResponse }
     */
    generateWithUrlContextAndSearch({ model, contents, config, }: {
        model: string;
        contents: Part[];
        config?: Record<string, unknown>;
    }): Promise<{
        text: string;
        urlContextMetadata?: Record<string, unknown>;
        rawResponse: GenerateContentResponse;
    }>;
}
