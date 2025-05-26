import type { Part } from '@google/genai';
export declare class ContentBuilder {
    static buildTextPart(text: string): {
        text: string;
    };
    static buildInlineDataPart(data: string, mimeType: string): {
        inlineData: {
            mimeType: string;
            data: string;
        };
    };
    static buildMultimodalParts(text: string, files: Array<{
        data: string;
        mimeType: string;
    }>): Part[];
    static buildPartsFromPromptAndFiles(prompt: string, files: Array<{
        data: string;
        mimeType: string;
    }>): Part[];
}
