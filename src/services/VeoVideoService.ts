import { BaseGenAIService } from "./BaseGenAIService";
import { createWriteStream } from "fs";
import { Readable } from "stream";

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
    model = "veo-2.0-generate-001",
    options = {},
    apiKey,
  }: {
    prompt: string,
    model?: string,
    options?: {
      aspectRatio?: "16:9" | "9:16",
      personGeneration?: "dont_allow" | "allow_adult",
      numberOfVideos?: 1 | 2,
      durationSeconds?: number,
      negativePrompt?: string,
      enhancePrompt?: boolean,
    },
    apiKey?: string, // Optionally override API key for download
  }): Promise<string[]> {
    // @ts-expect-error: generateVideos is not in the public type yet
    let operation = await this.genAI.models.generateVideos({
      model,
      prompt,
      config: options,
    });
    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      // @ts-expect-error: operations is not in the public type yet
      operation = await this.genAI.operations.getVideosOperation({ operation });
    }
    const key = apiKey || process.env.GEMINI_API_KEY;
    return (operation.response?.generatedVideos || []).map(
      (v: any) => `${v.video?.uri}${key ? `&key=${key}` : ""}`
    );
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
    mimeType = "image/png",
    model = "veo-2.0-generate-001",
    options = {},
    apiKey,
  }: {
    prompt: string,
    imageBytes: Buffer | string,
    mimeType?: string,
    model?: string,
    options?: {
      aspectRatio?: "16:9" | "9:16",
      personGeneration?: "dont_allow" | "allow_adult",
      numberOfVideos?: 1 | 2,
      durationSeconds?: number,
      negativePrompt?: string,
      enhancePrompt?: boolean,
    },
    apiKey?: string,
  }): Promise<string[]> {
    // @ts-expect-error: generateVideos is not in the public type yet
    let operation = await this.genAI.models.generateVideos({
      model,
      prompt,
      image: {
        imageBytes,
        mimeType,
      },
      config: options,
    });
    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      // @ts-expect-error: operations is not in the public type yet
      operation = await this.genAI.operations.getVideosOperation({ operation });
    }
    const key = apiKey || process.env.GEMINI_API_KEY;
    return (operation.response?.generatedVideos || []).map(
      (v: any) => `${v.video?.uri}${key ? `&key=${key}` : ""}`
    );
  }

  /**
   * Download a video from a given URI and save to a file.
   * @param uri Video URI (with API key appended).
   * @param filename Output filename (e.g., 'video0.mp4').
   */
  async downloadVideo(uri: string, filename: string) {
    const resp = await fetch(uri);
    const writer = createWriteStream(filename);
    (Readable as any).fromWeb(resp.body).pipe(writer);
    return new Promise<void>((resolve, reject) => {
      writer.on('finish', () => resolve());
      writer.on('error', reject);
    });
  }
} 