
import os
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from dotenv import load_dotenv
from google import genai

from database import get_db_connection, initialize_database


# Load environment variables from backend/.env
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Initialize database tables
initialize_database()


# ---------------------------------
# HOME API
# ---------------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Welcome to Health Guardian Backend!",
        "status": "Running"
    })


# ---------------------------------
# HEALTH CHECK API
# ---------------------------------

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "success": True,
        "message": "Health Guardian API is working!"
    })


# ---------------------------------
# USER REGISTRATION API
# ---------------------------------

@app.route("/api/register", methods=["POST"])
def register():

    data = request.get_json(silent=True) or {}

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Invalid request data"
        }), 400

    name = data.get("name", "")
    email = data.get("email", "")
    password = data.get("password", "")

    if not all(isinstance(value, str) for value in [name, email, password]):
        return jsonify({
            "success": False,
            "message": "Invalid input format"
        }), 400

    name = name.strip()
    email = email.strip().lower()

    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "All fields are required"
        }), 400

    if len(password) < 8:
        return jsonify({
            "success": False,
            "message": "Password must contain at least 8 characters"
        }), 400

    password_hash = generate_password_hash(password)

    connection = get_db_connection()

    try:
        connection.execute(
            """
            INSERT INTO users (name, email, password_hash)
            VALUES (?, ?, ?)
            """,
            (name, email, password_hash)
        )

        connection.commit()

        return jsonify({
            "success": True,
            "message": "User registered successfully!"
        }), 201

    except Exception as error:

        if "UNIQUE constraint failed" in str(error):
            return jsonify({
                "success": False,
                "message": "Email already registered"
            }), 409

        app.logger.exception("Registration error")

        return jsonify({
            "success": False,
            "message": "Registration failed"
        }), 500

    finally:
        connection.close()


# ---------------------------------
# GEMINI AI HEALTH CHATBOT API
# ---------------------------------

@app.route("/api/chat", methods=["POST"])
def health_chat():

    data = request.get_json(silent=True) or {}

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Invalid request data"
        }), 400

    message = data.get("message", "")

    if not isinstance(message, str) or not message.strip():
        return jsonify({
            "success": False,
            "message": "Please enter a question"
        }), 400

    if len(message) > 4000:
        return jsonify({
            "success": False,
            "message": "Message must be under 4000 characters"
        }), 400

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        return jsonify({
            "success": False,
            "message": "Gemini API key is not configured"
        }), 500

    try:
        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=message.strip(),
            config={
                "system_instruction": (
                    "You are Health Guardian, a responsible health "
                    "information assistant. Answer health-related "
                    "questions in simple and understandable language. "
                    "Explain common health terms and provide general "
                    "health education. Do not diagnose diseases, "
                    "prescribe medicines, or replace professional "
                    "medical advice. Encourage users to consult "
                    "qualified healthcare professionals. If a user "
                    "describes a possible medical emergency, advise "
                    "them to seek immediate emergency medical care."
                ),
                "temperature": 0.4,
                "max_output_tokens": 700
            }
        )

        reply = response.text

        if not reply:
            return jsonify({
                "success": False,
                "message": "No response received. Please try again."
            }), 502

        return jsonify({
            "success": True,
            "reply": reply
        }), 200

    except Exception:
        app.logger.exception("Gemini chatbot error")

        return jsonify({
            "success": False,
            "message": "The chatbot is temporarily unavailable. Please try again."
        }), 502


# ---------------------------------
# RUN FLASK APPLICATION
# ---------------------------------

if __name__ == "__main__":
    app.run(debug=True, port=5000)
