/**
 * Service for function calling (OpenAPI schema, parallel) using Gemini API.
 */
import { BaseGenAIService } from './BaseGenAIService';
import { Type, FunctionCallingConfigMode, Part, GenerateContentResponse } from '@google/genai';
import { Logger, GeminiApiError, ValidationError } from '../utils/Logger';
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

export class FunctionCallingService extends BaseGenAIService {
  static Type = Type;

  /**
   * Create a new FunctionCallingService instance.
   * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
   */
  constructor(apiKey: string) {
    super(apiKey);
  }

  /**
   * Send a prompt with function declarations and return the model response (including functionCalls if present).
   * @param params { model, contents, functionDeclarations, config? }
   * @returns The model response (including functionCalls if present).
   */
  async callWithFunctions(params: CallWithFunctionsParams): Promise<GenerateContentResponse> {
    try {
      if (!params.model || !params.contents || !params.functionDeclarations) {
        Logger.error('FunctionCallingService.callWithFunctions: Missing required params', {
          model: params.model,
          contents: params.contents,
          functionDeclarations: params.functionDeclarations,
        });
        throw new ValidationError('model, contents, and functionDeclarations are required');
      }
      return await this.genAI.models.generateContent({
        model: params.model,
        contents: params.contents,
        config: {
          ...params.config,
          tools: [{ functionDeclarations: params.functionDeclarations }],
        },
      });
    } catch (err) {
      Logger.error('FunctionCallingService.callWithFunctions error', err);
      throw new GeminiApiError('Failed to call with functions', err);
    }
  }

  /**
   * Helper to create a function declaration (OpenAPI subset schema).
   * @param params { name, description, parameters }
   * @returns Function declaration object.
   */
  static createFunctionDeclaration(params: FunctionDeclaration): FunctionDeclaration {
    return { name: params.name, description: params.description, parameters: params.parameters };
  }

  /**
   * Extract function calls from a model response.
   * @param response The model response.
   * @returns Array of function call objects (name, args), or empty array.
   */
  static getFunctionCalls(
    response: Record<string, unknown>,
  ): Array<{ name: string; args: unknown }> {
    return (response.functionCalls as Array<{ name: string; args: unknown }>) || [];
  }

  /**
   * Send a prompt with parallel function declarations (for parallel function calling).
   * @param params { model, contents, functionDeclarations, config? }
   * @returns The model response (including functionCalls if present).
   */
  async callWithParallelFunctions(
    params: CallWithParallelFunctionsParams,
  ): Promise<GenerateContentResponse> {
    try {
      if (!params.model || !params.contents || !params.functionDeclarations) {
        Logger.error('FunctionCallingService.callWithParallelFunctions: Missing required params', {
          model: params.model,
          contents: params.contents,
          functionDeclarations: params.functionDeclarations,
        });
        throw new ValidationError('model, contents, and functionDeclarations are required');
      }
      return await this.genAI.models.generateContent({
        model: params.model,
        contents: params.contents,
        config: {
          ...params.config,
          tools: [{ functionDeclarations: params.functionDeclarations }],
          toolConfig: {
            functionCallingConfig: { mode: FunctionCallingConfigMode.ANY },
          },
        },
      });
    } catch (err) {
      Logger.error('FunctionCallingService.callWithParallelFunctions error', err);
      throw new GeminiApiError('Failed to call with parallel functions', err);
    }
  }
}
