# Guia de Configuração do Gmail para SummarizeAI

## Configuração de Email para Recuperação de Senha

Para que o sistema de recuperação de senha funcione corretamente, você precisa configurar o Gmail para permitir o envio de emails através da aplicação.

### Passo 1: Ativar a Verificação em 2 Etapas

1. Acesse [myaccount.google.com](https://myaccount.google.com)
2. Vá em **Segurança** no menu lateral
3. Em "Como fazer login no Google", clique em **Verificação em duas etapas**
4. Siga as instruções para ativar a verificação em 2 etapas

### Passo 2: Gerar uma Senha de App

1. Ainda na seção **Segurança**, procure por **Senhas de app**
2. Clique em **Senhas de app**
3. Selecione **Outro (nome personalizado)**
4. Digite um nome como "SummarizeAI" ou "Recuperação de Senha"
5. Clique em **Gerar**
6. **IMPORTANTE**: Copie a senha de 16 caracteres gerada (exemplo: `abcd efgh ijkl mnop`)

### Passo 3: Configurar o Arquivo .env

Edite o arquivo `.env` na raiz do projeto e substitua as configurações de email:

```env
# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=seu-email@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
FROM_EMAIL=seu-email@gmail.com
FROM_NAME=SummarizeAI
```

**Substitua:**
- `seu-email@gmail.com` pelo seu email do Gmail
- `abcd efgh ijkl mnop` pela senha de app gerada no Passo 2

### Passo 4: Reiniciar o Backend

Após configurar o `.env`, reinicie o servidor backend:

```bash
cd backend
uvicorn app.main:app --reload --port 8001
```

### Passo 5: Testar a Funcionalidade

1. Acesse o frontend em `http://localhost:3000`
2. Na página de login, digite seu email
3. Clique em "Esqueceu a senha?"
4. Verifique sua caixa de entrada do Gmail

### Solução de Problemas

#### Email não está sendo enviado:

1. **Verifique as configurações do .env**:
   - Email correto
   - Senha de app correta (16 caracteres)
   - Verificação em 2 etapas ativada

2. **Verifique os logs do backend**:
   - O terminal do backend mostrará mensagens de debug
   - Procure por erros de autenticação SMTP

3. **Verifique a pasta de spam**:
   - Emails automáticos podem ir para spam inicialmente

#### Erro de autenticação SMTP:

- Certifique-se de que a verificação em 2 etapas está ativada
- Gere uma nova senha de app se necessário
- Verifique se não há espaços extras na senha de app

#### Email vai para spam:

- Marque o email como "Não é spam"
- Adicione o remetente aos contatos
- Com o tempo, o Gmail aprenderá que são emails legítimos

### Configurações de Segurança

- **Nunca compartilhe sua senha de app**
- **Use senhas de app específicas para cada aplicação**
- **Revogue senhas de app não utilizadas**
- **Monitore atividades suspeitas na sua conta Google**

### Exemplo de Email Recebido

O email de recuperação terá:
- **Assunto**: "Recuperação de Senha - SummarizeAI"
- **Remetente**: Seu email configurado
- **Conteúdo**: Link para redefinir senha (válido por 1 hora)

### Notas Importantes

1. **Produção**: Em ambiente de produção, considere usar serviços como SendGrid, Mailgun ou AWS SES
2. **Limites**: Gmail tem limites de envio (500 emails/dia para contas gratuitas)
3. **Segurança**: Mantenha as credenciais seguras e use variáveis de ambiente

---

**Precisa de ajuda?** Verifique os logs do backend para mensagens de erro específicas.