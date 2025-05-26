# Gemini API Model Variants

A comprehensive overview of all Gemini API model variants, their capabilities, and key properties. Use this as a reference for selecting the right model for your use case.

---

## Model Families

### Gemini 2.5 Pro

- **Our most powerful thinking model with maximum response accuracy and state-of-the-art performance**
- Input: audio, images, video, and text; Output: text
- Tackle difficult problems, analyze large databases, and more
- Best for complex coding, reasoning, and multimodal understanding

### Gemini 2.5 Flash

- **Best price-performance, well-rounded capabilities**
- Input: audio, images, video, and text; Output: text
- Model thinks as needed; configurable thinking budget
- Best for low latency, high volume tasks that require thinking

### Gemini 2.0 Flash

- **Newest multimodal model, next generation features**
- Input: audio, images, video, and text; Output: text
- Generate code and images, extract data, analyze files, generate graphs, and more
- Low latency, enhanced performance, built to power agentic experiences

---

## Model Variant Table

| Model Variant                             | Model Code                                                                                            | Input(s)                    | Output          | Optimized For                                                                |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------- | --------------- | ---------------------------------------------------------------------------- |
| Gemini 2.5 Flash Preview 05-20            | `gemini-2.5-flash-preview-05-20`                                                                      | Audio, images, videos, text | Text            | Adaptive thinking, cost efficiency                                           |
| Gemini 2.5 Flash Native Audio             | `gemini-2.5-flash-preview-native-audio-dialog`<br>`gemini-2.5-flash-exp-native-audio-thinking-dialog` | Audio, videos, text         | Text, audio     | High quality, natural conversational audio outputs, with or without thinking |
| Gemini 2.5 Flash Preview TTS              | `gemini-2.5-flash-preview-tts`                                                                        | Text                        | Audio           | Low latency, controllable, single- and multi-speaker TTS                     |
| Gemini 2.5 Pro Preview                    | `gemini-2.5-pro-preview-05-06`                                                                        | Audio, images, videos, text | Text            | Enhanced thinking, reasoning, multimodal understanding, advanced coding      |
| Gemini 2.5 Pro Preview TTS                | `gemini-2.5-pro-preview-tts`                                                                          | Text                        | Audio           | Low latency, controllable, single- and multi-speaker TTS                     |
| Gemini 2.0 Flash                          | `gemini-2.0-flash`                                                                                    | Audio, images, videos, text | Text            | Next generation features, speed, thinking, realtime streaming                |
| Gemini 2.0 Flash Preview Image Generation | `gemini-2.0-flash-preview-image-generation`                                                           | Audio, images, videos, text | Text, images    | Conversational image generation and editing                                  |
| Gemini 2.0 Flash-Lite                     | `gemini-2.0-flash-lite`                                                                               | Audio, images, videos, text | Text            | Cost efficiency, low latency                                                 |
| Gemini 1.5 Flash                          | `gemini-1.5-flash`                                                                                    | Audio, images, videos, text | Text            | Fast, versatile performance                                                  |
| Gemini 1.5 Flash-8B                       | `gemini-1.5-flash-8b`                                                                                 | Audio, images, videos, text | Text            | High volume, lower intelligence tasks                                        |
| Gemini 1.5 Pro                            | `gemini-1.5-pro`                                                                                      | Audio, images, videos, text | Text            | Complex reasoning tasks                                                      |
| Gemini Embedding                          | `gemini-embedding-exp`                                                                                | Text                        | Text embeddings | Measuring relatedness of text strings                                        |
| Imagen 3                                  | `imagen-3.0-generate-002`                                                                             | Text                        | Images          | Advanced image generation                                                    |
| Veo 2                                     | `veo-2.0-generate-001`                                                                                | Text, images                | Video           | High quality video generation                                                |
| Gemini 2.0 Flash Live                     | `gemini-2.0-flash-live-001`                                                                           | Audio, video, text          | Text, audio     | Low-latency bidirectional voice and video interactions                       |

---

## Model Details

### Gemini 2.5 Flash Preview 05-20

- **Model code:** `gemini-2.5-flash-preview-05-20`
- **Inputs:** Text, images, video, audio
- **Output:** Text
- **Token limits:**
  - Input: 1,048,576
  - Output: 65,536
