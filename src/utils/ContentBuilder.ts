import type { Part } from '@google/genai';

export class ContentBuilder {
  static buildTextPart(text: string) {
    return { text };
  }

  static buildInlineDataPart(data: string, mimeType: string) {
    return {
      inlineData: {
        mimeType,
        data,
      },
    };
  }

  static buildMultimodalParts(
    text: string,
    files: Array<{ data: string; mimeType: string }>,
  ): Part[] {
    const parts: Part[] = [this.buildTextPart(text) as Part];
    for (const file of files) {
      parts.push(this.buildInlineDataPart(file.data, file.mimeType) as Part);
    }
    return parts;
  }

  static buildPartsFromPromptAndFiles(
    prompt: string,
    files: Array<{ data: string; mimeType: string }>,
  ): Part[] {
    return this.buildMultimodalParts(prompt, files);
  }
}
