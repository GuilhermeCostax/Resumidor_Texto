import google.generativeai as genai
from ..config.settings import get_settings
import time
import random

class GeminiService:
    def __init__(self):
        settings = get_settings()
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
    
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
        
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = self.model.generate_content(prompt)
                return response.text
            except Exception as e:
                error_msg = str(e)
                if "overloaded" in error_msg or "503" in error_msg or "Deadline Exceeded" in error_msg:
                    if attempt < max_retries - 1:
                        # Aguarda entre 2-5 segundos antes de tentar novamente
                        wait_time = random.uniform(2, 5)
                        time.sleep(wait_time)
                        continue
                    else:
                        raise Exception("Serviço temporariamente indisponível. Tente novamente em alguns minutos.")
                else:
                    # Para outros tipos de erro, não tenta novamente
                    raise e