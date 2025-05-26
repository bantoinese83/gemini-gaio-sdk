import type { Part, Content, GenerateContentConfig, Schema } from '@google/genai';
export interface GeminiTextPart {
    text: string;
}
export interface GeminiInlineDataPart {
    inlineData: {
        mimeType: string;
        data: string;
    };
}
export interface GeminiExecutableCodePart {
    executableCode: {
        code: string;
        language?: string;
    };
}
export interface GeminiCodeExecutionResultPart {
    codeExecutionResult: {
        output: string;
        error?: string;
    };
}
export type GeminiResponsePart = GeminiTextPart | GeminiInlineDataPart | GeminiExecutableCodePart | GeminiCodeExecutionResultPart;
export interface GenerateSingleSpeakerSpeechParams {
    model: string;
    text: string;
    voiceName: string;
}
export type GenerateSingleSpeakerSpeechResult = Buffer;
export interface AnalyzeAudioFileParams {
    model: string;
    filePath: string;
    prompt: string;
    useFileApi?: boolean;
}
export interface ExecuteCodeParams {
    model: string;
    prompt: string | Part[];
    config?: Record<string, unknown>;
}
export interface ExecuteCodeResult {
    text: string[];
    code: string[];
    output: string[];
    images: {
        mimeType: string;
        data: string;
    }[];
}
export interface GenerateImageParams {
    model: string;
    contents: Part[];
    config?: Record<string, unknown>;
}
export interface GenerateImageResult {
    type: 'text' | 'image';
    data: string;
}
export interface GenerateTextParams {
    model: string;
    contents: string | Part[] | Content[];
    config?: Record<string, unknown>;
}
export type GenerateTextResult = unknown;
export interface SummarizeFromUrlParams {
    model: string;
    url: string;
    prompt?: string;
    mimeType?: string;
}
export interface SummarizeFromFileParams {
    model: string;
    filePath: string;
    prompt?: string;
    mimeType?: string;
}
export interface SummarizeLargeFromUrlParams {
    model: string;
    url: string;
    prompt?: string;
    displayName?: string;
    mimeType?: string;
}
export interface SummarizeLargeFromFileParams {
    model: string;
    filePath: string;
    prompt?: string;
    displayName?: string;
    mimeType?: string;
}
export interface SummarizeMultipleParams {
    model: string;
    docs: Array<{
        file: unknown;
        displayName: string;
        isUrl?: boolean;
        mimeType?: string;
    }>;
    prompt: string;
}
export type SummarizeResult = string;
export type ModelName = string;
export type ContentPart = string | GeminiTextPart | GeminiInlineDataPart | GeminiExecutableCodePart | GeminiCodeExecutionResultPart | {
    [key: string]: unknown;
};
export type ContentArray = ContentPart[];
export interface ModelConfig {
    [key: string]: unknown;
}
export interface FileReference {
    uri?: string;
    mimeType?: string;
}
export interface ApiResponse<T = unknown> {
    text?: string;
    candidates?: T[];
    [key: string]: unknown;
}
export interface StreamingCallbacks {
    onopen?: () => void;
    onmessage?: (message: unknown) => void;
    onerror?: (e: unknown) => void;
    onclose?: (e: unknown) => void;
}
export interface LiveSession {
    sendClientContent: (args: unknown) => Promise<void>;
    sendRealtimeInput: (args: unknown) => Promise<void>;
    close: () => Promise<void>;
}
export interface StructuredOutputConfig extends GenerateContentConfig {
    responseMimeType: 'application/json' | 'text/x.enum';
    responseSchema: Schema;
    [key: string]: unknown;
}
