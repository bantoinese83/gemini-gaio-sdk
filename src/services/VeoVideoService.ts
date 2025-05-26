import { BaseGenAIService } from './BaseGenAIService';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';
import { Logger, GeminiApiError, ValidationError } from '../utils/Logger';

export class VeoVideoService extends BaseGenAIService {
  constructor(apiKey: string) {
    super(apiKey);
  }

  /**
   * Generate video from text prompt using Veo.
   * @param prompt Text prompt for the video.
   * @param options Additional options: aspectRatio, personGeneration, numberOfVideos, durationSeconds, negativePrompt, enhancePrompt.
   * @returns Array of video URIs (after polling for completion).
   */
  async generateVideoFromText({
    prompt,
    model = 'veo-2.0-generate-001',
    options = {},
    apiKey,
  }: {
    prompt: string;
    model?: string;
    options?: {
      aspectRatio?: '16:9' | '9:16';
      personGeneration?: 'dont_allow' | 'allow_adult';
      numberOfVideos?: 1 | 2;
      durationSeconds?: number;
      negativePrompt?: string;
      enhancePrompt?: boolean;
    };
    apiKey?: string;
  }): Promise<string[]> {
    try {
      if (!prompt) {
        Logger.error('VeoVideoService.generateVideoFromText: Missing required param prompt', {
          prompt,
        });
        throw new ValidationError('prompt is required');
      }
      // This uses an unofficial/undocumented API; types may not exist
      let operation = await this.genAI.models.generateVideos({
        model,
        prompt,
        config: options,
      });
      while (!operation.done) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        operation = await this.genAI.operations.getVideosOperation({ operation });
      }
      const key = apiKey || process.env.GEMINI_API_KEY;
      return (operation.response?.generatedVideos || []).map(
        (v: { video?: { uri?: string } }) => `${v.video?.uri}${key ? `&key=${key}` : ''}`,
      );
    } catch (err) {
      Logger.error('VeoVideoService.generateVideoFromText error', err);
      throw new GeminiApiError('Failed to generate video from text', err);
    }
  }

  /**
   * Generate video from an image and prompt using Veo.
   * @param prompt Text prompt for the video.
   * @param imageBytes Image bytes (Buffer or base64 string).
   * @param mimeType Image mime type (e.g., 'image/png').
   * @param options Additional options: aspectRatio, personGeneration, numberOfVideos, durationSeconds, negativePrompt, enhancePrompt.
   * @returns Array of video URIs (after polling for completion).
   */
  async generateVideoFromImage({
    prompt,
    imageBytes,
    mimeType = 'image/png',
    model = 'veo-2.0-generate-001',
    options = {},
    apiKey,
  }: {
    prompt: string;
    imageBytes: Buffer | string;
    mimeType?: string;
    model?: string;
    options?: {
      aspectRatio?: '16:9' | '9:16';
      personGeneration?: 'dont_allow' | 'allow_adult';
      numberOfVideos?: 1 | 2;
      durationSeconds?: number;
      negativePrompt?: string;
      enhancePrompt?: boolean;
    };
    apiKey?: string;
  }): Promise<string[]> {
    try {
      if (!prompt || !imageBytes) {
        Logger.error('VeoVideoService.generateVideoFromImage: Missing required params', {
          prompt,
          imageBytes,
        });
        throw new ValidationError('prompt and imageBytes are required');
      }
      // If imageBytes is a Buffer, convert to base64 string (API expects string)
      let imageBytesStr: string | undefined;
      if (typeof imageBytes === 'string') {
        imageBytesStr = imageBytes;
      } else if (Buffer.isBuffer(imageBytes)) {
        imageBytesStr = imageBytes.toString('base64');
      } else {
        throw new ValidationError('imageBytes must be a Buffer or base64 string');
      }
      let operation = await this.genAI.models.generateVideos({
        model,
        prompt,
        image: {
          imageBytes: imageBytesStr,
          mimeType,
        },
        config: options,
      });
      while (!operation.done) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        operation = await this.genAI.operations.getVideosOperation({ operation });
      }
      const key = apiKey || process.env.GEMINI_API_KEY;
      return (operation.response?.generatedVideos || []).map(
        (v: { video?: { uri?: string } }) => `${v.video?.uri}${key ? `&key=${key}` : ''}`,
      );
    } catch (err) {
      Logger.error('VeoVideoService.generateVideoFromImage error', err);
      throw new GeminiApiError('Failed to generate video from image', err);
    }
  }

  /**
   * Download a video from a given URI and save to a file.
   * @param uri Video URI (with API key appended).
   * @param filename Output filename (e.g., 'video0.mp4').
   */
  async downloadVideo(uri: string, filename: string): Promise<void> {
    try {
      if (!uri || !filename) {
        Logger.error('VeoVideoService.downloadVideo: Missing required params', { uri, filename });
        throw new ValidationError('uri and filename are required');
      }
      const resp = await fetch(uri);
      const writer = createWriteStream(filename);
      (Readable.fromWeb as (body: unknown) => NodeJS.ReadableStream)(resp.body).pipe(writer);
      return new Promise<void>((resolve, reject) => {
        writer.on('finish', () => resolve());
        writer.on('error', reject);
      });
    } catch (err) {
      Logger.error('VeoVideoService.downloadVideo error', err);
      throw new GeminiApiError('Failed to download video', err);
    }
  }
}
