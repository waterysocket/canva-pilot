import { ChromaClient } from 'chromadb';
export class ChromaVectorStore {
    client;
    collections = new Map();
    constructor() {
        // Connects to local chroma daemon. In a production desktop app, 
        // you might manage the chroma binary lifecycle or use a different client configuration.
        this.client = new ChromaClient({ path: "http://localhost:8000" });
    }
    async createCollection(name) {
        const collection = await this.client.getOrCreateCollection({ name });
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
}
