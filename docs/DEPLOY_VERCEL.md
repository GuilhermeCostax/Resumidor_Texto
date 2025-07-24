# Deploy do Frontend na Vercel

Este guia fornece instruções detalhadas para fazer o deploy do frontend Next.js do projeto AI Text Summarizer na Vercel.

## Pré-requisitos

- Conta na [Vercel](https://vercel.com)
- Repositório Git com o código do projeto
- Node.js 18.x ou superior instalado localmente

## Configuração do Projeto

### 1. Arquivo vercel.json

O projeto já inclui um arquivo `vercel.json` na raiz do projeto com as seguintes configurações:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

Este arquivo configura:

- O comando de build (`npm run build`)
- O comando de desenvolvimento (`npm run dev`)
- O comando de instalação com flag `--legacy-peer-deps` para resolver conflitos de dependências
- O framework utilizado (Next.js)
- O diretório de saída (`.next`)

### 2. Configuração de Qualidade de Código

O projeto está configurado com:

- **ESLint**: Para análise estática de código
- **Prettier**: Para formatação consistente
- **Jest**: Para testes automatizados
- **Husky**: Para hooks de pré-commit

## Deploy na Vercel

### 1. Conectar Repositório

1. Faça login na [Vercel](https://vercel.com)
2. Clique em "Add New..." → "Project"
3. Importe seu repositório Git
4. Selecione o repositório do projeto AI Text Summarizer

### 2. Configurar Projeto

1. **Framework Preset**: Selecione "Next.js"
2. **Root Directory**: Mantenha como "/" (raiz do projeto)
3. **Build Command**: A Vercel detectará automaticamente o comando do arquivo `vercel.json`

### 3. Variáveis de Ambiente

Adicione as seguintes variáveis de ambiente:

- `NEXT_PUBLIC_API_URL`: URL completa da sua API backend (ex: https://api.seudominio.com)

### 4. Deploy

1. Clique em "Deploy"
2. Aguarde a conclusão do processo de build e deploy

## Verificação do Deploy

### 1. Verificar Status

1. Após o deploy, a Vercel fornecerá uma URL para acessar sua aplicação
2. Verifique se a aplicação está funcionando corretamente
3. Teste o login, registro e funcionalidades de resumo

### 2. Verificar Logs

1. Na dashboard da Vercel, acesse "Deployments"
2. Selecione o deployment mais recente
3. Clique em "Logs" para verificar os logs de build e runtime

## Troubleshooting

### Erros de Dependências

Se encontrar erros relacionados a conflitos de dependências durante o build:

1. Verifique se o arquivo `vercel.json` está configurado corretamente com `"installCommand": "npm install --legacy-peer-deps"`
2. Se o erro persistir, considere atualizar as versões das dependências no `package.json`

### Erros de Conexão com a API

Se a aplicação não conseguir se conectar à API:

1. Verifique se a variável de ambiente `NEXT_PUBLIC_API_URL` está configurada corretamente
2. Certifique-se de que a API está acessível publicamente
3. Verifique se há problemas de CORS na API

## Segurança em Produção

1. **HTTPS**: A Vercel fornece HTTPS por padrão
2. **Variáveis de Ambiente**: Nunca exponha chaves sensíveis no código frontend
3. **CSP**: Considere implementar Content Security Policy para maior segurança

## Monitoramento

1. **Analytics**: Ative o Vercel Analytics para monitorar o desempenho e uso
2. **Alertas**: Configure alertas para falhas de build ou problemas de runtime

---

Para mais informações sobre o deploy na Vercel, consulte a [documentação oficial da Vercel](https://vercel.com/docs).
