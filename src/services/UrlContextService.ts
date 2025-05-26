/**
 * Service for URL context and Google Search grounding using Gemini API.
 */
import { BaseGenAIService } from './BaseGenAIService';
import { Logger, GeminiApiError, ValidationError } from '../utils/Logger';
import type { Part, GenerateContentResponse } from '@google/genai';

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
    model: string;
    contents: Part[];
    config?: Record<string, unknown>;
  }): Promise<{
    text: string;
    urlContextMetadata?: Record<string, unknown>;
    rawResponse: GenerateContentResponse;
  }> {
    try {
      if (!model || !contents) {
        Logger.error('UrlContextService.generateWithUrlContext: Missing required params', {
          model,
          contents,
        });
        throw new ValidationError('model and contents are required');
      }
      const response = await this.genAI.models.generateContent({
        model,
        contents,
        config,
      });
      const candidate = response.candidates?.[0] as Record<string, unknown>;
      let urlContextMetadata: Record<string, unknown> | undefined = undefined;
      if (candidate && typeof candidate === 'object') {
        if (
          'metadata' in candidate &&
          candidate.metadata &&
          typeof candidate.metadata === 'object' &&
          'urlContextMetadata' in candidate.metadata
        ) {
          urlContextMetadata = (candidate.metadata as Record<string, unknown>)
            .urlContextMetadata as Record<string, unknown>;
        } else if ('urlContextMetadata' in candidate) {
          urlContextMetadata = candidate.urlContextMetadata as Record<string, unknown>;
        }
      }
      return {
        text: response.text ?? '',
        urlContextMetadata,
        rawResponse: response,
      };
    } catch (err) {
      Logger.error('UrlContextService.generateWithUrlContext error', err);
      throw new GeminiApiError('Failed to generate with URL context', err);
    }
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
    model: string;
    contents: Part[];
    config?: Record<string, unknown>;
  }): Promise<{
    text: string;
    urlContextMetadata?: Record<string, unknown>;
    rawResponse: GenerateContentResponse;
  }> {
    try {
      if (!model || !contents) {
        Logger.error('UrlContextService.generateWithUrlContextAndSearch: Missing required params', {
          model,
          contents,
        });
        throw new ValidationError('model and contents are required');
      }
      const response = await this.genAI.models.generateContent({
        model,
        contents,
        config,
      });
      const candidate = response.candidates?.[0] as Record<string, unknown>;
      let urlContextMetadata: Record<string, unknown> | undefined = undefined;
      if (candidate && typeof candidate === 'object') {
        if (
          'metadata' in candidate &&
          candidate.metadata &&
          typeof candidate.metadata === 'object' &&
          'urlContextMetadata' in candidate.metadata
        ) {
          urlContextMetadata = (candidate.metadata as Record<string, unknown>)
            .urlContextMetadata as Record<string, unknown>;
        } else if ('urlContextMetadata' in candidate) {
          urlContextMetadata = candidate.urlContextMetadata as Record<string, unknown>;
        }
      }
      return {
        text: response.text ?? '',
        urlContextMetadata,
        rawResponse: response,
      };
    } catch (err) {
      Logger.error('UrlContextService.generateWithUrlContextAndSearch error', err);
      throw new GeminiApiError('Failed to generate with URL context and search', err);
    }
  }
}
