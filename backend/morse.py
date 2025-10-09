import sqlite3
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from cryptography.fernet import Fernet
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import io
import unicodedata
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email import encoders

app = Flask(__name__)
CORS(app)

# ----- SMTP & Email Config (IMPORTANT: CONFIGURE THESE) -----
SMTP_SERVER = os.environ.get("SMTP_SERVER", "smtp.gmail.com") # e.g., 'smtp.gmail.com'
SMTP_PORT = int(os.environ.get("SMTP_PORT", 587)) # e.g., 587 for TLS
SMTP_USERNAME = os.environ.get("SMTP_USERNAME", "your_email@gmail.com") # Your email address
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "your_app_password") # Your email app password

# ----- App Config -----
JWT_SECRET = "YOUR_SUPER_SECRET_JWT_KEY_CHANGE_ME"
JWT_ALGORITHM = "HS256"
JWT_EXP_DELTA_SECONDS = 3600 * 24

# ----- Database -----
conn = sqlite3.connect("users.db", check_same_thread=False)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    fernet_key TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
)
""")
conn.commit()

# ----- Morse Codes (Omitted for brevity) -----
MORSE_CODES = {
    "english": {
        'A':'^~','B':'~^^','C':'~^~^','D':'~^','E':'^','F':'^^~^','G':'~~^','H':'^^^^',
        'I':'^^','J':'^~~~','K':'~^~','L':'^~~^','M':'~~','N':'^^^~^^^~','O':'~~~','P':'~~^^^~',
        'Q':'~~^~','R':'^~^','S':'^^^','T':'~','U':'^^~','V':'^^^~','W':'^~~','X':'~^^~',
        'Y':'~^~~','Z':'~~^^','1':'^~~~~','2':'^^~~~','3':'^^^~~','4':'^^^^~','5':'^^^^^',
        '6':'~^^^^','7':'~~^^^','8':'~~~^^','9':'~~~~^','0':'~~~~~',
        ' ':'|','.':'~^~^~^',',':'~~^^~~','?':'^^~~^^','!':'~^~^~~'
    }
}

# ----- Helpers (Omitted for brevity) -----
def encode_to_morse(text, language):
    morse_map = MORSE_CODES.get(language, MORSE_CODES['english'])
    text_norm = unicodedata.normalize("NFC", text)
    if language in ["english","french"]:
        text_norm = text_norm.upper()
    return ' '.join(morse_map.get(ch, '') for ch in text_norm)

def decode_from_morse(morse_code, language):
    morse_map = MORSE_CODES.get(language, MORSE_CODES['english'])
    reverse_map = {v: k for k, v in morse_map.items()}
    parts = morse_code.split()
    return ''.join(reverse_map.get(code, '') for code in parts)

def create_jwt_token(username):
    payload = {'username': username, 'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=JWT_EXP_DELTA_SECONDS)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_jwt_token(token):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except:
        return None

def get_user_by_username(username):
    cursor.execute("SELECT * FROM users WHERE username=?", (username,))
    row = cursor.fetchone()
    return dict(row) if row else None

def get_user_by_email(email):
    cursor.execute("SELECT * FROM users WHERE email=?", (email,))
    row = cursor.fetchone()
    return dict(row) if row else None

def get_user_from_auth_header():
    auth_header = request.headers.get("Authorization")
    if not auth_header: return None
    try:
        token_type, token = auth_header.split()
        if token_type.lower() != 'bearer': return None
    except ValueError:
        return None
    payload = decode_jwt_token(token)
    if not payload: return None
    return get_user_by_username(payload.get("username"))

# ----- Routes -----
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")
    if not username or not password or not email:
        return jsonify({"error": "Username, email, and password required"}), 400
    if get_user_by_username(username) or get_user_by_email(email):
        return jsonify({"error": "Username or email exists"}), 400
    password_hash = generate_password_hash(password)
    fernet_key = Fernet.generate_key().decode()
    cursor.execute("INSERT INTO users (username, password_hash, fernet_key, email) VALUES (?,?,?,?)",
                   (username, password_hash, fernet_key, email))
    conn.commit()
    return jsonify({"message": "User registered successfully"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
    user = get_user_by_email(email)
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid credentials"}), 401
    token = create_jwt_token(user["username"])
    return jsonify({"token": token})

@app.route("/encode", methods=["POST"])
def encode_route():
    user = get_user_from_auth_header()
    if not user: return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    text = data.get("text", "").strip()
    language = data.get("language", "english").lower()
    if not text: return jsonify({"error": "Text is required"}), 400

    morse = encode_to_morse(text, language)
    cipher = Fernet(user["fernet_key"].encode())
    encrypted = cipher.encrypt(morse.encode())
    return send_file(io.BytesIO(encrypted), download_name="morse.enc", mimetype="application/octet-stream")

@app.route("/decode", methods=["POST"])
def decode_route():
    user = get_user_from_auth_header()
    if not user: return jsonify({"error": "Unauthorized"}), 401
    if "file" not in request.files: return jsonify({"error": "File required"}), 400
    language = request.form.get("language", "english").lower()

    enc_file = request.files["file"]
    encrypted_data = enc_file.read()
    try:
        cipher = Fernet(user["fernet_key"].encode())
        decrypted = cipher.decrypt(encrypted_data).decode()
    except:
        return jsonify({"error": "Decryption failed"}), 400

    decoded_text = decode_from_morse(decrypted, language)
    return jsonify({"decoded_text": decoded_text})

@app.route("/api/email-text", methods=["POST"])
def email_text():
    user = get_user_from_auth_header()
    if not user: return jsonify({"error": "Unauthorized"}), 401
    
    data = request.json
    recipient_email = data.get('recipient_email')
    subject = data.get('subject', 'A message from Morse Encoder App')
    message_text = data.get('message_text')

    if not recipient_email or not message_text:
        return jsonify({"error": "Recipient email and message text are required"}), 400

    # Create the email
    msg = MIMEText(message_text)
    msg['Subject'] = subject
    msg['From'] = SMTP_USERNAME
    msg['To'] = recipient_email

    try:
        # Connect to the SMTP server and send the email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls() # Secure the connection
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
        return jsonify({"message": "Email sent successfully!"}), 200
    except Exception as e:
        print(f"Email failed to send: {e}") # Log the actual error on the server
        return jsonify({"error": "Failed to send email. Check server configuration."}), 500

@app.route("/api/share-file", methods=["POST"])
def share_file():
    user = get_user_from_auth_header()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    if 'file' not in request.files:
        return jsonify({"error": "File is required"}), 400

    recipient_email = request.form.get('recipient_email')
    subject = request.form.get('subject', 'File Share from Morse App')
    message_body = request.form.get('message_body', 'Please find the attached file.')
    
    if not recipient_email:
        return jsonify({"error": "Recipient email is required"}), 400

    file = request.files['file']

    msg = MIMEMultipart()
    msg['From'] = SMTP_USERNAME
    msg['To'] = recipient_email
    msg['Subject'] = subject

    msg.attach(MIMEText(message_body, 'plain'))

    part = MIMEBase('application', 'octet-stream')
    part.set_payload(file.read())
    encoders.encode_base64(part)
    part.add_header('Content-Disposition', f'attachment; filename="{file.filename}"')
    msg.attach(part)

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
        return jsonify({"message": "File sent successfully!"}), 200
    except Exception as e:
        print(f"Email failed to send: {e}")
        return jsonify({"error": "Failed to send email. Check server configuration."}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)