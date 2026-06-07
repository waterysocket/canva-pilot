import fs from 'fs';
import path from 'path';

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const r of replacements) {
    content = content.replace(r.from, r.to);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

replaceInFile('./main.ts', [
  { from: "'./src/main/types.js'", to: "'./src/main/types/index.js'" }
]);

replaceInFile('./src/main/agent/AgentOrchestrator.ts', [
  { from: "'../../types/index.js'", to: "'../types/index.js'" }
]);

replaceInFile('./src/main/context/ContextEngine.ts', [
  { from: "'../../types/index.js'", to: "'../types/index.js'" }
]);

replaceInFile('./src/main/events/ExecutionMonitor.ts', [
  { from: "'../../types/index.js'", to: "'../types/index.js'" }
]);

replaceInFile('./src/main/knowledge/ContextRefreshSystem.ts', [
  { from: "'../../types/index.js'", to: "'../types/index.js'" }
]);

replaceInFile('./src/main/knowledge/KnowledgeEngine.ts', [
  { from: "'../../types/index.js'", to: "'../types/index.js'" }
]);

replaceInFile('./src/main/vision/VisionExecutionLoop.ts', [
  { from: "'../../providers/ProviderManager.js'", to: "'../providers/ProviderManager.js'" },
  { from: "'../../automation/AutomationEngine.js'", to: "'../automation/AutomationEngine.js'" },
  { from: "'../../types/index.js'", to: "'../types/index.js'" }
]);

console.log("Fixes applied.");
