import sqlite3
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from cryptography.fernet import Fernet
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import jwt
import datetime
import io
import unicodedata
import os

app = Flask(__name__)
CORS(app)

# ----- App Config -----
JWT_SECRET = "YOUR_SUPER_SECRET_JWT_KEY_CHANGE_ME"
JWT_ALGORITHM = "HS256"
JWT_EXP_DELTA_SECONDS = 3600 * 24
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

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
cursor.execute("""
CREATE TABLE IF NOT EXISTS shared_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    recipient_id INTEGER NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users (id),
    FOREIGN KEY (recipient_id) REFERENCES users (id)
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

# ----- Helpers -----
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
    return io.BytesIO(encrypted), 200, {'Content-Disposition': 'attachment; filename="morse.enc"'}

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

@app.route("/api/users", methods=["GET"])
def get_users():
    user = get_user_from_auth_header()
    if not user: return jsonify({"error": "Unauthorized"}), 401
    cursor.execute("SELECT id, username, email FROM users WHERE id != ?", (user['id'],))
    users = [dict(row) for row in cursor.fetchall()]
    return jsonify(users)

@app.route("/api/share", methods=["POST"])
def share_file():
    user = get_user_from_auth_header()
    if not user: return jsonify({"error": "Unauthorized"}), 401

    if 'file' not in request.files:
        return jsonify({"error": "File is required"}), 400

    recipient_id = request.form.get('recipient_id')
    if not recipient_id:
        return jsonify({"error": "Recipient is required"}), 400

    file = request.files['file']
    filename = secure_filename(file.filename)
    unique_filename = f"{user['id']}_{datetime.datetime.now().timestamp()}_{filename}"
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(file_path)

    cursor.execute("INSERT INTO shared_files (sender_id, recipient_id, file_name, file_path) VALUES (?, ?, ?, ?)",
                   (user['id'], recipient_id, filename, file_path))
    conn.commit()

    return jsonify({"message": "File shared successfully"}), 200

@app.route("/api/files/sent", methods=["GET"])
def sent_files():
    user = get_user_from_auth_header()
    if not user: return jsonify({"error": "Unauthorized"}), 401

    cursor.execute("""
        SELECT sf.id, u.username as recipient, sf.file_name, sf.shared_at
        FROM shared_files sf
        JOIN users u ON sf.recipient_id = u.id
        WHERE sf.sender_id = ?
        ORDER BY sf.shared_at DESC
    """, (user['id'],))
    files = [dict(row) for row in cursor.fetchall()]
    return jsonify(files)

@app.route("/api/files/received", methods=["GET"])
def received_files():
    user = get_user_from_auth_header()
    if not user: return jsonify({"error": "Unauthorized"}), 401

    cursor.execute("""
        SELECT sf.id, u.username as sender, sf.file_name, sf.shared_at
        FROM shared_files sf
        JOIN users u ON sf.sender_id = u.id
        WHERE sf.recipient_id = ?
        ORDER BY sf.shared_at DESC
    """, (user['id'],))
    files = [dict(row) for row in cursor.fetchall()]
    return jsonify(files)

@app.route("/api/files/download/<int:file_id>", methods=["GET"])
def download_file(file_id):
    user = get_user_from_auth_header()
    if not user: return jsonify({"error": "Unauthorized"}), 401

    cursor.execute("SELECT * FROM shared_files WHERE id = ?", (file_id,))
    file_info = cursor.fetchone()

    if not file_info:
        return jsonify({"error": "File not found"}), 404

    if user['id'] not in [file_info['sender_id'], file_info['recipient_id']]:
        return jsonify({"error": "Forbidden"}), 403

    return send_from_directory(app.config['UPLOAD_FOLDER'], os.path.basename(file_info['file_path']), as_attachment=True, download_name=file_info['file_name'])

if __name__ == "__main__":
    app.run(debug=True, port=5000)