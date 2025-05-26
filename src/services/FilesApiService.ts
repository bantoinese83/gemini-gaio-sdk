/**
 * Service for file management (upload, list, delete) using Gemini API.
 */
import { BaseGenAIService } from './BaseGenAIService';
import { Logger, GeminiApiError, FileProcessingError, ValidationError } from '../utils/Logger';
import { FileReference } from '../types/types';
import type { File as GenAIFile } from '@google/genai';

export class FilesApiService extends BaseGenAIService {
  /**
   * Create a new FilesApiService instance.
   * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
   */
  constructor(apiKey: string) {
    super(apiKey);
  }

  /**
   * Upload a file (audio, image, video, document, etc) using the Files API.
   * @param params { file, mimeType, displayName? }
   * @returns The uploaded file object (with uri, name, mimeType, etc).
   */
  async uploadFile(params: {
    file: string | Blob;
    mimeType: string;
    displayName?: string;
  }): Promise<GenAIFile> {
    const { file, mimeType, displayName } = params;
    if (typeof file !== 'string' && !(file instanceof Blob)) {
      throw new ValidationError('file must be a string (path/uri) or Blob');
    }
    try {
      if (!file || !mimeType) {
        Logger.error('FilesApiService.uploadFile: Missing required params', { file, mimeType });
        throw new ValidationError('file and mimeType are required');
      }
      return await this.genAI.files.upload({
        file,
        config: { mimeType, ...(displayName ? { displayName } : {}) },
      });
    } catch (err) {
      Logger.error('FilesApiService.uploadFile error', err);
      throw new FileProcessingError('Failed to upload file', err);
    }
  }

  /**
   * Get metadata for a file by name.
   * @param name The file name (from upload).
   * @returns The file metadata object.
   */
  async getFile(name: string): Promise<FileReference> {
    try {
      if (!name) {
        Logger.error('FilesApiService.getFile: Missing required param name', { name });
        throw new ValidationError('name is required');
      }
      return await this.genAI.files.get({ name });
    } catch (err) {
      Logger.error('FilesApiService.getFile error', err);
      throw new GeminiApiError('Failed to get file metadata', err);
    }
  }

  /**
   * List uploaded files (paginated).
   * @param pageSize Number of results per page (default: 10).
   * @returns Array of file metadata objects.
   */
  async listFiles(pageSize = 10): Promise<FileReference[]> {
    try {
      const pager = await this.genAI.files.list({ config: { pageSize } });
      let page = pager.page;
      const results: FileReference[] = [];
      do {
        for (const f of page) results.push(f);
        if (pager.hasNextPage()) {
          page = await pager.nextPage();
        }
      } while (pager.hasNextPage());
      return results;
    } catch (err) {
      Logger.error('FilesApiService.listFiles error', err);
      throw new GeminiApiError('Failed to list files', err);
    }
  }

  /**
   * Delete a file by name.
   * @param name The file name (from upload).
   */
  async deleteFile(name: string): Promise<void> {
    try {
      if (!name) {
        Logger.error('FilesApiService.deleteFile: Missing required param name', { name });
        throw new ValidationError('name is required');
      }
      await this.genAI.files.delete({ name });
    } catch (err) {
      Logger.error('FilesApiService.deleteFile error', err);
      throw new GeminiApiError('Failed to delete file', err);
    }
  }
}
