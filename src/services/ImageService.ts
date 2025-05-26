import { BaseGenAIService } from "./BaseGenAIService";
import { ResponseParser } from "./ResponseParser";
import { GenerateImageParams, GenerateImageResult } from "./types";

export class ImageService extends BaseGenAIService {
  constructor(apiKey: string) {
    super(apiKey);
  }

  async generateImage({ model, contents, config }: GenerateImageParams): Promise<GenerateImageResult[]> {
    const finalConfig = { ...config, responseModalities: ["TEXT", "IMAGE"] };
    const response = await this.genAI.models.generateContent({ model, contents, config: finalConfig });
    const extractedParts: GenerateImageResult[] = [];
    const textParts = ResponseParser.extractText(response.candidates?.[0]?.content?.parts || []);
    for (const text of textParts) {
      extractedParts.push({ type: "text", data: text });
    }
    const imageParts = ResponseParser.extractImages(response.candidates?.[0]?.content?.parts || []);
    for (const img of imageParts) {
      extractedParts.push({ type: "image", data: img.data });
    }
    return extractedParts;
  }
} 