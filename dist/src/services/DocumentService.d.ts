import { BaseGenAIService } from './BaseGenAIService';
import { SummarizeFromUrlParams, SummarizeFromFileParams, SummarizeLargeFromUrlParams, SummarizeLargeFromFileParams, SummarizeMultipleParams, SummarizeResult } from '../types/types';
/**
 * Service for document summarization and analysis using Gemini API.
 */
export declare class DocumentService extends BaseGenAIService {
    /**
     * Create a new DocumentService instance.
     * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
     */
    constructor(apiKey: string);
    /**
     * Summarize a small document (under 20MB) from a remote URL using inline base64 encoding.
     * @param params { model, url, prompt?, mimeType? }
     * @returns The summary text
     */
    summarizeFromUrl(params: SummarizeFromUrlParams): Promise<SummarizeResult>;
    /**
     * Summarize a small document (under 20MB) from a local file using inline base64 encoding.
     * @param params { model, filePath, prompt?, mimeType? }
     * @returns The summary text
     */
    summarizeFromFile(params: SummarizeFromFileParams): Promise<SummarizeResult>;
    /**
     * Summarize a large document (over 20MB) from a remote URL using the File API.
     * @param params { model, url, prompt?, displayName?, mimeType? }
     * @returns The summary text
     */
    summarizeLargeFromUrl(params: SummarizeLargeFromUrlParams): Promise<SummarizeResult>;
    /**
     * Summarize a large document (over 20MB) from a local file using the File API.
     * @param params { model, filePath, prompt?, displayName?, mimeType? }
     * @returns The summary text
     */
    summarizeLargeFromFile(params: SummarizeLargeFromFileParams): Promise<SummarizeResult>;
    /**
     * Summarize or analyze multiple documents (local or remote, large or small) using the File API.
     * @param params { model, docs, prompt }
     * @returns The summary or analysis text
     */
    summarizeMultiple(params: SummarizeMultipleParams): Promise<SummarizeResult>;
}
