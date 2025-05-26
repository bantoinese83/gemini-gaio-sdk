/**
 * Service for real-time music generation using Lyria (Gemini API).
 */
import { BaseGenAIService } from "./BaseGenAIService";

export class LyriaMusicService extends BaseGenAIService {
  /**
   * Create a new LyriaMusicService instance.
   * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
   */
  constructor(apiKey: string) {
    super(apiKey);
  }

  /**
   * Connect to a Lyria RealTime music generation session.
   * @param onMessage Callback for receiving audio chunks (raw PCM, 48kHz, stereo).
   * @param onError Callback for errors.
   * @param onClose Callback for session close.
   * @param model Lyria model (default: 'models/lyria-realtime-exp').
   * @returns The session object for further control.
   */
  connectSession({
    onMessage,
    onError,
    onClose,
    model = 'models/lyria-realtime-exp',
  }: {
    onMessage: (message: any) => void,
    onError?: (error: any) => void,
    onClose?: () => void,
    model?: string,
  }) {
    // @ts-ignore
    return this.genAI.live.music.connect({
      model,
      callbacks: {
        onMessage,
        onError,
        onClose,
      },
    });
  }

  /**
   * Set weighted prompts for the Lyria session.
   * @param session The Lyria session object.
   * @param weightedPrompts Array of { text, weight }.
   */
  async setWeightedPrompts(session: any, weightedPrompts: Array<{ text: string, weight: number }>) {
    await session.setWeightedPrompts({ weightedPrompts });
  }

  /**
   * Set music generation config for the Lyria session.
   * @param session The Lyria session object.
   * @param config MusicGenerationConfig (bpm, temperature, density, etc.).
   */
  async setMusicGenerationConfig(session: any, config: any) {
    await session.setMusicGenerationConfig({ musicGenerationConfig: config });
  }

  /**
   * Start music generation in the Lyria session.
   * @param session The Lyria session object.
   */
  async play(session: any) {
    await session.play();
  }

  /**
   * Pause music generation in the Lyria session.
   * @param session The Lyria session object.
   */
  async pause(session: any) {
    await session.pause();
  }

  /**
   * Stop music generation in the Lyria session.
   * @param session The Lyria session object.
   */
  async stop(session: any) {
    await session.stop();
  }

  /**
   * Reset the Lyria session context (for hard transitions, e.g., bpm/scale changes).
   * @param session The Lyria session object.
   */
  async resetContext(session: any) {
    await session.reset_context();
  }
} 