#!/usr/bin/env python3
"""
Script para inicializar o banco de dados
"""

import sys
import os

# Adicionar o diretório do projeto ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.config.database import engine
from app.models.database import Base

def init_database():
    """Inicializa o banco de dados criando todas as tabelas"""
    print("Criando tabelas do banco de dados...")
    Base.metadata.create_all(bind=engine)
    print("✅ Banco de dados inicializado com sucesso!")
    print("📁 Arquivo do banco: summarizer.db")
    print("📋 Tabelas criadas: users, summaries")

if __name__ == "__main__":
    init_database()