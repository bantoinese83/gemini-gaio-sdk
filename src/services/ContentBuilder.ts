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

  static buildMultimodalParts(text: string, files: Array<{ data: string, mimeType: string }>): any[] {
    const parts: any[] = [this.buildTextPart(text)];
    for (const file of files) {
      parts.push(this.buildInlineDataPart(file.data, file.mimeType));
    }
    return parts;
  }

  static buildPartsFromPromptAndFiles(prompt: string, files: Array<{ data: string, mimeType: string }>): any[] {
    return this.buildMultimodalParts(prompt, files);
  }
} 