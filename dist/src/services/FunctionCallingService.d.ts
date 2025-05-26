/**
 * Service for function calling (OpenAPI schema, parallel) using Gemini API.
 */
import { BaseGenAIService } from './BaseGenAIService';
import { Type, Part, GenerateContentResponse } from '@google/genai';
import { ModelConfig } from '../types/types';
export interface FunctionDeclaration {
    name: string;
    description: string;
    parameters: object;
}
export interface CallWithFunctionsParams {
    model: string;
    contents: Part[];
    functionDeclarations: FunctionDeclaration[];
    config?: ModelConfig;
}
export interface CallWithParallelFunctionsParams {
    model: string;
    contents: Part[];
    functionDeclarations: FunctionDeclaration[];
    config?: ModelConfig;
}
export declare class FunctionCallingService extends BaseGenAIService {
    static Type: typeof Type;
    /**
     * Create a new FunctionCallingService instance.
     * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
     */
    constructor(apiKey: string);
    /**
     * Send a prompt with function declarations and return the model response (including functionCalls if present).
     * @param params { model, contents, functionDeclarations, config? }
     * @returns The model response (including functionCalls if present).
     */
    callWithFunctions(params: CallWithFunctionsParams): Promise<GenerateContentResponse>;
    /**
     * Helper to create a function declaration (OpenAPI subset schema).
     * @param params { name, description, parameters }
     * @returns Function declaration object.
     */
    static createFunctionDeclaration(params: FunctionDeclaration): FunctionDeclaration;
    /**
     * Extract function calls from a model response.
     * @param response The model response.
     * @returns Array of function call objects (name, args), or empty array.
     */
    static getFunctionCalls(response: Record<string, unknown>): Array<{
        name: string;
        args: unknown;
    }>;
    /**
     * Send a prompt with parallel function declarations (for parallel function calling).
     * @param params { model, contents, functionDeclarations, config? }
     * @returns The model response (including functionCalls if present).
     */
    callWithParallelFunctions(params: CallWithParallelFunctionsParams): Promise<GenerateContentResponse>;
}
