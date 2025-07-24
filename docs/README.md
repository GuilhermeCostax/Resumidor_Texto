# Documentação do SummarizeAI

Esta pasta contém a documentação completa do projeto SummarizeAI (AI Text Summarizer). Aqui você encontrará guias detalhados sobre configuração, deploy e melhores práticas.

## Guias Disponíveis

### Guias de Deploy

- [Guia Geral de Deploy](./DEPLOY.md) - Instruções gerais para deploy em produção
- [Deploy no Render](./DEPLOY_RENDER.md) - Guia específico para deploy na plataforma Render
- [Deploy na Vercel](./DEPLOY_VERCEL.md) - Guia específico para deploy do frontend na Vercel

### Checklists e Configurações

- [Checklist de Produção](./PRODUCTION_CHECKLIST.md) - Verificações importantes antes do deploy em produção
- [Configuração do Gmail](./GMAIL_SETUP_GUIDE.md) - Como configurar o envio de emails com Gmail
- [Guia de Redefinição de Senha](./PASSWORD_RESET_GUIDE.md) - Implementação do fluxo de redefinição de senha

### Configurações Importantes

#### Vercel

O projeto inclui um arquivo `vercel.json` na raiz que configura:
- Comando de build: `npm run build`
- Comando de instalação: `npm install --legacy-peer-deps` (resolve conflitos de dependências)
- Framework: Next.js

#### Render

O projeto inclui um arquivo `render.yaml` na raiz que configura:
- Serviço web para o backend (Python/FastAPI)
- Serviço web para o frontend (Node.js/Next.js)
- Banco de dados PostgreSQL

## Como Contribuir

Para contribuir com a documentação:

1. Crie um novo arquivo markdown na pasta `docs/`
2. Adicione um link para o novo documento neste README
3. Mantenha o estilo consistente com a documentação existente
4. Use exemplos práticos sempre que possível