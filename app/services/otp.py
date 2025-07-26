import pyotp
import qrcode
from io import BytesIO

def generate_otp_secret():
    return pyotp.random_base32()

def get_otp_provisioning_uri(username: str, secret: str):
    return pyotp.totp.TOTP(secret).provisioning_uri(
        name=username,
        issuer_name="Marzneshin"
    )

def verify_otp(secret: str, token: str) -> bool:
    if not secret:
        return False
    totp = pyotp.TOTP(secret)
    return totp.verify(token)

def generate_qr_code(uri: str) -> BytesIO:
    img = qrcode.make(uri)
    buf = BytesIO()
    img.save(buf)
    buf.seek(0)
    return buf