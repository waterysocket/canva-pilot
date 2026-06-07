import { ChromaVectorStore } from './ChromaVectorStore.js';
import { v4 as uuidv4 } from 'uuid';
export class KnowledgeEngine {
    static instance;
    vectorStore;
    constructor() {
        this.vectorStore = new ChromaVectorStore();
    }
    static getInstance() {
        if (!KnowledgeEngine.instance) {
            KnowledgeEngine.instance = new KnowledgeEngine();
        }
        return KnowledgeEngine.instance;
    }
    async ingestDocument(collectionName, document) {
        // In a real system, you would chunk the text here.
        // For now, we will create a single chunk out of the entire document.
        const chunkId = uuidv4();
        const chunk = {
            id: chunkId,
            documentId: document.id,
            content: document.content
        };
        await this.vectorStore.addDocuments(collectionName, [chunkId], [chunk.content], [{ documentId: document.id, contextPackId: document.contextPackId, title: document.title }]);
    }
    async searchKnowledge(collectionName, query, topK = 5) {
        return await this.vectorStore.search(collectionName, query, topK);
    }
    async deleteDocument(collectionName, chunkId) {
        await this.vectorStore.deleteDocuments(collectionName, [chunkId]);
    }
    async getCollectionStats(collectionName) {
        return await this.vectorStore.getCollectionStats(collectionName);
    }
    async getAllDocuments(collectionName) {
        return await this.vectorStore.getAllDocuments(collectionName);
    }
}
