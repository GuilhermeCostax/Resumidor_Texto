import google.generativeai as genai
from ..config.settings import get_settings

class GeminiService:
    def __init__(self):
        settings = get_settings()
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    def resumir_texto(self, texto: str) -> str:
        prompt = f"""
        Você é um especialista em resumir textos longos de forma clara e concisa.
        
        Sua tarefa é:
        1. Ler o texto fornecido
        2. Identificar os pontos principais
        3. Criar um resumo claro e objetivo
        4. Manter no máximo 100 palavras
        
        Texto para resumir:
        {texto}
        
        Resumo:
        """
        
        response = self.model.generate_content(prompt)
        return response.text