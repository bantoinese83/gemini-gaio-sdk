/**
 * Service for Google Search grounding using Gemini API.
 */
import { BaseGenAIService } from './BaseGenAIService';
import { Logger, GeminiApiError, ValidationError } from '../utils/Logger';
export class GroundingService extends BaseGenAIService {
    /**
     * Create a new GroundingService instance.
     * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
     */
    constructor(apiKey) {
        super(apiKey);
    }
    /**
     * Generate content with Google Search grounding enabled.
     * @param params { model, contents, config? }
     * @returns { text, groundingMetadata }
     */
    async generateGroundedContent(params) {
        try {
            if (!params.model || !params.contents) {
                Logger.error('GroundingService.generateGroundedContent: Missing required params', {
                    model: params.model,
                    contents: params.contents,
                });
                throw new ValidationError('model and contents are required');
            }
            const response = await this.genAI.models.generateContent({
                model: params.model,
                contents: params.contents,
                config: { ...params.config, tools: [{ googleSearch: {} }] },
            });
            const text = response.text ?? '';
            const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
            return { text, groundingMetadata };
        }
        catch (err) {
            Logger.error('GroundingService.generateGroundedContent error', err);
            throw new GeminiApiError('Failed to generate grounded content', err);
        }
    }
    /**
     * Extract Google Search suggestions from grounding metadata.
     * @param groundingMetadata The grounding metadata object.
     * @returns Array of suggested search queries.
     */
    extractGoogleSearchSuggestions(groundingMetadata) {
        try {
            if (!groundingMetadata)
                return [];
            return groundingMetadata.webSearchQueries || [];
        }
        catch (err) {
            Logger.error('GroundingService.extractGoogleSearchSuggestions error', err);
            throw new GeminiApiError('Failed to extract Google Search suggestions', err);
        }
    }
}
