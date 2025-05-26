# Gemini-Gaio: The All-in-One Gemini SDK

[![npm version](https://img.shields.io/npm/v/gemini-gaio.svg)](https://www.npmjs.com/package/gemini-gaio)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](tsconfig.json)

A comprehensive, modular Node.js/TypeScript SDK for the Google Gemini API, supporting **all advanced multimodal features**: document (PDF and more) understanding, music generation (Lyria RealTime), video/audio analysis, structured output, real-time streaming (Live API), function calling, context caching, URL context, file management, code execution, and more.

---

## Why Gemini-Gaio?

- **All-in-One**: Every Gemini API feature in one package—text, image, audio, video, TTS, music, streaming, function calling, context, files, code execution, and more.
- **Type-Safe & Modern**: Built with strict TypeScript for maximum safety and autocompletion.
- **Production-Ready**: Robust error handling, logging, and modular design.
- **Real-World Proven**: Used in production for multimodal, agentic, and creative AI apps.
- **Easy to Use**: Simple, consistent APIs for every Gemini capability.

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
- **Strict TypeScript Types & Autocompletion**

---

## Installation

```bash
npm install @google/genai gemini-gaio
```

---

## Quick Start

```ts
import { TextService, GeminiModel } from 'gemini-gaio';

const text = new TextService(process.env.GEMINI_API_KEY!);
const result = await text.generateText({
  model: GeminiModel.GEMINI_2_5_PRO_PREVIEW_05_06,
  contents: 'Write a poem about AI.'
});
console.log(result.text);
```

---

## Usage Examples

### Multimodal Chaining
```ts
import { ImageService, GeminiModel } from 'gemini-gaio';
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
```ts
import { LiveApiService, GeminiModel } from 'gemini-gaio';
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
```ts
import { FunctionCallingService, GeminiModel } from 'gemini-gaio';
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
```ts
import { ContextCacheService, GeminiModel } from 'gemini-gaio';
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

## API Overview

All services are available from the main entry point:

```ts
import {
  TextService, ImageService, DocumentService, AudioService, VideoService,
  StructuredOutputService, VeoVideoService, TextToSpeechService, LyriaMusicService,
  LiveApiService, UrlContextService, ContextCacheService, FilesApiService,
  TokenService, FunctionCallingService, GroundingService, ThinkingService,
  CodeExecutionService, GeminiModel, Logger
} from 'gemini-gaio';
```

See the [full API documentation](https://github.com/bantoinese83/gemini-gaio-sdk) for detailed usage of each service.

---

## TypeScript Support & Type Exports

All services and types/interfaces are exported from the main entry point. You get full autocompletion and type safety in your editor:

```ts
import type { GenerateTextParams, GenerateImageResult } from 'gemini-gaio';
```

---

## Contributing

Contributions, bug reports, and feature requests are welcome! Please open an issue or pull request on [GitHub](https://github.com/bantoinese83/gemini-gaio-sdk).

- Fork the repo and create your branch from `main`.
- Add/fix your feature or bug.
- Add/adjust tests if needed.
- Open a PR and describe your changes.

---

## Support & Contact

- For questions, open a [GitHub Issue](https://github.com/bantoinese83/gemini-gaio-sdk/issues)
- For commercial support or consulting, contact [Bryan Antoine](mailto:b.antoine.se@gmail.com)

---

## License
MIT 