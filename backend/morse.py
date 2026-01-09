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

# ---------------- APP SETUP ----------------
app = Flask(__name__)
CORS(app)

JWT_SECRET = "CHANGE_THIS_SECRET"
JWT_ALGORITHM = "HS256"
JWT_EXP_DELTA_SECONDS = 3600 * 24

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# ---------------- DATABASE ----------------
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
    sender_id INTEGER,
    recipient_id INTEGER,
    file_name TEXT,
    file_path TEXT,
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

conn.commit()

# ---------------- MORSE MAPS ----------------
MORSE_CODES = {

    # ---------- ENGLISH ----------
    "english": {
        'A':'^~','B':'~^^','C':'~^~^','D':'~^','E':'^','F':'^^~^','G':'~~^','H':'^^^^',
        'I':'^^','J':'^~~~','K':'~^~','L':'^~~^','M':'~~','N':'~^','O':'~~~','P':'^~~^',
        'Q':'~~^~','R':'^~^','S':'^^^','T':'~','U':'^^~','V':'^^^~','W':'^~~','X':'~^^~',
        'Y':'~^~~','Z':'~~^^',
        '1':'^~~~~','2':'^^~~~','3':'^^^~~','4':'^^^^~','5':'^^^^^',
        '6':'~^^^^','7':'~~^^^','8':'~~~^^','9':'~~~~^','0':'~~~~~',
        ' ':'|'
    }
}

# ---------- FRENCH (same + accents) ----------
MORSE_CODES["french"] = MORSE_CODES["english"].copy()
MORSE_CODES["french"].update({
    'É':'^^~^^','È':'^~^^~','À':'^~^~~','Ç':'~^~^^','Ù':'^^~~^'
})

# ---------- HINDI (phonetic morse) ----------
MORSE_CODES["hindi"] = {
    'अ':'^','आ':'^~','इ':'^^','ई':'^^~','उ':'^^^','ऊ':'^^~~',
    'क':'~^','ख':'~^^','ग':'~~^','घ':'~~~~',
    'च':'^~^','छ':'^~^^','ज':'~~','झ':'~~~',
    'ट':'~','ठ':'~^~','ड':'~~','ढ':'~~~',
    'त':'^','थ':'^^^','द':'~^','ध':'~~^',
    'न':'~^~','प':'^~~','फ':'^^~^','ब':'~^^',
    'म':'~~','य':'~^~~','र':'^~^','ल':'^~~^',
    'व':'^^~','श':'^^^^','स':'^^^','ह':'~~~~',
    ' ':'|'
}

# ---------- MARATHI (reuse Hindi) ----------
MORSE_CODES["marathi"] = MORSE_CODES["hindi"]

# ---------------- HELPERS ----------------
def encode_to_morse(text, language):
    morse_map = MORSE_CODES.get(language, MORSE_CODES["english"])
    text = unicodedata.normalize("NFC", text)
    if language in ["english", "french"]:
        text = text.upper()
    return " ".join(morse_map.get(ch, "") for ch in text)

def decode_from_morse(morse, language):
    morse_map = MORSE_CODES.get(language, MORSE_CODES["english"])
    reverse_map = {v: k for k, v in morse_map.items()}
    return "".join(reverse_map.get(code, "") for code in morse.split())

def create_token(username):
    payload = {
        "username": username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=JWT_EXP_DELTA_SECONDS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def get_user():
    auth = request.headers.get("Authorization")
    if not auth: return None
    try:
        _, token = auth.split()
        data = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        cursor.execute("SELECT * FROM users WHERE username=?", (data["username"],))
        return dict(cursor.fetchone())
    except:
        return None

# ---------------- AUTH ----------------
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    if not all(k in data for k in ("username","password","email")):
        return jsonify({"error":"Missing fields"}),400

    cursor.execute("SELECT * FROM users WHERE username=? OR email=?",
                   (data["username"],data["email"]))
    if cursor.fetchone():
        return jsonify({"error":"User exists"}),400

    cursor.execute(
        "INSERT INTO users (username,password_hash,fernet_key,email) VALUES (?,?,?,?)",
        (
            data["username"],
            generate_password_hash(data["password"]),
            Fernet.generate_key().decode(),
            data["email"]
        )
    )
    conn.commit()
    return jsonify({"message":"Registered"}),201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    cursor.execute("SELECT * FROM users WHERE email=?", (data.get("email"),))
    user = cursor.fetchone()
    if not user or not check_password_hash(user["password_hash"], data.get("password","")):
        return jsonify({"error":"Invalid credentials"}),401
    return jsonify({"token": create_token(user["username"])})

# ---------------- ENCODE / DECODE ----------------
@app.route("/encode", methods=["POST"])
def encode():
    user = get_user()
    if not user: return jsonify({"error":"Unauthorized"}),401

    data = request.json
    morse = encode_to_morse(data["text"], data.get("language","english"))
    encrypted = Fernet(user["fernet_key"].encode()).encrypt(morse.encode())

    return io.BytesIO(encrypted), 200, {
        "Content-Disposition": 'attachment; filename="morse.enc"'
    }

@app.route("/decode", methods=["POST"])
def decode():
    user = get_user()
    if not user: return jsonify({"error":"Unauthorized"}),401

    file = request.files["file"]
    language = request.form.get("language","english")
    decrypted = Fernet(user["fernet_key"].encode()).decrypt(file.read()).decode()
    return jsonify({"decoded_text": decode_from_morse(decrypted, language)})

# ---------------- FILE SHARING ----------------
@app.route("/api/share", methods=["POST"])
def share():
    user = get_user()
    if not user: return jsonify({"error":"Unauthorized"}),401

    file = request.files["file"]
    recipient = request.form["recipient_id"]
    fname = secure_filename(file.filename)
    path = os.path.join(UPLOAD_FOLDER, f"{user['id']}_{fname}")
    file.save(path)

    cursor.execute(
        "INSERT INTO shared_files (sender_id,recipient_id,file_name,file_path) VALUES (?,?,?,?)",
        (user["id"], recipient, fname, path)
    )
    conn.commit()
    return jsonify({"message":"Shared"})

@app.route("/api/files/download/<int:file_id>")
def download(file_id):
    user = get_user()
    if not user: return jsonify({"error":"Unauthorized"}),401

    cursor.execute("SELECT * FROM shared_files WHERE id=?", (file_id,))
    f = cursor.fetchone()
    if not f: return jsonify({"error":"Not found"}),404

    return send_from_directory(UPLOAD_FOLDER, os.path.basename(f["file_path"]),
                               as_attachment=True, download_name=f["file_name"])

# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
