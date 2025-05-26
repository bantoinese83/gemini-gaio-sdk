import { BaseGenAIService } from './BaseGenAIService';
import { ContentBuilder } from '../utils/ContentBuilder';
import { ResponseParser } from '../utils/ResponseParser';
import { Logger, GeminiApiError, ValidationError } from '../utils/Logger';
/**
 * Service for audio analysis and text-to-speech using Gemini API.
 */
export class AudioService extends BaseGenAIService {
    /**
     * Create a new AudioService instance.
     * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
     */
    constructor(apiKey) {
        super(apiKey);
    }
    /**
     * Generate single-speaker TTS audio from text.
     * @param params { model, text, voiceName }
     * @returns Audio as Buffer (PCM, base64-decoded)
     */
    async generateSingleSpeakerSpeech({ model, text, voiceName, }) {
        try {
            if (!model || !text || !voiceName) {
                Logger.error('AudioService.generateSingleSpeakerSpeech: Missing required params', {
                    model,
                    text,
                    voiceName,
                });
                throw new ValidationError('model, text, and voiceName are required');
            }
            const contents = [
                {
                    parts: ContentBuilder.buildMultimodalParts(text, []),
                },
            ];
            const speechConfig = {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: voiceName },
                },
            };
            const finalConfig = {
                responseModalities: ['AUDIO'],
                speechConfig: speechConfig,
            };
            const response = await this.genAI.models.generateContent({
                model,
                contents,
                config: finalConfig,
            });
            const audioParts = ResponseParser.extractAudio(response.candidates?.[0]?.content?.parts || []);
            if (!audioParts.length) {
                Logger.error('AudioService.generateSingleSpeakerSpeech: No audio data in response', {
                    response,
                });
                throw new GeminiApiError('Could not extract audio data from TTS response.', response);
            }
            return Buffer.from(audioParts[0].data, 'base64');
        }
        catch (err) {
            Logger.error('AudioService.generateSingleSpeakerSpeech error', err);
            if (err instanceof GeminiApiError || err instanceof ValidationError)
                throw err;
            throw new GeminiApiError('Failed to generate single-speaker speech', err);
        }
    }
    /**
     * Analyze an audio file (transcription, etc).
     * @param params { model, filePath, prompt, useFileApi? }
     * @returns The model response text
     */
    async analyzeAudioFile({ model, filePath, prompt, useFileApi = false, }) {
        try {
            if (!model || !filePath || !prompt) {
                Logger.error('AudioService.analyzeAudioFile: Missing required params', {
                    model,
                    filePath,
                    prompt,
                });
                throw new ValidationError('model, filePath, and prompt are required');
            }
            const fs = await import('fs');
            const stats = fs.statSync(filePath);
            const isSmall = stats.size < 20 * 1024 * 1024;
            if (isSmall && !useFileApi) {
                const base64Audio = fs.readFileSync(filePath, { encoding: 'base64' });
                const parts = ContentBuilder.buildMultimodalParts(prompt, [
                    { data: base64Audio, mimeType: 'audio/mp3' },
                ]);
                const response = await this.genAI.models.generateContent({ model, contents: parts });
                return response.text ?? '';
            }
            else {
                const file = await this.genAI.files.upload({
                    file: filePath,
                    config: { mimeType: 'audio/mp3' },
                });
                const { createUserContent, createPartFromUri } = await import('@google/genai');
                const parts = createUserContent([
                    createPartFromUri(file.uri ?? '', file.mimeType ?? 'audio/mp3'),
                    prompt,
                ]);
                const response = await this.genAI.models.generateContent({ model, contents: parts });
                return response.text ?? '';
            }
        }
        catch (err) {
            Logger.error('AudioService.analyzeAudioFile error', err);
            throw new GeminiApiError('Failed to analyze audio file', err);
        }
    }
    /**
     * Count tokens in an audio file.
     * @param params { model, filePath }
     * @returns Total token count
     */
    async countAudioTokens({ model, filePath, }) {
        try {
            if (!model || !filePath) {
                Logger.error('AudioService.countAudioTokens: Missing required params', { model, filePath });
                throw new ValidationError('model and filePath are required');
            }
            const file = await this.genAI.files.upload({
                file: filePath,
                config: { mimeType: 'audio/mp3' },
            });
            const { createUserContent, createPartFromUri } = await import('@google/genai');
            const parts = createUserContent([
                createPartFromUri(file.uri ?? '', file.mimeType ?? 'audio/mp3'),
            ]);
            const response = await this.genAI.models.countTokens({ model, contents: parts });
            return response.totalTokens ?? 0;
        }
        catch (err) {
            Logger.error('AudioService.countAudioTokens error', err);
            throw new GeminiApiError('Failed to count audio tokens', err);
        }
    }
}
