import { BaseGenAIService } from './BaseGenAIService';
import { ResponseParser } from '../utils/ResponseParser';
import { GenerateImageResult, ModelConfig } from '../types/types';
import { Logger, GeminiApiError, ValidationError } from '../utils/Logger';
import type { Part } from '@google/genai';

export class ImageService extends BaseGenAIService {
  constructor(apiKey: string) {
    super(apiKey);
  }

  async generateImage({
    model,
    contents,
    config,
  }: {
    model: string;
    contents: Part[];
    config?: ModelConfig;
  }): Promise<GenerateImageResult[]> {
    try {
      if (!model || !contents) {
        Logger.error('ImageService.generateImage: Missing required params', { model, contents });
        throw new ValidationError('model and contents are required');
      }
      const finalConfig = { ...config, responseModalities: ['TEXT', 'IMAGE'] };
      const response = await this.genAI.models.generateContent({
        model,
        contents,
        config: finalConfig,
      });
      const extractedParts: GenerateImageResult[] = [];
      const textParts = ResponseParser.extractText(response.candidates?.[0]?.content?.parts || []);
      for (const text of textParts) {
        extractedParts.push({ type: 'text', data: text });
      }
      const imageParts = ResponseParser.extractImages(
        response.candidates?.[0]?.content?.parts || [],
      );
      for (const img of imageParts) {
        extractedParts.push({ type: 'image', data: img.data });
      }
      return extractedParts;
    } catch (err) {
      Logger.error('ImageService.generateImage error', err);
      throw new GeminiApiError('Failed to generate image', err);
    }
  }
}
