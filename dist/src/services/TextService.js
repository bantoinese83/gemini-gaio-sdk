import { BaseGenAIService } from './BaseGenAIService';
import { Logger, GeminiApiError, ValidationError } from '../utils/Logger';
/**
 * Service for text generation and chat using Gemini API.
 */
export class TextService extends BaseGenAIService {
    /**
     * Create a new TextService instance.
     * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
     */
    constructor(apiKey) {
        super(apiKey);
    }
    /**
     * Generate text from a prompt or content array.
     * @param params { model, contents, config }
     * @returns The Gemini API response (raw)
     */
    async generateText({ model, contents, config }) {
        try {
            if (!model || !contents) {
                Logger.error('TextService.generateText: Missing required params', { model, contents });
                throw new ValidationError('model and contents are required');
            }
            return await this.genAI.models.generateContent({ model, contents, config });
        }
        catch (err) {
            Logger.error('TextService.generateText error', err);
            throw new GeminiApiError('Failed to generate text', err);
        }
    }
    /**
     * Generate text as a stream from a prompt or content array.
     * @param params { model, contents, config }
     * @returns The Gemini API response stream (raw)
     */
    async generateTextStream({ model, contents, config, }) {
        try {
            if (!model || !contents) {
                Logger.error('TextService.generateTextStream: Missing required params', {
                    model,
                    contents,
                });
                throw new ValidationError('model and contents are required');
            }
            return await this.genAI.models.generateContentStream({ model, contents, config });
        }
        catch (err) {
            Logger.error('TextService.generateTextStream error', err);
            throw new GeminiApiError('Failed to generate text stream', err);
        }
    }
    /**
     * Create a chat session for multi-turn conversation.
     * @param model Gemini model name
     * @param history Optional chat history
     * @returns The chat session object
     */
    createChat(model, history) {
        try {
            if (!model) {
                Logger.error('TextService.createChat: Missing required param model', { model });
                throw new ValidationError('model is required');
            }
            return this.genAI.chats.create({ model, history });
        }
        catch (err) {
            Logger.error('TextService.createChat error', err);
            throw new GeminiApiError('Failed to create chat session', err);
        }
    }
}
