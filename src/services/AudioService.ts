import { BaseGenAIService } from "./BaseGenAIService";
import { ContentBuilder } from "./ContentBuilder";
import { ResponseParser } from "./ResponseParser";
import { GenerateSingleSpeakerSpeechParams, GenerateSingleSpeakerSpeechResult, AnalyzeAudioFileParams } from "./types";

/**
 * Service for audio analysis and text-to-speech using Gemini API.
 */
export class AudioService extends BaseGenAIService {
  /**
   * Create a new AudioService instance.
   * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
   */
  constructor(apiKey: string) {
    super(apiKey);
  }

  /**
   * Generate single-speaker TTS audio from text.
   * @param params { model, text, voiceName }
   * @returns Audio as Buffer (PCM, base64-decoded)
   */
  async generateSingleSpeakerSpeech({ model, text, voiceName }: GenerateSingleSpeakerSpeechParams): Promise<GenerateSingleSpeakerSpeechResult> {
    const contents: any[] = [{ parts: ContentBuilder.buildMultimodalParts(text, []) }];
    const speechConfig: any = {
      voiceConfig: {
        prebuiltVoiceConfig: { voiceName: voiceName } as any,
      } as any,
    };
    const finalConfig: any = {
      responseModalities: ["AUDIO"],
      speechConfig: speechConfig,
    };
    const response = await this.genAI.models.generateContent({
      model,
      contents,
      config: finalConfig,
    });
    const audioParts = ResponseParser.extractAudio(response.candidates?.[0]?.content?.parts || []);
    if (!audioParts.length) {
      throw new Error("Could not extract audio data from TTS response.");
    }
    return Buffer.from(audioParts[0].data, "base64");
  }

  /**
   * Analyze an audio file (transcription, etc).
   * @param params { model, filePath, prompt, useFileApi? }
   * @returns The model response text
   */
  async analyzeAudioFile({ model, filePath, prompt, useFileApi = false }: AnalyzeAudioFileParams): Promise<string> {
    const fs = await import('fs');
    const stats = fs.statSync(filePath);
    const isSmall = stats.size < 20 * 1024 * 1024;
    if (isSmall && !useFileApi) {
      const base64Audio = fs.readFileSync(filePath, { encoding: 'base64' });
      const parts: any[] = ContentBuilder.buildMultimodalParts(prompt, [{ data: base64Audio, mimeType: 'audio/mp3' }]);
      const response = await this.genAI.models.generateContent({ model, contents: parts });
      return response.text ?? '';
    } else {
      const file = await this.genAI.files.upload({ file: filePath, config: { mimeType: 'audio/mp3' } });
      // @ts-ignore
      const { createUserContent, createPartFromUri } = await import('@google/genai');
      const parts = createUserContent([
        createPartFromUri(file.uri ?? '', file.mimeType ?? 'audio/mp3'),
        prompt,
      ]);
      const response = await this.genAI.models.generateContent({ model, contents: parts });
      return response.text ?? '';
    }
  }

  /**
   * Count tokens in an audio file.
   * @param params { model, filePath }
   * @returns Total token count
   */
  async countAudioTokens({ model, filePath }: { model: string, filePath: string }): Promise<number> {
    const file = await this.genAI.files.upload({ file: filePath, config: { mimeType: 'audio/mp3' } });
    // @ts-ignore
    const { createUserContent, createPartFromUri } = await import('@google/genai');
    const parts = createUserContent([
      createPartFromUri(file.uri ?? '', file.mimeType ?? 'audio/mp3'),
    ]);
    const response = await this.genAI.models.countTokens({ model, contents: parts });
    return response.totalTokens ?? 0;
  }
} 