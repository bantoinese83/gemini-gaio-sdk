/**
 * Service for function calling (OpenAPI schema, parallel) using Gemini API.
 */
import { BaseGenAIService } from "./BaseGenAIService";
import { Type } from "@google/genai";

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
  async callWithFunctions({
    model,
    contents,
    functionDeclarations,
    config = {},
  }: {
    model: string,
    contents: string | any[],
    functionDeclarations: any[],
    config?: any,
  }): Promise<any> {
    return await this.genAI.models.generateContent({
      model,
      contents,
      config: {
        ...config,
        tools: [{ functionDeclarations }],
      },
    });
  }

  /**
   * Helper to create a function declaration (OpenAPI subset schema).
   * @param params { name, description, parameters }
   * @returns Function declaration object.
   */
  static createFunctionDeclaration({ name, description, parameters }: { name: string, description: string, parameters: any }) {
    return { name, description, parameters };
  }

  /**
   * Extract function calls from a model response.
   * @param response The model response.
   * @returns Array of function call objects (name, args), or empty array.
   */
  static getFunctionCalls(response: any): Array<{ name: string, args: any }> {
    return response.functionCalls || [];
  }

  /**
   * Send a prompt with parallel function declarations (for parallel function calling).
   * @param params { model, contents, functionDeclarations, config? }
   * @returns The model response (including functionCalls if present).
   */
  async callWithParallelFunctions({
    model,
    contents,
    functionDeclarations,
    config = {},
  }: {
    model: string,
    contents: string | any[],
    functionDeclarations: any[],
    config?: any,
  }): Promise<any> {
    return await this.genAI.models.generateContent({
      model,
      contents,
      config: {
        ...config,
        tools: [{ functionDeclarations }],
        toolConfig: {
          functionCallingConfig: { mode: 'any' },
        },
      },
    });
  }
} 