- **Capabilities:**
  - Audio generation: Not supported
  - Caching: Supported
  - Code execution: Supported
  - Function calling: Supported
  - Image generation: Not supported
  - Search grounding: Supported
  - Structured outputs: Supported
  - Thinking: Supported
  - Tuning: Not supported
- **Latest update:** May 2025
- **Knowledge cutoff:** January 2025

### Gemini 2.5 Flash Native Audio

- **Model codes:**
  - `gemini-2.5-flash-preview-native-audio-dialog`
  - `gemini-2.5-flash-exp-native-audio-thinking-dialog`
- **Inputs:** Audio, video, text
- **Output:** Audio and text
- **Token limits:**
  - Input: 128,000
  - Output: 8,000
- **Capabilities:**
  - Audio generation: Supported
  - Caching: Not supported
  - Code execution: Not supported
  - Function calling: Supported
  - Image generation: Not supported
  - Search grounding: Supported
  - Structured outputs: Not supported
  - Thinking: Supported
  - Tuning: Not supported
- **Latest update:** May 2025
- **Knowledge cutoff:** January 2025

### Gemini 2.5 Flash Preview TTS

- **Model code:** `gemini-2.5-flash-preview-tts`
- **Inputs:** Text
- **Output:** Audio
- **Token limits:**
  - Input: 8,000
  - Output: 16,000
- **Capabilities:**
  - Structured outputs: Not supported
  - Caching: Not supported
  - Tuning: Not supported
  - Function calling: Not supported
  - Code execution: Not supported
  - Search: Not supported
  - Audio generation: Supported
  - Live API: Not supported
  - Thinking: Not supported
- **Latest update:** May 2025

### Gemini 2.5 Pro Preview

- **Model code:** `gemini-2.5-pro-preview-05-06`
- **Inputs:** Audio, images, video, text
- **Output:** Text
- **Token limits:**
  - Input: 1,048,576
  - Output: 65,536
- **Capabilities:**
  - Structured outputs: Supported
  - Caching: Supported
  - Tuning: Not supported
  - Function calling: Supported
  - Code execution: Supported
  - Search grounding: Supported
  - Image generation: Not supported
  - Audio generation: Not supported
  - Live API: Not supported
  - Thinking: Supported
- **Latest update:** May 2025
- **Knowledge cutoff:** January 2025

### Gemini 2.5 Pro Preview TTS

- **Model code:** `gemini-2.5-pro-preview-tts`
- **Inputs:** Text
- **Output:** Audio
- **Token limits:**
  - Input: 8,000
  - Output: 16,000
- **Capabilities:**
  - Structured outputs: Not supported
  - Caching: Not supported
  - Tuning: Not supported
  - Function calling: Not supported
  - Code execution: Not supported
  - Search: Not supported
  - Audio generation: Supported
  - Live API: Not supported
  - Thinking: Not supported
- **Latest update:** May 2025

### Gemini 2.0 Flash

- **Model code:** `gemini-2.0-flash`
- **Inputs:** Audio, images, video, text
- **Output:** Text
- **Token limits:**
  - Input: 1,048,576
  - Output: 8,192
- **Capabilities:**
  - Structured outputs: Supported
  - Caching: Supported
  - Tuning: Not supported
  - Function calling: Supported
  - Code execution: Supported
  - Search: Supported
  - Image generation: Not supported
  - Audio generation: Not supported
  - Live API: Supported
  - Thinking: Experimental
- **Latest update:** February 2025
- **Knowledge cutoff:** August 2024

### Gemini 2.0 Flash Preview Image Generation

- **Model code:** `gemini-2.0-flash-preview-image-generation`
- **Inputs:** Audio, images, video, text
- **Output:** Text, images
- **Token limits:**
  - Input: 32,000
  - Output: 8,192
- **Capabilities:**
  - Structured outputs: Supported
  - Caching: Supported
  - Tuning: Not supported
  - Function calling: Not supported
  - Code execution: Not supported
  - Search: Not supported
  - Image generation: Supported
  - Audio generation: Not supported
  - Live API: Not supported
  - Thinking: Not supported
- **Latest update:** May 2025
- **Knowledge cutoff:** August 2024

### Gemini 2.0 Flash-Lite

- **Model code:** `gemini-2.0-flash-lite`
- **Inputs:** Audio, images, video, text
- **Output:** Text
- **Token limits:**
  - Input: 1,048,576
  - Output: 8,192
