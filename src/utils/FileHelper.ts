import { GoogleGenAI } from '@google/genai';
import { Logger, FileProcessingError } from './Logger';
import type { File as GenAIFile } from '@google/genai';

export class FileHelper {
  static async uploadFileAndWait(
    genAI: GoogleGenAI,
    fileInput: string | Blob,
    displayName: string,
  ): Promise<GenAIFile> {
    try {
      const file = await genAI.files.upload({ file: fileInput, config: { displayName } });
      let getFile = await genAI.files.get({ name: file.name ?? '' });
      while (getFile.state === 'PROCESSING') {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        getFile = await genAI.files.get({ name: file.name ?? '' });
      }
      if (getFile.state === 'FAILED') {
        Logger.error('File processing failed', { fileInput, displayName, getFile });
        throw new FileProcessingError('File processing failed.', getFile);
      }
      return getFile;
    } catch (err) {
      Logger.error('FileHelper.uploadFileAndWait error', err);
      throw new FileProcessingError('File upload or processing failed.', err);
    }
  }
}
