import { BaseGenAIService } from './BaseGenAIService';
import { GenerateImageResult, ModelConfig } from '../types/types';
import type { Part } from '@google/genai';
export declare class ImageService extends BaseGenAIService {
    constructor(apiKey: string);
    generateImage({ model, contents, config, }: {
        model: string;
        contents: Part[];
        config?: ModelConfig;
    }): Promise<GenerateImageResult[]>;
}
