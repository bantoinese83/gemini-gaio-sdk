/**
 * Logger utility for Gemini SDK. Supports debug/info/warn/error logging.
 * Enable by setting Logger.enabled = true or GEMINI_SDK_DEBUG=1.
 */
export class Logger {
  /**
   * Whether logging is enabled. Set via GEMINI_SDK_DEBUG=1 or manually.
   */
  static enabled: boolean = process.env.GEMINI_SDK_DEBUG === '1' || false;

  /**
   * Log a debug message.
   * @param args Arguments to log
   */
  static debug(...args: any[]) {
    if (Logger.enabled) console.debug('[GeminiSDK][DEBUG]', ...args);
  }

  /**
   * Log an info message.
   * @param args Arguments to log
   */
  static info(...args: any[]) {
    if (Logger.enabled) console.info('[GeminiSDK][INFO]', ...args);
  }

  /**
   * Log a warning message.
   * @param args Arguments to log
   */
  static warn(...args: any[]) {
    if (Logger.enabled) console.warn('[GeminiSDK][WARN]', ...args);
  }

  /**
   * Log an error message.
   * @param args Arguments to log
   */
  static error(...args: any[]) {
    if (Logger.enabled) console.error('[GeminiSDK][ERROR]', ...args);
  }
} 