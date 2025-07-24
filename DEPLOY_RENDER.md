# Deploy no Render - AI Text Summarizer

Este guia explica como fazer o deploy da aplicação AI Text Summarizer no Render.

## 📋 Pré-requisitos

1. Conta no [Render](https://render.com)
2. Repositório Git com o código da aplicação
3. Chave da API do Google Gemini
4. Configuração de email (Gmail com App Password)

## 🗄️ 1. Configurar Banco de Dados PostgreSQL

1. No dashboard do Render, clique em "New" → "PostgreSQL"
2. Configure:
   - **Name**: `ai-text-summarizer-db`
   - **Database**: `resumidor_db`
   - **User**: `resumidor_db_user`
   - **Region**: Escolha a região mais próxima
3. Clique em "Create Database"
4. Anote a **External Database URL** (será usada nas variáveis de ambiente)

## 🚀 2. Deploy do Backend

1. No dashboard do Render, clique em "New" → "Web Service"
2. Conecte seu repositório Git
3. Configure:
   - **Name**: `ai-text-summarizer-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free` (ou `Starter` para melhor performance)

## 🔧 3. Configurar Variáveis de Ambiente

No painel do seu Web Service, vá em "Environment" e adicione:

### Obrigatórias:
```
DATABASE_URL=postgresql://user:password@host:port/database
GEMINI_API_KEY=sua_chave_do_gemini_aqui
SECRET_KEY=uma_chave_secreta_forte_e_unica
FRONTEND_URL=https://seu-frontend-domain.com
```

### Email (Opcionais, mas recomendadas):
```
SMTP_USERNAME=seu-email@gmail.com
SMTP_PASSWORD=sua_app_password_do_gmail
FROM_EMAIL=seu-email@gmail.com
FROM_NAME=SummarizeAI
```

### Outras configurações:
```
APP_NAME=AI Text Summarizer
DEBUG=False
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
```

## 🔑 4. Gerar Chaves Seguras

### SECRET_KEY:
Use um gerador de chaves seguras ou execute:
```python
import secrets
print(secrets.token_urlsafe(32))
```

### App Password do Gmail:
1. Ative a autenticação de 2 fatores no Gmail
2. Vá em "Gerenciar sua conta Google" → "Segurança" → "Senhas de app"
3. Gere uma nova senha de app para "Mail"
4. Use essa senha na variável `SMTP_PASSWORD`

## 🗃️ 5. Inicializar Banco de Dados

Após o primeiro deploy bem-sucedido:

1. Acesse o shell do seu serviço no Render
2. Execute:
```bash
cd backend
python init_production_db.py
```

Ou use o console do Render para executar:
```bash
python backend/init_production_db.py
```

## 🔍 6. Verificar Deploy

1. Acesse a URL do seu serviço (ex: `https://ai-text-summarizer-backend.onrender.com`)
2. Você deve ver a resposta JSON:
```json
{
  "message": "AI Text Summarizer API - Multiuser Version",
  "status": "running",
  "version": "2.0.0",
  "features": ["User Authentication", "Personal History", "JWT Security"]
}
```

## 📱 7. Deploy do Frontend

Para o frontend Next.js, você pode usar:
- **Vercel** (recomendado para Next.js)
- **Netlify**
- **Render** (Static Site)

Configure a variável de ambiente do frontend:
```
NEXT_PUBLIC_API_URL=https://ai-text-summarizer-backend.onrender.com
```

## 🛠️ 8. Troubleshooting

### Erro de Conexão com Banco:
- Verifique se a `DATABASE_URL` está correta
- Certifique-se de que o banco PostgreSQL está rodando
- Execute o script de inicialização do banco

### Erro de CORS:
- Verifique se `FRONTEND_URL` está configurada corretamente
- Certifique-se de que a URL do frontend está nas origens permitidas

### Erro de Autenticação:
- Verifique se `SECRET_KEY` está configurada
- Certifique-se de que é uma chave forte e única

### Logs:
Para ver os logs no Render:
1. Vá no dashboard do seu serviço
2. Clique na aba "Logs"
3. Monitore erros e problemas

## 🔒 9. Segurança em Produção

- ✅ Use HTTPS (automático no Render)
- ✅ Configure `SECRET_KEY` forte e única
- ✅ Use PostgreSQL em produção
- ✅ Configure CORS adequadamente
- ✅ Use App Passwords para email
- ✅ Mantenha `DEBUG=False`
- ✅ Monitore logs regularmente

## 📊 10. Monitoramento

- Configure alertas no Render para downtime
- Monitore uso de recursos (CPU, memória)
- Acompanhe logs de erro
- Configure backup do banco de dados

---

**Pronto!** Sua aplicação AI Text Summarizer está agora rodando em produção no Render! 🎉