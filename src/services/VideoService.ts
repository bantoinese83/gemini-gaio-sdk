import { BaseGenAIService } from "./BaseGenAIService";

export class VideoService extends BaseGenAIService {
  constructor(apiKey: string) {
    super(apiKey);
  }

  async analyzeVideoFile({ model, filePath, prompt, useFileApi = false }: { model: string, filePath: string, prompt: string, useFileApi?: boolean }): Promise<string> {
    const fs = await import('fs');
    const stats = fs.statSync(filePath);
    const isSmall = stats.size < 20 * 1024 * 1024;
    if (isSmall && !useFileApi) {
      const base64Video = fs.readFileSync(filePath, { encoding: 'base64' });
      const parts: any[] = [
        {
          inlineData: {
            mimeType: 'video/mp4',
            data: base64Video,
          },
        },
        { text: prompt },
      ];
      const response = await this.genAI.models.generateContent({ model, contents: parts });
      return response.text ?? '';
    } else {
      const file = await this.genAI.files.upload({ file: filePath, config: { mimeType: 'video/mp4' } });
      // @ts-ignore
      const { createUserContent, createPartFromUri } = await import('@google/genai');
      const parts = createUserContent([
        createPartFromUri(file.uri ?? '', file.mimeType ?? 'video/mp4'),
        prompt,
      ]);
      const response = await this.genAI.models.generateContent({ model, contents: parts });
      return response.text ?? '';
    }
  }

  async analyzeYoutubeVideo({ model, youtubeUrl, prompt }: { model: string, youtubeUrl: string, prompt: string }): Promise<string> {
    // @ts-ignore
    const { createUserContent } = await import('@google/generative-ai');
    const parts = createUserContent([
      prompt,
      { fileData: { fileUri: youtubeUrl } },
    ]);
    const response = await this.genAI.models.generateContent({ model, contents: parts });
    return response.text ?? '';
  }
} 