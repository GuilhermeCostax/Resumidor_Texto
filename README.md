# AI Text Summarizer - Versão Multiusuário

Aplicação web completa para resumir textos longos usando IA (Google Gemini) com sistema de autenticação e histórico pessoal.

## 🚀 Funcionalidades

- ✅ **Autenticação JWT**: Sistema seguro de login e registro
- ✅ **Histórico Pessoal**: Cada usuário tem seu próprio histórico de resumos
- ✅ **Banco de Dados**: SQLite com SQLAlchemy ORM
- ✅ **Segurança**: Senhas criptografadas com bcrypt
- ✅ **API RESTful**: Endpoints bem documentados
- ✅ **IA Integrada**: Google Gemini para resumos inteligentes

## 🏗️ Arquitetura

### Stack Tecnológica

- **Framework**: FastAPI
- **Banco de Dados**: SQLite (summarizer.db)
- **ORM**: SQLAlchemy
- **Autenticação**: JWT (JSON Web Tokens)
- **Segurança**: passlib com bcrypt
- **IA**: Google Gemini API

### Estrutura do Projeto

- `backend/`: API FastAPI construída com Python.
  - `app/`: Contém o código fonte da aplicação.
    - `models/`: Modelos SQLAlchemy e schemas Pydantic.
    - `services/`: Lógica de negócio (Autenticação, Usuário, Gemini).
    - `routers/`: Endpoints da API (rotas).
    - `config/`: Configurações da aplicação e do banco de dados.
    - `dependencies/`: Dependências para injeção (ex: autenticação).
- `summarizeai-frontend/`: Interface web construída com Next.js e TypeScript.
  - `src/app/`: Páginas e layouts da aplicação.
  - `src/components/`: Componentes reutilizáveis (UI e lógica).
  - `src/lib/`: Funções utilitárias e configurações.
- `docs/`: Documentação da API (gerada automaticamente).
- `tests/`: Testes automatizados para backend e frontend.

## 🛠️ Instalação e Configuração

### 1. Pré-requisitos

- **Python** 3.9+
- **Node.js** 18.x+ e npm
- **Chave API do Google Gemini**

### 2. Configuração do Ambiente

```bash
# Clone o repositório
git clone <seu-repositorio>
cd Resumidor_Textos

# Crie um ambiente virtual
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# ou
.venv\Scripts\activate  # Windows

# Instale as dependências
pip install -r requirements.txt
```

### 3. Configuração da API Key do Google Gemini

Obtenha sua chave em: <mcurl name="Google AI Studio" url="https://aistudio.google.com/app/apikey"></mcurl>

### 4. Configuração do Arquivo .env

O arquivo `.env` já está configurado com as variáveis necessárias:

```env
# API Keys
GEMINI_API_KEY=sua-chave-aqui

# App Configuration
APP_NAME=AI Text Summarizer
DEBUG=False

# Database
DATABASE_URL=sqlite:///./summarizer.db

# JWT Security (IMPORTANTE: Altere SECRET_KEY em produção!)
SECRET_KEY=sua-chave-secreta-super-segura-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**⚠️ IMPORTANTE**: Altere a `SECRET_KEY` para uma chave segura em produção!

### 5. Inicialização do Banco de Dados

```bash
cd backend
python init_db.py
```

### 6. Executar a Aplicação

Para rodar a aplicação completa (backend e frontend):

#### a. Iniciar o Backend (API)

```bash
cd backend
uvicorn app.main:app --reload
```

A API estará disponível em: `http://localhost:8000`

#### b. Iniciar o Frontend (Next.js)

Abra um novo terminal e execute:

```bash
cd summarizeai-frontend
npm install
npm run dev
```

O frontend estará disponível em: `http://localhost:3000`.

**Nota**: Certifique-se de que o backend esteja rodando antes de acessar o frontend, pois o frontend depende da API para funcionar.

## 📚 Endpoints da API

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login (retorna JWT token)
- `GET /api/auth/me` - Informações do usuário atual

### Resumos

- `POST /api/resumir-texto` - Resumir texto (requer autenticação)
- `GET /api/historico` - Histórico de resumos do usuário

### Documentação

- `GET /docs` - Swagger UI
- `GET /redoc` - ReDoc

## 🔐 Como Usar

### 1. Registrar Usuário

```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "username": "meuusuario",
    "password": "minhasenha123"
  }'
```

### 2. Fazer Login

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "minhasenha123"
  }'
```

### 3. Resumir Texto (com token)

```bash
curl -X POST "http://localhost:8000/api/resumir-texto" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "texto_a_resumir": "Seu texto longo aqui..."
  }'
```

## 🗄️ Banco de Dados

### Tabelas

**users**

- id (PK)
- email (unique)
- username (unique)
- hashed_password
- created_at

**summaries**

- id (PK)
- user_id (FK)
- original_text
- summary_text
- created_at

## 🔒 Segurança

- **Senhas**: Criptografadas com bcrypt
- **Tokens**: JWT com expiração configurável
- **Autenticação**: Bearer token em todas as rotas protegidas
- **Validação**: Schemas Pydantic para validação de dados

## 🚀 Próximos Passos

1. **Paginação**: Histórico com paginação
2. **Filtros**: Busca no histórico
3. **Exportação**: Download do histórico
4. **Rate Limiting**: Controle de uso da API

## 🌐 Deploy em Produção

Para fazer o deploy da aplicação em produção, siga as instruções detalhadas em:

- [Guia de Deploy](./docs/DEPLOY.md) - Instruções gerais de deploy
- [Deploy no Render](./docs/DEPLOY_RENDER.md) - Instruções específicas para o Render
- [Checklist de Produção](./docs/PRODUCTION_CHECKLIST.md) - Verificações antes do deploy

### Configuração Rápida com Render

O projeto inclui um arquivo `render.yaml` que permite fazer o deploy completo (backend, frontend e banco de dados) com apenas alguns cliques:

1. Faça login no [Render](https://render.com)
2. Clique em "New" → "Blueprint"
3. Conecte seu repositório Git
4. O Render detectará automaticamente o arquivo `render.yaml` e configurará todos os serviços
5. Configure as variáveis de ambiente necessárias

## 📝 Configuração Adicional
