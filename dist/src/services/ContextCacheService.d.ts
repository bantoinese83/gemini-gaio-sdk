/**
 * Service for context caching using Gemini API.
 */
import { CachedContent, Part, GenerateContentResponse } from '@google/genai';
import { BaseGenAIService } from './BaseGenAIService';
export declare class ContextCacheService extends BaseGenAIService {
    /**
     * Create a new ContextCacheService instance.
     * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
     */
    constructor(apiKey: string);
    /**
     * Create a cache from file(s) and/or system instruction.
     * @param params { model, fileUris, systemInstruction?, ttl? }
     * @returns The created cache object.
     */
    createCache({ model, fileUris, systemInstruction, ttl, }: {
        model: string;
        fileUris: Array<{
            uri: string;
            mimeType: string;
        }> | {
            uri: string;
            mimeType: string;
        };
        systemInstruction?: string;
        ttl?: string;
    }): Promise<CachedContent>;
    /**
     * List all cache metadata (paginated).
     * @param pageSize Number of results per page (default: 10).
     * @returns Array of cache metadata objects.
     */
    listCaches(pageSize?: number): Promise<CachedContent[]>;
    /**
     * Update a cache's TTL.
     * @param cacheName The cache name.
     * @param ttl TTL string (e.g., '7200s' for 2 hours).
     * @returns The updated cache object.
     */
    updateCacheTtl(cacheName: string, ttl: string): Promise<CachedContent>;
    /**
     * Delete a cache by name.
     * @param cacheName The cache name.
     */
    deleteCache(cacheName: string): Promise<void>;
    /**
     * Generate content using a cache (explicit context caching).
     * @param params { model, contents, cacheName, config? }
     * @returns The model response.
     */
    generateWithCache({ model, contents, cacheName, config, }: {
        model: string;
        contents: Part[];
        cacheName: string;
        config?: Record<string, unknown>;
    }): Promise<GenerateContentResponse>;
}
