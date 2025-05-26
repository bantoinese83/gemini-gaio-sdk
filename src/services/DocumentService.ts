import { BaseGenAIService } from "./BaseGenAIService";
import { FileHelper } from "../utils/FileHelper";
import {
  ModelConfig,
  SummarizeFromUrlParams,
  SummarizeFromFileParams,
  SummarizeLargeFromUrlParams,
  SummarizeLargeFromFileParams,
  SummarizeMultipleParams,
  SummarizeResult
} from "../types/types";
import { Logger, GeminiApiError, FileProcessingError, ValidationError } from "../utils/Logger";

/**
 * Service for document summarization and analysis using Gemini API.
 */
export class DocumentService extends BaseGenAIService {
  /**
   * Create a new DocumentService instance.
   * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
   */
  constructor(apiKey: string) {
    super(apiKey);
  }

  /**
   * Summarize a small document (under 20MB) from a remote URL using inline base64 encoding.
   * @param params { model, url, prompt?, mimeType? }
   * @returns The summary text
   */
  async summarizeFromUrl(params: SummarizeFromUrlParams): Promise<SummarizeResult> {
    try {
      if (!params.model || !params.url) {
        Logger.error('DocumentService.summarizeFromUrl: Missing required params', { model: params.model, url: params.url });
        throw new ValidationError('model and url are required');
      }
      const resp = await fetch(params.url).then((response) => response.arrayBuffer());
      const contents = [
        { text: params.prompt || "Summarize this document" },
        {
          inlineData: {
            mimeType: params.mimeType || 'application/pdf',
            data: Buffer.from(resp).toString("base64"),
          },
        },
      ];
      const response = await this.genAI.models.generateContent({ model: params.model, contents });
      return response.text ?? '';
    } catch (err) {
      Logger.error('DocumentService.summarizeFromUrl error', err);
      throw new GeminiApiError('Failed to summarize document from URL', err);
    }
  }

  /**
   * Summarize a small document (under 20MB) from a local file using inline base64 encoding.
   * @param params { model, filePath, prompt?, mimeType? }
   * @returns The summary text
   */
  async summarizeFromFile(params: SummarizeFromFileParams): Promise<SummarizeResult> {
    try {
      if (!params.model || !params.filePath) {
        Logger.error('DocumentService.summarizeFromFile: Missing required params', { model: params.model, filePath: params.filePath });
        throw new ValidationError('model and filePath are required');
      }
      const fs = await import('fs');
      const contents = [
        { text: params.prompt || "Summarize this document" },
        {
          inlineData: {
            mimeType: params.mimeType || 'application/pdf',
            data: Buffer.from(fs.readFileSync(params.filePath)).toString("base64"),
          },
        },
      ];
      const response = await this.genAI.models.generateContent({ model: params.model, contents });
      return response.text ?? '';
    } catch (err) {
      Logger.error('DocumentService.summarizeFromFile error', err);
      throw new GeminiApiError('Failed to summarize document from file', err);
    }
  }

  /**
   * Summarize a large document (over 20MB) from a remote URL using the File API.
   * @param params { model, url, prompt?, displayName?, mimeType? }
   * @returns The summary text
   */
  async summarizeLargeFromUrl(params: SummarizeLargeFromUrlParams): Promise<SummarizeResult> {
    try {
      if (!params.model || !params.url) {
        Logger.error('DocumentService.summarizeLargeFromUrl: Missing required params', { model: params.model, url: params.url });
        throw new ValidationError('model and url are required');
      }
      // @ts-ignore
      const { createPartFromUri } = await import('@google/genai');
      const resp = await fetch(params.url).then((response) => response.arrayBuffer());
      const fileBlob = new Blob([resp], { type: params.mimeType || 'application/pdf' });
      const file = await FileHelper.uploadFileAndWait(this.genAI, fileBlob, params.displayName || "Remote Document");
      const content: any[] = [params.prompt || "Summarize this document"];
      if (file.uri && file.mimeType) {
        content.push(createPartFromUri(file.uri ?? '', file.mimeType ?? (params.mimeType || 'application/pdf')));
      }
      const response = await this.genAI.models.generateContent({ model: params.model, contents: content });
      return response.text ?? '';
    } catch (err) {
      Logger.error('DocumentService.summarizeLargeFromUrl error', err);
      if (err instanceof FileProcessingError || err instanceof ValidationError) throw err;
      throw new GeminiApiError('Failed to summarize large document from URL', err);
    }
  }

  /**
   * Summarize a large document (over 20MB) from a local file using the File API.
   * @param params { model, filePath, prompt?, displayName?, mimeType? }
   * @returns The summary text
   */
  async summarizeLargeFromFile(params: SummarizeLargeFromFileParams): Promise<SummarizeResult> {
    try {
      if (!params.model || !params.filePath) {
        Logger.error('DocumentService.summarizeLargeFromFile: Missing required params', { model: params.model, filePath: params.filePath });
        throw new ValidationError('model and filePath are required');
      }
      // @ts-ignore
      const { createPartFromUri } = await import('@google/genai');
      const file = await FileHelper.uploadFileAndWait(this.genAI, params.filePath, params.displayName || "Local Document");
      const content: any[] = [params.prompt || "Summarize this document"];
      if (file.uri && file.mimeType) {
        content.push(createPartFromUri(file.uri ?? '', file.mimeType ?? (params.mimeType || 'application/pdf')));
      }
      const response = await this.genAI.models.generateContent({ model: params.model, contents: content });
      return response.text ?? '';
    } catch (err) {
      Logger.error('DocumentService.summarizeLargeFromFile error', err);
      if (err instanceof FileProcessingError || err instanceof ValidationError) throw err;
      throw new GeminiApiError('Failed to summarize large document from file', err);
    }
  }

  /**
   * Summarize or analyze multiple documents (local or remote, large or small) using the File API.
   * @param params { model, docs, prompt }
   * @returns The summary or analysis text
   */
  async summarizeMultiple(params: SummarizeMultipleParams): Promise<SummarizeResult> {
    try {
      if (!params.model || !params.docs || !Array.isArray(params.docs) || params.docs.length === 0) {
        Logger.error('DocumentService.summarizeMultiple: Missing or invalid params', { model: params.model, docs: params.docs });
        throw new ValidationError('model and docs (non-empty array) are required');
      }
      // @ts-ignore
      const { createPartFromUri } = await import('@google/genai');
      const content: any[] = [params.prompt || "Summarize or analyze these documents"];
      for (const doc of params.docs) {
        let fileInput = doc.file;
        let mimeType = doc.mimeType || 'application/pdf';
        if (doc.isUrl) {
          const resp = await fetch(doc.file).then((response) => response.arrayBuffer());
          fileInput = new Blob([resp], { type: mimeType });
        }
        const file = await FileHelper.uploadFileAndWait(this.genAI, fileInput, doc.displayName || doc.file);
        if (file.uri && file.mimeType) {
          content.push(createPartFromUri(file.uri ?? '', file.mimeType ?? (mimeType || 'application/pdf')));
        }
      }
      const response = await this.genAI.models.generateContent({ model: params.model, contents: content });
      return response.text ?? '';
    } catch (err) {
      Logger.error('DocumentService.summarizeMultiple error', err);
      if (err instanceof FileProcessingError || err instanceof ValidationError) throw err;
      throw new GeminiApiError('Failed to summarize multiple documents', err);
    }
  }
} 