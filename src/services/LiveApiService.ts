import { BaseGenAIService } from "./BaseGenAIService";
import { Logger, GeminiApiError, ValidationError } from "../utils/Logger";
import { StreamingCallbacks, LiveSession, ModelConfig } from "../types/types";
import { Modality } from "@google/genai";

export class LiveApiService extends BaseGenAIService {
  constructor(apiKey: string) {
    super(apiKey);
  }

  /**
   * Connect to a Gemini Live API session (WebSocket, streaming).
   * @param model Model name (e.g., 'gemini-2.0-flash-live-001').
   * @param responseModality 'TEXT' or 'AUDIO'.
   * @param callbacks { onopen, onmessage, onerror, onclose }
   * @param config Additional config (optional).
   * @returns The live session object.
   */
  async connectSession({
    model = 'gemini-2.0-flash-live-001',
    responseModality = 'TEXT',
    callbacks,
    config = {},
  }: {
    model?: string,
    responseModality?: string,
    callbacks: StreamingCallbacks,
    config?: ModelConfig,
  }): Promise<any> {
    try {
      if (!model || !callbacks) {
        Logger.error('LiveApiService.connectSession: Missing required params', { model, callbacks });
        throw new ValidationError('model and callbacks are required');
      }
      return await this.genAI.live.connect({
        model,
        callbacks: {
          onopen: callbacks.onopen,
          onmessage: callbacks.onmessage as any,
          onerror: callbacks.onerror,
          onclose: callbacks.onclose,
        },
        config: { responseModalities: [Modality[responseModality as keyof typeof Modality]], ...config },
      });
    } catch (err) {
      Logger.error('LiveApiService.connectSession error', err);
      throw new GeminiApiError('Failed to connect to live session', err);
    }
  }

  /**
   * Send a text turn to the Live API session.
   * @param session The live session object.
   * @param text The text to send.
   */
  async sendText(session: any, text: string): Promise<void> {
    try {
      if (!session || !text) {
        Logger.error('LiveApiService.sendText: Missing required params', { session, text });
        throw new ValidationError('session and text are required');
      }
      await session.sendClientContent({ turns: text });
    } catch (err) {
      Logger.error('LiveApiService.sendText error', err);
      throw new GeminiApiError('Failed to send text to live session', err);
    }
  }

  /**
   * Send audio (16-bit PCM, 16kHz, mono, base64) to the Live API session.
   * @param session The live session object.
   * @param base64Audio The base64-encoded audio data.
   */
  async sendAudio(session: any, base64Audio: string): Promise<void> {
    try {
      if (!session || !base64Audio) {
        Logger.error('LiveApiService.sendAudio: Missing required params', { session, base64Audio });
        throw new ValidationError('session and base64Audio are required');
      }
      await session.sendRealtimeInput({
        audio: {
          data: base64Audio,
          mimeType: 'audio/pcm;rate=16000',
        },
      });
    } catch (err) {
      Logger.error('LiveApiService.sendAudio error', err);
      throw new GeminiApiError('Failed to send audio to live session', err);
    }
  }

  /**
   * Close a Live API session.
   * @param session The session object.
   */
  async closeSession(session: any): Promise<void> {
    try {
      if (!session) {
        Logger.error('LiveApiService.closeSession: Missing required param session', { session });
        throw new ValidationError('session is required');
      }
      await session.close();
    } catch (err) {
      Logger.error('LiveApiService.closeSession error', err);
      throw new GeminiApiError('Failed to close live session', err);
    }
  }
} 