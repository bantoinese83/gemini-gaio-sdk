/**
 * Service for file management (upload, list, delete) using Gemini API.
 */
import { BaseGenAIService } from "./BaseGenAIService";

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
  async uploadFile({ file, mimeType, displayName }: { file: any, mimeType: string, displayName?: string }): Promise<any> {
    return await this.genAI.files.upload({
      file,
      config: { mimeType, ...(displayName ? { displayName } : {}) },
    });
  }

  /**
   * Get metadata for a file by name.
   * @param name The file name (from upload).
   * @returns The file metadata object.
   */
  async getFile(name: string): Promise<any> {
    return await this.genAI.files.get({ name });
  }

  /**
   * List uploaded files (paginated).
   * @param pageSize Number of results per page (default: 10).
   * @returns Array of file metadata objects.
   */
  async listFiles(pageSize = 10): Promise<any[]> {
    const pager = await this.genAI.files.list({ config: { pageSize } });
    let page = pager.page;
    const results: any[] = [];
    while (true) {
      for (const f of page) results.push(f);
      if (!pager.hasNextPage()) break;
      page = await pager.nextPage();
    }
    return results;
  }

  /**
   * Delete a file by name.
   * @param name The file name (from upload).
   */
  async deleteFile(name: string): Promise<void> {
    await this.genAI.files.delete({ name });
  }
} 