- **Capabilities:**
  - Structured outputs: Supported
  - Caching: Supported
  - Tuning: Not supported
  - Function calling: Supported
  - Code execution: Not supported
  - Search: Not supported
  - Image generation: Not supported
  - Audio generation: Not supported
  - Live API: Not supported
- **Latest update:** February 2025
- **Knowledge cutoff:** August 2024

### Gemini 1.5 Flash

- **Model code:** `gemini-1.5-flash`
- **Inputs:** Audio, images, video, text
- **Output:** Text
- **Token limits:**
  - Input: 1,048,576
  - Output: 8,192
- **Audio/visual specs:**
  - Max images per prompt: 3,600
  - Max video length: 1 hour
  - Max audio length: ~9.5 hours
- **Capabilities:**
  - System instructions: Supported
  - JSON mode: Supported
  - JSON schema: Supported
  - Adjustable safety settings: Supported
  - Caching: Supported
  - Tuning: Supported
  - Function calling: Supported
  - Code execution: Supported
  - Live API: Not supported
- **Latest update:** September 2024

### Gemini 1.5 Flash-8B

- **Model code:** `gemini-1.5-flash-8b`
- **Inputs:** Audio, images, video, text
- **Output:** Text
- **Token limits:**
  - Input: 1,048,576
  - Output: 8,192
- **Audio/visual specs:**
  - Max images per prompt: 3,600
  - Max video length: 1 hour
  - Max audio length: ~9.5 hours
- **Capabilities:**
  - System instructions: Supported
  - JSON mode: Supported
  - JSON schema: Supported
  - Adjustable safety settings: Supported
  - Caching: Supported
  - Tuning: Supported
  - Function calling: Supported
  - Code execution: Supported
  - Live API: Not supported
- **Latest update:** October 2024

### Gemini 1.5 Pro

- **Model code:** `gemini-1.5-pro`
- **Inputs:** Audio, images, video, text
- **Output:** Text
- **Token limits:**
  - Input: 2,097,152
  - Output: 8,192
- **Audio/visual specs:**
  - Max images per prompt: 7,200
  - Max video length: 2 hours
  - Max audio length: ~19 hours
- **Capabilities:**
  - System instructions: Supported
  - JSON mode: Supported
  - JSON schema: Supported
  - Adjustable safety settings: Supported
  - Caching: Supported
  - Tuning: Not supported
  - Function calling: Supported
  - Code execution: Supported
  - Live API: Not supported
- **Latest update:** September 2024

### Imagen 3

- **Model code:** `imagen-3.0-generate-002`
- **Inputs:** Text
- **Output:** Images
- **Output images:** Up to 4
- **Latest update:** February 2025

### Veo 2

- **Model code:** `veo-2.0-generate-001`
- **Inputs:** Text, image
- **Output:** Video
- **Limits:**
  - Text input: N/A
  - Image input: Any image resolution and aspect ratio up to 20MB file size
  - Output video: Up to 2
- **Latest update:** April 2025

### Gemini 2.0 Flash Live

- **Model code:** `gemini-2.0-flash-live-001`
- **Inputs:** Audio, video, text
- **Output:** Text, audio
- **Token limits:**
  - Input: 1,048,576
  - Output: 8,192
- **Capabilities:**
  - Structured outputs: Supported
  - Tuning: Not supported
  - Function calling: Supported
  - Code execution: Supported
  - Search: Supported
  - Image generation: Not supported
  - Audio generation: Supported
  - Thinking: Not supported
- **Latest update:** April 2025
- **Knowledge cutoff:** August 2024

### Gemini Embedding Experimental

- **Model code:** `gemini-embedding-exp-03-07`
- **Inputs:** Text
- **Output:** Text embeddings
- **Token limits:**
  - Input: 8,192
  - Output dimension size: 3072, 1536, or 768
- **Latest update:** March 2025

### Text Embedding (Experimental)

- **Model code:** `models/text-embedding-004`
- **Inputs:** Text
- **Output:** Text embeddings
- **Token limits:**
  - Input: 2,048
  - Output dimension size: 768
- **Rate limits:** 1,500 requests per minute
- **Latest update:** April 2024

### Embedding

- **Model code:** `models/embedding-001`
- **Inputs:** Text
- **Output:** Text embeddings
- **Token limits:**
  - Input: 2,048
  - Output dimension size: 768
