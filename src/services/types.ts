// Gemini API response part types
export interface GeminiTextPart {
  text: string;
}

export interface GeminiInlineDataPart {
  inlineData: {
    mimeType: string;
    data: string;
  };
}

export interface GeminiExecutableCodePart {
  executableCode: {
    code: string;
    language?: string;
  };
}

export interface GeminiCodeExecutionResultPart {
  codeExecutionResult: {
    output: string;
    error?: string;
  };
}

export type GeminiResponsePart =
  | GeminiTextPart
  | GeminiInlineDataPart
  | GeminiExecutableCodePart
  | GeminiCodeExecutionResultPart;

// AudioService types
export interface GenerateSingleSpeakerSpeechParams {
  model: string;
  text: string;
  voiceName: string;
}
export type GenerateSingleSpeakerSpeechResult = Buffer;

export interface AnalyzeAudioFileParams {
  model: string;
  filePath: string;
  prompt: string;
  useFileApi?: boolean;
}

// CodeExecutionService types
export interface ExecuteCodeParams {
  model: string;
  prompt: string | any[];
  config?: any;
}
export interface ExecuteCodeResult {
  text: string[];
  code: string[];
  output: string[];
  images: { mimeType: string; data: string }[];
}

// ImageService types
export interface GenerateImageParams {
  model: string;
  contents: string | any[];
  config?: any;
}
export interface GenerateImageResult {
  type: "text" | "image";
  data: string;
}

// TextService types
export interface GenerateTextParams {
  model: string;
  contents: string | any[];
  config?: any;
}
export type GenerateTextResult = any;

// DocumentService types
export interface SummarizeFromUrlParams {
  model: string;
  url: string;
  prompt?: string;
  mimeType?: string;
}
export interface SummarizeFromFileParams {
  model: string;
  filePath: string;
  prompt?: string;
  mimeType?: string;
}
export interface SummarizeLargeFromUrlParams {
  model: string;
  url: string;
  prompt?: string;
  displayName?: string;
  mimeType?: string;
}
export interface SummarizeLargeFromFileParams {
  model: string;
  filePath: string;
  prompt?: string;
  displayName?: string;
  mimeType?: string;
}
export interface SummarizeMultipleParams {
  model: string;
  docs: Array<{ file: any; displayName: string; isUrl?: boolean; mimeType?: string }>;
  prompt: string;
}
export type SummarizeResult = string; 