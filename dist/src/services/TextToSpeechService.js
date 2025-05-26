import { BaseGenAIService } from './BaseGenAIService';
import { Logger, GeminiApiError, ValidationError } from '../utils/Logger';
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
export class TextToSpeechService extends BaseGenAIService {
    /**
     * All supported Gemini TTS voice options (for the `voiceName` field).
     * See: https://ai.google.dev/gemini-api/docs/tts
     */
    static voiceOptions = [
        'Zephyr',
        'Puck',
        'Charon',
        'Kore',
        'Fenrir',
        'Leda',
        'Orus',
        'Aoede',
        'Callirhoe',
        'Autonoe',
        'Enceladus',
        'Iapetus',
        'Umbriel',
        'Algieba',
        'Despina',
        'Erinome',
        'Algenib',
        'Rasalgethi',
        'Laomedeia',
        'Achernar',
        'Alnilam',
        'Schedar',
        'Gacrux',
        'Pulcherrima',
        'Achird',
        'Zubenelgenubi',
        'Vindemiatrix',
        'Sadachbia',
        'Sadaltager',
        'Sulafar',
    ];
    /**
     * All supported Gemini TTS language codes (BCP-47).
     * See: https://ai.google.dev/gemini-api/docs/tts
     */
    static languageCodes = [
        'ar-EG',
        'de-DE',
        'en-US',
        'es-US',
        'fr-FR',
        'hi-IN',
        'id-ID',
        'it-IT',
        'ja-JP',
        'ko-KR',
        'pt-BR',
        'ru-RU',
        'nl-NL',
        'pl-PL',
        'th-TH',
        'tr-TR',
        'vi-VN',
        'ro-RO',
        'uk-UA',
        'bn-BD',
        'en-IN',
        'mr-IN',
        'ta-IN',
        'te-IN',
    ];
    /**
     * Create a new TextToSpeechService instance.
     * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
     */
    constructor(apiKey) {
        super(apiKey);
    }
    /**
     * Generate single-speaker TTS audio from text.
     * @param model Gemini TTS model (e.g., 'gemini-2.5-flash-preview-tts').
     * @param text Text to convert to speech.
     * @param voiceName Prebuilt voice name (see TextToSpeechService.voiceOptions).
     * @returns Audio as Buffer (PCM, base64-decoded).
     */
    async generateSingleSpeakerSpeech(params) {
        try {
            const { model, text, voiceName } = params;
            if (!model || !text || !voiceName) {
                Logger.error('TextToSpeechService.generateSingleSpeakerSpeech: Missing required params', {
                    model,
                    text,
                    voiceName,
                });
                throw new ValidationError('model, text, and voiceName are required');
            }
            const contents = [{ text }];
            const config = {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName },
                    },
                },
            };
            const response = await this.genAI.models.generateContent({ model, contents, config });
            const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (!data)
                throw new GeminiApiError('No audio data returned from TTS.', response);
            return Buffer.from(data, 'base64');
        }
        catch (err) {
            Logger.error('TextToSpeechService.generateSingleSpeakerSpeech error', err);
            if (err instanceof GeminiApiError || err instanceof ValidationError)
                throw err;
            throw new GeminiApiError('Failed to generate single-speaker speech', err);
        }
    }
    /**
     * Generate multi-speaker TTS audio from text.
     * @param model Gemini TTS model (e.g., 'gemini-2.5-flash-preview-tts').
     * @param text Text prompt with speaker names (e.g., 'Joe: ... Jane: ...').
     * @param speakers Array of { speaker, voiceName } for each speaker (see TextToSpeechService.voiceOptions).
     * @returns Audio as Buffer (PCM, base64-decoded).
     */
    async generateMultiSpeakerSpeech({ model, text, speakers, }) {
        try {
            if (!model || !text || !speakers || !Array.isArray(speakers) || speakers.length === 0) {
                Logger.error('TextToSpeechService.generateMultiSpeakerSpeech: Missing required params', {
                    model,
                    text,
                    speakers,
                });
                throw new ValidationError('model, text, and speakers (non-empty array) are required');
            }
            const contents = [{ text }];
            const config = {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    multiSpeakerVoiceConfig: {
                        speakerVoiceConfigs: speakers.map((s) => ({
                            speaker: s.speaker,
                            voiceConfig: {
                                prebuiltVoiceConfig: { voiceName: s.voiceName },
                            },
                        })),
                    },
                },
            };
            const response = await this.genAI.models.generateContent({ model, contents, config });
            const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (!data)
                throw new GeminiApiError('No audio data returned from TTS.', response);
            return Buffer.from(data, 'base64');
        }
        catch (err) {
            Logger.error('TextToSpeechService.generateMultiSpeakerSpeech error', err);
            if (err instanceof GeminiApiError || err instanceof ValidationError)
                throw err;
            throw new GeminiApiError('Failed to generate multi-speaker speech', err);
        }
    }
}
