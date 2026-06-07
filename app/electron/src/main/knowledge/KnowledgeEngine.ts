import { ChromaVectorStore, VectorStore } from './ChromaVectorStore.js';
import { KnowledgeDocument, KnowledgeChunk } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

export class KnowledgeEngine {
  private static instance: KnowledgeEngine;
  private vectorStore: VectorStore;

  private constructor() {
    this.vectorStore = new ChromaVectorStore();
  }

  public static getInstance(): KnowledgeEngine {
    if (!KnowledgeEngine.instance) {
      KnowledgeEngine.instance = new KnowledgeEngine();
    }
    return KnowledgeEngine.instance;
  }

  public async ingestDocument(collectionName: string, document: KnowledgeDocument): Promise<void> {
    // In a real system, you would chunk the text here.
    // For now, we will create a single chunk out of the entire document.
    const chunkId = uuidv4();
    const chunk: KnowledgeChunk = {
      id: chunkId,
      documentId: document.id,
      content: document.content
    };

    await this.vectorStore.addDocuments(
      collectionName,
      [chunkId],
      [chunk.content],
      [{ documentId: document.id, contextPackId: document.contextPackId, title: document.title }]
    );
  }

  public async searchKnowledge(collectionName: string, query: string, topK: number = 5): Promise<any> {
    return await this.vectorStore.search(collectionName, query, topK);
  }
}
