import { BaseGenAIService } from "./BaseGenAIService";

export class ThinkingService extends BaseGenAIService {
  constructor(apiKey: string) {
    super(apiKey);
  }

  async generateThinkingContent({
    model,
    contents,
    includeThoughts = false,
    thinkingBudget,
    config = {},
  }: {
    model: string,
    contents: string | any[],
    includeThoughts?: boolean,
    thinkingBudget?: number,
    config?: any,
  }): Promise<{ answer: string, thoughts: string, usage?: any }> {
    const thinkingConfig: any = { };
    if (includeThoughts) thinkingConfig.includeThoughts = true;
    if (typeof thinkingBudget === 'number') thinkingConfig.thinkingBudget = thinkingBudget;
    const response = await this.genAI.models.generateContent({
      model,
      contents,
      config: { ...config, thinkingConfig },
    });
    let answer = '', thoughts = '';
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (!part.text) continue;
        if (part.thought) thoughts += part.text; else answer += part.text;
      }
    }
    return { answer, thoughts, usage: response.usageMetadata };
  }

  async generateThinkingContentStream({
    model,
    contents,
    includeThoughts = false,
    thinkingBudget,
    config = {},
    onChunk,
  }: {
    model: string,
    contents: string | any[],
    includeThoughts?: boolean,
    thinkingBudget?: number,
    config?: any,
    onChunk: (data: { answer: string, thoughts: string, chunk: any }) => void,
  }) {
    const thinkingConfig: any = { };
    if (includeThoughts) thinkingConfig.includeThoughts = true;
    if (typeof thinkingBudget === 'number') thinkingConfig.thinkingBudget = thinkingBudget;
    const response = await this.genAI.models.generateContentStream({
      model,
      contents,
      config: { ...config, thinkingConfig },
    });
    let answer = '', thoughts = '';
    for await (const chunk of response) {
      if (chunk.candidates && chunk.candidates[0]?.content?.parts) {
        for (const part of chunk.candidates[0].content.parts) {
          if (!part.text) continue;
          if (part.thought) thoughts += part.text; else answer += part.text;
        }
      }
      onChunk({ answer, thoughts, chunk });
    }
  }
} 