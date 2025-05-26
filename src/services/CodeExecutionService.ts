import { BaseGenAIService } from "./BaseGenAIService";
import { ResponseParser } from "./ResponseParser";
import { ExecuteCodeParams, ExecuteCodeResult } from "./types";

/**
 * Service for enabling code execution via Gemini API (Python only).
 * Supports single-turn and chat-based code execution, file input, and output parsing.
 *
 * Supported file types: .png, .jpeg, .csv, .xml, .cpp, .java, .py, .js, .ts
 * Only matplotlib is supported for graph rendering.
 * The model can only generate and execute code, not return other artifacts like media files.
 */
export class CodeExecutionService extends BaseGenAIService {
  constructor(apiKey: string) {
    super(apiKey);
  }

  /**
   * Run a single-turn code execution prompt (Python only).
   * @param model Gemini model (e.g., 'gemini-2.0-flash').
   * @param prompt Prompt string or content array.
   * @param config Additional config (optional).
   * @returns Array of parts: text, executableCode, codeExecutionResult, inlineData, etc.
   */
  async executeCode({
    model,
    prompt,
    config = {},
  }: ExecuteCodeParams): Promise<ExecuteCodeResult> {
    const contents = Array.isArray(prompt) ? prompt : [prompt];
    const response = await this.genAI.models.generateContent({
      model,
      contents,
      config: { ...config, tools: [{ codeExecution: {} }] },
    });
    const parts = response?.candidates?.[0]?.content?.parts || [];
    return ResponseParser.parseAll(parts);
  }

  /**
   * Run a code execution chat (Python only).
   * @param model Gemini model (e.g., 'gemini-2.0-flash').
   * @param history Chat history (array of turns: {role, parts}).
   * @param message User message to send.
   * @param config Additional config (optional).
   * @returns Array of parts: text, executableCode, codeExecutionResult, inlineData, etc.
   */
  async executeCodeChat({
    model,
    history,
    message,
    config = {},
  }: {
    model: string,
    history: any[],
    message: string,
    config?: any,
  }): Promise<ExecuteCodeResult> {
    const chat = this.genAI.chats.create({
      model,
      history,
      config: { ...config, tools: [{ codeExecution: {} }] },
    });
    const response = await chat.sendMessage({ message });
    const parts = response?.candidates?.[0]?.content?.parts || [];
    return ResponseParser.parseAll(parts);
  }
}

export default CodeExecutionService; 