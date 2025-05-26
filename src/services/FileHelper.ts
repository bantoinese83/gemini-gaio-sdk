import { GoogleGenAI } from "@google/genai";

export class FileHelper {
  static async uploadFileAndWait(genAI: GoogleGenAI, fileInput: any, displayName: string): Promise<any> {
    const file = await genAI.files.upload({ file: fileInput, config: { displayName } });
    let getFile = await genAI.files.get({ name: file.name ?? '' });
    while (getFile.state === 'PROCESSING') {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      getFile = await genAI.files.get({ name: file.name ?? '' });
    }
    if (getFile.state === 'FAILED') {
      throw new Error('File processing failed.');
    }
    return getFile;
  }
} 