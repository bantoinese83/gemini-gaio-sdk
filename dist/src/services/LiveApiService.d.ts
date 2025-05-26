import { BaseGenAIService } from './BaseGenAIService';
import { StreamingCallbacks, ModelConfig, LiveSession } from '../types/types';
export declare class LiveApiService extends BaseGenAIService {
    constructor(apiKey: string);
    /**
     * Connect to a Gemini Live API session (WebSocket, streaming).
     * @param model Model name (e.g., 'gemini-2.0-flash-live-001').
     * @param responseModality 'TEXT' or 'AUDIO'.
     * @param callbacks { onopen, onmessage, onerror, onclose }
     * @param config Additional config (optional).
     * @returns The live session object.
     */
    connectSession({ model, responseModality, callbacks, config, }: {
        model?: string;
        responseModality?: string;
        callbacks: StreamingCallbacks;
        config?: ModelConfig;
    }): Promise<LiveSession>;
    /**
     * Send a text turn to the Live API session.
     * @param session The live session object.
     * @param text The text to send.
     */
    sendText(session: LiveSession, text: string): Promise<void>;
    /**
     * Send audio (16-bit PCM, 16kHz, mono, base64) to the Live API session.
     * @param session The live session object.
     * @param base64Audio The base64-encoded audio data.
     */
    sendAudio(session: LiveSession, base64Audio: string): Promise<void>;
    /**
     * Close a Live API session.
     * @param session The session object.
     */
    closeSession(session: LiveSession): Promise<void>;
}
