/**
 * Service for real-time music generation using Lyria (Gemini API).
 */
import { BaseGenAIService } from './BaseGenAIService';
export declare class LyriaMusicService extends BaseGenAIService {
    /**
     * Create a new LyriaMusicService instance.
     * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
     */
    constructor(apiKey: string);
    /**
     * Connect to a Lyria RealTime music generation session.
     * @param onMessage Callback for receiving audio chunks (raw PCM, 48kHz, stereo).
     * @param onError Callback for errors.
     * @param onClose Callback for session close.
     * @param model Lyria model (default: 'models/lyria-realtime-exp').
     * @returns The session object for further control.
     */
    connectSession({ onMessage, onError, onClose, model, }: {
        onMessage: (message: unknown) => void;
        onError?: (error: unknown) => void;
        onClose?: () => void;
        model?: string;
    }): Record<string, unknown>;
    /**
     * Set weighted prompts for the Lyria session.
     * @param session The Lyria session object.
     * @param weightedPrompts Array of { text, weight }.
     */
    setWeightedPrompts(session: Record<string, unknown>, weightedPrompts: Array<{
        text: string;
        weight: number;
    }>): Promise<void>;
    /**
     * Set music generation config for the Lyria session.
     * @param session The Lyria session object.
     * @param config MusicGenerationConfig (bpm, temperature, density, etc.).
     */
    setMusicGenerationConfig(session: Record<string, unknown>, config: Record<string, unknown>): Promise<void>;
    /**
     * Start music generation in the Lyria session.
     * @param session The Lyria session object.
     */
    play(session: Record<string, unknown>): Promise<void>;
    /**
     * Pause music generation in the Lyria session.
     * @param session The Lyria session object.
     */
    pause(session: Record<string, unknown>): Promise<void>;
    /**
     * Stop music generation in the Lyria session.
     * @param session The Lyria session object.
     */
    stop(session: Record<string, unknown>): Promise<void>;
    /**
     * Reset the Lyria session context (for hard transitions, e.g., bpm/scale changes).
     * @param session The Lyria session object.
     */
    resetContext(session: Record<string, unknown>): Promise<void>;
}
