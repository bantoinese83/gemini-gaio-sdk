export class ResponseParser {
  static extractText(parts: any[]): string[] {
    return parts.filter((p) => p.text).map((p) => p.text);
  }

  static extractCode(parts: any[]): string[] {
    return parts.filter((p) => p.executableCode?.code).map((p) => p.executableCode.code);
  }

  static extractOutput(parts: any[]): string[] {
    return parts.filter((p) => p.codeExecutionResult?.output).map((p) => p.codeExecutionResult.output);
  }

  static extractImages(parts: any[]): { mimeType: string, data: string }[] {
    return parts.filter((p) => p.inlineData?.mimeType?.startsWith('image/')).map((p) => ({
      mimeType: p.inlineData.mimeType,
      data: p.inlineData.data,
    }));
  }

  static extractAudio(parts: any[]): { mimeType: string, data: string }[] {
    return parts.filter((p) => p.inlineData?.mimeType?.startsWith('audio/')).map((p) => ({
      mimeType: p.inlineData.mimeType,
      data: p.inlineData.data,
    }));
  }

  static parseAll(parts: any[]) {
    return {
      text: this.extractText(parts),
      code: this.extractCode(parts),
      output: this.extractOutput(parts),
      images: this.extractImages(parts),
      audio: this.extractAudio(parts),
    };
  }
} 