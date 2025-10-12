# app/services/email_service.py
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
import os
from jinja2 import Template
from dotenv import load_dotenv, find_dotenv

# ✅ CARGAR .env ANTES de acceder a las variables
load_dotenv(find_dotenv())

# Verificar que las variables se cargaron
def get_mail_config():
    """
    Crea y retorna configuración de email con validación
    """
    mail_username = os.getenv("MAIL_USERNAME")
    mail_password = os.getenv("MAIL_PASSWORD")
    mail_from = os.getenv("MAIL_FROM")
    mail_port = os.getenv("MAIL_PORT", "587")
    mail_server = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    
    # Validar que las variables críticas existen
    if not mail_username or not mail_password or not mail_from:
        raise ValueError(
            "Faltan variables de entorno. Verifica que .env tenga: "
            "MAIL_USERNAME, MAIL_PASSWORD, MAIL_FROM"
        )
    
    return ConnectionConfig(
        MAIL_USERNAME=mail_username,
        MAIL_PASSWORD=mail_password,
        MAIL_FROM=mail_from,
        MAIL_PORT=int(mail_port),
        MAIL_SERVER=mail_server,
        MAIL_STARTTLS=True,
        MAIL_SSL_TLS=False,
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=True
    )

# Plantilla HTML del email
email_template = """
<!DOCTYPE html>
<html>
<head>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            background-color: #f4f4f4; 
            padding: 20px; 
        }
        .container { 
            background-color: white; 
            padding: 30px; 
            border-radius: 10px; 
            max-width: 500px; 
            margin: 0 auto; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .code { 
            font-size: 32px; 
            font-weight: bold; 
            color: #4CAF50; 
            text-align: center; 
            padding: 20px; 
            background-color: #f0f0f0; 
            border-radius: 5px; 
            letter-spacing: 8px;
            margin: 20px 0;
        }
        .title { 
            color: #333; 
            text-align: center; 
            margin-bottom: 20px;
        }
        .info {
            color: #666;
            line-height: 1.6;
            margin: 15px 0;
        }
        .footer { 
            color: #999; 
            font-size: 12px; 
            text-align: center; 
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2 class="title">🔐 Verificación de Cuenta - MindCheck</h2>
        <p class="info">Gracias por registrarte en MindCheck. Para activar tu cuenta, ingresa el siguiente código de verificación:</p>
        <div class="code">{{ code }}</div>
        <p class="info">⏱️ Este código expirará en <strong>15 minutos</strong>.</p>
        <p class="info">Si no solicitaste este código, puedes ignorar este mensaje de forma segura.</p>
        <div class="footer">
            <p>© 2025 MindCheck. Todos los derechos reservados.</p>
            <p>Este es un email automático, por favor no respondas a este mensaje.</p>
        </div>
    </div>
</body>
</html>
"""

async def send_verification_email(email: EmailStr, code: str):
    """
    Envía email con código de verificación
    
    Args:
        email: Email del destinatario
        code: Código de verificación de 6 dígitos
        
    Returns:
        True si el email se envió correctamente
        
    Raises:
        Exception: Si falla el envío del email
    """
    try:
        # Obtener configuración
        conf = get_mail_config()
        
        # Renderizar template
        template = Template(email_template)
        html_content = template.render(code=code)
        
        # Crear mensaje
        message = MessageSchema(
            subject="Código de Verificación - MindCheck 🔐",
            recipients=[email],
            body=html_content,
            subtype=MessageType.html
        )
        
        # Enviar email
        fm = FastMail(conf)
        await fm.send_message(message)
        
        print(f"✅ Email enviado exitosamente a {email}")
        return True
        
    except ValueError as ve:
        # Error de configuración
        print(f"❌ Error de configuración: {str(ve)}")
        raise
    except Exception as e:
        # Error al enviar email
        print(f"❌ Error enviando email: {str(e)}")
        raise Exception(f"No se pudo enviar el email: {str(e)}")
