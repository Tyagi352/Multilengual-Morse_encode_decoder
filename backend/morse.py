import sqlite3
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from cryptography.fernet import Fernet
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import io
import unicodedata

app = Flask(__name__)
CORS(app)

# ----- Config -----
JWT_SECRET = "YOUR_SUPER_SECRET_JWT_KEY_CHANGE_ME"
JWT_ALGORITHM = "HS256"
JWT_EXP_DELTA_SECONDS = 3600 * 24

# ----- Database -----
conn = sqlite3.connect("users.db", check_same_thread=False)
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    fernet_key TEXT NOT NULL
)
""")
conn.commit()

# ----- Morse Codes -----
MORSE_CODES = {
    "english": {
        'A':'^~','B':'~^^','C':'~^~^','D':'~^','E':'^','F':'^^~^','G':'~~^','H':'^^^^',
        'I':'^^','J':'^~~~','K':'~^~','L':'^~~^','M':'~~','N':'^^^~^^^~','O':'~~~','P':'~~^^^~',
        'Q':'~~^~','R':'^~^','S':'^^^','T':'~','U':'^^~','V':'^^^~','W':'^~~','X':'~^^~',
        'Y':'~^~~','Z':'~~^^','1':'^~~~~','2':'^^~~~','3':'^^^~~','4':'^^^^~','5':'^^^^^',
        '6':'~^^^^','7':'~~^^^','8':'~~~^^','9':'~~~~^','0':'~~~~~',
        ' ':'|','.':'~^~^~^',',':'~~^^~~','?':'^^~~^^','!':'~^~^~~'
    },
    "hindi": {
        'अ':'^~','आ':'^^~','इ':'~^','ई':'~~','उ':'^~~','ऊ':'^^~~','ऋ':'~^^',
        'ए':'^~^','ऐ':'^^~^','ओ':'^~~^','औ':'^^~~^',
        'क':'^~^~','ख':'^~^^','ग':'^^~^','घ':'^^~~','ङ':'~~^^',
        'च':'~^~','छ':'~^^','ज':'^^~','झ':'^^~^^','ञ':'~^^^',
        'ट':'~^~^','ठ':'~^^~','ड':'~~^','ढ':'~~^^','ण':'^~~^',
        'त':'^~','थ':'^~~','द':'^^','ध':'^^~','न':'^^^',
        'प':'^~~','फ':'^~^^','ब':'^^~','भ':'^^~^','म':'^^^~',
        'य':'^~^','र':'^~^~','ल':'^~~^','व':'^~^^',
        'श':'^^^','ष':'~^^^','स':'^^~^^','ह':'~^^~',
        'ळ':'~^~~','क्ष':'^^~~^','ज्ञ':'^~^^~',
        # matras
        'ा':'^','ि':'~','ी':'^^','ु':'~^','ू':'^^~',
        'े':'^~^','ै':'^^~^','ो':'^~~','ौ':'^^~~',
        'ं':'~^~','ँ':'^^~','ः':'^^^','़':'^~~^','ॉ':'~^^',
        # numbers
        '०':'~~~~~','१':'^~~~~','२':'^^~~~','३':'^^^~~','४':'^^^^~',
        '५':'^^^^^','६':'~^^^^','७':'~~^^^','८':'~~~^^','९':'~~~~^',
        # punctuation
        ' ':'|','.':'~^~^~^',',':'~~^^~~','?':'^^~~^^','!':'~^~^~~','।':'~^~'
    },
    "marathi": {},  # will copy Hindi dictionary below
    "french": {
        'A': '^', 'B': '^^', 'C': '^~', 'D': '^~~', 'E': '~', 'F': '~^', 'G': '~^^',
        'H': '~~~', 'I': '^^^', 'J': '^^~', 'K': '^^~~', 'L': '^~^', 'M': '~~~~~^~~~~~~~~~',
        'N': '^~~^', 'O': '^^~^', 'P': '^^~~^', 'Q': '~^~', 'R': '~^~~', 'S': '~^^~',
        'T': '~~^', 'U': '~~^^', 'V': '~~^~', 'W': '~~^^^', 'X': '^~~~', 'Y': '^~~~~^^^^~^~^~',
        'Z': '^^~~^^^^^^^~','É': '~^^^', 'À': '^~^~', 'È': '^~^^^^~~~^~~', 'Ù': '~~^^~',
        '0': '~~~~~','1': '^~~~~','2': '^^~~~','3': '^^^~~','4': '^^^^~',
        '5': '^^^^^','6': '~^^^^','7': '^^~^^^^^^~~~~~~~','8': '~~~^^','9': '~~~~^',
        ' ':'|', '.': '~^~^~', ',': '~~^^~~', '?': '^^~~^^', '!': '~^~^~~',
        ';': '~^~~^~', ':': '~^^^~', '-': '^~^^~', '(': '^~~^^', ')': '^~~^^~', 'ç':'^^^^^^^^~~~~~^~^',
        'î': '^~^^^~^^~~^^^^^~~~~~^~~^~~^',  
    'è': '^^~^~~~~^^^^~^~^^~^^~^', 
        "'": '^~^~~', '"': '^~^^^', '/': '^~~~^'
    }
}

# Copy Hindi dictionary to Marathi
MORSE_CODES['marathi'] = MORSE_CODES['hindi']

# ----- Helpers -----
def encode_to_morse(text, language):
    morse_map = MORSE_CODES[language]
    text_norm = unicodedata.normalize("NFC", text)
    if language in ["english","french"]:
        text_norm = text_norm.upper()
    return ' '.join(morse_map.get(ch, '') for ch in text_norm)

def decode_from_morse(morse_code, language):
    morse_map = MORSE_CODES[language]
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
    cursor.execute("SELECT id, username, password_hash, fernet_key FROM users WHERE username=?", (username,))
    row = cursor.fetchone()
    if row:
        return {"id": row[0], "username": row[1], "password_hash": row[2], "fernet_key": row[3]}
    return None

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
    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400
    if get_user_by_username(username):
        return jsonify({"error": "Username exists"}), 400
    password_hash = generate_password_hash(password)
    fernet_key = Fernet.generate_key().decode()
    cursor.execute("INSERT INTO users (username,password_hash,fernet_key) VALUES (?,?,?)",
                   (username, password_hash, fernet_key))
    conn.commit()
    return jsonify({"message": "User registered successfully"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    user = get_user_by_username(username)
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid username/password"}), 401
    token = create_jwt_token(username)
    return jsonify({"token": token})

@app.route("/encode", methods=["POST"])
def encode_route():
    user = get_user_from_auth_header()
    if not user: return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    text = data.get("text", "").strip()
    language = data.get("language", "english").lower()
    if not text: return jsonify({"error": "Text is required"}), 400
    if language not in MORSE_CODES: return jsonify({"error": "Language not supported"}), 400

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
    if language not in MORSE_CODES: return jsonify({"error": "Language not supported"}), 400

    enc_file = request.files["file"]
    encrypted_data = enc_file.read()
    try:
        cipher = Fernet(user["fernet_key"].encode())
        decrypted = cipher.decrypt(encrypted_data).decode()
    except:
        return jsonify({"error": "Decryption failed"}), 400

    decoded_text = decode_from_morse(decrypted, language)
    return jsonify({"decoded_text": decoded_text})

if __name__ == "__main__":
    app.run(debug=True)
