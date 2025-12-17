import type { TemplateType, InsertFile } from "@shared/schema";

interface TemplateFile {
  name: string;
  path: string;
  content: string;
  isFolder: string;
  parentPath: string | null;
}

const nextjsTemplate: TemplateFile[] = [
  {
    name: "pages",
    path: "pages",
    content: "",
    isFolder: "true",
    parentPath: null,
  },
  {
    name: "index.js",
    path: "pages/index.js",
    content: `export default function Home() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>Welcome to Next.js!</h1>
      <p>Get started by editing <code>pages/index.js</code></p>
      <div style={{ marginTop: '2rem' }}>
        <a 
          href="https://nextjs.org/docs" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#0070f3' }}
        >
          Documentation
        </a>
      </div>
    </div>
  );
}`,
    isFolder: "false",
    parentPath: "pages",
  },
  {
    name: "styles",
    path: "styles",
    content: "",
    isFolder: "true",
    parentPath: null,
  },
  {
    name: "globals.css",
    path: "styles/globals.css",
    content: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #fafafa;
  color: #333;
}

a {
  color: inherit;
  text-decoration: none;
}`,
    isFolder: "false",
    parentPath: "styles",
  },
  {
    name: "package.json",
    path: "package.json",
    content: `{
  "name": "my-nextjs-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}`,
    isFolder: "false",
    parentPath: null,
  },
];

const viteVueTemplate: TemplateFile[] = [
  {
    name: "src",
    path: "src",
    content: "",
    isFolder: "true",
    parentPath: null,
  },
  {
    name: "App.vue",
    path: "src/App.vue",
    content: `<template>
  <div class="app">
    <h1>{{ message }}</h1>
    <p>Edit <code>src/App.vue</code> to get started</p>
    <button @click="count++">Count: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('Welcome to Vue + Vite!')
const count = ref(0)
</script>

<style scoped>
.app {
  font-family: system-ui, sans-serif;
  text-align: center;
  padding: 2rem;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border: 1px solid #42b883;
  background: #42b883;
  color: white;
  border-radius: 4px;
}

button:hover {
  background: #3aa876;
}
</style>`,
    isFolder: "false",
    parentPath: "src",
  },
  {
    name: "main.js",
    path: "src/main.js",
    content: `import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')`,
    isFolder: "false",
    parentPath: "src",
  },
  {
    name: "index.html",
    path: "index.html",
    content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`,
    isFolder: "false",
    parentPath: null,
  },
  {
    name: "package.json",
    path: "package.json",
    content: `{
  "name": "my-vite-vue-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.0.0"
  }
}`,
    isFolder: "false",
    parentPath: null,
  },
  {
    name: "vite.config.js",
    path: "vite.config.js",
    content: `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()]
})`,
    isFolder: "false",
    parentPath: null,
  },
];

const staticTemplate: TemplateFile[] = [
  {
    name: "index.html",
    path: "index.html",
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <nav>
      <h1>My Website</h1>
    </nav>
  </header>
  
  <main>
    <section class="hero">
      <h2>Welcome!</h2>
      <p>This is a simple static website template.</p>
      <button id="cta-button">Get Started</button>
    </section>
    
    <section class="features">
      <div class="feature">
        <h3>Fast</h3>
        <p>Lightning fast performance</p>
      </div>
      <div class="feature">
        <h3>Simple</h3>
        <p>Easy to customize</p>
      </div>
      <div class="feature">
        <h3>Modern</h3>
        <p>Built with modern standards</p>
      </div>
    </section>
  </main>
  
  <footer>
    <p>Made with ProDev Studio</p>
  </footer>
  
  <script src="script.js"></script>
</body>
</html>`,
    isFolder: "false",
    parentPath: null,
  },
  {
    name: "styles.css",
    path: "styles.css",
    content: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #fafafa;
}

header {
  background: #2563eb;
  color: white;
  padding: 1rem 2rem;
}

header h1 {
  font-size: 1.5rem;
}

main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero {
  text-align: center;
  padding: 4rem 0;
}

.hero h2 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #1e40af;
}

.hero p {
  font-size: 1.25rem;
  color: #64748b;
  margin-bottom: 2rem;
}

.hero button {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.hero button:hover {
  background: #1d4ed8;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
}

.feature {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  text-align: center;
}

.feature h3 {
  color: #2563eb;
  margin-bottom: 0.5rem;
}

footer {
  text-align: center;
  padding: 2rem;
  color: #64748b;
  border-top: 1px solid #e2e8f0;
}`,
    isFolder: "false",
    parentPath: null,
  },
  {
    name: "script.js",
    path: "script.js",
    content: `// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
  console.log('Website loaded!');
  
  const ctaButton = document.getElementById('cta-button');
  if (ctaButton) {
    ctaButton.addEventListener('click', function() {
      alert('Thanks for clicking! Start building your website.');
    });
  }
});`,
    isFolder: "false",
    parentPath: null,
  },
];

export function getTemplateFiles(template: TemplateType, projectId: string): Omit<InsertFile, "id">[] {
  let templateFiles: TemplateFile[];

  switch (template) {
    case "nextjs":
      templateFiles = nextjsTemplate;
      break;
    case "vite-vue":
      templateFiles = viteVueTemplate;
      break;
    case "static":
      templateFiles = staticTemplate;
      break;
    default:
      templateFiles = staticTemplate;
  }

  return templateFiles.map((file) => ({
    projectId,
    name: file.name,
    path: file.path,
    content: file.content,
    isFolder: file.isFolder,
    parentPath: file.parentPath,
  }));
}
