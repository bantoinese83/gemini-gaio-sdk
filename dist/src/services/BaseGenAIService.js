import { GoogleGenAI } from '@google/genai';
export class BaseGenAIService {
    genAI;
    constructor(apiKey) {
        if (!apiKey)
            throw new Error('GEMINI_API_KEY is required for this service.');
        this.genAI = new GoogleGenAI({ apiKey });
    }
}
