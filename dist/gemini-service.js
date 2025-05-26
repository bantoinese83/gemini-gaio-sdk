import { GoogleGenAI, Modality, } from "@google/genai";
/**
 * A reusable service class for interacting with the Google Gemini API.
 */
export class GeminiService {
    genAI;
    /**
     * Initializes the GeminiService.
     * @param apiKey Your Google Gemini API key.
     */
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is required for GeminiService.");
        }
        this.genAI = new GoogleGenAI({ apiKey });
    }
    /**
     * Performs text generation using a specified model.
     * Supports basic text input, system instructions, and generation config.
     * Also supports multimodal inputs.
     *
     * @param model The name of the model to use (e.g., "gemini-2.0-flash").
     * @param contents The input contents. Can be a string for text-only, or an array of Content objects for multimodal. Use buildMultimodalContent helper for multimodal.
     * @param config Optional generation configuration (temperature, maxOutputTokens, systemInstruction, etc.).
     * @returns A promise that resolves with the GenerateContentResponse.
     */
    async generateText(model, contents, config) {
        console.log(`Generating text with model: ${model}`);
        const response = await this.genAI.models.generateContent({
            model,
            contents,
            config,
        });
        console.log("Text generation complete.");
        return response;
    }
    /**
     * Performs streaming text generation.
     * Receives GenerateContentResponse instances incrementally.
     *
     * @param model The name of the model to use (e.g., "gemini-2.0-flash").
     * @param contents The input contents. Can be a string for text-only, or an array of Content objects for multimodal. Use buildMultimodalContent helper for multimodal.
     * @param config Optional generation configuration.
     * @returns A promise that resolves with an AsyncIterable allowing you to process chunks as they arrive.
     */
    async generateTextStream(model, contents, config) {
        console.log(`Starting text stream with model: ${model}`);
        const response = await this.genAI.models.generateContentStream({
            model,
            contents,
            config,
        });
        console.log("Text stream started.");
        return response;
    }
    /**
     * Creates a new chat session instance.
     * This instance keeps track of the conversation history.
     *
     * @param model The name of the model to use (e.g., "gemini-2.0-flash").
     * @param history Optional initial conversation history.
     * @returns A Chat instance. Use its sendMessage or sendMessageStream methods for turns.
     */
    createChat(model, history) {
        console.log(`Creating chat session with model: ${model}`);
        const chat = this.genAI.chats.create({
            model,
            history,
        });
        console.log("Chat session created.");
        return chat;
    }
    /**
     * Generates an image using a model that supports image generation.
     * This method parses the response to extract image data (base64) and any accompanying text.
     * Requires a model like "gemini-2.0-flash-preview-image-generation".
     *
     * @param model The image generation model (e.g., "gemini-2.0-flash-preview-image-generation").
     * @param contents The input contents. Can be text, or text + image(s) for editing. Use buildMultimodalContent helper for multimodal inputs.
     * @param config Optional generation configuration. Note: responseModalities will be overridden to ['TEXT', 'IMAGE'].
     * @returns A promise resolving to an array of parts ({ type: 'text', data: string } or { type: 'image', data: base64String }).
     */
    async generateImage(model, contents, config) {
        console.log(`Generating image with model: ${model}`);
        // Ensure responseModalities is set correctly for image generation
        const finalConfig = {
            ...config,
            responseModalities: [Modality.TEXT, Modality.IMAGE],
        };
        const response = await this.genAI.models.generateContent({
            model,
            contents,
            config: finalConfig,
        });
        const extractedParts = [];
        // Check candidates and content parts
        if (response.candidates && response.candidates.length > 0) {
            const candidate = response.candidates[0]; // Assuming the first candidate is the primary result
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if ("text" in part && part.text) {
                        extractedParts.push({ type: "text", data: part.text });
                    }
                    else if ("inlineData" in part && part.inlineData) {
                        extractedParts.push({
                            type: "image",
                            data: part.inlineData.data, // Base64 string
                        });
                    }
                    // Handle other part types if needed in the future
                }
            }
        }
        if (extractedParts.length === 0) {
            console.warn("Image generation response did not contain expected text or inlineData parts.");
        }
        console.log(`Image generation complete. Found ${extractedParts.length} parts.`);
        return extractedParts;
    }
    /**
     * Converts text to single-speaker audio.
     * Requires a model like "gemini-2.5-flash-preview-tts".
     * Note: This method returns the raw audio Buffer. You need to save it to a file (e.g., using 'wav').
     *
     * @param model The TTS model (e.g., "gemini-2.5-flash-preview-tts").
     * @param text The text to convert to speech.
     * @param voiceName The name of the prebuilt voice to use (e.g., 'Kore', 'Puck').
     * @returns A promise resolving to a Buffer containing the audio data (likely PCM).
     */
    async generateSingleSpeakerSpeech(model, text, voiceName) {
        console.log(`Generating single-speaker speech with model: ${model}`);
        const contents = [{ parts: [{ text: text }] }];
        const speechConfig = {
            voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voiceName },
            },
        };
        const finalConfig = {
            responseModalities: [Modality.AUDIO],
            speechConfig: speechConfig,
        };
        const response = await this.genAI.models.generateContent({
            model,
            contents,
            config: finalConfig,
        });
        const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!audioData) {
            throw new Error("Could not extract audio data from TTS response.");
        }
        console.log("Single-speaker speech generation complete.");
        return Buffer.from(audioData, "base64");
    }
    /**
     * Converts text to multi-speaker audio.
     * Requires a model like "gemini-2.5-flash-preview-tts".
     * Note: This method returns the raw audio Buffer. You need to save it to a file (e.g., using 'wav').
     *
     * @param model The TTS model (e.g., "gemini-2.5-flash-preview-tts").
     * @param text The text conversation to convert (format like "Speaker: Dialogue").
     * @param speakerConfigs An array defining each speaker and their voice name. Max 2 speakers supported by the API.
     * @returns A promise resolving to a Buffer containing the audio data (likely PCM).
     */
    async generateMultiSpeakerSpeech(model, text, speakerConfigs) {
        console.log(`Generating multi-speaker speech with model: ${model}`);
        if (speakerConfigs.length === 0 || speakerConfigs.length > 2) {
            throw new Error("Multi-speaker TTS requires 1 or 2 speaker configurations.");
        }
        const contents = [{ parts: [{ text: text }] }];
        const multiSpeakerVoiceConfig = {
            speakerVoiceConfigs: speakerConfigs.map((cfg) => ({
                speaker: cfg.speaker,
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: cfg.voiceName },
                },
            })),
        };
        const speechConfig = {
            multiSpeakerVoiceConfig: multiSpeakerVoiceConfig,
        };
        const finalConfig = {
            responseModalities: [Modality.AUDIO],
            speechConfig: speechConfig,
        };
        const response = await this.genAI.models.generateContent({
            model,
            contents,
            config: finalConfig,
        });
        const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!audioData) {
            throw new Error("Could not extract audio data from TTS response.");
        }
        console.log("Multi-speaker speech generation complete.");
        return Buffer.from(audioData, "base64");
    }
    /**
     * Generates structured output (like JSON or an enum value) based on a schema.
     * Requires `responseMimeType` and `responseSchema` in the config.
     * Note: The response is returned as a GenerateContentResponse, and the structured data
     * is typically found in `response.text`.
     *
     * @param model The name of the model to use (e.g., "gemini-2.0-flash").
     * @param contents The input contents. Can be a string or Content array.
     * @param config Generation configuration, MUST include `responseMimeType` ('application/json' or 'text/x.enum') and `responseSchema`.
     * @returns A promise that resolves with the GenerateContentResponse containing the structured output string in `response.text`.
     */
    async generateStructuredOutput(model, contents, config) {
        console.log(`Generating structured output (${config.responseMimeType}) with model: ${model}`);
        if (!config.responseMimeType || !config.responseSchema) {
            throw new Error("generateStructuredOutput requires responseMimeType and responseSchema in the config.");
        }
        // We use the standard generateContent call, but with the required config fields
        const response = await this.genAI.models.generateContent({
            model,
            contents,
            config: config, // Pass the full config including the structured output fields
        });
        console.log("Structured output generation complete.");
        // The structured output (JSON string or enum value) is in response.text
        return response;
    }
    /**
     * Helper function to build the Content array for multimodal inputs (text + images).
     * Images should be provided as base64 strings.
     *
     * @param text The text part of the input.
     * @param images An array of image objects, each with base64 data and mimeType.
     * @returns An array of Content objects suitable for generateText or generateImage methods.
     */
    buildMultimodalContent(text, images) {
        const parts = [{ text: text }];
        for (const image of images) {
            parts.push({
                inlineData: {
                    mimeType: image.mimeType,
                    data: image.data, // Base64 string
                },
            });
        }
        return [{ parts: parts }];
    }
    /**
     * Summarizes a small PDF (under 20MB) from a remote URL using inline base64 encoding.
     * @param model The Gemini model to use (e.g., 'gemini-2.0-flash').
     * @param pdfUrl The URL of the PDF to summarize.
     * @param prompt The prompt to use (e.g., 'Summarize this document').
     * @returns The summary text.
     */
    async summarizePdfFromUrl(model, pdfUrl, prompt = "Summarize this document") {
        const pdfResp = await fetch(pdfUrl).then((response) => response.arrayBuffer());
        const contents = [
            { text: prompt },
            {
                inlineData: {
                    mimeType: 'application/pdf',
                    data: Buffer.from(pdfResp).toString("base64"),
                },
            },
        ];
        const response = await this.genAI.models.generateContent({ model, contents });
        return response.text;
    }
    /**
     * Summarizes a small PDF (under 20MB) from a local file using inline base64 encoding.
     * @param model The Gemini model to use.
     * @param filePath The local path to the PDF file.
     * @param prompt The prompt to use.
     * @returns The summary text.
     */
    async summarizePdfFromFile(model, filePath, prompt = "Summarize this document") {
        const fs = await import('fs');
        const contents = [
            { text: prompt },
            {
                inlineData: {
                    mimeType: 'application/pdf',
                    data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
                },
            },
        ];
        const response = await this.genAI.models.generateContent({ model, contents });
        return response.text;
    }
    /**
     * Uploads a file using the File API and waits for processing to complete.
     * @param fileInput File (Blob, string path, or File) to upload.
     * @param displayName Display name for the file.
     * @returns The processed file object (with uri and mimeType).
     */
    async uploadFileAndWait(fileInput, displayName) {
        const file = await this.genAI.files.upload({
            file: fileInput,
            config: { displayName },
        });
        // Wait for processing
        let getFile = await this.genAI.files.get({ name: file.name });
        while (getFile.state === 'PROCESSING') {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            getFile = await this.genAI.files.get({ name: file.name });
        }
        if (getFile.state === 'FAILED') {
            throw new Error('File processing failed.');
        }
        return getFile;
    }
    /**
     * Summarizes a large PDF (over 20MB) from a remote URL using the File API.
     * @param model The Gemini model to use.
     * @param pdfUrl The URL of the PDF to summarize.
     * @param prompt The prompt to use.
     * @param displayName Display name for the file.
     * @returns The summary text.
     */
    async summarizeLargePdfFromUrl(model, pdfUrl, prompt = "Summarize this document", displayName = "Remote PDF") {
        const pdfResp = await fetch(pdfUrl).then((response) => response.arrayBuffer());
        const fileBlob = new Blob([pdfResp], { type: 'application/pdf' });
        const file = await this.uploadFileAndWait(fileBlob, displayName);
        // @ts-ignore
        const { createPartFromUri } = await import('@google/genai');
        const content = [prompt];
        if (file.uri && file.mimeType) {
            content.push(createPartFromUri(file.uri, file.mimeType));
        }
        const response = await this.genAI.models.generateContent({ model, contents: content });
        return response.text;
    }
    /**
     * Summarizes a large PDF (over 20MB) from a local file using the File API.
     * @param model The Gemini model to use.
     * @param filePath The local path to the PDF file.
     * @param prompt The prompt to use.
     * @param displayName Display name for the file.
     * @returns The summary text.
     */
    async summarizeLargePdfFromFile(model, filePath, prompt = "Summarize this document", displayName = "Local PDF") {
        const file = await this.uploadFileAndWait(filePath, displayName);
        // @ts-ignore
        const { createPartFromUri } = await import('@google/genai');
        const content = [prompt];
        if (file.uri && file.mimeType) {
            content.push(createPartFromUri(file.uri, file.mimeType));
        }
        const response = await this.genAI.models.generateContent({ model, contents: content });
        return response.text;
    }
    /**
     * Summarizes multiple PDFs (local or remote, large or small) using the File API.
     * @param model The Gemini model to use.
     * @param pdfs Array of { file: Blob | string (path) | ArrayBuffer, displayName: string, isUrl?: boolean }
     * @param prompt The prompt to use.
     * @returns The summary text.
     */
    async summarizeMultiplePdfs(model, pdfs, prompt) {
        // @ts-ignore
        const { createPartFromUri } = await import('@google/genai');
        const content = [prompt];
        for (const pdf of pdfs) {
            let fileInput = pdf.file;
            if (pdf.isUrl) {
                // Fetch and convert to Blob
                const pdfResp = await fetch(pdf.file).then((response) => response.arrayBuffer());
                fileInput = new Blob([pdfResp], { type: 'application/pdf' });
            }
            const file = await this.uploadFileAndWait(fileInput, pdf.displayName);
            if (file.uri && file.mimeType) {
                content.push(createPartFromUri(file.uri, file.mimeType));
            }
        }
        const response = await this.genAI.models.generateContent({ model, contents: content });
        return response.text;
    }
    /**
     * Connects to the Lyria RealTime music generation session.
     * @param onMessage Callback for receiving audio chunks (raw PCM, 48kHz, stereo).
     * @param onError Callback for errors.
     * @param onClose Callback for session close.
     * @returns The session object for further control.
     */
    async connectLyriaRealtimeSession({ onMessage, onError, onClose, model = 'models/lyria-realtime-exp', }) {
        // @ts-ignore
        const client = this.genAI;
        const session = client.live.music.connect({
            model,
            callbacks: {
                onMessage,
                onError,
                onClose,
            },
        });
        return session;
    }
    /**
     * Sets weighted prompts for Lyria RealTime music generation.
     * @param session The Lyria session object.
     * @param weightedPrompts Array of { text, weight }.
     */
    async setLyriaWeightedPrompts(session, weightedPrompts) {
        await session.setWeightedPrompts({ weightedPrompts });
    }
    /**
     * Sets music generation config for Lyria RealTime.
     * @param session The Lyria session object.
     * @param config MusicGenerationConfig (bpm, temperature, density, etc.).
     */
    async setLyriaMusicGenerationConfig(session, config) {
        await session.setMusicGenerationConfig({ musicGenerationConfig: config });
    }
    /**
     * Starts music generation in the Lyria session.
     * @param session The Lyria session object.
     */
    async playLyriaMusic(session) {
        await session.play();
    }
    /**
     * Pauses music generation in the Lyria session.
     * @param session The Lyria session object.
     */
    async pauseLyriaMusic(session) {
        await session.pause();
    }
    /**
     * Stops music generation in the Lyria session.
     * @param session The Lyria session object.
     */
    async stopLyriaMusic(session) {
        await session.stop();
    }
    /**
     * Resets the Lyria session context (for hard transitions, e.g., bpm/scale changes).
     * @param session The Lyria session object.
     */
    async resetLyriaContext(session) {
        await session.reset_context();
    }
    /**
     * Connects to the Gemini Live API for real-time text/audio streaming.
     * @param model The model to use (e.g., 'gemini-2.0-flash-live-001').
     * @param responseModality 'TEXT' or 'AUDIO'.
     * @param callbacks { onopen, onmessage, onerror, onclose }
     * @returns The live session object.
     */
    async connectLiveSession({ model = 'gemini-2.0-flash-live-001', responseModality = 'TEXT', callbacks, config = {}, }) {
        // @ts-ignore
        const { Modality } = await import('@google/genai');
        const session = await this.genAI.live.connect({
            model,
            callbacks,
            config: { responseModalities: [Modality[responseModality]], ...config },
        });
        return session;
    }
    /**
     * Sends a text turn to the Live API session.
     * @param session The live session object.
     * @param text The text to send.
     */
    async sendLiveText(session, text) {
        await session.sendClientContent({ turns: text });
    }
    /**
     * Sends audio (16-bit PCM, 16kHz, mono, base64) to the Live API session.
     * @param session The live session object.
     * @param base64Audio The base64-encoded audio data.
     */
    async sendLiveAudio(session, base64Audio) {
        await session.sendRealtimeInput({
            audio: {
                data: base64Audio,
                mimeType: 'audio/pcm;rate=16000',
            },
        });
    }
    /**
     * Closes a Live API or Lyria session.
     * @param session The session object.
     */
    async closeSession(session) {
        await session.close();
    }
    /**
     * Generate content with Gemini 2.5 "thinking" (thought summaries, budget).
     * @param model Gemini 2.5 model (e.g., 'gemini-2.5-flash-preview-05-20').
     * @param contents Prompt or Content array.
     * @param includeThoughts Whether to include thought summaries.
     * @param thinkingBudget Optional thinking token budget (0 disables thinking).
     * @param config Additional config.
     * @returns { answer: string, thoughts: string, usage?: any }
     */
    async generateThinkingContent({ model, contents, includeThoughts = false, thinkingBudget, config = {}, }) {
        const thinkingConfig = {};
        if (includeThoughts)
            thinkingConfig.includeThoughts = true;
        if (typeof thinkingBudget === 'number')
            thinkingConfig.thinkingBudget = thinkingBudget;
        const response = await this.genAI.models.generateContent({
            model,
            contents,
            config: { ...config, thinkingConfig },
        });
        let answer = '', thoughts = '';
        if (response.candidates && response.candidates[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (!part.text)
                    continue;
                if (part.thought)
                    thoughts += part.text;
                else
                    answer += part.text;
            }
        }
        return { answer, thoughts, usage: response.usageMetadata };
    }
    /**
     * Generate content with Gemini 2.5 "thinking" (streaming, rolling thoughts).
     * @param model Gemini 2.5 model.
     * @param contents Prompt or Content array.
     * @param includeThoughts Whether to include thought summaries.
     * @param thinkingBudget Optional thinking token budget.
     * @param config Additional config.
     * @param onChunk Callback for each chunk ({ answer, thoughts, chunk }).
     */
    async generateThinkingContentStream({ model, contents, includeThoughts = false, thinkingBudget, config = {}, onChunk, }) {
        const thinkingConfig = {};
        if (includeThoughts)
            thinkingConfig.includeThoughts = true;
        if (typeof thinkingBudget === 'number')
            thinkingConfig.thinkingBudget = thinkingBudget;
        const response = await this.genAI.models.generateContentStream({
            model,
            contents,
            config: { ...config, thinkingConfig },
        });
        let answer = '', thoughts = '';
        for await (const chunk of response) {
            if (chunk.candidates && chunk.candidates[0]?.content?.parts) {
                for (const part of chunk.candidates[0].content.parts) {
                    if (!part.text)
                        continue;
                    if (part.thought)
                        thoughts += part.text;
                    else
                        answer += part.text;
                }
            }
            onChunk({ answer, thoughts, chunk });
        }
    }
    /**
     * Analyze a video file (inline for <20MB, File API for larger).
     * @param model Gemini model.
     * @param filePath Path to video file.
     * @param prompt Prompt to analyze video.
     * @param useFileApi Force use of File API (default: auto by size).
     * @param videoMetadata Optional video metadata (clipping, fps).
     * @returns The model's response text.
     */
    async analyzeVideoFile({ model, filePath, prompt, useFileApi = false, videoMetadata, }) {
        const fs = await import('fs');
        const stats = fs.statSync(filePath);
        const isSmall = stats.size < 20 * 1024 * 1024;
        if (isSmall && !useFileApi) {
            // Inline
            const base64Video = fs.readFileSync(filePath, { encoding: 'base64' });
            const parts = [
                {
                    inlineData: {
                        mimeType: 'video/mp4',
                        data: base64Video,
                        videoMetadata,
                    },
                },
                { text: prompt },
            ];
            const response = await this.genAI.models.generateContent({ model, contents: parts });
            return response.text;
        }
        else {
            // File API
            const file = await this.genAI.files.upload({
                file: filePath,
                config: { mimeType: 'video/mp4' },
            });
            // @ts-ignore
            const { createUserContent, createPartFromUri } = await import('@google/genai');
            const parts = createUserContent([
                createPartFromUri(file.uri, file.mimeType, videoMetadata),
                prompt,
            ]);
            const response = await this.genAI.models.generateContent({ model, contents: parts });
            return response.text;
        }
    }
    /**
     * Analyze a video from a YouTube URL (preview feature).
     * @param model Gemini model.
     * @param youtubeUrl The YouTube video URL.
     * @param prompt Prompt to analyze video.
     * @returns The model's response text.
     */
    async analyzeYoutubeVideo({ model, youtubeUrl, prompt, }) {
        // @ts-ignore
        const { createUserContent } = await import('@google/generative-ai');
        const parts = createUserContent([
            prompt,
            { fileData: { fileUri: youtubeUrl } },
        ]);
        const response = await this.genAI.models.generateContent({ model, contents: parts });
        return response.text;
    }
    /**
     * Analyze an audio file (inline for <20MB, File API for larger).
     * @param model Gemini model.
     * @param filePath Path to audio file.
     * @param prompt Prompt to analyze audio.
     * @param useFileApi Force use of File API (default: auto by size).
     * @returns The model's response text.
     */
    async analyzeAudioFile({ model, filePath, prompt, useFileApi = false, }) {
        const fs = await import('fs');
        const stats = fs.statSync(filePath);
        const isSmall = stats.size < 20 * 1024 * 1024;
        if (isSmall && !useFileApi) {
            // Inline
            const base64Audio = fs.readFileSync(filePath, { encoding: 'base64' });
            const parts = [
                { text: prompt },
                {
                    inlineData: {
                        mimeType: 'audio/mp3',
                        data: base64Audio,
                    },
                },
            ];
            const response = await this.genAI.models.generateContent({ model, contents: parts });
            return response.text;
        }
        else {
            // File API
            const file = await this.genAI.files.upload({
                file: filePath,
                config: { mimeType: 'audio/mp3' },
            });
            // @ts-ignore
            const { createUserContent, createPartFromUri } = await import('@google/genai');
            const parts = createUserContent([
                createPartFromUri(file.uri, file.mimeType),
                prompt,
            ]);
            const response = await this.genAI.models.generateContent({ model, contents: parts });
            return response.text;
        }
    }
    /**
     * Count tokens in an audio file (using File API).
     * @param model Gemini model.
     * @param filePath Path to audio file.
     * @returns Total token count.
     */
    async countAudioTokens({ model, filePath, }) {
        // File API only
        const file = await this.genAI.files.upload({
            file: filePath,
            config: { mimeType: 'audio/mp3' },
        });
        // @ts-ignore
        const { createUserContent, createPartFromUri } = await import('@google/genai');
        const parts = createUserContent([
            createPartFromUri(file.uri, file.mimeType),
        ]);
        const response = await this.genAI.models.countTokens({ model, contents: parts });
        return response.totalTokens;
    }
    /**
     * Generate content with grounding using Google Search (Gemini 2.0+).
     * @param model Gemini model.
     * @param contents Prompt or Content array.
     * @param config Additional config (tools, etc.).
     * @returns { text: string, groundingMetadata?: any }
     */
    async generateGroundedContent({ model, contents, config = {}, }) {
        const response = await this.genAI.models.generateContent({
            model,
            contents,
            config: { ...config, tools: [{ googleSearch: {} }] },
        });
        const text = response.text;
        const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
        return { text, groundingMetadata };
    }
    /**
     * Extract Google Search Suggestions from a grounded response.
     * @param groundingMetadata The groundingMetadata from a response.
     * @returns Array of search queries (suggestions).
     */
    extractGoogleSearchSuggestions(groundingMetadata) {
        if (!groundingMetadata)
            return [];
        return groundingMetadata.webSearchQueries || [];
    }
}
// Optional: Helper function to save audio buffer to a WAV file (requires 'wav' library)
// You can use this function *after* calling generateSingleSpeakerSpeech or generateMultiSpeakerSpeech
/*
import wav from 'wav';
import fs from 'fs';

export async function saveWaveFile(
    filename: string,
    pcmData: Buffer,
    channels = 1,
    rate = 24000, // Based on common model output format
    sampleWidth = 2, // 16-bit PCM
): Promise<void> {
    return new Promise((resolve, reject) => {
        const writer = new wav.FileWriter(filename, {
            channels,
            sampleRate: rate,
            bitDepth: sampleWidth * 8,
        });

        writer.on('finish', resolve);
        writer.on('error', reject);

        writer.write(pcmData);
        writer.end();
    });
}
*/ 
