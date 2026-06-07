# CanvaPilot

A **open‑source** AI‑augmented design assistant built with **React, TypeScript, Vite, and Electron**. The app combines a visual dashboard, a command bar, and a powerful **Context Engine** that can ingest, embed, and retrieve documents via ChromaDB.

---

## ✨ Overview
- **Dashboard** – System configurations, hardware info, model compatibility, and a knowledge base.
- **Command Bar** – Quick prompt entry and task orchestration.
- **Context Engine** – Independent knowledge‑base layer that stores and queries documents using ChromaDB. It can be swapped out or extended for any software.
- **Models** – Visual (image/video) and LLM reasoning models are selectable.

---

## 🚀 Getting Started
### Prerequisites
- **Node.js** (v20+) and **npm** (or **pnpm/yarn**)
- **Git**
- **Docker** (to run ChromaDB locally) – optional if you have a running ChromaDB instance.
- **Python 3.10+** (only required for custom providers, not needed for the core app).

### Install dependencies
```powershell
# Clone the repository and install dependencies
git clone https://github.com/waterysocket/canva-pilot.git
Set-Location canva-pilot
npm install
```

### Run the development server (Vite)
```powershell
# Run the Vite development server (default http://localhost:5173)
npm run dev
```
The UI will hot‑reload as you edit source files.

### Start ChromaDB (vector store)
We ship a Docker compose snippet that starts a local ChromaDB instance on **port 8000**:
```powershell
# Start ChromaDB (vector store) on port 8000
docker run -d `
  -p 8000:8000 `
  -v $(pwd)/chroma-data:/chroma `
  ghcr.io/chroma-core/chroma:latest
```

If you prefer a manual install, see the [ChromaDB docs](https://www.trychroma.com/docs).

### Launch the Electron app (desktop)
```powershell
# Launch the Electron desktop app
npm run dev:electron
```
This will:
1. Build the Vite front‑end.
2. Open the Electron window pointing at the Vite dev server.
3. Connect the backend (IPC) and the Context Engine.

---

## 🌐 Ports & How to Change Them
| Service | Default Port | How to Change |
| ------- | ------------ | ------------- |
| Vite dev server | **5173** | Set `VITE_PORT` in a `.env` file or edit `vite.config.ts` → `server.port`.
| ChromaDB | **8000** | Pass `-p <new>:8000` to Docker (`docker run -p 9000:8000 …`) and update the vector store client in `app/electron/src/main/knowledge/ChromaVectorStore.ts` – change the `path` option.
| Electron IPC (internal) | No external port – uses Node IPC.

If a port is already in use, stop the conflicting process or assign a new one using the methods above, then restart the affected service.

---

## 📈 Future Scope & Extensibility
- **Open‑source** – The entire codebase is MIT‑licensed, encouraging community contributions.
- **Context Engine Layer** – Completely decoupled from the UI and model layers. You can replace ChromaDB with any vector store (e.g., Pinecone, Weaviate) or plug in a custom knowledge‑base without touching the dashboard or command‑bar code.
- **Custom Software Integration** – Because the engine works over a simple IPC API, any desktop or web application can embed the Context Engine to provide RAG‑powered assistance.
- **Model Marketplace** – Add new vision or reasoning providers by extending the `PROVIDERS` config in `ModelsView.tsx`.
- **Multi‑user sync** – Future work could sync the knowledge base to a cloud backend, enabling collaborative prompt engineering.

---

## 🤝 Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome‑thing`).
3. Follow the coding style (Prettier + ESLint) – run `npm run lint` before committing.
4. Open a pull request targeting `main`.

---

## 📄 License
MIT © 2026 waterysocket.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
