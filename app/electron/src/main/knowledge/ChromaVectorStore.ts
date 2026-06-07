import { ChromaClient, Collection } from 'chromadb';

export interface VectorStore {
  addDocuments(collectionName: string, ids: string[], documents: string[], metadatas?: any[]): Promise<void>;
  search(collectionName: string, queryText: string, nResults: number): Promise<any>;
  deleteDocuments(collectionName: string, ids: string[]): Promise<void>;
  createCollection(name: string): Promise<void>;
  getCollectionStats(name: string): Promise<{ count: number }>;
  getAllDocuments(name: string): Promise<any>;
}

export class ChromaVectorStore implements VectorStore {
  private client: ChromaClient;
  private collections: Map<string, Collection> = new Map();

  constructor() {
    // Connects to local chroma daemon. In a production desktop app, 
    // you might manage the chroma binary lifecycle or use a different client configuration.
    this.client = new ChromaClient({ path: "http://localhost:8000" });
  }

  async createCollection(name: string): Promise<void> {
    const collection = await this.client.getOrCreateCollection({ name });
    this.collections.set(name, collection);
  }

  private async getCollection(name: string): Promise<Collection> {
    if (!this.collections.has(name)) {
      await this.createCollection(name);
    }
    return this.collections.get(name)!;
  }

  async addDocuments(collectionName: string, ids: string[], documents: string[], metadatas?: any[]): Promise<void> {
    const collection = await this.getCollection(collectionName);
    await collection.upsert({
      ids,
      documents,
      metadatas
    });
  }

  async search(collectionName: string, queryText: string, nResults: number = 3): Promise<any> {
    const collection = await this.getCollection(collectionName);
    const results = await collection.query({
      queryTexts: [queryText],
      nResults
    });
    return results;
  }

  async deleteDocuments(collectionName: string, ids: string[]): Promise<void> {
    const collection = await this.getCollection(collectionName);
    await collection.delete({ ids });
  }

  async getCollectionStats(name: string): Promise<{ count: number }> {
    try {
      const collection = await this.getCollection(name);
      const count = await collection.count();
      return { count };
    } catch {
      return { count: 0 };
    }
  }

  async getAllDocuments(name: string): Promise<any> {
    try {
      const collection = await this.getCollection(name);
      const res = await collection.get();
      return res;
    } catch {
      return { ids: [], metadatas: [], documents: [] };
    }
  }
}