- **Rate limits:** 1,500 requests per minute
- **Latest update:** December 2023

### AQA

- **Model code:** `models/aqa`
- **Inputs:** Text
- **Output:** Text
- **Token limits:**
  - Input: 7,168
  - Output: 1,024
- **Rate limits:** 1,500 requests per minute
- **Latest update:** December 2023

---

## Model Version Patterns

- **Latest stable:** `<model>-<generation>-<variation>` (e.g., `gemini-2.0-flash`)
- **Stable:** `<model>-<generation>-<variation>-<version>` (e.g., `gemini-2.0-flash-001`)
- **Preview:** `<model>-<generation>-<variation>-<version>` (e.g., `gemini-2.5-pro-preview-05-06`)
- **Experimental:** `<model>-<generation>-<variation>-<version>` (e.g., `gemini-2.0-pro-exp-02-05`)

> **Note:** Experimental models may be replaced or removed at any time and are not guaranteed to become stable.

---

## Supported Languages

Gemini models are trained to work with the following languages:

| Language                         | Code | Language   | Code |
| -------------------------------- | ---- | ---------- | ---- |
| Arabic                           | ar   | Hindi      | hi   |
| Bengali                          | bn   | Hungarian  | hu   |
| Bulgarian                        | bg   | Indonesian | id   |
| Chinese (Simplified/Traditional) | zh   | Italian    | it   |
| Croatian                         | hr   | Japanese   | ja   |
| Czech                            | cs   | Korean     | ko   |
| Danish                           | da   | Latvian    | lv   |
| Dutch                            | nl   | Lithuanian | lt   |
| English                          | en   | Norwegian  | no   |
| Estonian                         | et   | Polish     | pl   |
| Finnish                          | fi   | Portuguese | pt   |
| French                           | fr   | Romanian   | ro   |
| German                           | de   | Russian    | ru   |
| Greek                            | el   | Serbian    | sr   |
| Hebrew                           | iw   | Slovak     | sk   |
| Slovenian                        | sl   | Spanish    | es   |
| Swahili                          | sw   | Swedish    | sv   |
| Thai                             | th   | Turkish    | tr   |
| Ukrainian                        | uk   | Vietnamese | vi   |

---

## Previous Experimental Models

| Model Code                            | Base Model                  | Replacement Version                       |
| ------------------------------------- | --------------------------- | ----------------------------------------- |
| gemini-2.5-flash-preview-04-17        | Gemini 2.5 Flash            | gemini-2.5-flash-preview-05-20            |
| gemini-2.0-flash-exp-image-generation | Gemini 2.0 Flash            | gemini-2.0-flash-preview-image-generation |
| gemini-2.5-pro-preview-03-25          | Gemini 2.5 Pro Preview      | gemini-2.5-pro-preview-05-06              |
| gemini-2.0-flash-thinking-exp-01-21   | Gemini 2.5 Flash            | gemini-2.5-flash-preview-04-17            |
| gemini-2.0-pro-exp-02-05              | Gemini 2.0 Pro Experimental | gemini-2.5-pro-preview-03-25              |
| gemini-2.0-flash-exp                  | Gemini 2.0 Flash            | gemini-2.0-flash                          |
| gemini-exp-1206                       | Gemini 2.0 Pro              | gemini-2.0-pro-exp-02-05                  |
| gemini-2.0-flash-thinking-exp-1219    | Gemini 2.0 Flash Thinking   | gemini-2.0-flash-thinking-exp-01-21       |
| gemini-exp-1121                       | Gemini                      | gemini-exp-1206                           |
| gemini-exp-1114                       | Gemini                      | gemini-exp-1206                           |
| gemini-1.5-pro-exp-0827               | Gemini 1.5 Pro              | gemini-exp-1206                           |
| gemini-1.5-pro-exp-0801               | Gemini 1.5 Pro              | gemini-exp-1206                           |
| gemini-1.5-flash-8b-exp-0924          | Gemini 1.5 Flash-8B         | gemini-1.5-flash-8b                       |
| gemini-1.5-flash-8b-exp-0827          | Gemini 1.5 Flash-8B         | gemini-1.5-flash-8b                       |

---

## Notes

- A token is equivalent to about 4 characters for Gemini models. 100 tokens are about 60-80 English words.
- See the [official rate limits page](https://ai.google.dev/gemini-api/docs/rate-limits) for up-to-date information.
