/**
 * Service for context caching using Gemini API.
 */
import { createUserContent, createPartFromUri } from "@google/genai";
import { BaseGenAIService } from "./BaseGenAIService";

export class ContextCacheService extends BaseGenAIService {
  /**
   * Create a new ContextCacheService instance.
   * @param apiKey Gemini API key (or set GEMINI_API_KEY env variable)
   */
  constructor(apiKey: string) {
    super(apiKey);
  }

  /**
   * Create a cache from file(s) and/or system instruction.
   * @param params { model, fileUris, systemInstruction?, ttl? }
   * @returns The created cache object.
   */
  async createCache({
    model,
    fileUris,
    systemInstruction,
    ttl,
  }: {
    model: string,
    fileUris: Array<{ uri: string, mimeType: string }> | { uri: string, mimeType: string },
    systemInstruction?: string,
    ttl?: string,
  }): Promise<any> {
    const files = Array.isArray(fileUris) ? fileUris : [fileUris];
    const contents = createUserContent(files.map(f => createPartFromUri(f.uri, f.mimeType)));
    const config: any = { contents };
    if (systemInstruction) config.systemInstruction = systemInstruction;
    if (ttl) config.ttl = ttl;
    return await this.genAI.caches.create({ model, config });
  }

  /**
   * List all cache metadata (paginated).
   * @param pageSize Number of results per page (default: 10).
   * @returns Array of cache metadata objects.
   */
  async listCaches(pageSize = 10): Promise<any[]> {
    const pager = await this.genAI.caches.list({ config: { pageSize } });
    let page = pager.page;
    const results: any[] = [];
    while (true) {
      for (const c of page) results.push(c);
      if (!pager.hasNextPage()) break;
      page = await pager.nextPage();
    }
    return results;
  }

  /**
   * Update a cache's TTL.
   * @param cacheName The cache name.
   * @param ttl TTL string (e.g., '7200s' for 2 hours).
   * @returns The updated cache object.
   */
  async updateCacheTtl(cacheName: string, ttl: string): Promise<any> {
    return await this.genAI.caches.update({ name: cacheName, config: { ttl } });
  }

  /**
   * Delete a cache by name.
   * @param cacheName The cache name.
   */
  async deleteCache(cacheName: string): Promise<void> {
    await this.genAI.caches.delete({ name: cacheName });
  }

  /**
   * Generate content using a cache (explicit context caching).
   * @param params { model, contents, cacheName, config? }
   * @returns The model response.
   */
  async generateWithCache({
    model,
    contents,
    cacheName,
    config = {},
  }: {
    model: string,
    contents: string | any[],
    cacheName: string,
    config?: any,
  }): Promise<any> {
    return await this.genAI.models.generateContent({
      model,
      contents,
      config: { ...config, cachedContent: cacheName },
    });
  }
} 