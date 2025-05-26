export class ResponseParser {
  static extractText(parts: unknown[]): string[] {
    return (parts as Array<{ text?: string }>).filter((p) => p.text).map((p) => p.text as string);
  }

  static extractCode(parts: unknown[]): string[] {
    return (parts as Array<{ executableCode?: { code?: string } }>)
      .filter((p) => p.executableCode?.code)
      .map((p) => p.executableCode!.code!);
  }

  static extractOutput(parts: unknown[]): string[] {
    return (parts as Array<{ codeExecutionResult?: { output?: string } }>)
      .filter((p) => p.codeExecutionResult?.output)
      .map((p) => p.codeExecutionResult!.output!);
  }

  static extractImages(parts: unknown[]): { mimeType: string; data: string }[] {
    return (parts as Array<{ inlineData?: { mimeType?: string; data?: string } }>)
      .filter((p) => p.inlineData?.mimeType?.startsWith('image/') && p.inlineData?.data)
      .map((p) => ({
        mimeType: p.inlineData!.mimeType!,
        data: p.inlineData!.data!,
      }));
  }

  static extractAudio(parts: unknown[]): { mimeType: string; data: string }[] {
    return (parts as Array<{ inlineData?: { mimeType?: string; data?: string } }>)
      .filter((p) => p.inlineData?.mimeType?.startsWith('audio/') && p.inlineData?.data)
      .map((p) => ({
        mimeType: p.inlineData!.mimeType!,
        data: p.inlineData!.data!,
      }));
  }

  static parseAll(parts: unknown[]) {
    return {
      text: this.extractText(parts),
      code: this.extractCode(parts),
      output: this.extractOutput(parts),
      images: this.extractImages(parts),
      audio: this.extractAudio(parts),
    };
  }
}
