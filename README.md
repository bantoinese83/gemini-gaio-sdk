# Gemini SDK Service

A comprehensive, modular Node.js/TypeScript SDK for the Google Gemini API, supporting advanced multimodal features: document (PDF and more) understanding, music generation (Lyria RealTime), video/audio analysis, structured output, real-time streaming (Live API), function calling, context caching, URL context, file management, and more.

---

## Quick Start

```bash
npm install @google/genai gemini-sdk-service
```

```ts
import { TextService, GeminiModel } from 'gemini-sdk-service';

const text = new TextService(process.env.GEMINI_API_KEY!);
const result = await text.generateText({
  model: GeminiModel.GEMINI_2_5_PRO_PREVIEW_05_06,
  contents: 'Write a poem about AI.'
});
console.log(result.text);
```

---

## Advanced/Real-World Examples

### Multimodal Chaining
Combine text, images, and audio in a single prompt for rich, context-aware outputs.
```ts
import { ImageService, GeminiModel } from 'gemini-sdk-service';
const image = new ImageService(process.env.GEMINI_API_KEY!);
const multimodal = [
  { text: 'Describe this image and the sound:' },
  { inlineData: { mimeType: 'image/png', data: base64Img } },
  { inlineData: { mimeType: 'audio/mp3', data: base64Audio } }
];
const result = await image.generateImage({
  model: GeminiModel.GEMINI_2_0_FLASH_PREVIEW_IMAGE_GENERATION,
  contents: multimodal
});
```

### Real-Time Streaming
Use LiveApiService for low-latency, bidirectional streaming.
```ts
import { LiveApiService, GeminiModel } from 'gemini-sdk-service';
const live = new LiveApiService(process.env.GEMINI_API_KEY!);
const session = await live.connectSession({
  model: GeminiModel.GEMINI_2_0_FLASH_LIVE_001,
  responseModality: 'TEXT',
  callbacks: { onmessage: (msg) => console.log(msg) }
});
await live.sendText(session, 'Hello!');
await live.closeSession(session);
```

### Function Calling
Integrate Gemini with external APIs using FunctionCallingService.
```ts
import { FunctionCallingService, GeminiModel } from 'gemini-sdk-service';
const fc = new FunctionCallingService(process.env.GEMINI_API_KEY!);
const fnDecl = FunctionCallingService.createFunctionDeclaration({
  name: 'getWeather',
  description: 'Get weather by city',
  parameters: { type: 'object', properties: { city: { type: 'string' } }, required: ['city'] }
});
const resp = await fc.callWithFunctions({
  model: GeminiModel.GEMINI_2_5_PRO_PREVIEW_05_06,
  contents: 'What is the weather in Paris?',
  functionDeclarations: [fnDecl]
});
```

### Context Caching
Preload and reuse context for efficient, cost-effective inference.
```ts
import { ContextCacheService, GeminiModel } from 'gemini-sdk-service';
const cache = new ContextCacheService(process.env.GEMINI_API_KEY!);
const created = await cache.createCache({
  model: GeminiModel.GEMINI_2_5_PRO_PREVIEW_05_06,
  fileUris: [{ uri: 'gs://...', mimeType: 'application/pdf' }]
});
const result = await cache.generateWithCache({
  model: GeminiModel.GEMINI_2_5_PRO_PREVIEW_05_06,
  contents: 'Use the cached doc',
  cacheName: created.name
});
```

---

## Integration Example

```ts
import {
  TextService, ImageService, DocumentService, AudioService, VideoService,
  StructuredOutputService, VeoVideoService, TextToSpeechService, LyriaMusicService,
  LiveApiService, UrlContextService, ContextCacheService, FilesApiService,
  TokenService, FunctionCallingService, GroundingService, ThinkingService,
  CodeExecutionService, GeminiModel, Logger
} from 'gemini-sdk-service';

// Enable debug logging
Logger.enabled = true;

const audio = new AudioService(process.env.GEMINI_API_KEY!);
const tts = await audio.generateSingleSpeakerSpeech({
  model: GeminiModel.GEMINI_2_5_FLASH_PREVIEW_TTS,
  text: 'Hello world',
  voiceName: 'Kore'
});
// ...save/play tts Buffer...
```

