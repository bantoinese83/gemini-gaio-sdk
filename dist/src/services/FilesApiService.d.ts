/**
 * Service for file management (upload, list, delete) using Gemini API.
 */
import { BaseGenAIService } from './BaseGenAIService';
import { FileReference } from '../types/types';
import type { File as GenAIFile } from '@google/genai';
export declare class FilesApiService extends BaseGenAIService {
    /**
     * Create a new FilesApiService instance.
     * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
     */
    constructor(apiKey: string);
    /**
     * Upload a file (audio, image, video, document, etc) using the Files API.
     * @param params { file, mimeType, displayName? }
     * @returns The uploaded file object (with uri, name, mimeType, etc).
     */
    uploadFile(params: {
        file: string | Blob;
        mimeType: string;
        displayName?: string;
    }): Promise<GenAIFile>;
    /**
     * Get metadata for a file by name.
     * @param name The file name (from upload).
     * @returns The file metadata object.
     */
    getFile(name: string): Promise<FileReference>;
    /**
     * List uploaded files (paginated).
     * @param pageSize Number of results per page (default: 10).
     * @returns Array of file metadata objects.
     */
    listFiles(pageSize?: number): Promise<FileReference[]>;
    /**
     * Delete a file by name.
     * @param name The file name (from upload).
     */
    deleteFile(name: string): Promise<void>;
}
