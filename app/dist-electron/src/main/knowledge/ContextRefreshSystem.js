import { KnowledgeEngine } from './KnowledgeEngine.js';
import { v4 as uuidv4 } from 'uuid';
export class ContextRefreshSystem {
    knowledgeEngine;
    constructor() {
        this.knowledgeEngine = KnowledgeEngine.getInstance();
    }
    async refreshContext(packName, sources) {
        const collectionName = `${packName.toLowerCase()}-knowledge`;
        // In a real system, you might fetch docs from the web or read local files here.
        for (const source of sources) {
            const doc = {
                id: uuidv4(),
                contextPackId: packName.toLowerCase(),
                title: source.title,
                content: source.content
            };
            await this.knowledgeEngine.ingestDocument(collectionName, doc);
        }
    }
}
