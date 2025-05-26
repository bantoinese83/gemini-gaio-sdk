import { BaseGenAIService } from './BaseGenAIService';
import { ExecuteCodeParams, ExecuteCodeResult } from '../types/types';
import type { Content } from '@google/genai';
/**
 * Service for enabling code execution via Gemini API (Python only).
 * Supports single-turn and chat-based code execution, file input, and output parsing.
 *
 * Supported file types: .png, .jpeg, .csv, .xml, .cpp, .java, .py, .js, .ts
 * Only matplotlib is supported for graph rendering.
 * The model can only generate and execute code, not return other artifacts like media files.
 */
export declare class CodeExecutionService extends BaseGenAIService {
    constructor(apiKey: string);
    /**
     * Run a single-turn code execution prompt (Python only).
     * @param model Gemini model (e.g., 'gemini-2.0-flash').
     * @param prompt Prompt string or content array.
     * @param config Additional config (optional).
     * @returns Array of parts: text, executableCode, codeExecutionResult, inlineData, etc.
     */
    executeCode({ model, prompt, config }: ExecuteCodeParams): Promise<ExecuteCodeResult>;
    /**
     * Run a code execution chat (Python only).
     * @param model Gemini model (e.g., 'gemini-2.0-flash').
     * @param history Chat history (array of turns: {role, parts}).
     * @param message User message to send.
     * @param config Additional config (optional).
     * @returns Array of parts: text, executableCode, codeExecutionResult, inlineData, etc.
     */
    executeCodeChat({ model, history, message, config, }: {
        model: string;
        history: Content[];
        message: string;
        config?: Record<string, unknown>;
    }): Promise<ExecuteCodeResult>;
}
export default CodeExecutionService;
