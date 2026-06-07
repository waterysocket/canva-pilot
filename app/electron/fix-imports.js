import fs from 'fs';
import path from 'path';

function fixImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Regex to match imports: import ... from './path' or export ... from './path'
      // It looks for string literals starting with '.' and NOT ending with '.js'
      content = content.replace(/(from\s+['"])(\.[^'"]+)(['"])/g, (match, p1, p2, p3) => {
        if (!p2.endsWith('.js') && !p2.endsWith('.json')) {
          let resolved = p2;
          if (resolved.endsWith('types')) {
            resolved = resolved + '/index';
          }
          return `${p1}${resolved}.js${p3}`;
        }
        return match;
      });

      // Handle require statements as well
      content = content.replace(/(require\(['"])(\.[^'"]+)(['"]\))/g, (match, p1, p2, p3) => {
        if (!p2.endsWith('.js') && !p2.endsWith('.json')) {
          let resolved = p2;
          if (resolved.endsWith('types')) {
            resolved = resolved + '/index';
          }
          return `${p1}${resolved}.js${p3}`;
        }
        return match;
      });

      // Fix Planner error: Parameter 's' implicitly has an 'any' type.
      if (fullPath.includes('Planner.ts')) {
        content = content.replace(/filter\(s =>/g, "filter((s: PlanStep) =>");
      }

      // Cleanup previously bad appends
      content = content.replace(/types\.js/g, 'types/index.js');
      content = content.replace(/ExecutionMonitor monitor\.js/g, 'ExecutionMonitor.js');
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

fixImports(path.resolve('./src/main'));

const mainPath = path.resolve('./main.ts');
if (fs.existsSync(mainPath)) {
  let content = fs.readFileSync(mainPath, 'utf8');
  content = content.replace(/(from\s+['"])(\.[^'"]+)(['"])/g, (match, p1, p2, p3) => {
    if (!p2.endsWith('.js') && !p2.endsWith('.json') && !p2.endsWith('.cjs') && !p2.endsWith('.cts')) {
      return `${p1}${p2}.js${p3}`;
    }
    return match;
  });
  content = content.replace(/(require\(['"])(\.[^'"]+)(['"]\))/g, (match, p1, p2, p3) => {
    if (!p2.endsWith('.js') && !p2.endsWith('.json') && !p2.endsWith('.cjs') && !p2.endsWith('.cts')) {
      return `${p1}${p2}.js${p3}`;
    }
    return match;
  });
  fs.writeFileSync(mainPath, content, 'utf8');
}

console.log("Imports fixed.");
