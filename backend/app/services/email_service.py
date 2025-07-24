import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from app.config.settings import get_settings

settings = get_settings()

class EmailService:
    @staticmethod
    def send_password_reset_email(email: str, reset_token: str) -> bool:
        """Envia email de recuperação de senha"""
        try:
            # Configurações do servidor SMTP a partir das configurações
            settings = get_settings()
            smtp_server = settings.smtp_server
            smtp_port = settings.smtp_port
            smtp_username = settings.smtp_username
            smtp_password = settings.smtp_password
            from_email = settings.from_email
            from_name = settings.from_name
            
            # Verificar se as configurações de email estão definidas
            if not all([smtp_username, smtp_password, from_email]):
                print("Configurações de email não definidas")
                print("Configure SMTP_USERNAME, SMTP_PASSWORD e FROM_EMAIL no arquivo .env")
                return False
            
            # Criar mensagem
            message = MIMEMultipart("alternative")
            message["Subject"] = "Recuperação de Senha - SummarizeAI"
            message["From"] = from_email
            message["To"] = email
            
            # URL do frontend para redefinição de senha
            reset_url = f"{settings.frontend_url}/reset-password?token={reset_token}"
            
            # Corpo do email em HTML
            html_body = f"""
            <html>
              <body>
                <h2>Recuperação de Senha - SummarizeAI</h2>
                <p>Você solicitou a recuperação de sua senha.</p>
                <p>Clique no link abaixo para redefinir sua senha:</p>
                <p><a href="{reset_url}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Redefinir Senha</a></p>
                <p>Este link expira em 1 hora.</p>
                <p>Se você não solicitou esta recuperação, ignore este email.</p>
                <br>
                <p>Atenciosamente,<br>Equipe SummarizeAI</p>
              </body>
            </html>
            """
            
            # Corpo do email em texto simples
            text_body = f"""
            Recuperação de Senha - SummarizeAI
            
            Você solicitou a recuperação de sua senha.
            
            Acesse o link abaixo para redefinir sua senha:
            {reset_url}
            
            Este link expira em 1 hora.
            
            Se você não solicitou esta recuperação, ignore este email.
            
            Atenciosamente,
            Equipe SummarizeAI
            """
            
            # Adicionar partes do email
            part1 = MIMEText(text_body, "plain")
            part2 = MIMEText(html_body, "html")
            
            message.attach(part1)
            message.attach(part2)
            
            # Log para debug
            print(f"\n=== ENVIANDO EMAIL DE RECUPERAÇÃO ===")
            print(f"Para: {email}")
            print(f"Servidor SMTP: {smtp_server}:{smtp_port}")
            print(f"De: {from_email}")
            print(f"Link de recuperação: {reset_url}")
            print("=" * 40)
            
            # Envio real do email
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(smtp_username, smtp_password)
                server.sendmail(from_email, email, message.as_string())
            
            print("Email enviado com sucesso!")
            return True
            
        except Exception as e:
            print(f"Erro ao enviar email: {str(e)}")
            return False