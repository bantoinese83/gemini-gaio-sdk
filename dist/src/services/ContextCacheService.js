/**
 * Service for context caching using Gemini API.
 */
import { createUserContent, createPartFromUri, } from '@google/genai';
import { BaseGenAIService } from './BaseGenAIService';
import { Logger, GeminiApiError, ValidationError } from '../utils/Logger';
export class ContextCacheService extends BaseGenAIService {
    /**
     * Create a new ContextCacheService instance.
     * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
     */
    constructor(apiKey) {
        super(apiKey);
    }
    /**
     * Create a cache from file(s) and/or system instruction.
     * @param params { model, fileUris, systemInstruction?, ttl? }
     * @returns The created cache object.
     */
    async createCache({ model, fileUris, systemInstruction, ttl, }) {
        try {
            if (!model || !fileUris) {
                Logger.error('ContextCacheService.createCache: Missing required params', {
                    model,
                    fileUris,
                });
                throw new ValidationError('model and fileUris are required');
            }
            const files = Array.isArray(fileUris) ? fileUris : [fileUris];
            const contents = createUserContent(files.map((f) => createPartFromUri(f.uri, f.mimeType)));
            const config = { contents };
            if (systemInstruction)
                config.systemInstruction = systemInstruction;
            if (ttl)
                config.ttl = ttl;
            return await this.genAI.caches.create({ model, config });
        }
        catch (err) {
            Logger.error('ContextCacheService.createCache error', err);
            throw new GeminiApiError('Failed to create cache', err);
        }
    }
    /**
     * List all cache metadata (paginated).
     * @param pageSize Number of results per page (default: 10).
     * @returns Array of cache metadata objects.
     */
    async listCaches(pageSize = 10) {
        try {
            const pager = await this.genAI.caches.list({ config: { pageSize } });
            let page = pager.page;
            const results = [];
            do {
                for (const c of page)
                    results.push(c);
                if (pager.hasNextPage()) {
                    page = await pager.nextPage();
                }
            } while (pager.hasNextPage());
            return results;
        }
        catch (err) {
            Logger.error('ContextCacheService.listCaches error', err);
            throw new GeminiApiError('Failed to list caches', err);
        }
    }
    /**
     * Update a cache's TTL.
     * @param cacheName The cache name.
     * @param ttl TTL string (e.g., '7200s' for 2 hours).
     * @returns The updated cache object.
     */
    async updateCacheTtl(cacheName, ttl) {
        try {
            if (!cacheName || !ttl) {
                Logger.error('ContextCacheService.updateCacheTtl: Missing required params', {
                    cacheName,
                    ttl,
                });
                throw new ValidationError('cacheName and ttl are required');
            }
            return await this.genAI.caches.update({ name: cacheName, config: { ttl } });
        }
        catch (err) {
            Logger.error('ContextCacheService.updateCacheTtl error', err);
            throw new GeminiApiError('Failed to update cache TTL', err);
        }
    }
    /**
     * Delete a cache by name.
     * @param cacheName The cache name.
     */
    async deleteCache(cacheName) {
        try {
            if (!cacheName) {
                Logger.error('ContextCacheService.deleteCache: Missing required param cacheName', {
                    cacheName,
                });
                throw new ValidationError('cacheName is required');
            }
            await this.genAI.caches.delete({ name: cacheName });
        }
        catch (err) {
            Logger.error('ContextCacheService.deleteCache error', err);
            throw new GeminiApiError('Failed to delete cache', err);
        }
    }
    /**
     * Generate content using a cache (explicit context caching).
     * @param params { model, contents, cacheName, config? }
     * @returns The model response.
     */
    async generateWithCache({ model, contents, cacheName, config = {}, }) {
        try {
            if (!model || !contents || !cacheName) {
                Logger.error('ContextCacheService.generateWithCache: Missing required params', {
                    model,
                    contents,
                    cacheName,
                });
                throw new ValidationError('model, contents, and cacheName are required');
            }
            return await this.genAI.models.generateContent({
                model,
                contents,
                config: { ...config, cachedContent: cacheName },
            });
        }
        catch (err) {
            Logger.error('ContextCacheService.generateWithCache error', err);
            throw new GeminiApiError('Failed to generate with cache', err);
        }
    }
}
