export declare class ResponseParser {
    static extractText(parts: unknown[]): string[];
    static extractCode(parts: unknown[]): string[];
    static extractOutput(parts: unknown[]): string[];
    static extractImages(parts: unknown[]): {
        mimeType: string;
        data: string;
    }[];
    static extractAudio(parts: unknown[]): {
        mimeType: string;
        data: string;
    }[];
    static parseAll(parts: unknown[]): {
        text: string[];
        code: string[];
        output: string[];
        images: {
            mimeType: string;
            data: string;
        }[];
        audio: {
            mimeType: string;
            data: string;
        }[];
    };
}
