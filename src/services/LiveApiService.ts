import { BaseGenAIService } from "./BaseGenAIService";

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
    responseModality?: 'TEXT' | 'AUDIO',
    callbacks: {
      onopen?: () => void,
      onmessage?: (message: any) => void,
      onerror?: (e: any) => void,
      onclose?: (e: any) => void,
    },
    config?: any,
  }) {
    return await this.genAI.live.connect({
      model,
      callbacks: {
        onopen: callbacks.onopen,
        onmessage: callbacks.onmessage as any,
        onerror: callbacks.onerror,
        onclose: callbacks.onclose,
      },
      config: { responseModalities: [responseModality], ...config },
    });
  }

  /**
   * Send a text turn to the Live API session.
   * @param session The live session object.
   * @param text The text to send.
   */
  async sendText(session: any, text: string) {
    await session.sendClientContent({ turns: text });
  }

  /**
   * Send audio (16-bit PCM, 16kHz, mono, base64) to the Live API session.
   * @param session The live session object.
   * @param base64Audio The base64-encoded audio data.
   */
  async sendAudio(session: any, base64Audio: string) {
    await session.sendRealtimeInput({
      audio: {
        data: base64Audio,
        mimeType: 'audio/pcm;rate=16000',
      },
    });
  }

  /**
   * Close a Live API session.
   * @param session The session object.
   */
  async closeSession(session: any) {
    await session.close();
  }
} 