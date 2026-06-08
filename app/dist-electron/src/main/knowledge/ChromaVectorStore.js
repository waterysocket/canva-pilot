import { ChromaClient } from 'chromadb';
import { DefaultEmbeddingFunction } from '@chroma-core/default-embed';
import path from 'path';
import { app } from 'electron';
export class ChromaVectorStore {
    client;
    collections = new Map();
    embedder;
    constructor() {
        // Use embedded mode for local database-like experience
        // Data will be stored in the user's app data directory (automatically gitignored)
        const dataPath = path.join(app.getPath('userData'), 'chroma-db');
        this.client = new ChromaClient({ path: dataPath });
        this.embedder = new DefaultEmbeddingFunction();
    }
    async createCollection(name) {
        const collection = await this.client.getOrCreateCollection({
            name,
            embeddingFunction: this.embedder
        });
        this.collections.set(name, collection);
    }
    async getCollection(name) {
        if (!this.collections.has(name)) {
            await this.createCollection(name);
        }
        return this.collections.get(name);
    }
    async addDocuments(collectionName, ids, documents, metadatas) {
        const collection = await this.getCollection(collectionName);
        await collection.upsert({
            ids,
            documents,
            metadatas
        });
    }
    async search(collectionName, queryText, nResults = 3) {
        const collection = await this.getCollection(collectionName);
        const results = await collection.query({
            queryTexts: [queryText],
            nResults
        });
        return results;
    }
    async deleteDocuments(collectionName, ids) {
        const collection = await this.getCollection(collectionName);
        await collection.delete({ ids });
    }
    async getCollectionStats(name) {
        try {
            const collection = await this.getCollection(name);
            const count = await collection.count();
            return { count };
        }
        catch {
            return { count: 0 };
        }
    }
    async getAllDocuments(name) {
        try {
            const collection = await this.getCollection(name);
            const res = await collection.get();
            return res;
        }
        catch {
            return { ids: [], metadatas: [], documents: [] };
        }
    }
}
