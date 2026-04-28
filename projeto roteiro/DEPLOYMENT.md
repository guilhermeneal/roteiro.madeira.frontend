# 🚀 Guia de Deploy - Firebase Hosting

## 📋 Pré-requisitos

### **Ferramentas Necessárias**
- Node.js 18+ 
- npm ou yarn
- Firebase CLI
- Git (para versionamento)

### **Instalação Firebase CLI**
```bash
# Instalar globalmente
npm install -g firebase-tools

# Autenticar com Google
firebase login

# Verificar instalação
firebase --version
```

---

## 🔧 Configuração do Projeto

### **1. Inicialização Firebase**
```bash
# Navegar para diretório do projeto
cd "projeto roteiro"

# Inicializar Firebase
firebase init hosting

# Respostas para as perguntas:
? Please select an option: Create a new project
? Please specify a unique name for your project: roteiros-madeira
? What would you like to use as your public directory? dist
? Configure as a single-page app (rewrite all urls to /index.html)? Yes
? Set up automatic builds and deploys with GitHub? No
? File dist/index.html already exists. Overwrite? No
```

### **2. Estrutura de Arquivos Firebase**
```
projeto roteiro/
├── 📁 dist/                    # Build output
├── 📁 public/                  # Static assets
├── 📄 firebase.json            # Firebase configuration
├── 📄 .firebaserc              # Project settings
└── 📄 firestore.rules          # Security rules (se necessário)
```

### **3. firebase.json Configuration**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

---

## 🏗️ Build Optimization

### **1. Configuração Vite para Produção**
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['bootstrap']
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    host: true,
    port: 5173
  }
});
```

### **2. package.json Scripts**
```json
{
  "scripts": {
    "dev": "concurrently \"vite\" \"nodemon server.cjs\"",
    "build": "vite build",
    "build:analyze": "vite build && npx vite-bundle-analyzer dist/stats.html",
    "preview": "vite preview",
    "deploy": "npm run build && firebase deploy --only hosting",
    "deploy:staging": "npm run build && firebase hosting:channel:deploy staging",
    "serve": "firebase serve --only hosting"
  }
}
```

---

## 🚀 Processo de Deploy

### **1. Build para Produção**
```bash
# Limpar build anterior
rm -rf dist

# Build otimizado
npm run build

# Verificar build
ls -la dist/
```

### **2. Deploy Local (Staging)**
```bash
# Servir localmente para testes
firebase serve --only hosting

# Deploy para canal de staging
firebase hosting:channel:deploy staging
```

### **3. Deploy Produção**
```bash
# Deploy completo
firebase deploy --only hosting

# Deploy com mensagem
firebase deploy --only hosting --message "Release v1.0.0 - Modern UI Update"
```

### **4. Deploy Automatizado**
```bash
# Script completo
#!/bin/bash
echo "🚀 Iniciando deploy..."

# Build
echo "📦 Building project..."
npm run build

# Verificar build
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    
    # Deploy
    echo "🌐 Deploying to Firebase..."
    firebase deploy --only hosting
    
    echo "🎉 Deploy completed!"
else
    echo "❌ Build failed"
    exit 1
fi
```

---

## 🔍 Verificação Pós-Deploy

### **1. Testes Automáticos**
```bash
# Executar testes E2E
cd ../testes
npm run test

# Testar em produção
npm run test:headed -- --project=chromium
```

### **2. Performance Check**
```bash
# Lighthouse CLI
npm install -g lighthouse
lighthouse https://roteiros-madeira.web.app --output html --output-path ./lighthouse-report.html

# WebPageTest
curl -d "url=https://roteiros-madeira.web.app" https://www.webpagetest.org/runtest.php
```

### **3. SEO e Accessibility**
```bash
# SEO audit
npm install -g seo-audit
seo-audit https://roteiros-madeira.web.app

