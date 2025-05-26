export class ResponseParser {
    static extractText(parts) {
        return parts.filter((p) => p.text).map((p) => p.text);
    }
    static extractCode(parts) {
        return parts
            .filter((p) => p.executableCode?.code)
            .map((p) => p.executableCode.code);
    }
    static extractOutput(parts) {
        return parts
            .filter((p) => p.codeExecutionResult?.output)
            .map((p) => p.codeExecutionResult.output);
    }
    static extractImages(parts) {
        return parts
            .filter((p) => p.inlineData?.mimeType?.startsWith('image/') && p.inlineData?.data)
            .map((p) => ({
            mimeType: p.inlineData.mimeType,
            data: p.inlineData.data,
        }));
    }
    static extractAudio(parts) {
        return parts
            .filter((p) => p.inlineData?.mimeType?.startsWith('audio/') && p.inlineData?.data)
            .map((p) => ({
            mimeType: p.inlineData.mimeType,
            data: p.inlineData.data,
        }));
    }
    static parseAll(parts) {
        return {
            text: this.extractText(parts),
            code: this.extractCode(parts),
            output: this.extractOutput(parts),
            images: this.extractImages(parts),
            audio: this.extractAudio(parts),
        };
    }
}
