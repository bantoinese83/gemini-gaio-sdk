/**
 * Service for Google Search grounding using Gemini API.
 */
import { BaseGenAIService } from "./BaseGenAIService";

export class GroundingService extends BaseGenAIService {
  /**
   * Create a new GroundingService instance.
   * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
   */
  constructor(apiKey: string) {
    super(apiKey);
  }

  /**
   * Generate content with Google Search grounding enabled.
   * @param params { model, contents, config? }
   * @returns { text, groundingMetadata }
   */
  async generateGroundedContent({
    model,
    contents,
    config = {},
  }: {
    model: string,
    contents: string | any[],
    config?: any,
  }): Promise<{ text: string, groundingMetadata?: any }> {
    const response = await this.genAI.models.generateContent({
      model,
      contents,
      config: { ...config, tools: [{ googleSearch: {} }] },
    });
    const text = response.text ?? '';
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    return { text, groundingMetadata };
  }

  /**
   * Extract Google Search suggestions from grounding metadata.
   * @param groundingMetadata The grounding metadata object.
   * @returns Array of suggested search queries.
   */
  extractGoogleSearchSuggestions(groundingMetadata: any): string[] {
    if (!groundingMetadata) return [];
    return groundingMetadata.webSearchQueries || [];
  }
} 