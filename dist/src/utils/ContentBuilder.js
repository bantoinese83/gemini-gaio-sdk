export class ContentBuilder {
    static buildTextPart(text) {
        return { text };
    }
    static buildInlineDataPart(data, mimeType) {
        return {
            inlineData: {
                mimeType,
                data,
            },
        };
    }
    static buildMultimodalParts(text, files) {
        const parts = [this.buildTextPart(text)];
        for (const file of files) {
            parts.push(this.buildInlineDataPart(file.data, file.mimeType));
        }
        return parts;
    }
    static buildPartsFromPromptAndFiles(prompt, files) {
        return this.buildMultimodalParts(prompt, files);
    }
}
