# 🚀 Deploy na Vercel - AI Text Summarizer

Este guia fornece instruções detalhadas para fazer o deploy do frontend Next.js do AI Text Summarizer na Vercel, garantindo que o código seja verificado e compilado corretamente antes do deploy.

## 📋 Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. Repositório Git com o código da aplicação
3. Backend já deployado (por exemplo, no Render)

## 🔄 Configuração do Projeto

O projeto já inclui as seguintes configurações para garantir um deploy bem-sucedido na Vercel:

### 1. Arquivo `vercel.json`

Este arquivo configura o processo de build na Vercel:

```json
{
  "buildCommand": "npm run lint && npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

Esta configuração garante que:
- O linter seja executado antes do build (`npm run lint`)
- O build seja executado apenas se o linter passar (`npm run build`)
- A Vercel use o framework correto (Next.js)
- O diretório de saída seja configurado corretamente (`.next`)

### 2. Configuração de Linter (ESLint)

O arquivo `.eslintrc.json` está configurado para detectar problemas de indentação e outros erros comuns:

```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "plugins": ["prettier"],
  "rules": {
    "indent": ["error", 2],
    "no-mixed-spaces-and-tabs": "error",
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "jsx-quotes": ["error", "prefer-double"]
  }
}
```

### 3. Configuração de Formatação (Prettier)

O arquivo `.prettierrc` garante uma formatação consistente do código:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "avoid"
}
```

### 4. Configuração do Editor (VSCode)

O arquivo `.vscode/settings.json` ajuda a visualizar espaços em branco e indentação:

```json
{
  "editor.renderWhitespace": "all",
  "editor.guides.indentation": true,
  "editor.detectIndentation": false,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### 5. Verificação Pré-commit (Husky)

O projeto usa Husky para verificar o código antes de cada commit:

- `.husky/pre-commit`: Executa `lint-staged` e `npm run build`
- `package.json`: Configuração de `lint-staged` para verificar arquivos modificados

## 🚀 Deploy na Vercel

### 1. Importar Projeto

1. Faça login na [Vercel](https://vercel.com)
2. Clique em "Add New" → "Project"
3. Importe seu repositório Git
4. Selecione o diretório raiz do frontend (se necessário)

### 2. Configurar Variáveis de Ambiente

No painel de configuração do projeto, adicione:

```
NEXT_PUBLIC_API_URL=https://seu-backend-api.com
```

Substitua `https://seu-backend-api.com` pela URL do seu backend deployado.

### 3. Configurações de Deploy

A Vercel detectará automaticamente o arquivo `vercel.json` e usará as configurações definidas nele. Não é necessário alterar as configurações de build.

### 4. Deploy

Clique em "Deploy" e aguarde o processo de build e deploy.

## ✅ Verificação do Deploy

### 1. Verificar Logs de Build

Verifique os logs de build para garantir que:
- O linter foi executado com sucesso
- O build foi concluído sem erros

### 2. Testar o Site

1. Acesse a URL fornecida pela Vercel
2. Verifique se a página inicial carrega corretamente
3. Teste o registro e login de usuário
4. Teste a funcionalidade de resumo de texto

## 🔍 Troubleshooting

### Problemas Comuns

#### Erro de Build por Problemas de Indentação

**Solução**: 
1. Verifique os logs de build para identificar o arquivo e a linha com problema
2. Corrija a indentação no arquivo indicado
3. Commit e push das alterações

#### Erro de Conexão com o Backend

**Solução**:
1. Verifique se a variável `NEXT_PUBLIC_API_URL` está configurada corretamente
2. Confirme que o backend está rodando e acessível
3. Verifique se o CORS está configurado no backend para permitir requisições da URL da Vercel

#### Erro de Módulos não Encontrados

**Solução**:
1. Verifique se todas as dependências estão no `package.json`
2. Tente adicionar `--legacy-peer-deps` ao comando de instalação nas configurações da Vercel

## 🔒 Segurança

- ✅ Use HTTPS (automático na Vercel)
- ✅ Configure CORS no backend para permitir apenas a URL da Vercel
- ✅ Não exponha variáveis de ambiente sensíveis no frontend
- ✅ Use tokens JWT com expiração adequada

## 📊 Monitoramento

- Configure alertas na Vercel para falhas de build e deploy
- Monitore o uso de recursos e performance
- Utilize o Analytics da Vercel para monitorar o tráfego e performance

---

**Pronto!** Seu frontend Next.js do AI Text Summarizer está agora rodando na Vercel! 🎉