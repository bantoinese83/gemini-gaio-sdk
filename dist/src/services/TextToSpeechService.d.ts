import { BaseGenAIService } from './BaseGenAIService';
import { GenerateSingleSpeakerSpeechParams, GenerateSingleSpeakerSpeechResult } from '../types/types';
/**
 * Service for text-to-speech (TTS) using Gemini API.
 *
 * Technical details:
 * - Context window: 32k tokens per TTS session.
 * - Voice options: 30 supported voices (see TextToSpeechService.voiceOptions).
 * - Supported languages: 24 languages (see TextToSpeechService.languageCodes).
 *   Language is detected automatically from input text.
 * - Both single-speaker and multi-speaker TTS are supported on Gemini 2.5 Flash Preview TTS and Gemini 2.5 Pro Preview TTS models.
 */
export declare class TextToSpeechService extends BaseGenAIService {
    /**
     * All supported Gemini TTS voice options (for the `voiceName` field).
     * See: https://ai.google.dev/gemini-api/docs/tts
     */
    static readonly voiceOptions: string[];
    /**
     * All supported Gemini TTS language codes (BCP-47).
     * See: https://ai.google.dev/gemini-api/docs/tts
     */
    static readonly languageCodes: string[];
    /**
     * Create a new TextToSpeechService instance.
     * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
     */
    constructor(apiKey: string);
    /**
     * Generate single-speaker TTS audio from text.
     * @param model Gemini TTS model (e.g., 'gemini-2.5-flash-preview-tts').
     * @param text Text to convert to speech.
     * @param voiceName Prebuilt voice name (see TextToSpeechService.voiceOptions).
     * @returns Audio as Buffer (PCM, base64-decoded).
     */
    generateSingleSpeakerSpeech(params: GenerateSingleSpeakerSpeechParams): Promise<GenerateSingleSpeakerSpeechResult>;
    /**
     * Generate multi-speaker TTS audio from text.
     * @param model Gemini TTS model (e.g., 'gemini-2.5-flash-preview-tts').
     * @param text Text prompt with speaker names (e.g., 'Joe: ... Jane: ...').
     * @param speakers Array of { speaker, voiceName } for each speaker (see TextToSpeechService.voiceOptions).
     * @returns Audio as Buffer (PCM, base64-decoded).
     */
    generateMultiSpeakerSpeech({ model, text, speakers, }: {
        model: string;
        text: string;
        speakers: Array<{
            speaker: string;
            voiceName: string;
        }>;
    }): Promise<Buffer>;
}
