import { BaseGenAIService } from './BaseGenAIService';
import type { Part } from '@google/genai';
export declare class ThinkingService extends BaseGenAIService {
    constructor(apiKey: string);
    generateThinkingContent({ model, contents, includeThoughts, thinkingBudget, config, }: {
        model: string;
        contents: Part[];
        includeThoughts?: boolean;
        thinkingBudget?: number;
        config?: Record<string, unknown>;
    }): Promise<{
        answer: string;
        thoughts: string;
        usage?: Record<string, unknown>;
    }>;
    generateThinkingContentStream({ model, contents, includeThoughts, thinkingBudget, config, onChunk, }: {
        model: string;
        contents: Part[];
        includeThoughts?: boolean;
        thinkingBudget?: number;
        config?: Record<string, unknown>;
        onChunk: (data: {
            answer: string;
            thoughts: string;
            chunk: unknown;
        }) => void;
    }): Promise<void>;
}
