# Guia de Recuperação de Senha - SummarizeAI

## Funcionalidade Implementada

A funcionalidade de recuperação de senha foi completamente implementada no sistema SummarizeAI, incluindo:

### Backend (FastAPI)
- ✅ Modelo `PasswordResetToken` no banco de dados
- ✅ Serviço de envio de emails (`EmailService`)
- ✅ Serviço de recuperação de senha (`PasswordResetService`)
- ✅ Endpoints de API:
  - `POST /api/auth/forgot-password` - Solicitar recuperação
  - `GET /api/auth/validate-reset-token/{token}` - Validar token
  - `POST /api/auth/reset-password` - Redefinir senha

### Frontend (Next.js)
- ✅ Página de solicitação de recuperação (`/forgot-password`)
- ✅ Página de redefinição de senha (`/reset-password`)
- ✅ Link "Esqueceu a senha?" na página de login
- ✅ Componentes UI necessários (Label, Alert)
- ✅ Configuração centralizada da API

## Como Testar

### 1. Configuração do Email (Necessária)

Para testar o envio de emails, configure as variáveis no arquivo `.env`:

```env
# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-de-app
FROM_EMAIL=seu-email@gmail.com
FROM_NAME=SummarizeAI
```

**Importante:** Para Gmail, use uma "Senha de App" em vez da senha normal.

### 2. Iniciar os Serviços

#### Backend (Porta 8001)
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

#### Frontend (Porta 3000)
```bash
cd summarizeai-frontend
npm run dev
```

### 3. Fluxo de Teste

1. **Acesse:** http://localhost:3000
2. **Clique em:** "Entrar" no header
3. **Clique em:** "Esqueceu a senha?"
4. **Digite:** um email válido cadastrado no sistema
5. **Clique em:** "Enviar instruções"
6. **Verifique:** o email recebido (se configurado)
7. **Clique:** no link do email ou acesse `/reset-password?token=TOKEN`
8. **Digite:** a nova senha
9. **Clique em:** "Redefinir senha"
10. **Teste:** o login com a nova senha

## Estrutura dos Arquivos

### Backend
```
backend/
├── app/
│   ├── models/
│   │   └── database.py          # Modelo PasswordResetToken
│   ├── services/
│   │   ├── email_service.py     # Envio de emails
│   │   ├── password_reset_service.py  # Lógica de recuperação
│   │   └── auth_service.py      # Autenticação
│   ├── routers/
│   │   └── auth.py              # Endpoints de recuperação
│   └── config/
│       └── settings.py          # Configurações de email
```

### Frontend
```
summarizeai-frontend/
├── src/
│   ├── app/
│   │   ├── forgot-password/
│   │   │   └── page.tsx         # Página de solicitação
│   │   ├── reset-password/
│   │   │   └── page.tsx         # Página de redefinição
│   │   └── login/
│   │       └── page.tsx         # Link "Esqueceu a senha?"
│   ├── components/ui/
│   │   ├── label.tsx            # Componente Label
│   │   └── alert.tsx            # Componente Alert
│   └── lib/
│       └── api.ts               # Configuração centralizada da API
```

## Segurança Implementada

- ✅ Tokens únicos e seguros (UUID4)
- ✅ Expiração de tokens (1 hora)
- ✅ Tokens de uso único (marcados como usados)
- ✅ Validação de email existente
- ✅ Hash seguro de senhas (bcrypt)
- ✅ Validação de entrada (Pydantic)

## Próximos Passos

1. **Configurar SMTP real** para produção
2. **Personalizar templates** de email
3. **Adicionar rate limiting** para prevenir spam
4. **Implementar logs** de segurança
5. **Adicionar testes automatizados**

## Troubleshooting

### Email não enviado
- Verifique as configurações SMTP no `.env`
- Para Gmail, use "Senha de App" e ative 2FA
- Verifique os logs do backend para erros

### Token inválido
- Tokens expiram em 1 hora
- Tokens só podem ser usados uma vez
- Verifique se o token está correto na URL

### Erro de CORS
- Verifique se o backend está na porta 8001
- Verifique se o frontend está na porta 3000
- Confirme as configurações de CORS no backend