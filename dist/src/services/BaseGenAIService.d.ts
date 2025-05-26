import { GoogleGenAI } from '@google/genai';
export declare class BaseGenAIService {
    protected genAI: GoogleGenAI;
    constructor(apiKey: string);
}
