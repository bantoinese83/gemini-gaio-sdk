import { BaseGenAIService } from './BaseGenAIService';
export declare class VeoVideoService extends BaseGenAIService {
    constructor(apiKey: string);
    /**
     * Generate video from text prompt using Veo.
     * @param prompt Text prompt for the video.
     * @param options Additional options: aspectRatio, personGeneration, numberOfVideos, durationSeconds, negativePrompt, enhancePrompt.
     * @returns Array of video URIs (after polling for completion).
     */
    generateVideoFromText({ prompt, model, options, apiKey, }: {
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
    }): Promise<string[]>;
    /**
     * Generate video from an image and prompt using Veo.
     * @param prompt Text prompt for the video.
     * @param imageBytes Image bytes (Buffer or base64 string).
     * @param mimeType Image mime type (e.g., 'image/png').
     * @param options Additional options: aspectRatio, personGeneration, numberOfVideos, durationSeconds, negativePrompt, enhancePrompt.
     * @returns Array of video URIs (after polling for completion).
     */
    generateVideoFromImage({ prompt, imageBytes, mimeType, model, options, apiKey, }: {
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
    }): Promise<string[]>;
    /**
     * Download a video from a given URI and save to a file.
     * @param uri Video URI (with API key appended).
     * @param filename Output filename (e.g., 'video0.mp4').
     */
    downloadVideo(uri: string, filename: string): Promise<void>;
}
