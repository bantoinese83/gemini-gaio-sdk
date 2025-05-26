import { BaseGenAIService } from './BaseGenAIService';
import { Logger, GeminiApiError, ValidationError } from '../utils/Logger';
export class ThinkingService extends BaseGenAIService {
    constructor(apiKey) {
        super(apiKey);
    }
    async generateThinkingContent({ model, contents, includeThoughts = false, thinkingBudget, config = {}, }) {
        try {
            if (!model || !contents) {
                Logger.error('ThinkingService.generateThinkingContent: Missing required params', {
                    model,
                    contents,
                });
                throw new ValidationError('model and contents are required');
            }
            const thinkingConfig = {};
            if (includeThoughts)
                thinkingConfig.includeThoughts = true;
            if (typeof thinkingBudget === 'number')
                thinkingConfig.thinkingBudget = thinkingBudget;
            const response = await this.genAI.models.generateContent({
                model,
                contents,
                config: { ...config, thinkingConfig },
            });
            let answer = '', thoughts = '';
            if (response.candidates && response.candidates[0]?.content?.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (!part.text)
                        continue;
                    if (part.thought)
                        thoughts += part.text;
                    else
                        answer += part.text;
                }
            }
            let usage = undefined;
            if (response.usageMetadata && typeof response.usageMetadata === 'object') {
                usage = response.usageMetadata;
            }
            return { answer, thoughts, usage };
        }
        catch (err) {
            Logger.error('ThinkingService.generateThinkingContent error', err);
            throw new GeminiApiError('Failed to generate thinking content', err);
        }
    }
    async generateThinkingContentStream({ model, contents, includeThoughts = false, thinkingBudget, config = {}, onChunk, }) {
        try {
            if (!model || !contents || !onChunk) {
                Logger.error('ThinkingService.generateThinkingContentStream: Missing required params', {
                    model,
                    contents,
                    onChunk,
                });
                throw new ValidationError('model, contents, and onChunk are required');
            }
            const thinkingConfig = {};
            if (includeThoughts)
                thinkingConfig.includeThoughts = true;
            if (typeof thinkingBudget === 'number')
                thinkingConfig.thinkingBudget = thinkingBudget;
            const response = await this.genAI.models.generateContentStream({
                model,
                contents,
                config: { ...config, thinkingConfig },
            });
            let answer = '', thoughts = '';
            for await (const chunk of response) {
                if (chunk.candidates && chunk.candidates[0]?.content?.parts) {
                    for (const part of chunk.candidates[0].content.parts) {
                        if (!part.text)
                            continue;
                        if (part.thought)
                            thoughts += part.text;
                        else
                            answer += part.text;
                    }
                }
                onChunk({ answer, thoughts, chunk });
            }
        }
        catch (err) {
            Logger.error('ThinkingService.generateThinkingContentStream error', err);
            throw new GeminiApiError('Failed to generate thinking content stream', err);
        }
    }
}
