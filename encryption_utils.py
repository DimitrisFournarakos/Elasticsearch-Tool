import os
from cryptography.fernet import Fernet
from dotenv import load_dotenv

load_dotenv()

KEY = os.getenv("CLUSTER_ENCRYPTION_KEY")
cipher = Fernet(KEY.encode())

if KEY is None:
    raise ValueError("CLUSTER_ENCRYPTION_KEY not found in .env")

#Encryption
def encrypt_password(password):
    encrypted_password = cipher.encrypt(password.encode())

    return encrypted_password.decode()

#Decrypt
def decrypt_password(encrypted_password):
    decrypted_password = cipher.decrypt(encrypted_password.encode())

    return decrypted_password.decode()