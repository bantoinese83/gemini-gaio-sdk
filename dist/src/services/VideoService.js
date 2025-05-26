import { BaseGenAIService } from './BaseGenAIService';
import { Logger, GeminiApiError, ValidationError } from '../utils/Logger';
export class VideoService extends BaseGenAIService {
    constructor(apiKey) {
        super(apiKey);
    }
    async analyzeVideoFile(params) {
        try {
            if (!params.model || !params.filePath || !params.prompt) {
                Logger.error('VideoService.analyzeVideoFile: Missing required params', {
                    model: params.model,
                    filePath: params.filePath,
                    prompt: params.prompt,
                });
                throw new ValidationError('model, filePath, and prompt are required');
            }
            const fs = await import('fs');
            const stats = fs.statSync(params.filePath);
            const isSmall = stats.size < 20 * 1024 * 1024;
            if (isSmall && !params.useFileApi) {
                const base64Video = fs.readFileSync(params.filePath, { encoding: 'base64' });
                const parts = [
                    {
                        inlineData: {
                            mimeType: 'video/mp4',
                            data: base64Video,
                        },
                    },
                    { text: params.prompt },
                ];
                const response = await this.genAI.models.generateContent({
                    model: params.model,
                    contents: parts,
                });
                return response.text ?? '';
            }
            else {
                const file = await this.genAI.files.upload({
                    file: params.filePath,
                    config: { mimeType: 'video/mp4' },
                });
                const { createUserContent, createPartFromUri } = await import('@google/genai');
                const parts = createUserContent([
                    createPartFromUri(file.uri ?? '', file.mimeType ?? 'video/mp4'),
                    params.prompt,
                ]);
                const response = await this.genAI.models.generateContent({
                    model: params.model,
                    contents: parts,
                });
                return response.text ?? '';
            }
        }
        catch (err) {
            Logger.error('VideoService.analyzeVideoFile error', err);
            throw new GeminiApiError('Failed to analyze video file', err);
        }
    }
    async analyzeYoutubeVideo(params) {
        try {
            if (!params.model || !params.youtubeUrl || !params.prompt) {
                Logger.error('VideoService.analyzeYoutubeVideo: Missing required params', {
                    model: params.model,
                    youtubeUrl: params.youtubeUrl,
                    prompt: params.prompt,
                });
                throw new ValidationError('model, youtubeUrl, and prompt are required');
            }
            const { createUserContent } = await import('@google/genai');
            const parts = createUserContent([
                params.prompt,
                { fileData: { fileUri: params.youtubeUrl } },
            ]);
            const response = await this.genAI.models.generateContent({
                model: params.model,
                contents: parts,
            });
            return response.text ?? '';
        }
        catch (err) {
            Logger.error('VideoService.analyzeYoutubeVideo error', err);
            throw new GeminiApiError('Failed to analyze YouTube video', err);
        }
    }
}
