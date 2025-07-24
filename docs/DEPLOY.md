# 🚀 Guia de Deploy - AI Text Summarizer

Este guia fornece instruções detalhadas para fazer o deploy da aplicação AI Text Summarizer em produção.

## 📋 Pré-requisitos

1. Conta no [Render](https://render.com)
2. Repositório Git com o código da aplicação
3. Chave da API do Google Gemini
4. Configuração de email (Gmail com App Password)

## 🔄 Opções de Deploy

Existem duas opções principais para o deploy:

### 1. Deploy Automático via render.yaml

Esta é a opção mais simples e recomendada:

1. Faça login no [Render](https://render.com)
2. Clique em "New" → "Blueprint"
3. Conecte seu repositório Git
4. O Render detectará automaticamente o arquivo `render.yaml` e configurará todos os serviços
5. Revise as configurações e clique em "Apply"
6. Configure as variáveis de ambiente necessárias (veja abaixo)

### 2. Deploy Manual

Se preferir configurar manualmente, siga as instruções detalhadas em [DEPLOY_RENDER.md](./DEPLOY_RENDER.md).

## 🔐 Variáveis de Ambiente

### Variáveis Obrigatórias

```
GEMINI_API_KEY=sua_chave_do_gemini_aqui
SECRET_KEY=sua_chave_secreta_forte_aqui
```

### Variáveis de Email (Opcionais)

```
SMTP_USERNAME=seu-email@gmail.com
SMTP_PASSWORD=sua_app_password_do_gmail
FROM_EMAIL=seu-email@gmail.com
```

### URLs de Serviço

Após o deploy do backend, atualize:

```
# No serviço de frontend
NEXT_PUBLIC_API_URL=https://ai-text-summarizer-backend.onrender.com

# No serviço de backend
FRONTEND_URL=https://ai-text-summarizer-frontend.onrender.com
```

## 🗃️ Inicialização do Banco de Dados

Após o primeiro deploy bem-sucedido:

1. Acesse o shell do serviço backend no Render
2. Execute:
   ```bash
   cd backend
   python init_production_db.py
   ```

## ✅ Verificação do Deploy

### Backend

1. Acesse `https://ai-text-summarizer-backend.onrender.com`
2. Você deve ver uma resposta JSON com status "running"
3. Teste o endpoint de health check: `https://ai-text-summarizer-backend.onrender.com/api/health`

### Frontend

1. Acesse `https://ai-text-summarizer-frontend.onrender.com`
2. Verifique se a página inicial carrega corretamente
3. Teste o registro e login de usuário
4. Teste a funcionalidade de resumo de texto

## 🔍 Troubleshooting

### Problemas Comuns

- **Erro de Conexão com Banco**: Verifique a `DATABASE_URL` e execute o script de inicialização
- **Erro de CORS**: Verifique se `FRONTEND_URL` está configurado corretamente
- **Erro de Autenticação**: Verifique a `SECRET_KEY`
- **Erro na API Gemini**: Verifique a `GEMINI_API_KEY`

### Logs

Para ver os logs no Render:
1. Vá no dashboard do seu serviço
2. Clique na aba "Logs"
3. Monitore erros e problemas

## 📊 Monitoramento

- Configure alertas no Render para downtime
- Monitore uso de recursos (CPU, memória)
- Acompanhe logs de erro
- Configure backup do banco de dados

## 🔒 Segurança

- ✅ Use HTTPS (automático no Render)
- ✅ Configure `SECRET_KEY` forte e única
- ✅ Use PostgreSQL em produção
- ✅ Configure CORS adequadamente
- ✅ Use App Passwords para email
- ✅ Mantenha `DEBUG=False`

---

**Pronto!** Sua aplicação AI Text Summarizer está agora rodando em produção! 🎉