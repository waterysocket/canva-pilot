import { app } from 'electron';
import path from 'path';
import { promises as fs } from 'fs';
/**
 * Local file-based vector store using JSON files.
 * Stores data in %APPDATA%/canvapilot/vector-store/
 *
 * Note: This is a simple implementation without actual embeddings.
 * For semantic search, you would need to add an embedding function
 * and compute cosine similarity.
 */
export class LocalVectorStore {
    dataDir;
    collections = new Map();
    constructor() {
        this.dataDir = path.join(app.getPath('userData'), 'vector-store');
        this.initializeDataDir();
    }
    async initializeDataDir() {
        try {
            await fs.mkdir(this.dataDir, { recursive: true });
            // Load existing collections
            const files = await fs.readdir(this.dataDir);
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const collectionName = file.slice(0, -5); // Remove .json
                    try {
                        const content = await fs.readFile(path.join(this.dataDir, file), 'utf-8');
                        const data = JSON.parse(content);
                        this.collections.set(collectionName, data);
                    }
                    catch (e) {
                        console.warn(`Failed to load collection ${collectionName}:`, e);
                    }
                }
            }
        }
        catch (e) {
            console.warn('Failed to initialize vector store data directory:', e);
        }
    }
    getCollectionPath(name) {
        return path.join(this.dataDir, `${name}.json`);
    }
    async saveCollection(name) {
        const collection = this.collections.get(name);
        if (collection) {
            try {
                await fs.writeFile(this.getCollectionPath(name), JSON.stringify(collection, null, 2), 'utf-8');
            }
            catch (e) {
                console.warn(`Failed to save collection ${name}:`, e);
            }
        }
    }
    async loadCollection(name) {
        const filePath = this.getCollectionPath(name);
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(content);
        }
        catch {
            return null;
        }
    }
    async createCollection(name) {
        if (!this.collections.has(name)) {
            const existing = await this.loadCollection(name);
            if (existing) {
                this.collections.set(name, existing);
            }
            else {
                this.collections.set(name, { name, documents: [] });
                await this.saveCollection(name);
            }
        }
    }
    async getCollection(name) {
        if (!this.collections.has(name)) {
            await this.createCollection(name);
        }
        return this.collections.get(name);
    }
    async addDocuments(collectionName, ids, documents, metadatas) {
        const collection = await this.getCollection(collectionName);
        for (let i = 0; i < ids.length; i++) {
            // Check if document already exists
            const existingIndex = collection.documents.findIndex(d => d.id === ids[i]);
            const doc = {
                id: ids[i],
                documentId: metadatas?.[i]?.documentId || ids[i],
                content: documents[i],
                metadata: metadatas?.[i] || {}
            };
            if (existingIndex >= 0) {
                collection.documents[existingIndex] = doc;
            }
            else {
                collection.documents.push(doc);
            }
        }
        await this.saveCollection(collectionName);
    }
    async search(collectionName, queryText, nResults = 5) {
        const collection = await this.getCollection(collectionName);
        // Simple keyword-based search (BM25-like scoring)
        const queryWords = queryText.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        const scoredDocs = collection.documents.map(doc => {
            const contentLower = doc.content.toLowerCase();
            let score = 0;
            for (const word of queryWords) {
                const occurrences = (contentLower.match(new RegExp(word, 'g')) || []).length;
                score += occurrences;
            }
            return { doc, score };
        });
        // Sort by score descending
        scoredDocs.sort((a, b) => b.score - a.score);
        // Take top nResults
        const topResults = scoredDocs.slice(0, nResults);
        return {
            ids: topResults.map(r => r.doc.id),
            documents: topResults.map(r => r.doc.content),
            metadatas: topResults.map(r => r.doc.metadata),
            distances: topResults.map(r => r.score === 0 ? 1.0 : 1 / (1 + r.score)) // Convert score to "distance"
        };
    }
    async deleteDocuments(collectionName, ids) {
        const collection = await this.getCollection(collectionName);
        collection.documents = collection.documents.filter(d => !ids.includes(d.id));
        await this.saveCollection(collectionName);
    }
    async deleteCollection(collectionName) {
        this.collections.delete(collectionName);
        try {
            await fs.unlink(this.getCollectionPath(collectionName));
        }
        catch {
            // File might not exist
        }
    }
    async getCollectionStats(name) {
        const collection = await this.getCollection(name);
        return { count: collection.documents.length };
    }
    async getAllDocuments(name) {
        const collection = await this.getCollection(name);
        return {
            ids: collection.documents.map(d => d.id),
            documents: collection.documents.map(d => d.content),
            metadatas: collection.documents.map(d => ({
                documentId: d.documentId,
                title: d.metadata.title || 'Untitled',
                contextPackId: d.metadata.contextPackId || '',
                sourceUrl: d.metadata.sourceUrl || ''
            }))
        };
    }
}
