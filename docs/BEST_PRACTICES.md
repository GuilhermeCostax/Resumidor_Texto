# Melhores Práticas para o Projeto SummarizeAI

Este documento contém recomendações para garantir a qualidade do código e evitar problemas de compilação, especialmente para o deploy na Vercel.

## Prevenção de Erros de Compilação

### 1. Configurar um Linter para Detectar Problemas de Indentação

**Recomendação:** Adicionar e configurar ESLint com regras específicas para indentação.

**Implementação:**

1. Certifique-se de que o ESLint está instalado no projeto:

```bash
npm install --save-dev eslint eslint-config-next
```

2. Adicione as seguintes regras ao arquivo `.eslintrc.json` ou `eslint.config.mjs`:

```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "indent": ["error", 2],
    "no-mixed-spaces-and-tabs": "error",
    "no-trailing-spaces": "error"
  }
}
```

3. Adicione um script no `package.json` para verificar o código:

```json
"scripts": {
  "lint": "next lint",
  "lint:fix": "next lint --fix"
}
```

### 2. Configurar o Editor para Mostrar Espaços em Branco e Indentação

**Recomendação:** Configure seu editor de código para visualizar espaços em branco e indentação.

**Implementação:**

1. Para VSCode, adicione um arquivo `.vscode/settings.json` no projeto:

```json
{
  "editor.renderWhitespace": "boundary",
  "editor.guides.indentation": true,
  "editor.detectIndentation": true,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

2. Adicione este arquivo ao repositório para que todos os desenvolvedores tenham a mesma configuração.

### 3. Executar Build Antes de Fazer Push para o Repositório

**Recomendação:** Implemente hooks de pré-commit para executar o build automaticamente.

**Implementação:**

1. Instale as dependências necessárias:

```bash
npm install --save-dev husky lint-staged
```

2. Configure o Husky e lint-staged no `package.json`:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged && npm run build"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

3. Inicialize o Husky:

```bash
npx husky install
npx husky add .husky/pre-commit "npx lint-staged && npm run build"
```

### 4. Adicionar Testes Automatizados

**Recomendação:** Implemente testes automatizados para garantir que o código compile corretamente.

**Implementação:**

1. Instale as dependências de teste:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

2. Configure o Jest no `package.json`:

```json
{
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"],
    "moduleNameMapper": {
      "^@/components/(.*)$": "<rootDir>/src/components/$1",
      "^@/lib/(.*)$": "<rootDir>/src/lib/$1"
    }
  },
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

3. Crie um arquivo `jest.setup.js` na raiz do projeto:

```javascript
import '@testing-library/jest-dom';
```

4. Adicione testes básicos para os componentes principais, começando com um teste simples para verificar se o componente renderiza:

```javascript
// src/app/__tests__/page.test.tsx
import { render, screen } from '@testing-library/react';
import Page from '../page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Page />);
    expect(screen.getByText(/Transforme textos longos/i)).toBeInTheDocument();
  });
});
```

## Configuração Específica para Vercel

### 1. Configurar Verificações de Build na Vercel

**Recomendação:** Configure a Vercel para executar verificações de build antes do deploy.

**Implementação:**

1. Crie um arquivo `vercel.json` na raiz do projeto:

```json
{
  "buildCommand": "npm run lint && npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### 2. Configurar Variáveis de Ambiente na Vercel

**Recomendação:** Certifique-se de que todas as variáveis de ambiente necessárias estão configuradas na Vercel.

**Implementação:**

1. No dashboard da Vercel, vá para o seu projeto > Settings > Environment Variables.
2. Adicione todas as variáveis de ambiente listadas no arquivo `.env.example`.
3. Certifique-se de que `NEXT_PUBLIC_API_URL` está configurado corretamente para apontar para o backend em produção.

### 3. Configurar Previews de Pull Request

**Recomendação:** Habilite previews de Pull Request na Vercel para testar mudanças antes de mesclar com a branch principal.

**Implementação:**

1. No dashboard da Vercel, vá para o seu projeto > Settings > Git.
2. Habilite "Preview Deployments" para todas as branches.

## Conclusão

Seguindo estas recomendações, você pode melhorar significativamente a qualidade do código e evitar problemas de compilação, especialmente no ambiente de produção da Vercel. Estas práticas ajudarão a garantir que o código seja consistente, bem formatado e livre de erros comuns de sintaxe e indentação.