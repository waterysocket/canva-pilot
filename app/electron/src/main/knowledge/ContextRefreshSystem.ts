import { KnowledgeEngine } from './KnowledgeEngine.js';
import { KnowledgeDocument } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

export class ContextRefreshSystem {
  private knowledgeEngine: KnowledgeEngine;

  constructor() {
    this.knowledgeEngine = KnowledgeEngine.getInstance();
  }

  public async refreshContext(packName: string, sources: { title: string, content: string }[]): Promise<void> {
    const collectionName = `${packName.toLowerCase()}-knowledge`;
    
    // In a real system, you might fetch docs from the web or read local files here.
    
    for (const source of sources) {
      const doc: KnowledgeDocument = {
        id: uuidv4(),
        contextPackId: packName.toLowerCase(),
        title: source.title,
        content: source.content
      };

      await this.knowledgeEngine.ingestDocument(collectionName, doc);
    }
  }
}
