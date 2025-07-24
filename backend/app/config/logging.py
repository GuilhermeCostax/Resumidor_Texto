import logging
import sys
from typing import Dict, Any
from .settings import get_settings

settings = get_settings()

def setup_logging() -> None:
    """
    Configura o sistema de logging para produção.
    """
    # Configuração base do logging
    log_config: Dict[str, Any] = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
            "detailed": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(module)s - %(funcName)s - %(lineno)d - %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "level": "INFO",
                "formatter": "default",
                "stream": sys.stdout,
            },
            "error_console": {
                "class": "logging.StreamHandler",
                "level": "ERROR",
                "formatter": "detailed",
                "stream": sys.stderr,
            },
        },
        "loggers": {
            "uvicorn": {
                "level": "INFO",
                "handlers": ["console"],
                "propagate": False,
            },
            "uvicorn.error": {
                "level": "INFO",
                "handlers": ["error_console"],
                "propagate": False,
            },
            "uvicorn.access": {
                "level": "INFO",
                "handlers": ["console"],
                "propagate": False,
            },
            "sqlalchemy.engine": {
                "level": "WARNING",
                "handlers": ["console"],
                "propagate": False,
            },
            "app": {
                "level": "INFO" if not settings.debug else "DEBUG",
                "handlers": ["console", "error_console"],
                "propagate": False,
            },
        },
        "root": {
            "level": "INFO",
            "handlers": ["console"],
        },
    }
    
    # Aplicar configuração
    logging.config.dictConfig(log_config)
    
    # Logger específico da aplicação
    logger = logging.getLogger("app")
    
    if settings.debug:
        logger.info("Logging configurado para modo DEBUG")
    else:
        logger.info("Logging configurado para modo PRODUÇÃO")

def get_logger(name: str) -> logging.Logger:
    """
    Retorna um logger configurado para o módulo especificado.
    """
    return logging.getLogger(f"app.{name}")