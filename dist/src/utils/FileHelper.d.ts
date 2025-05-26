import { GoogleGenAI } from '@google/genai';
import type { File as GenAIFile } from '@google/genai';
export declare class FileHelper {
    static uploadFileAndWait(genAI: GoogleGenAI, fileInput: string | Blob, displayName: string): Promise<GenAIFile>;
}
