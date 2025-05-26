import { BaseGenAIService } from "./BaseGenAIService";
import { FileHelper } from "./FileHelper";
import {
  SummarizeFromUrlParams,
  SummarizeFromFileParams,
  SummarizeLargeFromUrlParams,
  SummarizeLargeFromFileParams,
  SummarizeMultipleParams,
  SummarizeResult
} from "./types";

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
  async summarizeFromUrl({ model, url, prompt = "Summarize this document", mimeType = 'application/pdf' }: SummarizeFromUrlParams): Promise<SummarizeResult> {
    const resp = await fetch(url).then((response) => response.arrayBuffer());
    const contents = [
      { text: prompt },
      {
        inlineData: {
          mimeType,
          data: Buffer.from(resp).toString("base64"),
        },
      },
    ];
    const response = await this.genAI.models.generateContent({ model, contents });
    return response.text ?? '';
  }

  /**
   * Summarize a small document (under 20MB) from a local file using inline base64 encoding.
   * @param params { model, filePath, prompt?, mimeType? }
   * @returns The summary text
   */
  async summarizeFromFile({ model, filePath, prompt = "Summarize this document", mimeType = 'application/pdf' }: SummarizeFromFileParams): Promise<SummarizeResult> {
    const fs = await import('fs');
    const contents = [
      { text: prompt },
      {
        inlineData: {
          mimeType,
          data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
        },
      },
    ];
    const response = await this.genAI.models.generateContent({ model, contents });
    return response.text ?? '';
  }

  /**
   * Summarize a large document (over 20MB) from a remote URL using the File API.
   * @param params { model, url, prompt?, displayName?, mimeType? }
   * @returns The summary text
   */
  async summarizeLargeFromUrl({ model, url, prompt = "Summarize this document", displayName = "Remote Document", mimeType = 'application/pdf' }: SummarizeLargeFromUrlParams): Promise<SummarizeResult> {
    // @ts-ignore
    const { createPartFromUri } = await import('@google/genai');
    const resp = await fetch(url).then((response) => response.arrayBuffer());
    const fileBlob = new Blob([resp], { type: mimeType });
    const file = await FileHelper.uploadFileAndWait(this.genAI, fileBlob, displayName);
    const content: any[] = [prompt];
    if (file.uri && file.mimeType) {
      content.push(createPartFromUri(file.uri ?? '', file.mimeType ?? mimeType));
    }
    const response = await this.genAI.models.generateContent({ model, contents: content });
    return response.text ?? '';
  }

  /**
   * Summarize a large document (over 20MB) from a local file using the File API.
   * @param params { model, filePath, prompt?, displayName?, mimeType? }
   * @returns The summary text
   */
  async summarizeLargeFromFile({ model, filePath, prompt = "Summarize this document", displayName = "Local Document", mimeType = 'application/pdf' }: SummarizeLargeFromFileParams): Promise<SummarizeResult> {
    // @ts-ignore
    const { createPartFromUri } = await import('@google/genai');
    const file = await FileHelper.uploadFileAndWait(this.genAI, filePath, displayName);
    const content: any[] = [prompt];
    if (file.uri && file.mimeType) {
      content.push(createPartFromUri(file.uri ?? '', file.mimeType ?? mimeType));
    }
    const response = await this.genAI.models.generateContent({ model, contents: content });
    return response.text ?? '';
  }

  /**
   * Summarize or analyze multiple documents (local or remote, large or small) using the File API.
   * @param params { model, docs, prompt }
   * @returns The summary or analysis text
   */
  async summarizeMultiple({ model, docs, prompt }: SummarizeMultipleParams): Promise<SummarizeResult> {
    // @ts-ignore
    const { createPartFromUri } = await import('@google/genai');
    const content: any[] = [prompt];
    for (const doc of docs) {
      let fileInput = doc.file;
      let mimeType = doc.mimeType || 'application/pdf';
      if (doc.isUrl) {
        const resp = await fetch(doc.file).then((response) => response.arrayBuffer());
        fileInput = new Blob([resp], { type: mimeType });
      }
      const file = await FileHelper.uploadFileAndWait(this.genAI, fileInput, doc.displayName);
      if (file.uri && file.mimeType) {
        content.push(createPartFromUri(file.uri ?? '', file.mimeType ?? mimeType));
      }
    }
    const response = await this.genAI.models.generateContent({ model, contents: content });
    return response.text ?? '';
  }
} 