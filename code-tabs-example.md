# Exemplos de Code Tabs

Este arquivo demonstra como usar a nova funcionalidade de **code tabs** no markdown.

## 🔧 Como Usar

Para criar tabs de código, use a sintaxe `tab="nome"` nos blocos de código consecutivos:

```markdown
```bash tab="npm"
npm install @zard/ui
```

```bash tab="yarn"
yarn add @zard/ui
```
```

## 📦 Instalação de Pacotes

Você pode instalar o ZardUI usando diferentes package managers:

```bash tab="npm"
npm install @zard/ui
```

```bash tab="pnpm"
pnpm add @zard/ui
```

```bash tab="yarn"
yarn add @zard/ui
```

```bash tab="bun"
bun add @zard/ui
```

## 🚀 Frameworks

Exemplos de como usar com diferentes frameworks:

```typescript tab="Angular"
import { Component } from '@angular/core';
import { ZardButtonComponent } from '@zard/ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ZardButtonComponent],
  template: `<z-button>Click me</z-button>`
})
export class ExampleComponent {}
```

```react tab="React"
import { Button } from '@zard/ui';

export function Example() {
  return <Button>Click me</Button>;
}
```

```vue tab="Vue"
<template>
  <ZardButton>Click me</ZardButton>
</template>

<script setup lang="ts">
import { ZardButton } from '@zard/ui';
</script>
```

## ⚙️ Configuração

Configuração do Tailwind para diferentes formatos:

```javascript tab="CommonJS"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

```typescript tab="TypeScript"
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

## 🎨 Temas

Variáveis CSS para diferentes temas:

```css tab="Light"
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 47.4% 11.2%;
  --primary: 222.2 47.4% 11.2%;
}
```

```css tab="Dark"
:root {
  --background: 224 71% 4%;
  --foreground: 213 31% 91%;
  --primary: 210 40% 98%;
}
```

## 💻 Comandos CLI

```bash tab="Desenvolvimento"
# Inicia o servidor de desenvolvimento
npm start

# Ou usando o Angular CLI
ng serve
```

```bash tab="Build"
# Build para produção
npm run build

# Build com configuração específica
ng build --configuration production
```

```bash tab="Testes"
# Executar todos os testes
npm test

# Testes com watch mode
npm run test:watch
```

## 📝 Código Individual (sem tabs)

Este bloco não faz parte de nenhum grupo de tabs:

```typescript
// Exemplo de código sem tabs
console.log('Este é um bloco individual');

function exemploSemTabs() {
  return 'Funciona normalmente como antes';
}
```

## 🔀 Exemplos de Code Blocks Expandables

### Exemplo Básico com Expandable

Este código está dentro de um expandable com título padrão:

```typescript expandable="true" title="exemplo-basico.ts"
import { Component } from '@angular/core';

@Component({
  selector: 'app-exemplo',
  standalone: true,
  template: `
    <div class="flex flex-col gap-4">
      <h1>Exemplo de Componente</h1>
      <p>Este é um exemplo de componente Angular</p>
      <button class="btn-primary">Clique aqui</button>
    </div>
  `
})
export class ExemploComponent {
  title = 'Meu Componente';
  
  onClick() {
    console.log('Botão clicado!');
  }
}
```

### Exemplo com Título Customizado

Este expandable tem um título personalizado:

```typescript expandable="true" expandableTitle="🚀 Configuração Avançada" title="config.ts"
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

export const databaseConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'myapp',
  username: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production'
};

export function createConnection(config: DatabaseConfig) {
  return new DatabaseConnection(config);
}
```

### Exemplo com Copy Button

Expandable com botão de copiar:

```bash expandable="true" expandableTitle="📦 Scripts de Build" copyButton title="build.sh"
#!/bin/bash

# Build do projeto
echo "Iniciando build..."

# Install dependencies
npm ci

# Run tests
npm run test

# Build for production
npm run build

# Create docker image
docker build -t myapp:latest .

# Push to registry
docker push myapp:latest

echo "Build concluído com sucesso!"
```

## ✨ Características

### Code Tabs
- ✅ **Automático**: Detecta automaticamente blocos consecutivos com `tab="nome"`
- ✅ **Interativo**: Botões clicáveis para alternar entre tabs
- ✅ **Responsivo**: Interface adaptável com Tailwind CSS
- ✅ **Compatível**: Funciona junto com todos os recursos existentes de code blocks
- ✅ **Flexível**: Suporta qualquer linguagem e número de tabs

### Code Expandables
- ✅ **Expandable**: Use `expandable="true"` para criar code blocks recolhíveis
- ✅ **Títulos Customizados**: Use `expandableTitle="Seu Título"` para personalizar o texto do expandable
- ✅ **Combinável**: Funciona junto com títulos de arquivo, copy buttons e outros recursos
- ✅ **Acessível**: Usa elementos HTML nativos (`<details>` e `<summary>`)
- ✅ **Estilizado**: Design consistente com o resto do sistema de code blocks

## 📖 Como Usar Expandables

### Sintaxe Básica
```markdown
```typescript expandable="true" title="meu-arquivo.ts"
// Seu código aqui
```
```

### Sintaxe com Título Customizado
```markdown
```typescript expandable="true" expandableTitle="🔧 Configuração Avançada" title="config.ts"
// Seu código aqui
```
```

### Sintaxe com Copy Button
```markdown
```bash expandable="true" expandableTitle="📦 Scripts" copyButton title="script.sh"
#!/bin/bash
echo "Hello World"
```
```