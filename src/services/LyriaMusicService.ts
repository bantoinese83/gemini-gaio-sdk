/**
 * Service for real-time music generation using Lyria (Gemini API).
 */
import { BaseGenAIService } from "./BaseGenAIService";
import { Logger, GeminiApiError, ValidationError } from "../utils/Logger";

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
    try {
      if (!session || !weightedPrompts || !Array.isArray(weightedPrompts) || weightedPrompts.length === 0) {
        Logger.error('LyriaMusicService.setWeightedPrompts: Missing required params', { session, weightedPrompts });
        throw new ValidationError('session and weightedPrompts (non-empty array) are required');
      }
      await session.setWeightedPrompts({ weightedPrompts });
    } catch (err) {
      Logger.error('LyriaMusicService.setWeightedPrompts error', err);
      throw new GeminiApiError('Failed to set weighted prompts', err);
    }
  }

  /**
   * Set music generation config for the Lyria session.
   * @param session The Lyria session object.
   * @param config MusicGenerationConfig (bpm, temperature, density, etc.).
   */
  async setMusicGenerationConfig(session: any, config: any) {
    try {
      if (!session || !config) {
        Logger.error('LyriaMusicService.setMusicGenerationConfig: Missing required params', { session, config });
        throw new ValidationError('session and config are required');
      }
      await session.setMusicGenerationConfig({ musicGenerationConfig: config });
    } catch (err) {
      Logger.error('LyriaMusicService.setMusicGenerationConfig error', err);
      throw new GeminiApiError('Failed to set music generation config', err);
    }
  }

  /**
   * Start music generation in the Lyria session.
   * @param session The Lyria session object.
   */
  async play(session: any) {
    try {
      if (!session) {
        Logger.error('LyriaMusicService.play: Missing required param session', { session });
        throw new ValidationError('session is required');
      }
      await session.play();
    } catch (err) {
      Logger.error('LyriaMusicService.play error', err);
      throw new GeminiApiError('Failed to play music', err);
    }
  }

  /**
   * Pause music generation in the Lyria session.
   * @param session The Lyria session object.
   */
  async pause(session: any) {
    try {
      if (!session) {
        Logger.error('LyriaMusicService.pause: Missing required param session', { session });
        throw new ValidationError('session is required');
      }
      await session.pause();
    } catch (err) {
      Logger.error('LyriaMusicService.pause error', err);
      throw new GeminiApiError('Failed to pause music', err);
    }
  }

  /**
   * Stop music generation in the Lyria session.
   * @param session The Lyria session object.
   */
  async stop(session: any) {
    try {
      if (!session) {
        Logger.error('LyriaMusicService.stop: Missing required param session', { session });
        throw new ValidationError('session is required');
      }
      await session.stop();
    } catch (err) {
      Logger.error('LyriaMusicService.stop error', err);
      throw new GeminiApiError('Failed to stop music', err);
    }
  }

  /**
   * Reset the Lyria session context (for hard transitions, e.g., bpm/scale changes).
   * @param session The Lyria session object.
   */
  async resetContext(session: any) {
    try {
      if (!session) {
        Logger.error('LyriaMusicService.resetContext: Missing required param session', { session });
        throw new ValidationError('session is required');
      }
      await session.reset_context();
    } catch (err) {
      Logger.error('LyriaMusicService.resetContext error', err);
      throw new GeminiApiError('Failed to reset context', err);
    }
  }
} 