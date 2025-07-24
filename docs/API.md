# Documentação da API

## Endpoints

### POST /api/resumir-texto

Resume um texto longo.

**Request Body:**
```json
{
  "texto_a_resumir": "Texto longo para ser resumido..."
}
```

**Response:**
```json
{
  "resumo": "Resumo do texto em até 100 palavras",
  "status": "success"
}
```