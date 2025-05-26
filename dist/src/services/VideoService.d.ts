import { BaseGenAIService } from './BaseGenAIService';
export interface AnalyzeVideoFileParams {
    model: string;
    filePath: string;
    prompt: string;
    useFileApi?: boolean;
}
export interface AnalyzeYoutubeVideoParams {
    model: string;
    youtubeUrl: string;
    prompt: string;
}
export declare class VideoService extends BaseGenAIService {
    constructor(apiKey: string);
    analyzeVideoFile(params: AnalyzeVideoFileParams): Promise<string>;
    analyzeYoutubeVideo(params: AnalyzeYoutubeVideoParams): Promise<string>;
}
