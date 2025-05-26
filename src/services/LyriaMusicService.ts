/**
 * Service for real-time music generation using Lyria (Gemini API).
 */
import { BaseGenAIService } from './BaseGenAIService';
import { Logger, GeminiApiError, ValidationError } from '../utils/Logger';

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
    onMessage: (message: unknown) => void;
    onError?: (error: unknown) => void;
    onClose?: () => void;
    model?: string;
  }): Record<string, unknown> {
    if (
      !this.genAI.live ||
      !this.genAI.live.music ||
      typeof this.genAI.live.music.connect !== 'function'
    ) {
      throw new Error(
        'Lyria RealTime is not available. Make sure you are using @google/genai >= 1.0.1 and apiVersion: "v1alpha".',
      );
    }
    // @ts-expect-error Lyria live.music.connect is not typed in @google/genai
    return this.genAI.live.music.connect({
      model,
      callbacks: {
        onmessage: onMessage,
        onerror: onError,
        onclose: onClose,
      },
    });
  }

  /**
   * Set weighted prompts for the Lyria session.
   * @param session The Lyria session object.
   * @param weightedPrompts Array of { text, weight }.
   */
  async setWeightedPrompts(
    session: Record<string, unknown>,
    weightedPrompts: Array<{ text: string; weight: number }>,
  ) {
    try {
      if (
        !session ||
        !weightedPrompts ||
        !Array.isArray(weightedPrompts) ||
        weightedPrompts.length === 0
      ) {
        Logger.error('LyriaMusicService.setWeightedPrompts: Missing required params', {
          session,
          weightedPrompts,
        });
        throw new ValidationError('session and weightedPrompts (non-empty array) are required');
      }
      const fn = session.setWeightedPrompts as unknown as (args: {
        weightedPrompts: Array<{ text: string; weight: number }>;
      }) => Promise<void>;
      await fn({ weightedPrompts });
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
  async setMusicGenerationConfig(
    session: Record<string, unknown>,
    config: Record<string, unknown>,
  ) {
    try {
      if (!session || !config) {
        Logger.error('LyriaMusicService.setMusicGenerationConfig: Missing required params', {
          session,
          config,
        });
        throw new ValidationError('session and config are required');
      }
      const fn = session.setMusicGenerationConfig as unknown as (args: {
        musicGenerationConfig: Record<string, unknown>;
      }) => Promise<void>;
      await fn({ musicGenerationConfig: config });
    } catch (err) {
      Logger.error('LyriaMusicService.setMusicGenerationConfig error', err);
      throw new GeminiApiError('Failed to set music generation config', err);
    }
  }

  /**
   * Start music generation in the Lyria session.
   * @param session The Lyria session object.
   */
  async play(session: Record<string, unknown>) {
    try {
      if (!session) {
        Logger.error('LyriaMusicService.play: Missing required param session', { session });
        throw new ValidationError('session is required');
      }
      const fn = session.play as unknown as () => Promise<void>;
      await fn();
    } catch (err) {
      Logger.error('LyriaMusicService.play error', err);
      throw new GeminiApiError('Failed to play music', err);
    }
  }

  /**
   * Pause music generation in the Lyria session.
   * @param session The Lyria session object.
   */
  async pause(session: Record<string, unknown>) {
    try {
      if (!session) {
        Logger.error('LyriaMusicService.pause: Missing required param session', { session });
        throw new ValidationError('session is required');
      }
      const fn = session.pause as unknown as () => Promise<void>;
      await fn();
    } catch (err) {
      Logger.error('LyriaMusicService.pause error', err);
      throw new GeminiApiError('Failed to pause music', err);
    }
  }

  /**
   * Stop music generation in the Lyria session.
   * @param session The Lyria session object.
   */
  async stop(session: Record<string, unknown>) {
    try {
      if (!session) {
        Logger.error('LyriaMusicService.stop: Missing required param session', { session });
        throw new ValidationError('session is required');
      }
      const fn = session.stop as unknown as () => Promise<void>;
      await fn();
    } catch (err) {
      Logger.error('LyriaMusicService.stop error', err);
      throw new GeminiApiError('Failed to stop music', err);
    }
  }

  /**
   * Reset the Lyria session context (for hard transitions, e.g., bpm/scale changes).
   * @param session The Lyria session object.
   */
  async resetContext(session: Record<string, unknown>) {
    try {
      if (!session) {
        Logger.error('LyriaMusicService.resetContext: Missing required param session', { session });
        throw new ValidationError('session is required');
      }
      const fn = session.reset_context as unknown as () => Promise<void>;
      await fn();
    } catch (err) {
      Logger.error('LyriaMusicService.resetContext error', err);
      throw new GeminiApiError('Failed to reset context', err);
    }
  }
}
