#!/usr/bin/env python3

import sys
import os

# Adicionar o diretório do projeto ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.config.database import engine, Base
from app.models.database import User, Summary, PasswordResetToken  # Garante que todos os modelos sejam carregados

def init_database():
    print("Iniciando a criação das tabelas no banco de dados...")
    try:
        # O método create_all verifica quais tabelas já existem antes de criá-las.
        # É seguro de se executar múltiplas vezes.
        Base.metadata.create_all(bind=engine)
        print("Tabelas criadas com sucesso (ou já existentes).")
    except Exception as e:
        print(f"Ocorreu um erro ao criar as tabelas: {e}")

if __name__ == "__main__":
    init_database()