---

## Enabling Debug Logging

Set the environment variable `GEMINI_SDK_DEBUG=1` or set `Logger.enabled = true` in your code to see debug/info/warn/error logs from the SDK.

---

## TypeScript Support & Type Exports

All services and types/interfaces are exported from the main entry point. You get full autocompletion and type safety in your editor:

```ts
import type { GenerateTextParams, GenerateImageResult } from 'gemini-sdk-service';
```

---

## Table of Contents
- [Gemini SDK Service](#gemini-sdk-service)
  - [Quick Start](#quick-start)
  - [Advanced/Real-World Examples](#advancedreal-world-examples)
    - [Multimodal Chaining](#multimodal-chaining)
    - [Real-Time Streaming](#real-time-streaming)
    - [Function Calling](#function-calling)
    - [Context Caching](#context-caching)
  - [Integration Example](#integration-example)
  - [Enabling Debug Logging](#enabling-debug-logging)
  - [TypeScript Support \& Type Exports](#typescript-support--type-exports)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Service Overview](#service-overview)
  - [Supported Model Variants](#supported-model-variants)
  - [Installation](#installation)
  - [Setup \& Environment](#setup--environment)
  - [Usage](#usage)
    - [TextService](#textservice)
    - [ImageService](#imageservice)
    - [DocumentService](#documentservice)
    - [AudioService](#audioservice)
    - [VideoService](#videoservice)
    - [StructuredOutputService](#structuredoutputservice)
    - [VeoVideoService](#veovideoservice)
    - [TextToSpeechService](#texttospeechservice)
    - [LyriaMusicService](#lyriamusicservice)
    - [LiveApiService](#liveapiservice)
    - [UrlContextService](#urlcontextservice)
    - [ContextCacheService](#contextcacheservice)
    - [FilesApiService](#filesapiservice)
    - [TokenService](#tokenservice)
    - [FunctionCallingService](#functioncallingservice)
    - [GroundingService](#groundingservice)
    - [ThinkingService](#thinkingservice)
    - [CodeExecutionService](#codeexecutionservice)
  - [Real World Use Cases](#real-world-use-cases)
  - [Cool Ways to Use](#cool-ways-to-use)
  - [Advanced Use Cases](#advanced-use-cases)
  - [TypeScript \& Build](#typescript--build)
  - [Troubleshooting](#troubleshooting)
  - [License](#license)

---

## Features
- **Text, Image, Audio, Video, and Document Understanding**
- **Structured Output (JSON, Enum, Schema)**
- **Veo Video Generation (Text-to-Video, Image-to-Video)**
- **Text-to-Speech (TTS, Multi-Speaker)**
- **Lyria RealTime Music Generation**
- **Live API (Real-Time Streaming, Bidirectional)**
- **URL Context & Google Search Grounding**
- **Context Caching**
- **File Management (Upload, List, Delete)**
- **Token Counting & Usage Metadata**
- **Function Calling (OpenAPI subset, Parallel)**
- **Chain-of-Thought & Reasoning**
- **Python Code Execution (with output parsing)**

---

## Service Overview

| Service | Description |
|---------|-------------|
| **TextService** | Text generation, chat, and streaming. |
| **ImageService** | Multimodal image generation and analysis. |
| **AudioService** | Audio analysis, TTS, and token counting. |
| **VideoService** | Video analysis (file and YouTube). |
| **DocumentService** | Summarization and analysis of documents (local/remote, small/large, multiple). |
| **VeoVideoService** | Text-to-video and image-to-video generation (Veo). |
| **TextToSpeechService** | Single and multi-speaker TTS. |
| **LyriaMusicService** | Real-time music generation (Lyria). |
| **LiveApiService** | Real-time streaming (text/audio). |
| **UrlContextService** | Use of URL context and Google Search grounding. |
| **ContextCacheService** | Context caching for efficient inference. |
| **FilesApiService** | File upload, listing, and deletion. |
| **TokenService** | Token counting for text, chat, and multimodal inputs. |
| **FunctionCallingService** | Function calling (OpenAPI schema, parallel). |
| **GroundingService** | Google Search grounding and suggestion extraction. |
| **ThinkingService** | Chain-of-thought and reasoning. |
| **CodeExecutionService** | Python code execution and output parsing. |
| **StructuredOutputService** | Structured output (JSON, enums, schema enforcement). |

---

## Supported Model Variants

```ts
import { GeminiModel } from './gemini-service';

// Example usage:
const model = GeminiModel.GEMINI_2_5_PRO_PREVIEW_05_06;
```

| Enum Value | Model Name | Input(s) | Output | Optimized for |
|------------|------------|----------|--------|---------------|
| GEMINI_2_5_FLASH_PREVIEW_05_20 | gemini-2.5-flash-preview-05-20 | Audio, images, videos, text | Text | Adaptive thinking, cost efficiency |
| GEMINI_2_5_FLASH_PREVIEW_NATIVE_AUDIO_DIALOG | gemini-2.5-flash-preview-native-audio-dialog | Audio, videos, text | Text, audio | High quality, natural conversational audio outputs |
| GEMINI_2_5_FLASH_EXP_NATIVE_AUDIO_THINKING_DIALOG | gemini-2.5-flash-exp-native-audio-thinking-dialog | Audio, videos, text | Text, audio | High quality, natural conversational audio outputs, with or without thinking |
| GEMINI_2_5_FLASH_PREVIEW_TTS | gemini-2.5-flash-preview-tts | Text | Audio | Low latency, controllable, single- and multi-speaker TTS |
| GEMINI_2_5_PRO_PREVIEW_05_06 | gemini-2.5-pro-preview-05-06 | Audio, images, videos, text | Text | Enhanced thinking, reasoning, multimodal understanding, advanced coding |
| GEMINI_2_5_PRO_PREVIEW_TTS | gemini-2.5-pro-preview-tts | Text | Audio | Low latency, controllable, single- and multi-speaker TTS |
| GEMINI_2_0_FLASH | gemini-2.0-flash | Audio, images, videos, text | Text | Next generation features, speed, thinking, realtime streaming |
| GEMINI_2_0_FLASH_PREVIEW_IMAGE_GENERATION | gemini-2.0-flash-preview-image-generation | Audio, images, videos, text | Text, images | Conversational image generation and editing |
| GEMINI_2_0_FLASH_LITE | gemini-2.0-flash-lite | Audio, images, videos, text | Text | Cost efficiency, low latency |
| GEMINI_1_5_FLASH | gemini-1.5-flash | Audio, images, videos, text | Text | Fast, versatile performance |
| GEMINI_1_5_FLASH_8B | gemini-1.5-flash-8b | Audio, images, videos, text | Text | High volume, lower intelligence tasks |
| GEMINI_1_5_PRO | gemini-1.5-pro | Audio, images, videos, text | Text | Complex reasoning tasks |
| GEMINI_EMBEDDING_EXP | gemini-embedding-exp | Text | Text embeddings | Measuring relatedness of text strings |
| IMAGEN_3_0_GENERATE_002 | imagen-3.0-generate-002 | Text | Images | Advanced image generation |
| VEO_2_0_GENERATE_001 | veo-2.0-generate-001 | Text, images | Video | High quality video generation |
| GEMINI_2_0_FLASH_LIVE_001 | gemini-2.0-flash-live-001 | Audio, video, text | Text, audio | Low-latency bidirectional voice and video interactions |

---

## Installation

```bash
npm install @google/genai
git clone <this-repo-url>
cd gemini-sdk-service
npm install
```

---

## Setup & Environment

- **Node.js v18+ required**
- Set your Google Gemini API key as an environment variable:

```bash
export GEMINI_API_KEY=your_api_key_here
```

Or pass it directly to each service constructor.

---

## Usage

Import services from the main entry point:

```ts
import {
  TextService, ImageService, DocumentService, AudioService, VideoService,
  StructuredOutputService, VeoVideoService, TextToSpeechService, LyriaMusicService,
  LiveApiService, UrlContextService, ContextCacheService, FilesApiService,
  TokenService, FunctionCallingService, GroundingService, ThinkingService,
  CodeExecutionService, GeminiModel
} from './gemini-service';
```

### TextService
```ts
const text = new TextService(process.env.GEMINI_API_KEY!);
const result = await text.generateText(GeminiModel.GEMINI_2_5_PRO_PREVIEW_05_06, 'Write a poem about AI.');
```

### ImageService
```ts
const image = new ImageService(process.env.GEMINI_API_KEY!);
const multimodal = image.buildMultimodalContent('Describe this image:', [{ data: base64Img, mimeType: 'image/png' }]);
const result = await image.generateImage(GeminiModel.GEMINI_2_0_FLASH_PREVIEW_IMAGE_GENERATION, multimodal);
```

### DocumentService
```ts
const doc = new DocumentService(process.env.GEMINI_API_KEY!);
// Summarize a PDF from URL
const summary = await doc.summarizeFromUrl(GeminiModel.GEMINI_2_5_PRO_PREVIEW_05_06, 'https://example.com/file.pdf');
// Summarize a large local PDF
const summaryLarge = await doc.summarizeLargeFromFile(GeminiModel.GEMINI_2_5_PRO_PREVIEW_05_06, './file.pdf');
// Summarize multiple documents
const multi = await doc.summarizeMultiple(GeminiModel.GEMINI_2_5_PRO_PREVIEW_05_06, [
  { file: './file1.pdf', displayName: 'Doc1' },
  { file: 'https://example.com/file2.pdf', displayName: 'Doc2', isUrl: true }
], 'Summarize all docs');
```

### AudioService
```ts
const audio = new AudioService(process.env.GEMINI_API_KEY!);
// Analyze audio file
const analysis = await audio.analyzeAudioFile({ model: GeminiModel.GEMINI_2_5_PRO_PREVIEW_05_06, filePath: './audio.mp3', prompt: 'Transcribe this.' });
// Count tokens in audio
const tokens = await audio.countAudioTokens({ model: GeminiModel.GEMINI_2_5_PRO_PREVIEW_05_06, filePath: './audio.mp3' });
```

### VideoService
```ts
const video = new VideoService(process.env.GEMINI_API_KEY!);
const analysis = await video.analyzeVideoFile({ model: GeminiModel.GEMINI_2_5_PRO_PREVIEW_05_06, filePath: './video.mp4', prompt: 'Summarize this video.' });
const yt = await video.analyzeYoutubeVideo({ model: GeminiModel.GEMINI_2_5_PRO_PREVIEW_05_06, youtubeUrl: 'https://youtube.com/xyz', prompt: 'Summarize.' });
```

### StructuredOutputService
```ts
const struct = new StructuredOutputService(process.env.GEMINI_API_KEY!);
const schema = { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] };
const result = await struct.generateStructuredOutput({
  model: GeminiModel.GEMINI_2_5_PRO_PREVIEW_05_06,
  contents: 'Extract the name.',
  config: { responseMimeType: 'application/json', responseSchema: schema }
});
```

### VeoVideoService
```ts
const veo = new VeoVideoService(process.env.GEMINI_API_KEY!);
const uris = await veo.generateVideoFromText({ prompt: 'A cat playing piano.', model: GeminiModel.VEO_2_0_GENERATE_001 });
await veo.downloadVideo(uris[0], 'cat.mp4');
```

### TextToSpeechService
```ts
const tts = new TextToSpeechService(process.env.GEMINI_API_KEY!);
const audioBuffer = await tts.generateSingleSpeakerSpeech({ model: GeminiModel.GEMINI_2_5_FLASH_PREVIEW_TTS, text: 'Hello world', voiceName: 'Kore' });
```

#### Supported Voices & Languages

You can list all supported voices and languages directly from the SDK:

```ts
import { TextToSpeechService } from 'gemini-sdk-service';

console.log('Supported voices:', TextToSpeechService.voiceOptions);
console.log('Supported languages:', TextToSpeechService.languageCodes);
```

#### Multi-Language & Multi-Voice Usage Example

```ts
// Generate speech in French using the "Zephyr" voice
const tts = new TextToSpeechService(process.env.GEMINI_API_KEY!);
const audioFr = await tts.generateSingleSpeakerSpeech({
  model: GeminiModel.GEMINI_2_5_FLASH_PREVIEW_TTS,
  text: 'Bonjour, comment ça va?',
  voiceName: 'Zephyr', // Pick any from TextToSpeechService.voiceOptions
  // Language is auto-detected from text, but you can ensure it by using the correct language in your prompt
});

// Generate multi-speaker speech in Hindi and English
const audioMulti = await tts.generateMultiSpeakerSpeech({
  model: GeminiModel.GEMINI_2_5_PRO_PREVIEW_TTS,
  text: 'Amit: नमस्ते! John: Hello!',
  speakers: [
    { speaker: 'Amit', voiceName: 'Sadaltager' },
    { speaker: 'John', voiceName: 'Kore' },
  ],
});
```

#### All Supported Voice Options

| Voice Name         | Description (if known) |
|--------------------|-----------------------|
| Zephyr             | Bright                |
| Puck               | Upbeat                |
| Charon             | Informative           |
| Kore               | Firm                  |
| Fenrir             | Excitable             |
| Leda               | Youthful              |
| Orus               | Firm                  |
| Aoede              | Breezy                |
| Callirhoe          | Easy-going            |
| Autonoe            | Bright                |
| Enceladus          | Breathy               |
| Iapetus            | Clear                 |
| Umbriel            | Easy-going            |
| Algieba            | Smooth                |
| Despina            | Smooth                |
| Erinome            | Clear                 |
| Algenib            | Gravelly              |
| Rasalgethi         | Informative           |
| Laomedeia          | Upbeat                |
| Achernar           | Soft                  |
| Alnilam            | Firm                  |
| Schedar            | Even                  |
| Gacrux             | Mature                |
| Pulcherrima        | Forward               |
| Achird             | Friendly              |
| Zubenelgenubi      | Casual                |
| Vindemiatrix       | Gentle                |
| Sadachbia          | Lively                |
| Sadaltager         | Knowledgeable         |
| Sulafar            | Warm                  |

#### All Supported Language Codes

| Language                | BCP-47 Code |
|-------------------------|-------------|
| Arabic (Egyptian)       | ar-EG       |
| German (Germany)        | de-DE       |
| English (US)            | en-US       |
| Spanish (US)            | es-US       |
| French (France)         | fr-FR       |
| Hindi (India)           | hi-IN       |
| Indonesian (Indonesia)  | id-ID       |
| Italian (Italy)         | it-IT       |
| Japanese (Japan)        | ja-JP       |
| Korean (Korea)          | ko-KR       |
| Portuguese (Brazil)     | pt-BR       |
| Russian (Russia)        | ru-RU       |
| Dutch (Netherlands)     | nl-NL       |
| Polish (Poland)         | pl-PL       |
| Thai (Thailand)         | th-TH       |
| Turkish (Turkey)        | tr-TR       |
| Vietnamese (Vietnam)    | vi-VN       |
| Romanian (Romania)      | ro-RO       |
| Ukrainian (Ukraine)     | uk-UA       |
| Bengali (Bangladesh)    | bn-BD       |
| English (India)         | en-IN       |
| Marathi (India)         | mr-IN       |
| Tamil (India)           | ta-IN       |
| Telugu (India)          | te-IN       |

### LyriaMusicService
```ts
import { LyriaMusicService } from './gemini-service';
const lyria = new LyriaMusicService(process.env.GEMINI_API_KEY!);
const session = lyria.connectSession({
  onMessage: (msg) => { /* handle PCM audio */ },
  // model defaults to 'models/lyria-realtime-exp' (official Lyria RealTime model)
});
await lyria.setWeightedPrompts(session, [{ text: 'jazz', weight: 1 }]);
await lyria.play(session);
```
> **Note:** The default model for Lyria RealTime is `'models/lyria-realtime-exp'`. You can override this by passing a different model if needed, but this is the recommended and official model for real-time music generation.

### LiveApiService
```ts
const live = new LiveApiService(process.env.GEMINI_API_KEY!);
const session = await live.connectSession({
  model: GeminiModel.GEMINI_2_0_FLASH_LIVE_001,
  responseModality: 'TEXT',
  callbacks: { onmessage: (msg) => { /* handle stream */ } }
});
await live.sendText(session, 'Hello!');
await live.closeSession(session);
```

### UrlContextService
```ts
const urlCtx = new UrlContextService(process.env.GEMINI_API_KEY!);
const result = await urlCtx.generateWithUrlContext({ model: GeminiModel.GEMINI_2_5_PRO_PREVIEW_05_06, contents: 'Summarize https://en.wikipedia.org/wiki/AI' });
```

### ContextCacheService
```ts
const cache = new ContextCacheService(process.env.GEMINI_API_KEY!);
const created = await cache.createCache({ model: GeminiModel.GEMINI_2_5_PRO_PREVIEW_05_06, fileUris: [{ uri: 'gs://...', mimeType: 'application/pdf' }] });
const result = await cache.generateWithCache({ model: GeminiModel.GEMINI_2_5_PRO_PREVIEW_05_06, contents: 'Use the cached doc', cacheName: created.name });
```

### FilesApiService
```ts
const files = new FilesApiService(process.env.GEMINI_API_KEY!);
const uploaded = await files.uploadFile({ file: './file.pdf', mimeType: 'application/pdf' });
const listed = await files.listFiles();
await files.deleteFile(uploaded.name);
```

### TokenService
```ts
const tokens = new TokenService(process.env.GEMINI_API_KEY!);
const count = await tokens.countTextTokens(GeminiModel.GEMINI_2_5_PRO_PREVIEW_05_06, 'How many tokens?');
```

### FunctionCallingService
```ts
const fc = new FunctionCallingService(process.env.GEMINI_API_KEY!);
const fnDecl = FunctionCallingService.createFunctionDeclaration({
  name: 'getWeather',
  description: 'Get weather by city',
  parameters: { type: 'object', properties: { city: { type: 'string' } }, required: ['city'] }
});
const resp = await fc.callWithFunctions({
  model: GeminiModel.GEMINI_2_5_PRO_PREVIEW_05_06,
  contents: 'What is the weather in Paris?',
  functionDeclarations: [fnDecl]
});
```

### GroundingService
```ts
const ground = new GroundingService(process.env.GEMINI_API_KEY!);
const { text, groundingMetadata } = await ground.generateGroundedContent({ model: GeminiModel.GEMINI_2_5_PRO_PREVIEW_05_06, contents: 'What is the latest news on AI?' });
```

### ThinkingService
```ts
const think = new ThinkingService(process.env.GEMINI_API_KEY!);
const { answer, thoughts } = await think.generateThinkingContent({ model: GeminiModel.GEMINI_2_5_PRO_PREVIEW_05_06, contents: 'Solve this step by step.', includeThoughts: true });
```

### CodeExecutionService
```ts
import { CodeExecutionService, GeminiModel } from './gemini-service';
const codeExec = new CodeExecutionService(process.env.GEMINI_API_KEY!);
// Single-turn code execution (Python only)
const parts = await codeExec.executeCode({
  model: GeminiModel.GEMINI_2_0_FLASH,
  prompt: 'What is the sum of the first 50 prime numbers? Generate and run code for the calculation, and make sure you get all 50.'
});
const { text, code, output, images } = CodeExecutionService.parseParts(parts);
console.log('Text:', text);
console.log('Code:', code);
console.log('Output:', output);
console.log('Images:', images);

// Chat-based code execution
const chatHistory = [
  { role: 'user', parts: [{ text: 'I have a math question for you:' }] },
  { role: 'model', parts: [{ text: "Great! I'm ready for your math question. Please ask away." }] },
];
const chatParts = await codeExec.executeCodeChat({
  model: GeminiModel.GEMINI_2_0_FLASH,
  history: chatHistory,
  message: 'What is the sum of the first 50 prime numbers? Generate and run code for the calculation, and make sure you get all 50.'
});
const chatResults = CodeExecutionService.parseParts(chatParts);
console.log('Chat Output:', chatResults.output);
```

---

## Real World Use Cases

- **Enterprise Document Automation:** Summarize, extract, and analyze contracts, invoices, and reports in bulk using `DocumentService` and `StructuredOutputService`.
- **Conversational AI:** Build chatbots and virtual assistants with `TextService`, `ThinkingService`, and `FunctionCallingService` for advanced reasoning and tool use.
- **Media Analysis Pipelines:** Automatically transcribe, summarize, and tag audio/video files using `AudioService` and `VideoService`.
- **Content Moderation:** Use `GroundingService` and `UrlContextService` to fact-check and ground responses in real-time.
- **Education & Tutoring:** Generate step-by-step explanations, code execution, and multimodal content for interactive learning apps.
- **Creative Apps:** Generate music (`LyriaMusicService`), images (`ImageService`), and videos (`VeoVideoService`) for content creation platforms.
- **Voice Assistants:** Use `TextToSpeechService` and `LiveApiService` for real-time, multi-speaker conversational interfaces.
- **Knowledge Management:** Preload and cache large corpora for fast, cost-effective Q&A with `ContextCacheService`.
- **APIs with Function Calling:** Integrate Gemini with external APIs using `FunctionCallingService` for dynamic, tool-augmented responses.

---

## Cool Ways to Use

- **Multimodal Chaining:** Combine text, images, audio, and documents in a single prompt for rich, context-aware outputs.
- **Real-Time Music Jams:** Use `LyriaMusicService` to create collaborative, steerable music generation apps.
- **Live Streaming Chatbots:** Build voice- and text-based bots that stream responses in real time with `LiveApiService`.
- **Automated Video Generation:** Turn blog posts or news into narrated videos using `VeoVideoService` + `TextToSpeechService`.
- **Parallel Function Calling:** Use `FunctionCallingService` to call multiple tools/APIs in parallel for complex workflows.
- **Grounded Research Assistants:** Use `GroundingService` and `UrlContextService` to build assistants that cite sources and suggest further reading.
- **Token-Aware UX:** Use `TokenService` to optimize prompts and avoid model truncation in production apps.
- **Code Tutor:** Use `CodeExecutionService` to build interactive Python coding tutors that run and explain code step by step.

---

## Advanced Use Cases
- **Multimodal chaining**: Combine text, image, audio, and document inputs in a single prompt.
- **Real-time music and text streaming**: Use LyriaMusicService and LiveApiService for interactive, steerable generation.
- **Function calling with tool use**: Integrate with external APIs using FunctionCallingService.
- **Context caching for large corpora**: Preload and reuse context for efficient, cost-effective inference.
- **Grounded search and URL context**: Use GroundingService and UrlContextService for up-to-date, web-grounded answers.

---

## TypeScript & Build
- All services are fully typed and compatible with strict TypeScript.
- Build with:
```bash
npm run build
```
- Output is in `dist/`.

---

## Troubleshooting
- **API Key errors**: Ensure `GEMINI_API_KEY` is set in your environment or passed to constructors.
- **File size limits**: Use File API methods for large files (>20MB).
- **Streaming**: Ensure your Node.js version supports async iterators and WebSockets.
- **TypeScript errors**: Check your `tsconfig.json` for compatibility with ES2022 and Node module resolution.

---

## License
MIT 