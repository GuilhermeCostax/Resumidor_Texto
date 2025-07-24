#!/usr/bin/env python3
"""
Script para inicializar o banco de dados em produção.
Este script deve ser executado uma vez após o deploy para criar as tabelas.
"""

import sys
import os

# Adicionar o diretório do projeto ao path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.config.database import engine
from backend.app.models.database import Base, User, Summary, PasswordResetToken

def init_production_database():
    """
    Inicializa o banco de dados em produção criando todas as tabelas.
    """
    try:
        # Importar todos os modelos para garantir que sejam registrados
        print("Criando tabelas do banco de dados...")
        
        # Criar todas as tabelas
        Base.metadata.create_all(bind=engine)
        
        print("✅ Banco de dados inicializado com sucesso!")
        print("Tabelas criadas:")
        print("- users")
        print("- summaries")
        print("- password_reset_tokens")
        
    except Exception as e:
        print(f"❌ Erro ao inicializar banco de dados: {e}")
        sys.exit(1)

if __name__ == "__main__":
    init_production_database()