# Accessibility check
npm install -g pa11y
pa11y https://roteiros-madeira.web.app
```

---

## 📊 Monitoramento e Analytics

### **1. Google Analytics Setup**
```javascript
// public/analytics.js
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'GA_MEASUREMENT_ID', 'auto');
ga('send', 'pageview');
```

### **2. Firebase Performance**
```javascript
// src/utils/performance.js
import { getPerformance, trace } from 'firebase/performance';

const perf = getPerformance();

// Page load trace
const pageLoadTrace = trace(perf, 'page_load');
pageLoadTrace.start();

// Custom metrics
pageLoadTrace.putMetric('load_time', performance.now());
pageLoadTrace.stop();
```

---

## 🔄 CI/CD Integration

### **1. GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: cd ../testes && npm ci && npm test
    
    - name: Build project
      run: npm run build
    
    - name: Deploy to Firebase
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        channelId: live
        projectId: roteiros-madeira
```

### **2. Environment Variables**
```bash
# .env.production
VITE_API_URL=https://roteiros-madeira.web.app/api
VITE_GA_ID=GA_MEASUREMENT_ID
VITE_ENVIRONMENT=production
```

---

## 🛠️ Troubleshooting

### **1. Build Issues**
```bash
# Limpar cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Verificar dependências
npm audit
npm audit fix
```

### **2. Deploy Issues**
```bash
# Verificar configuração Firebase
firebase projects:list
firebase use --project roteiros-madeira

# Debug deploy
firebase deploy --debug --only hosting
```

### **3. Performance Issues**
```bash
# Analisar bundle
npm run build:analyze

# Verificar assets
npx bundlesize
```

---

## 📈 Otimizações Avançadas

### **1. Service Worker**
```javascript
// public/sw.js
const CACHE_NAME = 'roteiros-v1';
const urlsToCache = [
  '/',
  '/static/js/main.js',
  '/static/css/main.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

### **2. Image Optimization**
```javascript
// vite.config.js - Image optimization
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.png') || assetInfo.name.endsWith('.jpg')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  }
});
```

### **3. Preloading Strategies**
```javascript
// public/index.html
<head>
  <!-- Preload critical resources -->
  <link rel="preload" href="/static/js/main.js" as="script">
  <link rel="preload" href="/static/css/main.css" as="style">
  
  <!-- DNS prefetch for external domains -->
  <link rel="dns-prefetch" href="//fonts.googleapis.com">
  
  <!-- Preconnect for critical domains -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</head>
```

---

## 📋 Checklist de Deploy

### **Pre-Deploy Checklist**
- [ ] Build local sem erros
- [ ] Testes passando
- [ ] Lighthouse score > 90
- [ ] Imagens otimizadas
- [ ] Cache headers configurados
- [ ] SEO meta tags atualizadas
- [ ] Analytics configurado
- [ ] Error monitoring ativo

### **Post-Deploy Checklist**
- [ ] Funcionalidades testadas em produção
- [ ] Performance monitorada
- [ ] Logs verificados
- [ ] Backup criado
- [ ] Rollback plan testado

---

## 🌐 URLs e Configurações

### **Produção URLs**
- **Main Site**: https://roteiros-madeira.web.app
- **Custom Domain**: https://roteiros-madeira.com (se configurado)
- **Staging**: https://roteiros-madeira.web.app/channel/staging

### **Firebase Console**
- **Project ID**: roteiros-madeira
- **Hosting URL**: https://roteiros-madeira.web.app
- **Analytics**: GA4 Property configurada

---

## 🆘 Suporte e Manutenção

### **Monitoramento**
- **Firebase Console**: Real-time monitoring
- **Google Analytics**: Traffic and behavior
- **Chrome DevTools**: Performance debugging
- **Firebase Performance**: App performance metrics

### **Backup Strategy**
- **Git**: Version control completo
- **Firebase Hosting**: Automatic backups
- **Database**: Regular exports (se necessário)

---

*Guia de deploy criado por Cascade AI*  
*Atualizado em 23 de Abril de 2026*
