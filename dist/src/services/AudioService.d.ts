import { BaseGenAIService } from './BaseGenAIService';
import { GenerateSingleSpeakerSpeechParams, GenerateSingleSpeakerSpeechResult, AnalyzeAudioFileParams } from '../types/types';
/**
 * Service for audio analysis and text-to-speech using Gemini API.
 */
export declare class AudioService extends BaseGenAIService {
    /**
     * Create a new AudioService instance.
     * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
     */
    constructor(apiKey: string);
    /**
     * Generate single-speaker TTS audio from text.
     * @param params { model, text, voiceName }
     * @returns Audio as Buffer (PCM, base64-decoded)
     */
    generateSingleSpeakerSpeech({ model, text, voiceName, }: GenerateSingleSpeakerSpeechParams): Promise<GenerateSingleSpeakerSpeechResult>;
    /**
     * Analyze an audio file (transcription, etc).
     * @param params { model, filePath, prompt, useFileApi? }
     * @returns The model response text
     */
    analyzeAudioFile({ model, filePath, prompt, useFileApi, }: AnalyzeAudioFileParams): Promise<string>;
    /**
     * Count tokens in an audio file.
     * @param params { model, filePath }
     * @returns Total token count
     */
    countAudioTokens({ model, filePath, }: {
        model: string;
        filePath: string;
    }): Promise<number>;
}
