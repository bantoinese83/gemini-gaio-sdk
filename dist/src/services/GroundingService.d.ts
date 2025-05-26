/**
 * Service for Google Search grounding using Gemini API.
 */
import { BaseGenAIService } from './BaseGenAIService';
import { ModelConfig } from '../types/types';
import { GroundingMetadata, Part } from '@google/genai';
export interface GenerateGroundedContentParams {
    model: string;
    contents: Part[];
    config?: ModelConfig;
}
export declare class GroundingService extends BaseGenAIService {
    /**
     * Create a new GroundingService instance.
     * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
     */
    constructor(apiKey: string);
    /**
     * Generate content with Google Search grounding enabled.
     * @param params { model, contents, config? }
     * @returns { text, groundingMetadata }
     */
    generateGroundedContent(params: GenerateGroundedContentParams): Promise<{
        text: string;
        groundingMetadata?: GroundingMetadata;
    }>;
    /**
     * Extract Google Search suggestions from grounding metadata.
     * @param groundingMetadata The grounding metadata object.
     * @returns Array of suggested search queries.
     */
    extractGoogleSearchSuggestions(groundingMetadata: GroundingMetadata): string[];
}
