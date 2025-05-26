/**
 * Service for URL context and Google Search grounding using Gemini API.
 */
import { BaseGenAIService } from "./BaseGenAIService";

export class UrlContextService extends BaseGenAIService {
  /**
   * Create a new UrlContextService instance.
   * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
   */
  constructor(apiKey: string) {
    super(apiKey);
  }

  /**
   * Generate content using URL context only.
   * @param params { model, contents, config? }
   * @returns { text, urlContextMetadata, rawResponse }
   */
  async generateWithUrlContext({
    model,
    contents,
    config = {},
  }: {
    model: string,
    contents: string | any[],
    config?: any,
  }): Promise<{ text: string, urlContextMetadata?: any, rawResponse: any }> {
    const response = await this.genAI.models.generateContent({
      model,
      contents,
      config: { ...config, tools: [{ urlContext: {} }] },
    });
    // urlContextMetadata may be in metadata or directly on the candidate, depending on API version
    const candidate = response.candidates?.[0] as any; // Type assertion to any to avoid TS linter errors
    const urlContextMetadata = candidate?.metadata?.urlContextMetadata || candidate?.urlContextMetadata;
    return {
      text: response.text ?? '',
      urlContextMetadata,
      rawResponse: response,
    };
  }

  /**
   * Generate content using both URL context and Google Search grounding.
   * @param params { model, contents, config? }
   * @returns { text, urlContextMetadata, rawResponse }
   */
  async generateWithUrlContextAndSearch({
    model,
    contents,
    config = {},
  }: {
    model: string,
    contents: string | any[],
    config?: any,
  }): Promise<{ text: string, urlContextMetadata?: any, rawResponse: any }> {
    const response = await this.genAI.models.generateContent({
      model,
      contents,
      config: { ...config, tools: [{ urlContext: {} }, { googleSearch: {} }] },
    });
    // urlContextMetadata may be in metadata or directly on the candidate, depending on API version
    const candidate = response.candidates?.[0] as any; // Type assertion to any to avoid TS linter errors
    const urlContextMetadata = candidate?.metadata?.urlContextMetadata || candidate?.urlContextMetadata;
    return {
      text: response.text ?? '',
      urlContextMetadata,
      rawResponse: response,
    };
  }
} 